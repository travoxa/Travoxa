'use client';

import React, { useState, useEffect } from 'react';
import { RiPlayLine, RiBugLine, RiCodeSSlashLine, RiTerminalLine, RiFileCopyLine, RiCheckLine } from 'react-icons/ri';

type TestResult = {
  success: boolean;
  data?: unknown;
  error?: string;
  originalPrompt?: string;
  rawContent?: string;
  fullResponse?: unknown;
  finishReason?: string | null;
  usageMetadata?: unknown;
  generationConfig?: unknown;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected error occurred during the test.';
}

export default function AISettingsClient() {
  const generationFieldHelp = {
    maxTokens: 'Max output length. Too low truncates JSON; higher values increase cost and latency.',
    thinkingBudget: 'Hidden reasoning budget for supported Gemini thinking models. Higher values can reduce visible output space.',
    topP: 'Controls randomness by limiting probability mass. Too low can become repetitive; too high can reduce consistency.',
    topK: 'Limits next-token choices on supported models, mainly Gemini. Too low can make output rigid and unnatural.',
    stopSequences: 'Stops generation when any listed text appears. Unsafe values can cut JSON in the middle.',
    responseSchema: 'Defines expected JSON structure, mainly for Gemini. Invalid or over-strict schema can cause failures.',
  } as const;

  const [config, setConfig] = useState({
    provider: 'openrouter' as 'openrouter' | 'google',
    apiKey: '',
    modelName: '',
    googleApiKey: '',
    googleModelName: 'gemini-2.0-flash',
    promptTemplate: '',
    cityPromptTemplate: '',
    temperature: '0.4',
    maxTokens: '8192',
    topP: '0.9',
    topK: '40',
    thinkingBudget: '0',
    stopSequences: '',
    responseSchema: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Test State
  const [testInput, setTestInput] = useState({
    primaryType: 'Sightseeing',
    secondaryTypes: ['Nature', 'Photography'],
    departureName: 'Alappuzha',
    lat: '9.4981',
    lon: '76.3329'
  });
  const [testGenerationConfig, setTestGenerationConfig] = useState({
    maxTokens: '',
    thinkingBudget: '',
    topP: '',
    topK: '',
    stopSequences: '',
    responseSchema: '',
  });
  const [useLocalOverride, setUseLocalOverride] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [activeTab, setActiveTab] = useState<'parsed' | 'raw' | 'technical'>('parsed');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/admin/ai-config');
      const json = await res.json();
      if (json.success && json.data) {
        const savedStopSequences = Array.isArray(json.data.stopSequences) ? json.data.stopSequences.join('\n') : '';
        const savedResponseSchema = json.data.responseSchema ? JSON.stringify(json.data.responseSchema, null, 2) : '';
        setConfig({
          provider: json.data.provider || 'openrouter',
          apiKey: json.data.apiKey || '',
          modelName: json.data.modelName || '',
          googleApiKey: json.data.googleApiKey || '',
          googleModelName: json.data.googleModelName || 'gemini-2.0-flash',
          promptTemplate: json.data.promptTemplate || '',
          cityPromptTemplate: json.data.cityPromptTemplate || '',
          temperature: String(json.data.temperature ?? '0.4'),
          maxTokens: String(json.data.maxTokens ?? '8192'),
          topP: json.data.topP == null ? '0.9' : String(json.data.topP),
          topK: json.data.topK == null ? '40' : String(json.data.topK),
          thinkingBudget: json.data.thinkingBudget == null ? '0' : String(json.data.thinkingBudget),
          stopSequences: savedStopSequences,
          responseSchema: savedResponseSchema,
        });

        setTestGenerationConfig({
          maxTokens: json.data.maxTokens == null ? '8192' : String(json.data.maxTokens),
          thinkingBudget: json.data.thinkingBudget == null ? '0' : String(json.data.thinkingBudget),
          topP: json.data.topP == null ? '0.9' : String(json.data.topP),
          topK: json.data.topK == null ? '40' : String(json.data.topK),
          stopSequences: savedStopSequences,
          responseSchema: savedResponseSchema,
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
      let parsedResponseSchema: unknown = null;
      if (config.responseSchema.trim()) {
        try {
          parsedResponseSchema = JSON.parse(config.responseSchema);
        } catch {
          setMessage('Error: Response schema must be valid JSON before saving.');
          setSaving(false);
          return;
        }
      }

      const stopSequences = config.stopSequences
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean);

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          temperature: Number(config.temperature),
          maxTokens: Number(config.maxTokens),
          topP: config.topP === '' ? null : Number(config.topP),
          topK: config.topK === '' ? null : Number(config.topK),
          thinkingBudget: config.thinkingBudget === '' ? null : Number(config.thinkingBudget),
          stopSequences,
          responseSchema: parsedResponseSchema,
        }),
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
      let parsedSchema: unknown;
      if (testGenerationConfig.responseSchema.trim()) {
        try {
          parsedSchema = JSON.parse(testGenerationConfig.responseSchema);
        } catch {
          setTestResult({
            success: false,
            error: 'Response schema must be valid JSON before running the test.'
          });
          setTestLoading(false);
          return;
        }
      }

      const stopSequences = testGenerationConfig.stopSequences
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean);

      const generationConfig: Record<string, unknown> = {};
      if (testGenerationConfig.maxTokens !== '') generationConfig.maxTokens = Number(testGenerationConfig.maxTokens);
      if (testGenerationConfig.thinkingBudget !== '') generationConfig.thinkingBudget = Number(testGenerationConfig.thinkingBudget);
      if (testGenerationConfig.topP !== '') generationConfig.topP = Number(testGenerationConfig.topP);
      if (testGenerationConfig.topK !== '') generationConfig.topK = Number(testGenerationConfig.topK);
      if (stopSequences.length > 0) generationConfig.stopSequences = stopSequences;
      if (parsedSchema) generationConfig.responseSchema = parsedSchema;

      const payload: {
        primaryType: string;
        secondaryTypes: string[];
        departure: {
          name: string;
          lat: number;
          lon: number;
        };
        generationConfig: Record<string, unknown>;
        overrideConfig?: {
          USE_LOCAL_CONFIG: boolean;
          PROVIDER: 'openrouter' | 'google';
          API_KEY: string;
          MODEL: string;
          PROMPT: string;
        };
      } = {
        primaryType: testInput.primaryType,
        secondaryTypes: testInput.secondaryTypes,
        departure: {
          name: testInput.departureName,
          lat: parseFloat(testInput.lat),
          lon: parseFloat(testInput.lon)
        },
        generationConfig,
      };

      if (useLocalOverride) {
        payload.overrideConfig = {
          USE_LOCAL_CONFIG: true,
          PROVIDER: config.provider,
          API_KEY: config.provider === 'google' ? config.googleApiKey : config.apiKey,
          MODEL: config.provider === 'google' ? config.googleModelName : config.modelName,
          PROMPT: config.promptTemplate
        };
      }

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/ai-test-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setTestResult(json);
    } catch (error: unknown) {
      setTestResult({
        success: false,
        error: getErrorMessage(error)
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
    const stopSequences = testGenerationConfig.stopSequences
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    let responseSchema: unknown;
    if (testGenerationConfig.responseSchema.trim()) {
      try {
        responseSchema = JSON.parse(testGenerationConfig.responseSchema);
      } catch {
        responseSchema = testGenerationConfig.responseSchema;
      }
    }

    const generationConfig: Record<string, unknown> = {};
    if (testGenerationConfig.maxTokens !== '') generationConfig.maxTokens = Number(testGenerationConfig.maxTokens);
    if (testGenerationConfig.thinkingBudget !== '') generationConfig.thinkingBudget = Number(testGenerationConfig.thinkingBudget);
    if (testGenerationConfig.topP !== '') generationConfig.topP = Number(testGenerationConfig.topP);
    if (testGenerationConfig.topK !== '') generationConfig.topK = Number(testGenerationConfig.topK);
    if (stopSequences.length > 0) generationConfig.stopSequences = stopSequences;
    if (responseSchema) generationConfig.responseSchema = responseSchema;

    return JSON.stringify({
      primaryType: testInput.primaryType,
      secondaryTypes: testInput.secondaryTypes,
      departure: {
        name: testInput.departureName,
        lat: parseFloat(testInput.lat),
        lon: parseFloat(testInput.lon)
      },
      generationConfig,
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
	      },
        generationConfig: JSON.parse(getPostmanPayload()).generationConfig
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
          <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setConfig({ ...config, provider: 'openrouter' })}
              className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${config.provider === 'openrouter' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
              OpenRouter
            </button>
            <button
              type="button"
              onClick={() => setConfig({ ...config, provider: 'google' })}
              className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${config.provider === 'google' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
              Google AI (Gemini)
            </button>
          </div>
        </div>

        {config.provider === 'openrouter' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OpenRouter API Key</label>
              <input
                 type="password"
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
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google AI API Key</label>
              <input
                 type="password"
                 value={config.googleApiKey}
                 onChange={(e) => setConfig({ ...config, googleApiKey: e.target.value })}
                 placeholder="AIzaSy..."
                 className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gemini Model</label>
              <div className="flex gap-2 mb-2">
                <select
                  value={['gemini-2.0-flash', 'gemini-2.0-flash-lite-preview-02-05', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-flash-latest'].includes(config.googleModelName) ? config.googleModelName : 'custom'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== 'custom') {
                      setConfig({ ...config, googleModelName: val });
                    }
                  }}
                  className="flex-1 p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-2.0-flash-lite-preview-02-05">Gemini 2.0 Flash-Lite</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-flash-latest">Gemini Flash Latest (API default)</option>
                  <option value="custom">-- Custom Model Name --</option>
                </select>
              </div>
              
              {(!['gemini-2.0-flash', 'gemini-2.0-flash-lite-preview-02-05', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-flash-latest'].includes(config.googleModelName) || config.googleModelName === 'custom') && (
                <input
                  type="text"
                  value={config.googleModelName === 'custom' ? '' : config.googleModelName}
                  onChange={(e) => setConfig({ ...config, googleModelName: e.target.value })}
                  placeholder="Enter custom model name (e.g. gemini-flash-latest)"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              )}
            </div>
          </>
        )}

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

        <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/70">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Global Generation Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">General creativity level. Higher values add variety but can reduce consistency.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
              <input
                type="number"
                min="1"
                value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">{generationFieldHelp.maxTokens}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Top P</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={config.topP}
                onChange={(e) => setConfig({ ...config, topP: e.target.value })}
                placeholder="Optional"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">{generationFieldHelp.topP}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Top K</label>
              <input
                type="number"
                min="1"
                value={config.topK}
                onChange={(e) => setConfig({ ...config, topK: e.target.value })}
                placeholder="Optional"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">{generationFieldHelp.topK}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thinking Budget</label>
              <input
                type="number"
                min="0"
                value={config.thinkingBudget}
                onChange={(e) => setConfig({ ...config, thinkingBudget: e.target.value })}
                placeholder="Optional"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">{generationFieldHelp.thinkingBudget}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Stop Sequences</label>
              <textarea
                value={config.stopSequences}
                onChange={(e) => setConfig({ ...config, stopSequences: e.target.value })}
                rows={3}
                placeholder={'One stop sequence per line'}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">{generationFieldHelp.stopSequences}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Schema (JSON)</label>
              <textarea
                value={config.responseSchema}
                onChange={(e) => setConfig({ ...config, responseSchema: e.target.value })}
                rows={8}
                placeholder={'{\n  "type": "ARRAY",\n  "items": {\n    "type": "OBJECT"\n  }\n}'}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">{generationFieldHelp.responseSchema}</p>
            </div>
          </div>
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
              <select
                value={testInput.primaryType}
                onChange={(e) => setTestInput({ ...testInput, primaryType: e.target.value })}
                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500 appearance-none cursor-pointer"
              >
                {['Sightseeing', 'Hill Station', 'Beach', 'Weekend Getaway', 'Budget Trip', 'Adventure', 'Pilgrimage'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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

          <div className="mt-6">
            <h4 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-3">Generation Controls</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Max Tokens</label>
                <input
                  type="number"
                  min="1"
                  value={testGenerationConfig.maxTokens}
                  onChange={(e) => setTestGenerationConfig({ ...testGenerationConfig, maxTokens: e.target.value })}
                  placeholder="e.g. 4096"
                  className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
                />
                <p className="mt-1 text-xs text-orange-700/80">{generationFieldHelp.maxTokens}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Thinking Budget</label>
                <input
                  type="number"
                  min="0"
                  value={testGenerationConfig.thinkingBudget}
                  onChange={(e) => setTestGenerationConfig({ ...testGenerationConfig, thinkingBudget: e.target.value })}
                  placeholder="e.g. 0"
                  className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
                />
                <p className="mt-1 text-xs text-orange-700/80">{generationFieldHelp.thinkingBudget}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Top P</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={testGenerationConfig.topP}
                  onChange={(e) => setTestGenerationConfig({ ...testGenerationConfig, topP: e.target.value })}
                  placeholder="e.g. 0.9"
                  className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
                />
                <p className="mt-1 text-xs text-orange-700/80">{generationFieldHelp.topP}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Top K</label>
                <input
                  type="number"
                  min="1"
                  value={testGenerationConfig.topK}
                  onChange={(e) => setTestGenerationConfig({ ...testGenerationConfig, topK: e.target.value })}
                  placeholder="e.g. 40"
                  className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500"
                />
                <p className="mt-1 text-xs text-orange-700/80">{generationFieldHelp.topK}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Stop Sequences</label>
                <textarea
                  value={testGenerationConfig.stopSequences}
                  onChange={(e) => setTestGenerationConfig({ ...testGenerationConfig, stopSequences: e.target.value })}
                  rows={3}
                  placeholder={'One stop sequence per line\nExample: ```'}
                  className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500 font-mono"
                />
                <p className="mt-1 text-xs text-orange-700/80">{generationFieldHelp.stopSequences}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase tracking-wider">Response Schema (JSON)</label>
                <textarea
                  value={testGenerationConfig.responseSchema}
                  onChange={(e) => setTestGenerationConfig({ ...testGenerationConfig, responseSchema: e.target.value })}
                  rows={8}
                  placeholder={'{\n  "type": "ARRAY",\n  "items": {\n    "type": "OBJECT"\n  }\n}'}
                  className="w-full p-2 bg-white border border-orange-200 rounded-lg text-sm outline-none focus:border-orange-500 font-mono"
                />
                <p className="mt-1 text-xs text-orange-700/80">{generationFieldHelp.responseSchema}</p>
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
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70">Processed System Prompt</p>
                    <div className="bg-white/60 border border-green-100 p-3 rounded-lg text-xs text-green-900 font-mono whitespace-pre-wrap leading-relaxed">
                      {testResult.originalPrompt}
                    </div>
                  </div>
                )}

                {(!!testResult.finishReason || !!testResult.usageMetadata || !!testResult.generationConfig) && (
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white/60 border border-green-100 p-3 rounded-lg">
                      <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70">Finish Reason</p>
                      <p className="text-sm text-green-900 font-mono">{testResult.finishReason || 'n/a'}</p>
                    </div>
                    <div className="bg-white/60 border border-green-100 p-3 rounded-lg md:col-span-2">
                      <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70">Applied Generation Config</p>
                      <pre className="text-xs text-green-900 font-mono whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(testResult.generationConfig || {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4 bg-green-100/50 p-1 rounded-lg w-fit">
                  <button 
                    onClick={() => setActiveTab('parsed')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'parsed' ? 'bg-white text-green-700 shadow-sm' : 'text-green-600 hover:bg-white/40'}`}
                  >
                    PARSED UI
                  </button>
                  <button 
                    onClick={() => setActiveTab('raw')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'raw' ? 'bg-white text-green-700 shadow-sm' : 'text-green-600 hover:bg-white/40'}`}
                  >
                    RAW OUTPUT
                  </button>
                  <button 
                    onClick={() => setActiveTab('technical')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'technical' ? 'bg-white text-green-700 shadow-sm' : 'text-green-600 hover:bg-white/40'}`}
                  >
                    TECHNICAL
                  </button>
                </div>

                {activeTab === 'parsed' && (
                  <div>
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70 border-b border-green-100 pb-1">AI Response (Parsed JSON)</p>
                    <div className="bg-white border border-green-200 p-4 rounded-xl max-h-[400px] overflow-y-auto shadow-inner shadow-green-50/50 mt-2">
                      <pre className="text-xs text-gray-800 font-mono leading-relaxed">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {activeTab === 'raw' && (
                  <div>
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70 border-b border-green-100 pb-1">Exact LLM Output (Text)</p>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl max-h-[400px] overflow-y-auto shadow-2xl mt-2">
                      <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
                        {testResult.rawContent || 'No raw content available.'}
                      </pre>
                    </div>
                  </div>
                )}

                {activeTab === 'technical' && (
                    <div>
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5 opacity-70 border-b border-green-100 pb-1">Provider Full Response</p>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl max-h-[400px] overflow-y-auto shadow-2xl mt-2">
                      <pre className="text-[11px] text-blue-400 font-mono leading-relaxed">
                        {JSON.stringify({
                          finishReason: testResult.finishReason,
                          usageMetadata: testResult.usageMetadata,
                          fullResponse: testResult.fullResponse,
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
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
