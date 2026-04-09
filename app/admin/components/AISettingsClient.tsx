'use client';

import React, { useState, useEffect } from 'react';
import { RiPlayLine, RiBugLine, RiCodeSSlashLine, RiTerminalLine, RiFileCopyLine, RiCheckLine } from 'react-icons/ri';

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
  
  // Test State
  const [testInput, setTestInput] = useState({
    primaryType: 'Sightseeing',
    secondaryTypes: ['Nature', 'Photography'],
    departureName: 'London',
    lat: '51.5074',
    lon: '-0.1278'
  });
  const [useLocalOverride, setUseLocalOverride] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
    originalPrompt?: string;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

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

  const handleRunTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const payload: any = {
        primaryType: testInput.primaryType,
        secondaryTypes: testInput.secondaryTypes,
        departure: {
          name: testInput.departureName,
          lat: parseFloat(testInput.lat),
          lon: parseFloat(testInput.lon)
        }
      };

      if (useLocalOverride) {
        payload.overrideConfig = {
          USE_LOCAL_CONFIG: true,
          API_KEY: config.apiKey,
          MODEL: config.modelName,
          PROMPT: config.promptTemplate
        };
      }

      const res = await fetch('/api/ai-test-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setTestResult(json);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message || 'An unexpected error occurred during the test.'
      });
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getPostmanPayload = () => {
    return JSON.stringify({
      primaryType: testInput.primaryType,
      secondaryTypes: testInput.secondaryTypes,
      departure: {
        name: testInput.departureName,
        lat: parseFloat(testInput.lat),
        lon: parseFloat(testInput.lon)
      }
    }, null, 2);
  };

  const getCurlCommand = () => {
    return `curl -X POST ${window.location.origin}/api/ai-test-run \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({
      primaryType: testInput.primaryType,
      secondaryTypes: testInput.secondaryTypes,
      departure: {
        name: testInput.departureName,
        lat: parseFloat(testInput.lat),
        lon: parseFloat(testInput.lon)
      }
    })}'`;
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

      <div className="mt-12 pt-12 border-t border-gray-100 italic text-gray-400 text-xs">
        Note: The city screen prompt template is currently only used in the mobile application logic and cannot be tested from this screen yet.
      </div>

      {/* Testing Section */}
      <div className="mt-12 pt-12 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <RiBugLine className="text-orange-500 text-xl" />
          <h2 className="text-xl font-bold text-gray-900">Test AI Integration</h2>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-orange-800 mb-4 flex items-center gap-2">
            <RiPlayLine /> Mock Test Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Primary Type</label>
              <input
                type="text"
                value={testInput.primaryType}
                onChange={(e) => setTestInput({ ...testInput, primaryType: e.target.value })}
                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Departure Name</label>
              <input
                type="text"
                value={testInput.departureName}
                onChange={(e) => setTestInput({ ...testInput, departureName: e.target.value })}
                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Coordinates (Lat, Lon)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput.lat}
                  onChange={(e) => setTestInput({ ...testInput, lat: e.target.value })}
                  placeholder="Lat"
                  className="w-1/2 p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  value={testInput.lon}
                  onChange={(e) => setTestInput({ ...testInput, lon: e.target.value })}
                  placeholder="Lon"
                  className="w-1/2 p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useLocalOverride}
                onChange={(e) => setUseLocalOverride(e.target.checked)}
                className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-orange-800 font-medium">Use Unsaved Config (above)</span>
            </label>

            <button
              onClick={handleRunTest}
              disabled={testLoading}
              className="px-8 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 transition-all shadow-md shadow-orange-200 flex items-center gap-2"
            >
              {testLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  Testing AI...
                </>
              ) : (
                <>
                  <RiPlayLine /> Run AI Test
                </>
              )}
            </button>
          </div>
        </div>

        {testResult && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {testResult.success ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <RiCheckLine className="text-green-600" /> Result Received
                </h3>
                
                {testResult.originalPrompt && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70">Processed System Prompt</p>
                    <div className="bg-white/60 border border-green-100 p-3 rounded-lg text-xs text-green-900 font-mono whitespace-pre-wrap leading-relaxed">
                      {testResult.originalPrompt}
                    </div>
                  </div>
                )}

                <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70">AI Response Data</p>
                <div className="bg-white border border-green-200 p-4 rounded-xl max-h-[400px] overflow-y-auto shadow-inner shadow-green-50/50">
                  <pre className="text-xs text-gray-800 font-mono leading-relaxed">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  Test Execution Failed
                </h3>
                <div className="bg-white border border-red-200 p-4 rounded-xl text-sm text-red-600 font-mono whitespace-pre-wrap">
                   {testResult.error || 'Unknown error occurred'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Developer Reference Section */}
      <div className="mt-12 pt-12 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-gray-400">
          <RiTerminalLine className="text-xl" />
          <h2 className="text-lg font-bold text-gray-800">Developer Reference (Postman / Manual)</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <RiCodeSSlashLine /> API Endpoint (POST)
              </span>
              <button 
                onClick={() => copyToClipboard(`${window.location.origin}/api/ai-test-run`, 'endpoint')}
                className="text-xs text-gray-400 hover:text-green-600 flex items-center gap-1 transition-colors"
              >
                {copiedType === 'endpoint' ? <><RiCheckLine /> Copied</> : <><RiFileCopyLine /> Copy URL</>}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm text-gray-700 font-mono break-all">
              {typeof window !== 'undefined' ? `${window.location.host}/api/ai-test-run` : '/api/ai-test-run'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  Sample JSON Payload
                </span>
                <button 
                  onClick={() => copyToClipboard(getPostmanPayload(), 'payload')}
                  className="text-xs text-gray-400 hover:text-green-600 flex items-center gap-1 transition-colors"
                >
                  {copiedType === 'payload' ? <><RiCheckLine /> Copied</> : <><RiFileCopyLine /> Copy JSON</>}
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl max-h-[250px] overflow-y-auto">
                <pre className="text-[11px] text-green-400 font-mono leading-relaxed">
                  {getPostmanPayload()}
                </pre>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  cURL Command
                </span>
                <button 
                  onClick={() => copyToClipboard(getCurlCommand(), 'curl')}
                  className="text-xs text-gray-400 hover:text-green-600 flex items-center gap-1 transition-colors"
                >
                  {copiedType === 'curl' ? <><RiCheckLine /> Copied</> : <><RiFileCopyLine /> Copy cURL</>}
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl max-h-[250px] overflow-y-auto">
                <pre className="text-[11px] text-blue-400 font-mono leading-relaxed whitespace-pre-wrap">
                  {typeof window !== 'undefined' ? getCurlCommand() : 'Loading command...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
