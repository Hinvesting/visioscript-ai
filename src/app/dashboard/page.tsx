"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// This is the content from our original app.jsx, now a client component
// that is protected and uses our auth state.

export default function DashboardPage() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();

  // --- App State ---
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Protection Effect ---
  // This effect protects the page
  useEffect(() => {
    if (!isLoading && !user) {
      // If loading is done and there's no user, redirect to login
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // --- Handle Generation ---
  // This is where we will call our SECURE API route from Phase 3
  const handleGenerateClick = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');

    // Simulate API call delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulated back-end response
    const mockResponse = `This is the AI-generated content for your prompt: "${prompt}". 
    
This request was made by: ${user?.email}
Subscription Status: ${user?.subscriptionStatus}
    
In Phase 3, this will be a real call to /api/generate/process-script.`;

    setGeneratedContent(mockResponse);
    setIsGenerating(false);
  };

  // Show a loading spinner while checking auth
  if (isLoading) {
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
      <div className="w-full max-w-3xl">
        
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

        {/* Content Generation Area (from app.jsx) */}
        <main className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
          
          <div className="flex flex-col">
            <label htmlFor="prompt" className="text-sm font-medium text-gray-300 mb-2">
              Your Prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full p-4 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
              placeholder="e.g., Write a blog post about the future of AI..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out
                ${isGenerating 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : 'Generate Content'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-800 border border-red-700 text-red-100 rounded-lg text-center">
              {error}
            </div>
          )}

          {generatedContent && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                Generated Content
              </h2>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 whitespace-pre-wrap text-gray-300">
                {generatedContent}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
