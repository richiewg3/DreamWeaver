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
  Camera,
  Sun,
  Aperture,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { generatePrompt } from '../services/gemini';

// Shot type options for cinematography
const SHOT_TYPES = [
  { value: '', label: 'Auto (AI decides)' },
  { value: 'extreme_wide', label: 'Extreme Wide Shot' },
  { value: 'wide', label: 'Wide Shot' },
  { value: 'full', label: 'Full Shot' },
  { value: 'medium_wide', label: 'Medium Wide Shot' },
  { value: 'medium', label: 'Medium Shot' },
  { value: 'medium_close', label: 'Medium Close-Up' },
  { value: 'close', label: 'Close-Up' },
  { value: 'extreme_close', label: 'Extreme Close-Up' },
  { value: 'over_shoulder', label: 'Over-the-Shoulder' },
  { value: 'pov', label: 'POV Shot' },
  { value: 'two_shot', label: 'Two Shot' },
];

// Camera angle options
const CAMERA_ANGLES = [
  { value: '', label: 'Auto (AI decides)' },
  { value: 'eye_level', label: 'Eye Level' },
  { value: 'low_angle', label: 'Low Angle (heroic)' },
  { value: 'high_angle', label: 'High Angle (vulnerable)' },
  { value: 'birds_eye', label: "Bird's Eye View" },
  { value: 'worms_eye', label: "Worm's Eye View" },
  { value: 'dutch_angle', label: 'Dutch Angle (tilted)' },
  { value: 'profile', label: 'Profile View' },
  { value: 'three_quarter', label: 'Three-Quarter View' },
];

