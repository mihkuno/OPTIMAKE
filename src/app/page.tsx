// app/page.js
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Timetable from "@/components/timetable"; // Assuming the Timetable component is in this path

export default function Home() {
    // State for all inputs
    const [numSections, setNumSections] = useState(2);
    const [numCourses, setNumCourses] = useState(3);
    const [numRooms, setNumRooms] = useState(2);
    const [weekdays, setWeekdays] = useState([0, 1, 2, 3, 4, 5]);
    const [courses, setCourses] = useState([
        { name: "CS101", duration: 1, apparatus: 1 },
        { name: "CS102", duration: 2, apparatus: 1 },
        { name: "CS103", duration: 1, apparatus: 2 },
    ]);
    const [rooms, setRooms] = useState([
        { name: "Room A", apparatus: 1 },
        { name: "Room B", apparatus: 3 }, // Supports both apparatus types
    ]);
    const [sectionCourses, setSectionCourses] = useState([
        [0, 1], // Section 1 takes courses at index 0 and 1
        [1, 2], // Section 2 takes courses at index 1 and 2
    ]);

    // State for results
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState("section");

    // Derived state for names
    const [courseNames, setCourseNames] = useState([]);
    const [roomNames, setRoomNames] = useState([]);
    const [sectionNames, setSectionNames] = useState([]);

    // Update derived course names when courses change
    useEffect(() => {
        setCourseNames(courses.map(c => c.name));
    }, [courses]);

    // Update derived room names when rooms change
    useEffect(() => {
        setRoomNames(rooms.map(r => r.name));
    }, [rooms]);

    // Update derived section names when numSections changes
    useEffect(() => {
        setSectionNames(Array.from({ length: numSections }, (_, i) => `Section ${i + 1}`));
    }, [numSections]);

    // Update section courses when number of sections changes
    const updateNumSections = (num) => {
        const newNum = parseInt(num);
        if (newNum > 0) {
            setNumSections(newNum);

            // Update sectionCourses array size
            const newSectionCourses = [...sectionCourses];
            if (newNum > sectionCourses.length) {
                // Add new sections with empty course lists
                for (let i = sectionCourses.length; i < newNum; i++) {
                    newSectionCourses.push([]);
                }
            } else {
                // Remove excess sections
                newSectionCourses.splice(newNum);
            }
            setSectionCourses(newSectionCourses);
        }
    };

    // Update courses when number of courses changes
    const updateNumCourses = (num) => {
        const newNum = parseInt(num);
        if (newNum > 0) {
            setNumCourses(newNum);

            // Update courses array size
            const newCourses = [...courses];
            if (newNum > courses.length) {
                // Add new courses
                for (let i = courses.length; i < newNum; i++) {
                    newCourses.push({ name: `Course ${i + 1}`, duration: 1, apparatus: 1 });
                }
            } else {
                // Remove excess courses
                newCourses.splice(newNum);

                // Also remove deleted courses from sectionCourses
                const newSectionCourses = sectionCourses.map(section =>
                    section.filter(courseIndex => courseIndex < newNum)
                );
                setSectionCourses(newSectionCourses);
            }
            setCourses(newCourses);
        }
    };

    // Update rooms when number of rooms changes
    const updateNumRooms = (num) => {
        const newNum = parseInt(num);
        if (newNum > 0) {
            setNumRooms(newNum);

            // Update rooms array size
            const newRooms = [...rooms];
            if (newNum > rooms.length) {
                // Add new rooms
                for (let i = rooms.length; i < newNum; i++) {
                    newRooms.push({ name: `Room ${i + 1}`, apparatus: 1 });
                }
            } else {
                // Remove excess rooms
                newRooms.splice(newNum);
            }
            setRooms(newRooms);
        }
    };

    // Helper to update course properties
    const updateCourse = (index, field, value) => {
        const newCourses = [...courses];
        if (field === "duration" || field === "apparatus") {
            newCourses[index][field] = parseInt(value);
        } else {
            newCourses[index][field] = value;
        }
        setCourses(newCourses);
    };

    // Helper to update room properties
    const updateRoom = (index, field, value) => {
        const newRooms = [...rooms];
        if (field === "apparatus") {
            newRooms[index][field] = parseInt(value);
        } else {
            newRooms[index][field] = value;
        }
        setRooms(newRooms);
    };

    // Toggle course assignment to a section using index
    const toggleCourseForSection = (sectionIndex, courseIndex) => {
        const newSectionCourses = [...sectionCourses];

        if (newSectionCourses[sectionIndex].includes(courseIndex)) {
            // Remove course from section
            newSectionCourses[sectionIndex] = newSectionCourses[sectionIndex].filter(id => id !== courseIndex);
        } else {
            // Add course to section
            newSectionCourses[sectionIndex].push(courseIndex);
        }

        setSectionCourses(newSectionCourses);
    };

    // Toggle weekday selection
    const toggleWeekday = (day) => {
        if (weekdays.includes(day)) {
            setWeekdays(weekdays.filter(d => d !== day));
        } else {
            const newWeekdays = [...weekdays, day];
            newWeekdays.sort((a, b) => a - b);
            setWeekdays(newWeekdays);
        }
    };

    const generateTimetable = async () => {
        setLoading(true);

        try {
            // Prepare the input for the backend API
            const inputData = {
                weekdays: weekdays,
                course_durations: courses.map(c => c.duration),
                course_apparatus: courses.map(c => c.apparatus),
                room_apparatus: rooms.map(r => r.apparatus),
                section_courses: sectionCourses,
                num_sections: numSections,
                num_courses: numCourses,
                num_rooms: numRooms,
            };

            // Send to backend API
            const response = await fetch('/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setTimetable(result);
            toast.success("Timetable generated successfully!");
        } catch (error) {
            console.error("Error generating timetable:", error);
            toast.error("Failed to generate timetable. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    // Convert day number to name
    const getDayName = (day) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // Ensure day is within valid range
        const index = Number(day);
        return days[index];
    };

    return (
        <main className="mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="numSections">Number of Sections</Label>
                                    <Input
                                        id="numSections"
                                        type="number"
                                        min="1"
                                        value={numSections}
                                        onChange={(e) => updateNumSections(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="numCourses">Number of Courses</Label>
                                    <Input
                                        id="numCourses"
                                        type="number"
                                        min="1"
                                        value={numCourses}
                                        onChange={(e) => updateNumCourses(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="numRooms">Number of Rooms</Label>
                                    <Input
                                        id="numRooms"
                                        type="number"
                                        min="1"
                                        value={numRooms}
                                        onChange={(e) => updateNumRooms(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Weekdays</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {[0, 1, 2, 3, 4, 5].map(day => (
                                        <Button
                                            key={day}
                                            variant={weekdays.includes(day) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => toggleWeekday(day)}
                                        >
                                            {getDayName(day)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {courses.map((course, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                        <div>
                                            <Label>Name</Label>
                                            <Input
                                                value={course.name}
                                                onChange={(e) => updateCourse(index, "name", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Duration</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={course.duration}
                                                onChange={(e) => updateCourse(index, "duration", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Apparatus</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={course.apparatus}
                                                onChange={(e) => updateCourse(index, "apparatus", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rooms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {rooms.map((room, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2 items-center">
                                        <div>
                                            <Label>Name</Label>
                                            <Input
                                                value={room.name}
                                                onChange={(e) => updateRoom(index, "name", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Apparatus</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={room.apparatus}
                                                onChange={(e) => updateRoom(index, "apparatus", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Section Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Array.from({ length: numSections }).map((_, sectionIndex) => (
                                    <div key={sectionIndex} className="border p-4 rounded-md">
                                        <Label className="mb-2 block">Section {sectionIndex + 1} Courses</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {courses.map((course, courseIndex) => (
                                                <Button
                                                    key={courseIndex}
                                                    variant={sectionCourses[sectionIndex]?.includes(courseIndex) ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => toggleCourseForSection(sectionIndex, courseIndex)}
                                                >
                                                    {course.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={generateTimetable}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Timetable"}
                    </Button>
                </div>

                {/* Timetable Display */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Timetable</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {timetable ? (
                                <Timetable
                                    scheduleData={timetable.schedule}
                                    COURSE_NAMES={courseNames}
                                    ROOM_NAMES={roomNames}
                                    SECTION_NAMES={sectionNames}
                                />
                            ) : (
                                <div className="text-center p-8 text-gray-500">
                                    <p>Generated timetable will appear here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div >
            </div >
        </main >
    );
}