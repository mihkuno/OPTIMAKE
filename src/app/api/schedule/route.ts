import { spawnSync } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    console.log('[INFO] Receiving request...');
    const inputData = await request.json();
    console.log('[DEBUG] Raw inputData:', inputData);

    // Build the input format expected by main.py
    const transformedInput = {
      weekdays: inputData.weekdays ?? [0, 1], // fallback just in case
      course_durations: inputData.course_durations,
      course_ids: inputData.course_ids ?? inputData.course_durations.map((_, i) => i),
      room_ids: inputData.room_ids ?? inputData.room_apparatus.map((_, i) => i),
      section_courses: inputData.section_courses,
      course_apparatus: inputData.course_apparatus,
      room_apparatus: inputData.room_apparatus
    };

    console.log('[DEBUG] Transformed input for main.py:', transformedInput);

    const exePath = path.join(process.cwd(), 'main.py');
    const pythonExecutable = 'python3';

    console.log('[INFO] Spawning Python process...');
    const proc = spawnSync(pythonExecutable, [exePath], {
      input: JSON.stringify(transformedInput),
      encoding: 'utf8',
      shell: false
    });

    if (proc.error) {
      console.error('[ERROR] Process spawn failed:', proc.error);
      throw proc.error;
    }

    console.log('[DEBUG] Process exited with status:', proc.status);
    console.log('[DEBUG] stdout:', proc.stdout);
    console.log('[DEBUG] stderr:', proc.stderr);

    if (proc.status !== 0) {
      return NextResponse.json(
        { error: 'Process failed', stderr: proc.stderr },
        { status: 500 }
      );
    }

    let parsed;
    try {
      console.log('[INFO] Parsing process output...');
      parsed = JSON.parse(proc.stdout);
    } catch (err) {
      console.error('[ERROR] Failed to parse JSON output:', proc.stdout);
      return NextResponse.json(
        { error: 'Failed to parse JSON output', rawOutput: proc.stdout },
        { status: 500 }
      );
    }

    console.log('[INFO] Returning parsed response');
    return NextResponse.json(parsed, { status: 200 });

  } catch (error) {
    console.error('[ERROR] Caught exception:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to generate timetable',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
