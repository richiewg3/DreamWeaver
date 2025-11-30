/**
 * DreamWeaver Storage Service
 * Handles localStorage operations for Assets, Story Context, and Beats
 */

const STORAGE_KEYS = {
  CHARACTERS: 'dreamweaver_characters',
  LOCATIONS: 'dreamweaver_locations',
  STORY_CONTEXT: 'dreamweaver_story_context',
  BEATS: 'dreamweaver_beats',
};

/**
 * Convert File to Base64 data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Extract base64 data without the data URL prefix
 */
export const extractBase64Data = (dataUrl) => {
  const [, base64] = dataUrl.split(',');
  return base64;
};

/**
 * Get MIME type from data URL
 */
export const getMimeType = (dataUrl) => {
  const match = dataUrl.match(/data:([^;]+);/);
  return match ? match[1] : 'image/jpeg';
};

// ============ CHARACTERS ============

/**
 * Save characters to localStorage
 */
export const saveCharacters = (characters) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
    return true;
  } catch (error) {
    console.error('Error saving characters:', error);
    return false;
  }
};

/**
 * Load characters from localStorage
 */
export const loadCharacters = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
};

/**
 * Add a new character
 */
export const addCharacter = async (file, name) => {
  const characters = loadCharacters();
  const base64 = await fileToBase64(file);
  const newCharacter = {
    id: `char_${Date.now()}`,
    name: name || `Character ${characters.length + 1}`,
    image: base64,
    createdAt: new Date().toISOString(),
  };
  characters.push(newCharacter);
  saveCharacters(characters);
  return newCharacter;
};

/**
 * Remove a character by ID
 */
export const removeCharacter = (id) => {
  const characters = loadCharacters().filter((c) => c.id !== id);
  saveCharacters(characters);
  return characters;
};

/**
 * Update character name
 */
export const updateCharacterName = (id, name) => {
  const characters = loadCharacters().map((c) =>
    c.id === id ? { ...c, name } : c
  );
  saveCharacters(characters);
  return characters;
};

// ============ LOCATIONS ============

/**
 * Save locations to localStorage
 */
export const saveLocations = (locations) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
    return true;
  } catch (error) {
    console.error('Error saving locations:', error);
    return false;
  }
};

/**
 * Load locations from localStorage
 */
export const loadLocations = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading locations:', error);
    return [];
  }
};

/**
 * Add a new location
 */
export const addLocation = async (file, name) => {
  const locations = loadLocations();
  const base64 = await fileToBase64(file);
  const newLocation = {
    id: `loc_${Date.now()}`,
    name: name || `Location ${locations.length + 1}`,
    image: base64,
    createdAt: new Date().toISOString(),
  };
  locations.push(newLocation);
  saveLocations(locations);
  return newLocation;
};

/**
 * Remove a location by ID
 */
export const removeLocation = (id) => {
  const locations = loadLocations().filter((l) => l.id !== id);
  saveLocations(locations);
  return locations;
};

/**
 * Update location name
 */
export const updateLocationName = (id, name) => {
  const locations = loadLocations().map((l) =>
    l.id === id ? { ...l, name } : l
  );
  saveLocations(locations);
  return locations;
};

// ============ STORY CONTEXT ============

/**
 * Save story context to localStorage
 */
export const saveStoryContext = (context) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STORY_CONTEXT, context);
    return true;
  } catch (error) {
    console.error('Error saving story context:', error);
    return false;
  }
};

/**
 * Load story context from localStorage
 */
export const loadStoryContext = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.STORY_CONTEXT) || '';
  } catch (error) {
    console.error('Error loading story context:', error);
    return '';
  }
};

// ============ BEATS ============

/**
 * Save beats to localStorage
 */
export const saveBeats = (beats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BEATS, JSON.stringify(beats));
    return true;
  } catch (error) {
    console.error('Error saving beats:', error);
    return false;
  }
};

/**
 * Load beats from localStorage
 */
export const loadBeats = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BEATS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading beats:', error);
    return [];
  }
};

/**
 * Clear all DreamWeaver data from localStorage
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export default {
  // Characters
  saveCharacters,
  loadCharacters,
  addCharacter,
  removeCharacter,
  updateCharacterName,
  // Locations
  saveLocations,
  loadLocations,
  addLocation,
  removeLocation,
  updateLocationName,
  // Story Context
  saveStoryContext,
  loadStoryContext,
  // Beats
  saveBeats,
  loadBeats,
  // Utils
  fileToBase64,
  extractBase64Data,
  getMimeType,
  clearAllData,
};
