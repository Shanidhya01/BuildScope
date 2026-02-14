"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { 
  FileText, 
  Sparkles, 
  Building2, 
  Database, 
  Plug, 
  Calendar,
  ArrowLeft,
  Copy,
  Download,
  FileDown,
  Trash2,
  CheckCircle2,
  Loader2,
  Table as TableIcon,
  List
} from "lucide-react";

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [databaseViewMode, setDatabaseViewMode] = useState("table"); // 'table' or 'text'

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${params.id}`, {
          headers: {
            Authorization: "Bearer testtoken", // temporary
          },
        });
        setProject(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load project. It may have been deleted or you don't have access.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/projects/${params.id}`, {
        headers: {
          Authorization: "Bearer testtoken",
        },
      });
      router.push("/projects");
    } catch (err) {
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleCopyText = async () => {
    try {
      const blueprint = project.blueprint || {};
      const textContent = formatBlueprintAsText(blueprint);
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/export/${params.id}?format=pdf`, {
        headers: {
          Authorization: "Bearer testtoken",
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.idea.substring(0, 30)}-blueprint.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadMarkdown = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/export/${params.id}?format=md`, {
        headers: {
          Authorization: "Bearer testtoken",
        },
      });

      const blob = new Blob([response.data], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.idea.substring(0, 30)}-blueprint.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download Markdown. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const formatBlueprintAsText = (blueprint) => {
    let text = `Project: ${project.idea}\n`;
    text += `Created: ${new Date(project.createdAt).toLocaleDateString()}\n\n`;
    text += "=" .repeat(60) + "\n\n";

    Object.entries(blueprint).forEach(([key, value]) => {
      text += `${key.toUpperCase()}\n`;
      text += "-".repeat(60) + "\n";
      text += formatValue(value) + "\n\n";
    });

    return text;
  };

  const formatValue = (value, indent = 0) => {
    const indentStr = "  ".repeat(indent);
    
    if (typeof value === 'string') {
      return indentStr + value;
    } else if (Array.isArray(value)) {
      return value.map((item, i) => {
        if (typeof item === 'string') {
          return `${indentStr}${i + 1}. ${item}`;
        } else if (typeof item === 'object') {
          return `${indentStr}${i + 1}. ${formatValue(item, indent + 1)}`;
        }
        return `${indentStr}${i + 1}. ${String(item)}`;
      }).join('\n');
    } else if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([k, v]) => {
        return `${indentStr}${k}: ${formatValue(v, indent + 1)}`;
      }).join('\n');
    }
    return indentStr + String(value);
  };

  const renderAPIEndpoint = (endpoint, index) => {
    return (
      <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-3">
          <span className={`px-3 py-1 rounded-md text-xs font-bold ${
            endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
            endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
            endpoint.method === 'PATCH' ? 'bg-orange-100 text-orange-700' :
            endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {endpoint.method}
          </span>
          <code className="flex-1 font-mono text-sm text-slate-700 bg-slate-50 px-3 py-1 rounded">
            {endpoint.path}
          </code>
        </div>
        <p className="text-slate-600 text-sm ml-16">{endpoint.description}</p>
      </div>
    );
  };

  const renderDatabaseTable = (collections) => {
    if (!Array.isArray(collections)) {
      return <p className="text-slate-500 italic">No collections defined</p>;
    }

    const isObjectSchema = collections.some(
      (collection) => typeof collection === "object" && collection !== null
    );

    if (isObjectSchema) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">
                  Collection Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">
                  Fields
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection, index) => {
                const name =
                  typeof collection === "object" && collection !== null
                    ? collection.name || `collection_${index + 1}`
                    : String(collection);
                const fields =
                  typeof collection === "object" && collection !== null && Array.isArray(collection.fields)
                    ? collection.fields
                    : [];

                return (
                  <tr key={index} className="hover:bg-slate-50 align-top">
                    <td className="px-4 py-3 text-sm text-slate-600 border border-slate-200">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-700 border border-slate-200">
                      {name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">
                      {fields.length > 0 ? fields.join(", ") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">
                Collection Name
              </th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-600 border border-slate-200">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-slate-700 border border-slate-200">
                  {collection}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = (content) => {
    if (!content) return <p className="text-slate-500 italic">No content available</p>;

    if (typeof content === 'string') {
      return (
        <div className="prose prose-slate max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{content}</p>
        </div>
      );
    }

    if (Array.isArray(content)) {
      return (
        <ul className="space-y-3">
          {content.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                {index + 1}
              </span>
              <span className="flex-1 text-slate-700 leading-relaxed">
                {typeof item === 'string' ? item : renderContent(item)}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    if (typeof content === 'object') {
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value], index) => (
            <div key={index} className="border-l-4 border-blue-400 pl-4 py-2 bg-slate-50 rounded-r">
              <h4 className="font-semibold text-slate-800 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
              </h4>
              <div className="text-slate-700">
                {renderContent(value)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-slate-700">{String(content)}</p>;
  };

  const renderSection = (title, content, icon) => {
    if (!content) return null;

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="text-slate-700">
          {renderContent(content)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-4">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-slate-600 font-medium">Loading project details...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const blueprint = project.blueprint || {};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Projects
            </Link>
          </div>

          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{project.idea}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(project.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.createdAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={handleCopyText}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors group relative"
                  title="Copy as Text"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Download as PDF"
                >
                  {downloading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileDown className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  disabled={downloading}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Download as Markdown"
                >
                  {downloading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleDelete}
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(blueprint).length}
                </div>
                <div className="text-sm text-slate-600">Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {blueprint.timeline ? '✓' : '—'}
                </div>
                <div className="text-sm text-slate-600">Timeline</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {blueprint.database ? '✓' : '—'}
                </div>
                <div className="text-sm text-slate-600">Database</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {blueprint.apis ? '✓' : '—'}
                </div>
                <div className="text-sm text-slate-600">API Specs</div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="flex border-b border-slate-200 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: <FileText className="w-4 h-4" /> },
                { id: "features", label: "Features", icon: <Sparkles className="w-4 h-4" /> },
                { id: "architecture", label: "Architecture", icon: <Building2 className="w-4 h-4" /> },
                { id: "database", label: "Database", icon: <Database className="w-4 h-4" /> },
                { id: "api", label: "API", icon: <Plug className="w-4 h-4" /> },
                { id: "timeline", label: "Timeline", icon: <Calendar className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Project Overview</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Project Idea</h4>
                        <p className="text-slate-700 leading-relaxed">{project.idea}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Created</p>
                          <p className="text-slate-900 font-medium">
                            {new Date(project.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Total Sections</p>
                          <p className="text-slate-900 font-medium">{Object.keys(blueprint).length}</p>
                        </div>
                      </div>
                      {blueprint.description && (
                        <div className="pt-4 border-t border-slate-200">
                          <h4 className="font-semibold text-slate-800 mb-3">Description</h4>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{blueprint.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="space-y-6">
                  {renderSection(
                    "Core Features",
                    blueprint.features || "No features defined",
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </div>
              )}

              {activeTab === "architecture" && (
                <div className="space-y-6">
                  {renderSection(
                    "Technology Stack",
                    blueprint.techStack || blueprint.techstack || blueprint.architecture || "No architecture details available",
                    <Building2 className="w-5 h-5 text-white" />
                  )}
                </div>
              )}

              {activeTab === "database" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Database Schema</h3>
                      </div>
                      
                      {/* View Mode Toggle */}
                      <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                        <button
                          onClick={() => setDatabaseViewMode('table')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            databaseViewMode === 'table'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <TableIcon className="w-4 h-4" />
                          Table
                        </button>
                        <button
                          onClick={() => setDatabaseViewMode('text')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            databaseViewMode === 'text'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <List className="w-4 h-4" />
                          List
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-slate-700">
                      {databaseViewMode === 'table' ? (
                        renderDatabaseTable(blueprint.database?.collections || blueprint.database)
                      ) : (
                        <pre className="text-xs text-slate-700 overflow-auto max-h-96 bg-slate-50 p-4 rounded border border-slate-200">
                          {JSON.stringify(blueprint.database || { collections: [] }, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                        <Plug className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">API Endpoints</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {blueprint.apis && Array.isArray(blueprint.apis) ? (
                        blueprint.apis.map((endpoint, index) => renderAPIEndpoint(endpoint, index))
                      ) : (
                        <p className="text-slate-500 italic">No API specifications available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  {renderSection(
                    "Development Timeline",
                    blueprint.timeline || "No timeline available",
                    <Calendar className="w-5 h-5 text-white" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}