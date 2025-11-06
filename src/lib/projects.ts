import Project from './models/project.model';

/**
 * Find a project by id and verify the owner matches the provided userId.
 * Returns the project document if owner matches, otherwise null.
 */
export async function getProjectAndVerifyOwnership(projectId: string, userId: string) {
  const project = await Project.findById(projectId).exec();
  if (!project) return null;

  // project.userId may be an ObjectId - compare as strings
  if (project.userId.toString() !== userId) return null;

  return project;
}
