#!/usr/bin/env /home/mihkuno/projects/optimake/.venv/bin/python
import sys
import json
from ortools.sat.python import cp_model

def main():
    # Read JSON from stdins
    input_data = json.load(sys.stdin)

    Q = input_data["weekdays"]
    D = input_data["course_durations"]
    C = input_data["course_ids"]
    R = input_data["room_ids"]
    E = input_data["section_courses"]
    AC = input_data["course_apparatus"]
    AR = input_data["room_apparatus"]

    model = cp_model.CpModel()
    solver = cp_model.CpSolver()

    W, X, Y = [], [], []

    for k, e in enumerate(E):
        w, x, y = [], [], []
        for i, c in enumerate(e):
            w.append(model.NewIntVar(0, len(Q) - 1, f'w_{i}_{k}'))          # Day of week
            x.append(model.NewIntVar(7, 21 - D[i], f's_{i}_{k}'))           # Start time
            y.append(model.NewIntVar(0, len(R) - 1, f'y_{i}_{k}'))          # Room
        W.append(w)
        X.append(x)
        Y.append(y)

    # No overlapping courses in the same section
    for k, e in enumerate(E):
        for i, c in enumerate(e):
            required_apparatus = AC[c]
            room_apparatus = [1 if ar == required_apparatus else 0 for ar in AR]
            model.AddElement(Y[k][i], room_apparatus, 1)

            for i_, c_ in enumerate(e):
                if i < i_:
                    same_day = model.NewBoolVar(f'same_day_{i}_{i_}_{k}')
                    model.Add(W[k][i] == W[k][i_]).OnlyEnforceIf(same_day)
                    model.Add(W[k][i] != W[k][i_]).OnlyEnforceIf(same_day.Not())

                    is_i_before_j = model.NewBoolVar(f'is_{i}_before_{i_}_{k}')
                    model.Add(X[k][i] + D[i] <= X[k][i_]).OnlyEnforceIf([is_i_before_j, same_day])
                    model.Add(X[k][i_] + D[i_] <= X[k][i]).OnlyEnforceIf([is_i_before_j.Not(), same_day])

    # No room overlap across sections
    for k1, e1 in enumerate(E):
        for k2, e2 in enumerate(E):
            if k1 < k2:
                for i, c1 in enumerate(e1):
                    for j, c2 in enumerate(e2):
                        same_room = model.NewBoolVar(f'same_room_{k1}_{i}_{k2}_{j}')
                        model.Add(Y[k1][i] == Y[k2][j]).OnlyEnforceIf(same_room)
                        model.Add(Y[k1][i] != Y[k2][j]).OnlyEnforceIf(same_room.Not())

                        is_before = model.NewBoolVar(f'is_{k1}_{i}_before_{k2}_{j}')
                        model.Add(X[k1][i] + D[i] <= X[k2][j]).OnlyEnforceIf([is_before, same_room])
                        model.Add(X[k2][j] + D[j] <= X[k1][i]).OnlyEnforceIf([is_before.Not(), same_room])

    status = solver.Solve(model)

    if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        result = {
            "status": "SOLVED",
            "schedule": []
        }
        for k, e in enumerate(E):
            for i, c in enumerate(e):
                result["schedule"].append({
                    "section": k,
                    "course": c,
                    "room": solver.Value(Y[k][i]),
                    "day": solver.Value(W[k][i]),
                    "start_time": solver.Value(X[k][i]),
                    "end_time": solver.Value(X[k][i]) + D[i]
                })
    else:
        result = {
            "status": "UNSATISFIABLE",
            "schedule": []
        }

    print(json.dumps(result, indent=4))


if __name__ == "__main__":
    main()
