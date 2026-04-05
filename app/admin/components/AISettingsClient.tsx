'use client';

import React, { useState, useEffect } from 'react';

export default function AISettingsClient() {
  const [config, setConfig] = useState({
    apiKey: '',
    modelName: '',
    promptTemplate: '',
    cityPromptTemplate: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/ai-config');
      const json = await res.json();
      if (json.success && json.data) {
        setConfig({
          apiKey: json.data.apiKey || '',
          modelName: json.data.modelName || '',
          promptTemplate: json.data.promptTemplate || '',
          cityPromptTemplate: json.data.cityPromptTemplate || '',
        });
      }
    } catch (error) {
      console.error('Failed to load config', error);
      setMessage('Failed to load configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      if (json.success) {
        setMessage('Configuration saved successfully!');
      } else {
        setMessage(`Error: ${json.error}`);
      }
    } catch (error) {
      console.error('Failed to save config', error);
      setMessage('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading AI Settings...</div>;

  return (
    <div className="max-w-4xl max-h-screen overflow-y-auto p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Search Configuration</h1>
        <p className="text-gray-500 mt-2 text-sm">Configure parameters for AI-powered location searching including OpenRouter integration details.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">OpenRouter API Key</label>
          <input
             type="text"
             value={config.apiKey}
             onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
             placeholder="sk-or-v1-..."
             className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
          <input
             type="text"
             value={config.modelName}
             onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
             placeholder="e.g. google/gemini-2.0-flash-lite-preview-02-05:free"
             className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Template</label>
           <p className="text-xs text-gray-500 mb-3">Available variables: {'{primaryType}'}, {'{lat}'}, {'{lon}'}, {'{departureName}'}</p>
           <textarea
             value={config.promptTemplate}
             onChange={(e) => setConfig({ ...config, promptTemplate: e.target.value })}
             rows={6}
             className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono text-sm leading-relaxed"
             placeholder="Enter your system prompt here..."
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">City Screen Prompt Template</label>
           <p className="text-xs text-gray-500 mb-3">Available variables: {'{cityName}'}</p>
           <textarea
             value={config.cityPromptTemplate}
             onChange={(e) => setConfig({ ...config, cityPromptTemplate: e.target.value })}
             rows={6}
             className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono text-sm leading-relaxed"
             placeholder="Enter the city screen prompt here..."
           />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
