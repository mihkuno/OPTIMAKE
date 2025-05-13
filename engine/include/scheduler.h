#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <vector>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

json GenerateSchedule(
    const std::vector<int>& weekdays,
    const std::vector<int>& course_durations,
    const std::vector<int>& course_ids,
    const std::vector<int>& room_ids,
    const std::vector<std::vector<int>>& section_courses,
    const std::vector<int>& course_apparatus,
    const std::vector<int>& room_apparatus
);

#endif
