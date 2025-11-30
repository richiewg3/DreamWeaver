import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Play,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Wand2,
  Shirt,
  Clapperboard,
  GripVertical,
  AlertCircle,
} from 'lucide-react';
import { generatePrompt } from '../services/gemini';

/**
 * BeatSheet Component
 * Main UI for creating and managing scene beats with AI prompt generation
 */
const BeatSheet = ({
  beats,
  setBeats,
  storyContext,
  characters,
  locations,
  selectedCharacters,
  selectedLocations,
  isApiConfigured,
}) => {
  const [expandedBeat, setExpandedBeat] = useState(null);
  const [loadingBeat, setLoadingBeat] = useState(null);
  const [copiedBeat, setCopiedBeat] = useState(null);

  const getBeatLabel = (index) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (index < 26) return `Beat ${letters[index]}`;
    return `Beat ${Math.floor(index / 26)}${letters[index % 26]}`;
  };

  const addBeat = () => {
    const newBeat = {
      id: `beat_${Date.now()}`,
      action: '',
      outfitOverride: '',
      generatedPrompt: null,
      isGenerating: false,
      error: null,
    };
    setBeats([...beats, newBeat]);
  };

  const updateBeat = (id, field, value) => {
    setBeats(beats.map((beat) => 
      beat.id === id ? { ...beat, [field]: value } : beat
    ));
  };

  const removeBeat = (id) => {
    setBeats(beats.filter((beat) => beat.id !== id));
    if (expandedBeat === id) setExpandedBeat(null);
  };

  const generateBeatPrompt = async (beat) => {
    if (!isApiConfigured) {
      updateBeat(beat.id, 'error', 'API key not configured. Please add VITE_GOOGLE_API_KEY to your .env file.');
      return;
    }

    setLoadingBeat(beat.id);
    updateBeat(beat.id, 'isGenerating', true);
    updateBeat(beat.id, 'error', null);

    try {
      const selectedChars = characters.filter((c) => selectedCharacters.includes(c.id));
      const selectedLocs = locations.filter((l) => selectedLocations.includes(l.id));

      const result = await generatePrompt({
        storyContext,
        characters: selectedChars,
        locations: selectedLocs,
        beatAction: beat.action,
        outfitOverride: beat.outfitOverride,
      });

      if (result.success) {
        updateBeat(beat.id, 'generatedPrompt', result.prompt);
        setExpandedBeat(beat.id);
      } else {
        updateBeat(beat.id, 'error', result.error);
      }
    } catch (error) {
      updateBeat(beat.id, 'error', error.message);
    } finally {
      setLoadingBeat(null);
      updateBeat(beat.id, 'isGenerating', false);
    }
  };

  const copyToClipboard = async (text, beatId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBeat(beatId);
      setTimeout(() => setCopiedBeat(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const renderGeneratedPrompt = (beat) => {
    if (!beat.generatedPrompt) return null;

    return (
      <div className="mt-4 result-panel rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-cyan-500/10">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Generated Prompt</span>
          </div>
          <button
            onClick={() => copyToClipboard(beat.generatedPrompt, beat.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs transition-colors"
          >
            {copiedBeat === beat.id ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="p-4 font-prose text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
          {beat.generatedPrompt}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-500/10">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold gradient-text">Beat Sheet</h2>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-midnight-700 text-xs text-gray-400">
            {beats.length} {beats.length === 1 ? 'beat' : 'beats'}
          </span>
        </div>
        <button
          onClick={addBeat}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
        >
          <Plus className="w-4 h-4" />
          Add Beat
        </button>
      </div>

      {/* API Warning */}
      {!isApiConfigured && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-300 font-medium">API Key Required</p>
            <p className="text-xs text-amber-400/70 mt-1">
              Create a <code className="px-1 py-0.5 rounded bg-midnight-800">.env</code> file with your{' '}
              <code className="px-1 py-0.5 rounded bg-midnight-800">VITE_GOOGLE_API_KEY</code> to enable AI generation.
            </p>
          </div>
        </div>
      )}

      {/* Beats List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {beats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center mb-6 float-animation">
              <Clapperboard className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No beats yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              Create beats to break down your scene into individual moments. Each beat can generate a unique AI art prompt.
            </p>
            <button
              onClick={addBeat}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white"
            >
              <Plus className="w-4 h-4" />
              Create Your First Beat
            </button>
          </div>
        ) : (
          beats.map((beat, index) => (
            <div
              key={beat.id}
              className="beat-row rounded-xl p-4 transition-all"
            >
              {/* Beat Header */}
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 pt-2">
                  <GripVertical className="w-4 h-4 text-gray-600 cursor-grab" />
                  <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-sm font-semibold text-gray-200">
                    {getBeatLabel(index)}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {/* Action Input */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Action / Scene Description
                    </label>
                    <textarea
                      value={beat.action}
                      onChange={(e) => updateBeat(beat.id, 'action', e.target.value)}
                      placeholder="Describe what happens in this beat... (e.g., 'Character enters the dark forest, looking over their shoulder with fear')"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Outfit Override */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                      <Shirt className="w-3.5 h-3.5" />
                      Outfit Override (Optional)
                    </label>
                    <input
                      type="text"
                      value={beat.outfitOverride}
                      onChange={(e) => updateBeat(beat.id, 'outfitOverride', e.target.value)}
                      placeholder="e.g., 'Wearing a tattered red cloak and leather boots'"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => generateBeatPrompt(beat)}
                    disabled={loadingBeat === beat.id || !beat.action.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      loadingBeat === beat.id
                        ? 'bg-purple-500/30 text-purple-300 cursor-wait'
                        : beat.action.trim()
                        ? 'btn-primary text-white'
                        : 'bg-midnight-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loadingBeat === beat.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => removeBeat(beat.id)}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {beat.error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{beat.error}</p>
                </div>
              )}

              {/* Generated Prompt */}
              {beat.generatedPrompt && (
                <div className="mt-4">
                  <button
                    onClick={() => setExpandedBeat(expandedBeat === beat.id ? null : beat.id)}
                    className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {expandedBeat === beat.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {expandedBeat === beat.id ? 'Hide' : 'Show'} Generated Prompt
                  </button>
                  {expandedBeat === beat.id && renderGeneratedPrompt(beat)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BeatSheet;
