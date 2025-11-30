/**
 * DreamWeaver Gemini Service
 * Handles AI prompt generation using Google Gemini 2.5 Flash-Lite
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractBase64Data, getMimeType } from './storage';

// Initialize the Gemini API client
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

let genAI = null;
let model = null;

/**
 * Initialize the Gemini client
 */
export const initializeGemini = () => {
  if (!API_KEY) {
    console.error('VITE_GOOGLE_API_KEY is not set. Please add it to your .env file.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    
    // CRITICAL: Use exact model string as specified
    model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: `You are a Prompt Engineer specializing in creating detailed, cinematic AI art prompts. 

Your task is to analyze provided images for visual details WITHOUT using character names - describe them by their visual appearance, clothing, features, and distinguishing characteristics instead.

Combine the visual analysis with the Story Context and Beat Action to create a comprehensive scene prompt.

Output your response in this EXACT structured format:

## Cinematic Paragraph
[Write a flowing, evocative paragraph that captures the scene's mood, atmosphere, lighting, and emotional tone. Describe the setting, character positions, and overall composition as if describing a film still. Use rich sensory details and cinematic language.]

## Staging Details
- **Camera Angle:** [Describe the perspective - low angle, high angle, Dutch angle, eye-level, bird's eye, etc.]
- **Shot Type:** [Wide shot, medium shot, close-up, extreme close-up, over-the-shoulder, etc.]
- **Lighting:** [Describe light sources, quality, direction, color temperature, shadows]
- **Character Positions:** [Where each figure is placed in the frame, their poses, gestures]
- **Background Elements:** [Key environmental details visible in the scene]
- **Foreground Elements:** [Objects or elements in the immediate foreground]

## Micro-Details
- **Textures:** [Specific material textures visible - fabric, skin, metal, wood, etc.]
- **Color Palette:** [Dominant colors, accent colors, color harmony]
- **Atmospheric Effects:** [Dust particles, fog, lens flare, bokeh, rain, etc.]
- **Time of Day:** [Specific lighting condition suggesting time]
- **Mood Indicators:** [Small details that reinforce the emotional tone]
- **Style Reference:** [Suggested art style, artist references, or visual influences]

Remember: Be specific and visual. Paint a picture with words that an AI image generator can interpret into a stunning visual.`,
    });

    return true;
  } catch (error) {
    console.error('Error initializing Gemini:', error);
    return false;
  }
};

/**
 * Prepare image data for Gemini API
 */
const prepareImagePart = (imageDataUrl) => {
  return {
    inlineData: {
      data: extractBase64Data(imageDataUrl),
      mimeType: getMimeType(imageDataUrl),
    },
  };
};

/**
 * Generate a detailed prompt using Gemini
 * @param {Object} params - Generation parameters
 * @param {string} params.storyContext - The story summary/context
 * @param {Array} params.characters - Selected character images (with name and image properties)
 * @param {Array} params.locations - Selected location images (with name and image properties)
 * @param {string} params.beatAction - The specific action for this beat
 * @param {string} params.outfitOverride - Optional outfit override for characters
 * @returns {Promise<Object>} - The generated prompt response
 */
export const generatePrompt = async ({
  storyContext,
  characters = [],
  locations = [],
  beatAction,
  outfitOverride = '',
}) => {
  if (!model) {
    const initialized = initializeGemini();
    if (!initialized) {
      throw new Error('Failed to initialize Gemini. Please check your API key.');
    }
  }

  // Build the content array with text and images
  const contentParts = [];

  // Add text prompt
  let textPrompt = `## Story Context\n${storyContext || 'No story context provided.'}\n\n`;
  textPrompt += `## Beat Action\n${beatAction || 'No specific action provided.'}\n\n`;
  
  if (outfitOverride) {
    textPrompt += `## Outfit Override\nThe character(s) should be wearing: ${outfitOverride}\n\n`;
  }

  textPrompt += `## Reference Images\n`;
  
  if (characters.length > 0) {
    textPrompt += `Characters provided: ${characters.length} character reference(s)\n`;
    characters.forEach((char, idx) => {
      textPrompt += `- Reference ${idx + 1}: "${char.name}"\n`;
    });
  }
  
  if (locations.length > 0) {
    textPrompt += `Locations provided: ${locations.length} location reference(s)\n`;
    locations.forEach((loc, idx) => {
      textPrompt += `- Location ${idx + 1}: "${loc.name}"\n`;
    });
  }

  textPrompt += `\nPlease analyze all provided images and generate a comprehensive scene prompt following the structured format.`;

  contentParts.push({ text: textPrompt });

  // Add character images
  for (const character of characters) {
    if (character.image) {
      contentParts.push(prepareImagePart(character.image));
    }
  }

  // Add location images
  for (const location of locations) {
    if (location.image) {
      contentParts.push(prepareImagePart(location.image));
    }
  }

  try {
    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      prompt: text,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating prompt:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate prompt',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Check if Gemini is properly configured
 */
export const isGeminiConfigured = () => {
  return !!API_KEY;
};

export default {
  initializeGemini,
  generatePrompt,
  isGeminiConfigured,
};
