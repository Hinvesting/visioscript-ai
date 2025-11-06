import dbConnect from '@/lib/db';
import Project from '@/lib/models/project.model';
import { NextResponse } from 'next/server';
import { verifyJwtAndGetUserId } from '@/lib/auth';

/**
 * --- YOUR COPILOT PROMPT ---
 *
 * vvv COPILOT PROMPT vvv
 *
 * // Create a GET handler for this route
 * // 1. Authenticate the user by calling verifyJwtAndGetUserId(request).
 * // 2. If no userId, return a 401 Unauthorized error.
 * // 3. Connect to the database.
 * // 4. Find all Projects where the userId matches the authenticated user's ID.
 * // 5. Sort them by createdAt descending (newest first).
 * // 6. Return the projects in a 200 OK response.
 * // 7. Add try/catch error handling.
 *
 * ^^^ COPILOT PROMPT ^^^
 */

export async function GET(request: Request) {
  try {
    const userId = await verifyJwtAndGetUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/projects Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * --- YOUR COPILOT PROMPT ---
 *
 * vvv COPILOT PROMPT vvv
 *
 * // Create a POST handler for this route
 * // 1. Authenticate the user by calling verifyJwtAndGetUserId(request).
 * // 2. If no userId, return a 401 Unauthorized error.
 * // 3. Parse the request body for 'title' and 'contentType'.
 * // 4. Connect to the database.
 * // 5. Create a new Project with the title, contentType, and the authenticated userId.
 * // 6. Return the new project in a 201 Created response.
 * // 7. Add try/catch error handling.
 *
 * ^^^ COPILOT PROMPT ^^^
 */

export async function POST(request: Request) {
  try {
    const userId = await verifyJwtAndGetUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, contentType } = await request.json();
    if (!title || !contentType) {
      return NextResponse.json({ message: 'Title and contentType are required' }, { status: 400 });
    }

    await dbConnect();

    const newProject = await Project.create({
      userId,
      title,
      contentType,
      scenes: [], // Start with an empty array of scenes
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/projects Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
