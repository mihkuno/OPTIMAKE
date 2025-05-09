cmake_minimum_required(VERSION 3.18)
project(optimake VERSION 1.0 LANGUAGES CXX)

# Enable the generation of compile_commands.json for IDEs intellisense
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Tell CMake where to find OR-Tools config file
set(CMAKE_PREFIX_PATH "${CMAKE_SOURCE_DIR}/or-tools")

# Find the OR-Tools package
# This assumes you have installed OR-Tools in the specified path
find_package(ortools REQUIRED CONFIG)

# Add the directory where json.hpp is located
include_directories(include/)
include_directories(extern/nlohmann_json/single_include)

# Add the source files
add_executable(main src/main.cpp src/scheduler.cpp)
# If you want to test scan the solution space
# add_executable(main src/scanner.cpp)

# Add the include directories
target_link_libraries(main ortools::ortools)

# Set the C++ standard to C++17
set_property(TARGET main PROPERTY CXX_STANDARD 17)