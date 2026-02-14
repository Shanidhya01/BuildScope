"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Generate() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [savingProject, setSavingProject] = useState(false);
  const [projectSaved, setProjectSaved] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState("");
  const [saveError, setSaveError] = useState("");

  const saveGeneratedProject = async (generatedBlueprint: any, generatedIdea: string) => {
    if (!generatedBlueprint || !generatedIdea?.trim()) return null;

    setSavingProject(true);
    setSaveError("");

    try {
      const savedResponse = await api.post("/projects", {
        idea: generatedIdea.trim(),
        blueprint: generatedBlueprint
      });

      setProjectSaved(true);
      setSavedProjectId(savedResponse?.data?._id || "");
      return savedResponse.data;
    } catch (saveErr: any) {
      const saveMessage =
        saveErr?.response?.data?.message ||
        (typeof saveErr?.response?.data === "string" ? saveErr.response.data : "") ||
        saveErr?.message ||
        "Blueprint generated, but failed to auto-save to Projects.";

      setProjectSaved(false);
      setSavedProjectId("");
      setSaveError(saveMessage);
      return null;
    } finally {
      setSavingProject(false);
    }
  };

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError("Please enter your project idea");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setProjectSaved(false);
    setSavedProjectId("");
    setSaveError("");

    try {
      const response = await api.post("/ai/generate", {
        idea
      });
      setResult(response.data);
      const savedProject = await saveGeneratedProject(response.data, idea);

      if (savedProject?._id) {
        router.push(`/projects/${savedProject._id}`);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to generate blueprint. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  const exampleIdeas = [
    "A task management app with real-time collaboration and kanban boards",
    "An e-commerce platform for handmade crafts with seller profiles",
    "A fitness tracking app with workout plans and progress analytics",
    "A recipe sharing platform with ingredient substitution suggestions"
  ];

  const renderSection = (title: string, content: any, icon: React.ReactNode) => {
    if (!content) return null;

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Generate Project Blueprint
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Describe your software idea in plain English, and we'll create a complete, structured project blueprint for you.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Describe Your Project Idea
            </label>
            
            <div className="relative">
              <textarea
                className="w-full border-2 border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900 placeholder:text-slate-400 resize-none"
                rows={6}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Example: A social media platform for pet owners to share photos, connect with local pet services, and schedule playdates. Include user profiles, messaging, location-based search, and booking system..."
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                {idea.length} characters • Press Cmd/Ctrl + Enter to generate
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Example Ideas */}
            {!result && !loading && (
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-700 mb-3">Need inspiration? Try these:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exampleIdeas.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setIdea(example)}
                      className="text-left p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 transition-colors"
                    >
                      <span className="text-blue-600 font-medium">💡</span> {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !idea.trim()}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Blueprint...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Project Blueprint
                </>
              )}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Analyzing Your Idea</h3>
                <p className="text-slate-600 text-center max-w-md">
                  Our AI is crafting a comprehensive blueprint with features, architecture, database schema, and timeline...
                </p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {savingProject
                    ? "Blueprint generated. Auto-saving to Projects..."
                    : projectSaved
                      ? "Blueprint generated and saved to Projects"
                      : "Blueprint generated successfully"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy JSON
                  </button>
                  <button
                    onClick={() => saveGeneratedProject(result, idea)}
                    disabled={savingProject || projectSaved}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {savingProject ? "Saving..." : projectSaved ? "Saved to Projects" : "Save to Projects"}
                  </button>
                </div>
              </div>

              {saveError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm">
                  {saveError}
                </div>
              )}

              {projectSaved && savedProjectId && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                  Auto-saved to Projects successfully.
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200 overflow-x-auto">
                  {[
                    { id: "overview", label: "Overview", icon: "📋" },
                    { id: "features", label: "Features", icon: "✨" },
                    { id: "architecture", label: "Architecture", icon: "🏗️" },
                    { id: "database", label: "Database", icon: "💾" },
                    { id: "api", label: "API", icon: "🔌" },
                    { id: "timeline", label: "Timeline", icon: "📅" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      {renderSection(
                        "Project Overview",
                        result.overview || result.description,
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                  )}

                  {activeTab === "features" && (
                    <div className="space-y-4">
                      {renderSection(
                        "Core Features",
                        result.features,
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      )}
                    </div>
                  )}

                  {activeTab === "architecture" && (
                    <div className="space-y-4">
                      {renderSection(
                        "System Architecture",
                        result.architecture,
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                    </div>
                  )}

                  {activeTab === "database" && (
                    <div className="space-y-4">
                      {renderSection(
                        "Database Schema",
                        result.database || result.schema,
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      )}
                    </div>
                  )}

                  {activeTab === "api" && (
                    <div className="space-y-4">
                      {renderSection(
                        "API Endpoints",
                        result.api || result.endpoints,
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  )}

                  {activeTab === "timeline" && (
                    <div className="space-y-4">
                      {renderSection(
                        "Development Timeline",
                        result.timeline || result.milestones,
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Raw JSON Fallback */}
                  {!result[activeTab] && (
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <p className="text-sm text-slate-600 mb-3">Raw JSON data for this section:</p>
                      <pre className="text-xs text-slate-700 overflow-auto max-h-96 bg-white p-4 rounded border border-slate-200">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}