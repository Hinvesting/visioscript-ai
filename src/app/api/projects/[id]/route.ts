import dbConnect from '@/lib/db';
import Project from '@/lib/models/project.model';
import { NextResponse } from 'next/server';
import { verifyJwtAndGetUserId } from '@/lib/auth';
import { getProjectAndVerifyOwnership } from '@/lib/projects';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyJwtAndGetUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;
    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
    }

    await dbConnect();

    const project = await getProjectAndVerifyOwnership(projectId, userId);
    if (!project) {
      return NextResponse.json({ message: 'Project not found or forbidden' }, { status: 404 });
    }

    const updates = await request.json();
    // Only allow certain fields to be updated
    const allowed: any = {};
    if (typeof updates.title === 'string') allowed.title = updates.title;
    if (Array.isArray(updates.scenes)) allowed.scenes = updates.scenes;

    const updated = await Project.findByIdAndUpdate(projectId, allowed, { new: true }).exec();

    return NextResponse.json({ project: updated }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/projects/[id] Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
