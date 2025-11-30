import React, { useState, useEffect, useCallback } from 'react';
import {
  Moon,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

import AssetLibrary from './components/AssetLibrary';
import BeatSheet from './components/BeatSheet';
import {
  loadCharacters,
  loadLocations,
  loadStoryContext,
  loadBeats,
  addCharacter as addCharacterToStorage,
  addLocation as addLocationToStorage,
  removeCharacter as removeCharacterFromStorage,
  removeLocation as removeLocationFromStorage,
  updateCharacterName as updateCharacterNameInStorage,
  updateLocationName as updateLocationNameInStorage,
  saveStoryContext,
  saveBeats,
  clearAllData,
} from './services/storage';
import { isGeminiConfigured, initializeGemini } from './services/gemini';

function App() {
  // State
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [storyContext, setStoryContext] = useState('');
  const [beats, setBeats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  // Initialize on mount
  useEffect(() => {
    // Load data from localStorage
    setCharacters(loadCharacters());
    setLocations(loadLocations());
    setStoryContext(loadStoryContext());
    setBeats(loadBeats());
    
    // Check API configuration
    const configured = isGeminiConfigured();
    setApiConfigured(configured);
    if (configured) {
      initializeGemini();
    }
  }, []);

  // Auto-save story context
  useEffect(() => {
    const timer = setTimeout(() => {
      if (storyContext !== loadStoryContext()) {
        saveStoryContext(storyContext);
        showSaveStatus('Context saved');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [storyContext]);

  // Auto-save beats
  useEffect(() => {
    const timer = setTimeout(() => {
      saveBeats(beats);
    }, 1000);
    return () => clearTimeout(timer);
  }, [beats]);

  const showSaveStatus = (message) => {
    setSaveStatus(message);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  // Character handlers
  const handleAddCharacter = async (file, name) => {
    const newChar = await addCharacterToStorage(file, name);
    setCharacters((prev) => [...prev, newChar]);
  };

  const handleRemoveCharacter = (id) => {
    removeCharacterFromStorage(id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setSelectedCharacters((prev) => prev.filter((cId) => cId !== id));
  };

  const handleUpdateCharacterName = (id, name) => {
    updateCharacterNameInStorage(id, name);
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const handleToggleCharacter = (id) => {
    setSelectedCharacters((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  // Location handlers
  const handleAddLocation = async (file, name) => {
    const newLoc = await addLocationToStorage(file, name);
    setLocations((prev) => [...prev, newLoc]);
  };

  const handleRemoveLocation = (id) => {
    removeLocationFromStorage(id);
    setLocations((prev) => prev.filter((l) => l.id !== id));
    setSelectedLocations((prev) => prev.filter((lId) => lId !== id));
  };

  const handleUpdateLocationName = (id, name) => {
    updateLocationNameInStorage(id, name);
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name } : l))
    );
  };

  const handleToggleLocation = (id) => {
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((lId) => lId !== id) : [...prev, id]
    );
  };

  // Clear all data
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
      setCharacters([]);
      setLocations([]);
      setSelectedCharacters([]);
      setSelectedLocations([]);
      setStoryContext('');
      setBeats([]);
      showSaveStatus('All data cleared');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-indigo-500/10 bg-midnight-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center glow-purple">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">DreamWeaver</h1>
              <p className="text-xs text-gray-500">AI Scene Prompt Generator</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs text-green-400 flex items-center gap-1.5 animate-pulse">
              <Save className="w-3.5 h-3.5" />
              {saveStatus}
            </span>
          )}
          
          {!apiConfigured && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300">No API Key</span>
            </div>
          )}

          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Asset Library */}
        <aside
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-indigo-500/10 bg-midnight-900/30`}
        >
          <div className="w-80 h-full">
            <AssetLibrary
              characters={characters}
              locations={locations}
              selectedCharacters={selectedCharacters}
              selectedLocations={selectedLocations}
              onAddCharacter={handleAddCharacter}
              onAddLocation={handleAddLocation}
              onRemoveCharacter={handleRemoveCharacter}
              onRemoveLocation={handleRemoveLocation}
              onToggleCharacter={handleToggleCharacter}
              onToggleLocation={handleToggleLocation}
              onUpdateCharacterName={handleUpdateCharacterName}
              onUpdateLocationName={handleUpdateLocationName}
            />
          </div>
        </aside>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex-shrink-0 w-6 flex items-center justify-center hover:bg-midnight-700/50 transition-colors border-r border-indigo-500/10"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Main Panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Story Context Panel */}
          <div className={`${showContextPanel ? 'h-auto' : 'h-0'} overflow-hidden transition-all border-b border-indigo-500/10`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-medium text-gray-300">Story Context</h3>
                </div>
                <button
                  onClick={() => setShowContextPanel(!showContextPanel)}
                  className="text-xs text-gray-500 hover:text-gray-400"
                >
                  {showContextPanel ? 'Collapse' : 'Expand'}
                </button>
              </div>
              <textarea
                value={storyContext}
                onChange={(e) => setStoryContext(e.target.value)}
                placeholder="Paste your story summary here... This context will be used for all beat generations. Include key plot points, character relationships, world-building details, and overall tone/mood."
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 resize-none font-prose"
                rows={4}
              />
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                This context applies to all generated prompts
              </p>
            </div>
          </div>

          {/* Context toggle when collapsed */}
          {!showContextPanel && (
            <button
              onClick={() => setShowContextPanel(true)}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-400 hover:bg-midnight-700/30 transition-colors flex items-center justify-center gap-2 border-b border-indigo-500/10"
            >
              <FileText className="w-3.5 h-3.5" />
              Show Story Context
              {storyContext && (
                <span className="text-purple-400">
                  ({storyContext.length} chars)
                </span>
              )}
            </button>
          )}

          {/* Beat Sheet */}
          <div className="flex-1 overflow-hidden">
            <BeatSheet
              beats={beats}
              setBeats={setBeats}
              storyContext={storyContext}
              characters={characters}
              locations={locations}
              selectedCharacters={selectedCharacters}
              selectedLocations={selectedLocations}
              isApiConfigured={apiConfigured}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-indigo-500/10 bg-midnight-900/30">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              {characters.length} character{characters.length !== 1 ? 's' : ''} •{' '}
              {locations.length} location{locations.length !== 1 ? 's' : ''} •{' '}
              {beats.length} beat{beats.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Powered by Gemini 2.5 Flash-Lite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
