"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { IProject } from '@/lib/models/project.model'; // Import our Project interface

export default function DashboardPage() {
  const { user, token, isLoading: isAuthLoading, logout } = useAuth();
  const router = useRouter();

  // --- App State ---
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Protection Effect ---
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [isAuthLoading, user, router]);

  // --- Data Fetching Effect ---
  // This effect runs when the user is authenticated
  useEffect(() => {
    if (user && token) {
      fetchProjects();
    }
  }, [user, token]); // Re-run if user or token changes

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await res.json();
      setProjects(data.projects);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handle Project Creation ---
  const handleCreateProject = async () => {
    // For now, we'll use a simple prompt.
    // In the future, we'll pop a modal to ask for title/type.
    const title = prompt("Enter a title for your new project:", "New Project");
    if (!title) return;

    setError(null);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, contentType: 'video-package' }), // Hard-coding type for now
      });

      if (!res.ok) {
        throw new Error('Failed to create project');
      }

      // Refresh the project list to show the new one
      fetchProjects(); 
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // --- Handle Project Click ---
  const handleProjectClick = (projectId: string) => {
    // This is where we will go to the editor page in the next step
    // router.push(`/project/${projectId}`);
    alert(`TODO: Navigate to project editor for ID: ${projectId}`);
  };

  // Show a loading spinner while checking auth or fetching data
  if (isAuthLoading || (isLoading && projects.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // If auth is checked and user is null, this will be null before redirect
  if (!user) {
    return null;
  }

  // --- Render The App ---
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8">
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 md:mb-12">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            VisioScript AI
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 hidden sm:block">{user.email}</span>
            <button
              onClick={logout}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Project Area */}
        <main>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Your Projects</h2>
            <button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition"
            >
              + Create New Project
            </button>
          </div>

          {error && (
            <div className="my-4 p-3 bg-red-800 border border-red-700 text-red-100 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Project List */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={String((project as any)._id)}
                  onClick={() => handleProjectClick(String((project as any)._id))}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:bg-gray-700 transition"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">Type: {project.contentType}</p>
                  <p className="text-gray-500 text-xs">
                    Last updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center text-gray-500 py-16 bg-gray-800 rounded-lg">
                <h3 className="text-2xl font-semibold">No Projects Yet</h3>
                <p className="mt-2">Click "Create New Project" to get started!</p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
