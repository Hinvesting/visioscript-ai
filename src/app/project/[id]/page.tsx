"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { IProject } from '@/lib/models/project.model';

export default function ProjectEditorPage() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (user && token && projectId) {
      fetchProject();
    }
  }, [user, token, projectId]);

  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await res.json();
      setProject(data.project);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">{error || 'Project not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-gray-400">Type: {project.contentType}</p>
        </header>

        {project.scenes.length === 0 ? (
          <div className="p-6 bg-gray-800 rounded-lg text-center">No scenes yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.scenes.map((scene) => (
              <div key={scene.id} className="bg-gray-800 rounded-lg p-4">
                {scene.imageUrl ? (
                  <img src={scene.imageUrl} alt={scene.description || 'scene image'} className="w-full h-40 object-cover rounded mb-3" />
                ) : (
                  <div className="w-full h-40 bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <h3 className="font-semibold text-lg mb-1">Scene: {scene.id}</h3>
                {scene.description && <p className="text-gray-300 mb-2">{scene.description}</p>}
                {scene.dialogue && <pre className="text-sm bg-gray-900 p-2 rounded text-gray-300 whitespace-pre-wrap">{scene.dialogue}</pre>}
                {scene.imagePrompt && <p className="text-sm text-gray-400 mt-2">Prompt: {scene.imagePrompt}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
