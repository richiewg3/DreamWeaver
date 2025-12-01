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
  Library,
  Clapperboard,
  X,
  Menu,
  FolderOpen,
  FilePlus,
  Trash2,
  Edit3,
  Check,
  BookOpen,
  ChevronDown,
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
  getSavedStories,
  getCurrentStoryId,
  saveStory,
  loadStory,
  deleteStory,
  renameStory,
  startNewStory,
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
  // Mobile-specific state
  const [mobileView, setMobileView] = useState('beats'); // 'assets' | 'beats'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Story management state
  const [savedStories, setSavedStories] = useState([]);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [currentStoryName, setCurrentStoryName] = useState('');
  const [showStoryManager, setShowStoryManager] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveStoryName, setSaveStoryName] = useState('');
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [editingStoryName, setEditingStoryName] = useState('');

  // Initialize on mount
  useEffect(() => {
    // Load data from localStorage
    setCharacters(loadCharacters());
    setLocations(loadLocations());
    setStoryContext(loadStoryContext());
    setBeats(loadBeats());
    
    // Load saved stories
    setSavedStories(getSavedStories());
    const currentId = getCurrentStoryId();
    setCurrentStoryId(currentId);
    if (currentId) {
      const stories = getSavedStories();
      const current = stories.find(s => s.id === currentId);
      if (current) {
        setCurrentStoryName(current.name);
      }
    }
    
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
      setCurrentStoryId(null);
      setCurrentStoryName('');
      showSaveStatus('All data cleared');
    }
  };

  // Story management handlers
  const refreshData = () => {
    setCharacters(loadCharacters());
    setLocations(loadLocations());
    setStoryContext(loadStoryContext());
    setBeats(loadBeats());
    setSelectedCharacters([]);
    setSelectedLocations([]);
  };

  const handleSaveStory = () => {
    if (!saveStoryName.trim()) return;
    
    const saved = saveStory(saveStoryName.trim(), currentStoryId);
    setCurrentStoryId(saved.id);
    setCurrentStoryName(saved.name);
    setSavedStories(getSavedStories());
    setShowSaveDialog(false);
    setSaveStoryName('');
    showSaveStatus(`Saved "${saved.name}"`);
  };

  const handleSaveAsNew = () => {
    setSaveStoryName('');
    setShowSaveDialog(true);
  };

  const handleQuickSave = () => {
    if (currentStoryId && currentStoryName) {
      const saved = saveStory(currentStoryName, currentStoryId);
      setSavedStories(getSavedStories());
      showSaveStatus(`Saved "${saved.name}"`);
    } else {
      handleSaveAsNew();
    }
  };

  const handleLoadStory = (storyId) => {
    if (loadStory(storyId)) {
      refreshData();
      const stories = getSavedStories();
      const loaded = stories.find(s => s.id === storyId);
      if (loaded) {
        setCurrentStoryId(storyId);
        setCurrentStoryName(loaded.name);
        showSaveStatus(`Loaded "${loaded.name}"`);
      }
      setShowStoryManager(false);
    }
  };

  const handleDeleteStory = (storyId) => {
    const story = savedStories.find(s => s.id === storyId);
    if (window.confirm(`Delete "${story?.name}"? This cannot be undone.`)) {
      deleteStory(storyId);
      setSavedStories(getSavedStories());
      if (currentStoryId === storyId) {
        setCurrentStoryId(null);
        setCurrentStoryName('');
      }
      showSaveStatus('Story deleted');
    }
  };

  const handleRenameStory = (storyId) => {
    if (!editingStoryName.trim()) return;
    renameStory(storyId, editingStoryName.trim());
    setSavedStories(getSavedStories());
    if (currentStoryId === storyId) {
      setCurrentStoryName(editingStoryName.trim());
    }
    setEditingStoryId(null);
    setEditingStoryName('');
  };

  const handleNewStory = () => {
    if (beats.length > 0 || storyContext || characters.length > 0) {
      if (!window.confirm('Start a new story? Any unsaved changes will be lost.')) {
        return;
      }
    }
    startNewStory();
    refreshData();
    setCurrentStoryId(null);
    setCurrentStoryName('');
    setShowStoryManager(false);
    showSaveStatus('New story started');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-indigo-500/10 bg-midnight-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center glow-purple">
            <Moon className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold gradient-text">DreamWeaver</h1>
            <p className="text-[10px] md:text-xs text-gray-500 hidden sm:block">AI Scene Prompt Generator</p>
          </div>
        </div>

        {/* Current Story Name (Desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-md">
          <button
            onClick={() => setShowStoryManager(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-midnight-700/50 hover:bg-midnight-700 transition-colors group"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300 truncate max-w-[200px]">
              {currentStoryName || 'Untitled Story'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {saveStatus && (
            <span className="text-xs text-green-400 flex items-center gap-1 animate-pulse">
              <Save className="w-3 h-3" />
              <span className="hidden sm:inline">{saveStatus}</span>
            </span>
          )}
          
          {!apiConfigured && (
            <div className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
              <span className="text-[10px] md:text-xs text-amber-300 hidden sm:inline">No API Key</span>
            </div>
          )}

          {/* Story Actions */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={handleQuickSave}
              className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-xl text-sm text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"
              title="Save Story"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowStoryManager(true)}
              className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-xl text-sm text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
              title="Story Manager"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Story Manager Modal */}
      {showStoryManager && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-midnight-800 rounded-2xl border border-indigo-500/20 w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-indigo-500/10">
              <h2 className="text-lg font-semibold gradient-text flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Story Manager
              </h2>
              <button
                onClick={() => setShowStoryManager(false)}
                className="p-2 rounded-xl hover:bg-midnight-700 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="p-4 border-b border-indigo-500/10 flex gap-2">
              <button
                onClick={handleNewStory}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 text-gray-200 text-sm font-medium transition-colors"
              >
                <FilePlus className="w-4 h-4" />
                New Story
              </button>
              <button
                onClick={handleSaveAsNew}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Current
              </button>
            </div>

            {/* Saved Stories List */}
            <div className="flex-1 overflow-y-auto p-4">
              {savedStories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderOpen className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">No saved stories yet</p>
                  <p className="text-gray-500 text-xs">Save your current work to access it later</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedStories.map((story) => (
                    <div
                      key={story.id}
                      className={`p-3 rounded-xl border transition-colors ${
                        story.id === currentStoryId
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-midnight-700/50 border-indigo-500/10 hover:border-indigo-500/30'
                      }`}
                    >
                      {editingStoryId === story.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingStoryName}
                            onChange={(e) => setEditingStoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameStory(story.id);
                              if (e.key === 'Escape') {
                                setEditingStoryId(null);
                                setEditingStoryName('');
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg text-sm bg-midnight-800 border border-purple-500/30 text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRenameStory(story.id)}
                            className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStoryId(null);
                              setEditingStoryName('');
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-gray-200 truncate">{story.name}</h3>
                              {story.id === currentStoryId && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/30 text-purple-300">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Updated {formatDate(story.updatedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => handleLoadStory(story.id)}
                              disabled={story.id === currentStoryId}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                story.id === currentStoryId
                                  ? 'bg-midnight-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300'
                              }`}
                            >
                              Load
                            </button>
                            <button
                              onClick={() => {
                                setEditingStoryId(story.id);
                                setEditingStoryName(story.name);
                              }}
                              className="p-1.5 rounded-lg hover:bg-midnight-600 text-gray-400 hover:text-gray-300"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStory(story.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-midnight-800 rounded-2xl border border-indigo-500/20 w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-semibold gradient-text mb-4 flex items-center gap-2">
              <Save className="w-5 h-5 text-green-400" />
              Save Story
            </h2>
            <input
              type="text"
              value={saveStoryName}
              onChange={(e) => setSaveStoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveStory();
                if (e.key === 'Escape') setShowSaveDialog(false);
              }}
              placeholder="Enter story name..."
              className="w-full px-4 py-3 rounded-xl text-sm bg-midnight-700 border border-indigo-500/20 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-midnight-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStory}
                disabled={!saveStoryName.trim()}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  saveStoryName.trim()
                    ? 'btn-primary text-white'
                    : 'bg-midnight-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Desktop Layout */}
      <div className="flex-1 hidden md:flex overflow-hidden">
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

        {/* Main Panel - Desktop */}
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

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden pb-16">
        {/* Mobile Story Context (collapsible) */}
        <div className={`${showContextPanel ? 'max-h-64' : 'max-h-0'} overflow-hidden transition-all duration-300 border-b border-indigo-500/10`}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-medium text-gray-300">Story Context</h3>
              </div>
              <button
                onClick={() => setShowContextPanel(false)}
                className="p-1 text-gray-500 hover:text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={storyContext}
              onChange={(e) => setStoryContext(e.target.value)}
              placeholder="Paste your story summary here..."
              className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-gray-500 resize-none font-prose"
              rows={3}
            />
          </div>
        </div>

        {/* Mobile context toggle */}
        {!showContextPanel && (
          <button
            onClick={() => setShowContextPanel(true)}
            className="w-full py-2 text-xs text-gray-500 hover:text-gray-400 hover:bg-midnight-700/30 transition-colors flex items-center justify-center gap-2 border-b border-indigo-500/10"
          >
            <FileText className="w-3.5 h-3.5" />
            Story Context
            {storyContext && <span className="text-purple-400">•</span>}
          </button>
        )}

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-hidden">
          {mobileView === 'assets' ? (
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
              isMobile={true}
            />
          ) : (
            <BeatSheet
              beats={beats}
              setBeats={setBeats}
              storyContext={storyContext}
              characters={characters}
              locations={locations}
              selectedCharacters={selectedCharacters}
              selectedLocations={selectedLocations}
              isApiConfigured={apiConfigured}
              isMobile={true}
            />
          )}
        </div>

        {/* Mobile Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 flex border-t border-indigo-500/10 bg-midnight-900/95 backdrop-blur-lg z-50">
          <button
            onClick={() => setMobileView('assets')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors relative ${
              mobileView === 'assets'
                ? 'text-purple-400 bg-purple-500/10'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            <Library className="w-5 h-5" />
            <span className="text-[10px] font-medium">Assets</span>
            {(selectedCharacters.length > 0 || selectedLocations.length > 0) && (
              <span className="absolute top-2 right-1/4 w-2 h-2 rounded-full bg-purple-500" />
            )}
          </button>
          <button
            onClick={() => setMobileView('beats')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors relative ${
              mobileView === 'beats'
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            <Clapperboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Beats</span>
            {beats.length > 0 && (
              <span className="absolute top-2 right-1/4 w-2 h-2 rounded-full bg-cyan-500" />
            )}
          </button>
          <button
            onClick={() => setShowStoryManager(true)}
            className="flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors text-gray-500 hover:text-gray-400 relative"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-medium">Stories</span>
            {savedStories.length > 0 && (
              <span className="absolute top-2 right-1/4 w-2 h-2 rounded-full bg-green-500" />
            )}
          </button>
        </nav>
      </div>

      {/* Footer - Desktop only */}
      <footer className="hidden md:block px-6 py-3 border-t border-indigo-500/10 bg-midnight-900/30">
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
