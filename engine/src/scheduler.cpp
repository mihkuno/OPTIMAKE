#include "scheduler.h"
#include <iostream>
#include <vector>
#include <string>
#include "ortools/sat/cp_model.h"
#include <nlohmann/json.hpp>

using namespace operations_research;
using namespace sat;
using json = nlohmann::json;

json GenerateSchedule(
    const std::vector<int>& weekdays,
    const std::vector<int>& course_durations,
    const std::vector<int>& course_ids,
    const std::vector<int>& room_ids,
    const std::vector<std::vector<int>>& section_courses,
    const std::vector<int>& course_apparatus,
    const std::vector<int>& room_apparatus
) {

    CpModelBuilder cp_model;

    int num_sections = section_courses.size();
    int num_rooms    = room_ids.size();
    int num_days     = weekdays.size();

    std::vector<std::vector<IntVar>> day_vars(num_sections);
    std::vector<std::vector<IntVar>> start_time_vars(num_sections);
    std::vector<std::vector<IntVar>> room_vars(num_sections);

    for (int section = 0; section < num_sections; ++section) {
        for (int idx = 0; idx < section_courses[section].size(); ++idx) {
            int course = section_courses[section][idx];
            day_vars[section].push_back(cp_model.NewIntVar(Domain(0, num_days - 1)));
            start_time_vars[section].push_back(cp_model.NewIntVar(Domain(7, 21 - course_durations[course])));
            room_vars[section].push_back(cp_model.NewIntVar(Domain(0, num_rooms - 1)));
        }
    }

    // Intra-section constraints
    for (int section = 0; section < num_sections; ++section) {
        for (int i = 0; i < section_courses[section].size(); ++i) {
            int course_i = section_courses[section][i];
            std::vector<int64_t> room_match;
            for (int room = 0; room < num_rooms; ++room) {
                room_match.push_back(room_apparatus[room] == course_apparatus[course_i] ? 1 : 0);
            }
            IntVar has_apparatus = cp_model.NewIntVar(Domain(0, 1));
            cp_model.AddElement(room_vars[section][i], room_match, has_apparatus);

            for (int j = i + 1; j < section_courses[section].size(); ++j) {
                int course_j = section_courses[section][j];
                BoolVar same_day = cp_model.NewBoolVar();
                cp_model.AddEquality(day_vars[section][i], day_vars[section][j]).OnlyEnforceIf(same_day);
                cp_model.AddNotEqual(day_vars[section][i], day_vars[section][j]).OnlyEnforceIf(same_day.Not());

                BoolVar i_before_j = cp_model.NewBoolVar();
                cp_model.AddLessOrEqual(start_time_vars[section][i] + course_durations[course_i], start_time_vars[section][j])
                         .OnlyEnforceIf({same_day, i_before_j});
                cp_model.AddLessOrEqual(start_time_vars[section][j] + course_durations[course_j], start_time_vars[section][i])
                         .OnlyEnforceIf({same_day, i_before_j.Not()});
            }
        }
    }

    // Inter-section room conflicts
    for (int sec1 = 0; sec1 < num_sections; ++sec1) {
        for (int sec2 = sec1 + 1; sec2 < num_sections; ++sec2) {
            for (int i = 0; i < section_courses[sec1].size(); ++i) {
                int course_i = section_courses[sec1][i];
                for (int j = 0; j < section_courses[sec2].size(); ++j) {
                    int course_j = section_courses[sec2][j];
                    BoolVar same_room = cp_model.NewBoolVar();
                    cp_model.AddEquality(room_vars[sec1][i], room_vars[sec2][j]).OnlyEnforceIf(same_room);
                    cp_model.AddNotEqual(room_vars[sec1][i], room_vars[sec2][j]).OnlyEnforceIf(same_room.Not());

                    BoolVar i_before_j = cp_model.NewBoolVar();
                    cp_model.AddLessOrEqual(start_time_vars[sec1][i] + course_durations[course_i], start_time_vars[sec2][j])
                         .OnlyEnforceIf({same_room, i_before_j});
                    cp_model.AddLessOrEqual(start_time_vars[sec2][j] + course_durations[course_j], start_time_vars[sec1][i])
                         .OnlyEnforceIf({same_room, i_before_j.Not()});
                }
            }
        }
    }

    // Solve the model
    const CpSolverResponse response = Solve(cp_model.Build());

    json output_data;

    if (response.status() == CpSolverStatus::FEASIBLE || response.status() == CpSolverStatus::OPTIMAL) {
        output_data["status"] = response.status();
        output_data["schedule"] = json::array();

        for (int section = 0; section < num_sections; ++section) {
            for (int i = 0; i < section_courses[section].size(); ++i) {
                int course = section_courses[section][i];
                int day    = SolutionIntegerValue(response, day_vars[section][i]);
                int room   = SolutionIntegerValue(response, room_vars[section][i]);
                int start  = SolutionIntegerValue(response, start_time_vars[section][i]);

                json course_schedule;
                course_schedule["section"] = section;
                course_schedule["course"] = course;
                course_schedule["room"] = room;
                course_schedule["day"] = day;
                course_schedule["start_time"] = start;
                course_schedule["end_time"] = start + course_durations[course];

                output_data["schedule"].push_back(course_schedule);
            }
        }
    } else {
        output_data["status"] = response.status();
        output_data["message"] = "No feasible solution found.";
    }

    return output_data;
}