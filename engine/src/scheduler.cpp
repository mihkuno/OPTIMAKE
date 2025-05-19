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
    const std::vector<int> &weekdays,
    const std::vector<int> &course_durations,
    const std::vector<int> &course_ids,
    const std::vector<int> &room_ids,
    const std::vector<std::vector<int>> &section_courses,
    const std::vector<int> &course_apparatus,
    const std::vector<int> &room_apparatus)
{
    CpModelBuilder cp_model;

    const int num_sections = section_courses.size();
    const int num_rooms = room_ids.size();
    const int num_days = weekdays.size();

    // Variable storage
    std::vector<std::vector<IntVar>> day_vars(num_sections);
    std::vector<std::vector<IntVar>> start_time_vars(num_sections);
    std::vector<std::vector<IntVar>> room_vars(num_sections);

    // Create variables
    for (int section = 0; section < num_sections; ++section)
    {
        const int num_courses = section_courses[section].size();
        day_vars[section].resize(num_courses);
        start_time_vars[section].resize(num_courses);
        room_vars[section].resize(num_courses);

        for (int idx = 0; idx < num_courses; ++idx)
        {
            const int course = section_courses[section][idx];
            day_vars[section][idx] = cp_model.NewIntVar(Domain(0, num_days - 1));
            start_time_vars[section][idx] = cp_model.NewIntVar(
                Domain(7, 21 - course_durations[course]));
            room_vars[section][idx] = cp_model.NewIntVar(Domain(0, num_rooms - 1));
        }
    }

    // Intra-section constraints
    for (int section = 0; section < num_sections; ++section)
    {
        const int num_courses = section_courses[section].size();

        for (int i = 0; i < num_courses; ++i)
        {
            const int course_i = section_courses[section][i];

            // FIX: Enforce apparatus compatibility
            std::vector<int64_t> room_compatibility;
            for (int room = 0; room < num_rooms; ++room)
            {
                room_compatibility.push_back(
                    room_apparatus[room] == course_apparatus[course_i] ? 1 : 0);
            }
            IntVar has_apparatus = cp_model.NewIntVar(Domain(0, 1));
            cp_model.AddElement(room_vars[section][i], room_compatibility, has_apparatus);
            cp_model.AddEquality(has_apparatus, 1); // CRITICAL FIX ADDED HERE

            // Time constraints within section
            for (int j = i + 1; j < num_courses; ++j)
            {
                const int course_j = section_courses[section][j];

                // Same day constraint
                BoolVar same_day = cp_model.NewBoolVar();
                cp_model.AddEquality(day_vars[section][i], day_vars[section][j])
                    .OnlyEnforceIf(same_day);
                cp_model.AddNotEqual(day_vars[section][i], day_vars[section][j])
                    .OnlyEnforceIf(same_day.Not());

                // Non-overlapping time slots
                BoolVar i_before_j = cp_model.NewBoolVar();
                cp_model.AddLessOrEqual(
                            start_time_vars[section][i] + course_durations[course_i],
                            start_time_vars[section][j])
                    .OnlyEnforceIf({same_day, i_before_j});

                cp_model.AddLessOrEqual(
                            start_time_vars[section][j] + course_durations[course_j],
                            start_time_vars[section][i])
                    .OnlyEnforceIf({same_day, i_before_j.Not()});
            }
        }
    }

    // Inter-section room conflicts
    for (int sec1 = 0; sec1 < num_sections; ++sec1)
    {
        for (int sec2 = sec1 + 1; sec2 < num_sections; ++sec2)
        {
            for (int i = 0; i < section_courses[sec1].size(); ++i)
            {
                const int course_i = section_courses[sec1][i];

                for (int j = 0; j < section_courses[sec2].size(); ++j)
                {
                    const int course_j = section_courses[sec2][j];

                    // Room conflict detection
                    BoolVar same_room = cp_model.NewBoolVar();
                    cp_model.AddEquality(room_vars[sec1][i], room_vars[sec2][j])
                        .OnlyEnforceIf(same_room);
                    cp_model.AddNotEqual(room_vars[sec1][i], room_vars[sec2][j])
                        .OnlyEnforceIf(same_room.Not());

                    // Time separation if sharing room
                    BoolVar i_before_j = cp_model.NewBoolVar();
                    cp_model.AddLessOrEqual(
                                start_time_vars[sec1][i] + course_durations[course_i],
                                start_time_vars[sec2][j])
                        .OnlyEnforceIf({same_room, i_before_j});

                    cp_model.AddLessOrEqual(
                                start_time_vars[sec2][j] + course_durations[course_j],
                                start_time_vars[sec1][i])
                        .OnlyEnforceIf({same_room, i_before_j.Not()});
                }
            }
        }
    }

    // Solve and return results
    const CpSolverResponse response = Solve(cp_model.Build());
    json output;

    if (response.status() == CpSolverStatus::FEASIBLE ||
        response.status() == CpSolverStatus::OPTIMAL)
    {
        output["status"] = "SOLVED";
        output["schedule"] = json::array();

        for (int section = 0; section < num_sections; ++section)
        {
            for (int idx = 0; idx < section_courses[section].size(); ++idx)
            {
                const int course = section_courses[section][idx];
                json entry;
                entry["section"] = section;
                entry["course"] = course;
                entry["room"] = SolutionIntegerValue(response, room_vars[section][idx]);
                entry["day"] = SolutionIntegerValue(response, day_vars[section][idx]);
                entry["start"] = SolutionIntegerValue(response, start_time_vars[section][idx]);
                entry["end"] = entry["start"].get<int>() + course_durations[course];

                output["schedule"].push_back(entry);
            }
        }
    }
    else
    {
        output["status"] = "NO_SOLUTION";
        output["message"] = "No valid schedule found";
    }

    return output;
}