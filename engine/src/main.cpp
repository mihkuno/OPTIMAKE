#include "scheduler.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main(int argc, char* argv[]) {
    
    
    // Read JSON from stdin
    std::stringstream buffer;
    buffer << std::cin.rdbuf();
    json input;
    buffer >> input;

    // Extract fields from JSON input
    std::vector<int> weekdays          = input["weekdays"];
    std::vector<int> course_durations  = input["course_durations"];
    std::vector<int> course_ids        = input["course_ids"];
    std::vector<int> room_ids          = input["room_ids"];
    std::vector<std::vector<int>> section_courses = input["section_courses"];
    std::vector<int> course_apparatus  = input["course_apparatus"];
    std::vector<int> room_apparatus    = input["room_apparatus"];


    // Example hardcoded inputs (for testing)
    // const std::vector<int> weekdays         = {0, 1};   
    // const std::vector<int> course_durations = {3, 3, 3};
    // const std::vector<int> course_ids       = {0, 1, 2};
    // const std::vector<int> room_ids         = {0, 1, 2};
    // const std::vector<std::vector<int>> section_courses = {
    //     {0, 1, 2},
    //     {0, 1, 2},
    //     {0, 1, 2}
    // };
    // const std::vector<int> course_apparatus = {1, 0, 2};
    // const std::vector<int> room_apparatus   = {0, 1, 2};


    // Call scheduler
    json result = GenerateSchedule(
        weekdays,
        course_durations,
        course_ids,
        room_ids,
        section_courses,
        course_apparatus,
        room_apparatus
    );

    // Output JSON to stdout
    std::cout << result.dump(4) << std::endl;
    return 0;
}


// Example usage:

// echo '{
//   "weekdays": [0, 1],
//   "course_durations": [3, 3, 3],
//   "course_ids": [0, 1, 2],
//   "room_ids": [0, 1, 2],
//   "section_courses": [[0, 1, 2], [0, 1, 2], [0, 1, 2]],
//   "course_apparatus": [1, 0, 2],
//   "room_apparatus": [0, 1, 2]
// }' | ./engine/build/main 