// Lighting preset options
const LIGHTING_PRESETS = [
  { value: '', label: 'Auto (AI decides)' },
  { value: 'natural_daylight', label: 'Natural Daylight' },
  { value: 'golden_hour', label: 'Golden Hour' },
  { value: 'blue_hour', label: 'Blue Hour' },
  { value: 'overcast', label: 'Overcast/Soft Light' },
  { value: 'harsh_midday', label: 'Harsh Midday Sun' },
  { value: 'moonlight', label: 'Moonlight' },
  { value: 'candlelight', label: 'Candlelight/Warm Glow' },
  { value: 'neon', label: 'Neon/Cyberpunk' },
  { value: 'dramatic_shadows', label: 'Dramatic Shadows (Noir)' },
  { value: 'backlit', label: 'Backlit/Silhouette' },
  { value: 'rim_light', label: 'Rim Lighting' },
  { value: 'studio_soft', label: 'Studio Soft Box' },
  { value: 'firelight', label: 'Firelight' },
  { value: 'stormy', label: 'Stormy/Dark Atmospheric' },
];

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
  isMobile = false,
}) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [collapsedBeats, setCollapsedBeats] = useState(new Set());
  const [loadingBeat, setLoadingBeat] = useState(null);
  const [copiedBeat, setCopiedBeat] = useState(null);

  const getBeatLabel = (index) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (index < 26) return `Beat ${letters[index]}`;
    return `Beat ${Math.floor(index / 26)}${letters[index % 26]}`;
  };

  const toggleBeatCollapse = (beatId) => {
    setCollapsedBeats(prev => {
      const next = new Set(prev);
      if (next.has(beatId)) {
        next.delete(beatId);
      } else {
        next.add(beatId);
      }
      return next;
    });
  };

  const collapseAllBeats = () => {
    setCollapsedBeats(new Set(beats.map(b => b.id)));
  };

  const expandAllBeats = () => {
    setCollapsedBeats(new Set());
  };

  const addBeat = () => {
    const newBeat = {
      id: `beat_${Date.now()}`,
      action: '',
      outfitOverride: '',
      shotType: '',
      cameraAngle: '',
      lighting: '',
      generatedPrompt: null,
      isGenerating: false,
      error: null,
    };
    setBeats(prevBeats => [...prevBeats, newBeat]);
  };

  const updateBeat = (id, field, value) => {
    setBeats(prevBeats => prevBeats.map((beat) => 
      beat.id === id ? { ...beat, [field]: value } : beat
    ));
  };

  const removeBeat = (id) => {
    setBeats(prevBeats => prevBeats.filter((beat) => beat.id !== id));
    if (expandedPrompt === id) setExpandedPrompt(null);
    setCollapsedBeats(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
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

      // Find the labels for the selected options
      const shotTypeLabel = SHOT_TYPES.find(s => s.value === beat.shotType)?.label || '';
      const cameraAngleLabel = CAMERA_ANGLES.find(a => a.value === beat.cameraAngle)?.label || '';
      const lightingLabel = LIGHTING_PRESETS.find(l => l.value === beat.lighting)?.label || '';

      const result = await generatePrompt({
        storyContext,
        characters: selectedChars,
        locations: selectedLocs,
        beatAction: beat.action,
        outfitOverride: beat.outfitOverride,
        shotType: beat.shotType ? shotTypeLabel : '',
        cameraAngle: beat.cameraAngle ? cameraAngleLabel : '',
        lighting: beat.lighting ? lightingLabel : '',
      });

      if (result.success) {
        updateBeat(beat.id, 'generatedPrompt', result.prompt);
        setExpandedPrompt(beat.id);
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
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-indigo-500/10">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          <h2 className="text-base md:text-lg font-semibold gradient-text">Beat Sheet</h2>
          <span className="ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 rounded-full bg-midnight-700 text-[10px] md:text-xs text-gray-400">
            {beats.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {beats.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <button
                onClick={collapseAllBeats}
                className="p-1.5 rounded-lg hover:bg-midnight-700/50 text-gray-500 hover:text-gray-400 transition-colors"
                title="Collapse all beats"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={expandAllBeats}
                className="p-1.5 rounded-lg hover:bg-midnight-700/50 text-gray-500 hover:text-gray-400 transition-colors"
                title="Expand all beats"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={addBeat}
            className="btn-primary flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span> Beat
          </button>
        </div>
      </div>

      {/* API Warning */}
      {!isApiConfigured && (
        <div className="mx-3 md:mx-4 mt-3 md:mt-4 p-2.5 md:p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 md:gap-3">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs md:text-sm text-amber-300 font-medium">API Key Required</p>
            <p className="text-[10px] md:text-xs text-amber-400/70 mt-1">
              Add <code className="px-1 py-0.5 rounded bg-midnight-800">VITE_GOOGLE_API_KEY</code> to <code className="px-1 py-0.5 rounded bg-midnight-800">.env</code>
            </p>
          </div>
        </div>
      )}

      {/* Beats List */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        {beats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center px-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center mb-4 md:mb-6 float-animation">
              <Clapperboard className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
            </div>
            <h3 className="text-base md:text-lg font-medium text-gray-300 mb-2">No beats yet</h3>
            <p className="text-xs md:text-sm text-gray-500 max-w-sm mb-4 md:mb-6">
              Create beats to break down your scene into individual moments.
            </p>
            <button
              onClick={addBeat}
              className="btn-primary flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-sm font-medium text-white"
            >
              <Plus className="w-4 h-4" />
              Create First Beat
            </button>
          </div>
        ) : (
          beats.map((beat, index) => {
            const isCollapsed = collapsedBeats.has(beat.id);
            return (
            <div
              key={beat.id}
              className="beat-row rounded-xl p-3 md:p-4 transition-all"
            >
              {/* Beat Header - Always visible */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    onClick={() => toggleBeatCollapse(beat.id)}
                    className="p-1 rounded-lg hover:bg-midnight-700/50 text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                  <GripVertical className="w-4 h-4 text-gray-600 cursor-grab hidden md:block" />
                  <span className="px-2.5 md:px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-xs md:text-sm font-semibold text-gray-200">
                    {getBeatLabel(index)}
                  </span>
                  {isCollapsed && beat.action && (
                    <span className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-[400px]">
                      {beat.action}
                    </span>
                  )}
                  {isCollapsed && beat.generatedPrompt && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] text-cyan-400">
                      ✓ Generated
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Quick Generate Button when collapsed */}
                  {isCollapsed && beat.action.trim() && (
                    <button
                      onClick={() => generateBeatPrompt(beat)}
                      disabled={loadingBeat === beat.id}
                      className={`p-2 rounded-xl transition-colors ${
                        loadingBeat === beat.id
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'hover:bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {loadingBeat === beat.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => removeBeat(beat.id)}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expandable Content */}
              {!isCollapsed && (
                <div className="mt-3 md:mt-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                    {/* Inputs */}
                    <div className="flex-1 space-y-3">
                      {/* Action Input */}
                      <div>
                        <label className="block text-[10px] md:text-xs text-gray-400 mb-1 md:mb-1.5">
                          Action / Scene Description
                        </label>
                        <textarea
                          value={beat.action}
                          onChange={(e) => updateBeat(beat.id, 'action', e.target.value)}
                          placeholder="Describe what happens in this beat..."
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm text-white placeholder-gray-500 resize-none"
                          rows={isMobile ? 3 : 2}
                        />
                      </div>

                      {/* Shot/Lighting Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                        {/* Shot Type */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400 mb-1 md:mb-1.5">
                            <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            Shot Type
                          </label>
                          <select
                            value={beat.shotType || ''}
                            onChange={(e) => updateBeat(beat.id, 'shotType', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl text-sm text-white bg-midnight-800 border border-indigo-500/20 focus:border-purple-500 focus:outline-none"
                          >
                            {SHOT_TYPES.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Camera Angle */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400 mb-1 md:mb-1.5">
                            <Aperture className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            Camera Angle
                          </label>
                          <select
                            value={beat.cameraAngle || ''}
                            onChange={(e) => updateBeat(beat.id, 'cameraAngle', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl text-sm text-white bg-midnight-800 border border-indigo-500/20 focus:border-purple-500 focus:outline-none"
                          >
                            {CAMERA_ANGLES.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Lighting */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400 mb-1 md:mb-1.5">
                            <Sun className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            Lighting
                          </label>
                          <select
                            value={beat.lighting || ''}
                            onChange={(e) => updateBeat(beat.id, 'lighting', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl text-sm text-white bg-midnight-800 border border-indigo-500/20 focus:border-purple-500 focus:outline-none"
                          >
                            {LIGHTING_PRESETS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Outfit Override */}
                      <div>
                        <label className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400 mb-1 md:mb-1.5">
                          <Shirt className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          Outfit Override (Optional)
                        </label>
                        <input
                          type="text"
                          value={beat.outfitOverride || ''}
                          onChange={(e) => updateBeat(beat.id, 'outfitOverride', e.target.value)}
                          placeholder="e.g., 'Wearing a tattered red cloak'"
                          className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-sm text-white placeholder-gray-500"
                        />
                      </div>

                      {/* Generate Button */}
                      <button
                        onClick={() => generateBeatPrompt(beat)}
                        disabled={loadingBeat === beat.id || !beat.action.trim()}
                        className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
                            Generate Prompt
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {beat.error && (
                    <div className="mt-3 md:mt-4 p-2.5 md:p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm text-red-300">{beat.error}</p>
                    </div>
                  )}

                  {/* Generated Prompt */}
                  {beat.generatedPrompt && (
                    <div className="mt-3 md:mt-4">
                      <button
                        onClick={() => setExpandedPrompt(expandedPrompt === beat.id ? null : beat.id)}
                        className="flex items-center gap-2 text-xs md:text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {expandedPrompt === beat.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {expandedPrompt === beat.id ? 'Hide' : 'Show'} Generated Prompt
                      </button>
                      {expandedPrompt === beat.id && renderGeneratedPrompt(beat)}
                    </div>
                  )}
                </div>
              )}

              {/* Collapsed view: Show error and prompt toggle */}
              {isCollapsed && (
                <>
                  {beat.error && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-300 truncate">{beat.error}</p>
                    </div>
                  )}
                  {beat.generatedPrompt && (
                    <div className="mt-2">
                      <button
                        onClick={() => setExpandedPrompt(expandedPrompt === beat.id ? null : beat.id)}
                        className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {expandedPrompt === beat.id ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                        {expandedPrompt === beat.id ? 'Hide' : 'View'} Prompt
                      </button>
                      {expandedPrompt === beat.id && renderGeneratedPrompt(beat)}
                    </div>
                  )}
                </>
              )}
            </div>
          );
          })
        )}
      </div>
    </div>
  );
};

export default BeatSheet;
