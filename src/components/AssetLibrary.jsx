import React, { useState, useRef } from 'react';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Upload,
  Check,
  X,
  Edit3,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

/**
 * AssetLibrary Component
 * Sidebar for managing character and location image assets
 */
const AssetLibrary = ({
  characters,
  locations,
  selectedCharacters,
  selectedLocations,
  onAddCharacter,
  onAddLocation,
  onRemoveCharacter,
  onRemoveLocation,
  onToggleCharacter,
  onToggleLocation,
  onUpdateCharacterName,
  onUpdateLocationName,
}) => {
  const [activeTab, setActiveTab] = useState('characters');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  
  const characterInputRef = useRef(null);
  const locationInputRef = useRef(null);

  const handleFileUpload = async (files, type) => {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        if (type === 'character') {
          await onAddCharacter(file, name);
        } else {
          await onAddLocation(file, name);
        }
      }
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files, type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveEdit = (type) => {
    if (type === 'character') {
      onUpdateCharacterName(editingId, editName);
    } else {
      onUpdateLocationName(editingId, editName);
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const renderAssetCard = (asset, type) => {
    const isSelected = type === 'character' 
      ? selectedCharacters.includes(asset.id)
      : selectedLocations.includes(asset.id);
    const isEditing = editingId === asset.id;
    const onToggle = type === 'character' ? onToggleCharacter : onToggleLocation;
    const onRemove = type === 'character' ? onRemoveCharacter : onRemoveLocation;

    return (
      <div
        key={asset.id}
        className={`asset-card rounded-xl overflow-hidden cursor-pointer group ${
          isSelected ? 'selected' : ''
        }`}
        onClick={() => !isEditing && onToggle(asset.id)}
      >
        <div className="relative aspect-square">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startEditing(asset.id, asset.name);
              }}
              className="p-1.5 rounded-lg bg-midnight-800/80 hover:bg-midnight-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(asset.id);
              }}
              className="p-1.5 rounded-lg bg-midnight-800/80 hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>
        <div className="p-2.5">
          {isEditing ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(type);
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="flex-1 text-xs px-2 py-1 rounded bg-midnight-800 border-purple-500/50 text-white"
                autoFocus
              />
              <button
                onClick={() => saveEdit(type)}
                className="p-1 rounded hover:bg-green-900/30"
              >
                <Check className="w-3.5 h-3.5 text-green-400" />
              </button>
              <button onClick={cancelEdit} className="p-1 rounded hover:bg-red-900/30">
                <X className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-300 truncate font-medium">{asset.name}</p>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = (type) => (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-midnight-700/50 flex items-center justify-center mb-4">
        <ImageIcon className="w-8 h-8 text-gray-500" />
      </div>
      <p className="text-gray-400 text-sm mb-2">
        No {type === 'character' ? 'characters' : 'locations'} yet
      </p>
      <p className="text-gray-500 text-xs">
        Upload images to build your asset library
      </p>
    </div>
  );

  const currentAssets = activeTab === 'characters' ? characters : locations;
  const currentInputRef = activeTab === 'characters' ? characterInputRef : locationInputRef;
  const assetType = activeTab === 'characters' ? 'character' : 'location';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-indigo-500/10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold gradient-text">Asset Library</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'characters'
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-gray-300 hover:bg-midnight-700/50'
            }`}
          >
            <User className="w-4 h-4" />
            Characters
            {selectedCharacters.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-purple-500/30 text-purple-300">
                {selectedCharacters.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'locations'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-300 hover:bg-midnight-700/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Locations
            {selectedLocations.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-cyan-500/30 text-cyan-300">
                {selectedLocations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-4">
        <div
          onDrop={(e) => handleDrop(e, assetType)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => currentInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-purple-400 bg-purple-500/10'
              : 'border-midnight-500 hover:border-purple-500/50 hover:bg-midnight-700/30'
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? 'text-purple-400' : 'text-gray-500'}`} />
          <p className="text-sm text-gray-400">
            Drop images here or <span className="text-purple-400">browse</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP supported</p>
        </div>
        
        <input
          ref={characterInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(Array.from(e.target.files), 'character')}
        />
        <input
          ref={locationInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(Array.from(e.target.files), 'location')}
        />
      </div>

      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {currentAssets.length === 0 ? (
          renderEmptyState(assetType)
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {currentAssets.map((asset) => renderAssetCard(asset, assetType))}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {(selectedCharacters.length > 0 || selectedLocations.length > 0) && (
        <div className="p-4 border-t border-indigo-500/10 bg-midnight-800/50">
          <p className="text-xs text-gray-400 mb-2">Selected for generation:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCharacters.map((id) => {
              const char = characters.find((c) => c.id === id);
              return char ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs"
                >
                  <User className="w-3 h-3" />
                  {char.name}
                </span>
              ) : null;
            })}
            {selectedLocations.map((id) => {
              const loc = locations.find((l) => l.id === id);
              return loc ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs"
                >
                  <MapPin className="w-3 h-3" />
                  {loc.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetLibrary;
