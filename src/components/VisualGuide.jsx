import React, { useState } from 'react';
import {
  Camera,
  Sun,
  Aperture,
  X,
  Info,
} from 'lucide-react';

/**
 * Visual diagrams for shot types using CSS
 */
const ShotTypeDiagram = ({ type }) => {
  const diagrams = {
    extreme_wide: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-700 to-slate-800 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900/50 to-transparent" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-amber-400 rounded-full" />
        <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full" />
        <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white/40 rounded-full" />
      </div>
    ),
    wide: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-600 to-slate-700 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-800/60 to-transparent" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-amber-400 rounded-t-sm" />
      </div>
    ),
    full: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-2 h-2 bg-amber-300 rounded-full" />
          <div className="w-3 h-4 bg-amber-400 rounded-t-sm -mt-0.5" />
          <div className="w-1 h-3 bg-amber-500" />
        </div>
      </div>
    ),
    medium_wide: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-2.5 h-2.5 bg-amber-300 rounded-full" />
          <div className="w-4 h-5 bg-amber-400 rounded-t-sm -mt-0.5" />
        </div>
      </div>
    ),
    medium: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-3 h-3 bg-amber-300 rounded-full" />
          <div className="w-5 h-6 bg-amber-400 rounded-t-sm -mt-0.5" />
        </div>
      </div>
    ),
    medium_close: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-4 h-4 bg-amber-300 rounded-full" />
          <div className="w-6 h-5 bg-amber-400 rounded-t-sm -mt-1" />
        </div>
      </div>
    ),
    close: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden flex items-center justify-center">
        <div className="w-8 h-8 bg-amber-300 rounded-full">
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-slate-700 rounded-full -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-slate-700 rounded-full -translate-y-1/2" />
        </div>
      </div>
    ),
    extreme_close: (
      <div className="relative w-full h-full bg-amber-300 overflow-hidden flex items-center justify-center">
        <div className="w-4 h-4 bg-slate-700 rounded-full border-4 border-slate-500">
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full ml-0.5 mt-0.5" />
        </div>
      </div>
    ),
    over_shoulder: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute left-0 bottom-0 w-4 h-8 bg-slate-800 rounded-tr-lg" />
        <div className="absolute right-1 bottom-1 flex flex-col items-center">
          <div className="w-3 h-3 bg-amber-300 rounded-full" />
          <div className="w-4 h-4 bg-amber-400 rounded-t-sm -mt-0.5" />
        </div>
      </div>
    ),
    pov: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2">
          <div className="w-2 h-5 bg-slate-800 rounded-t-sm transform -rotate-6" />
          <div className="w-2 h-5 bg-slate-800 rounded-t-sm transform rotate-6" />
        </div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[6px] text-white/60">👁</div>
      </div>
    ),
    two_shot: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute bottom-0 left-2 flex flex-col items-center">
          <div className="w-2 h-2 bg-amber-300 rounded-full" />
          <div className="w-3 h-5 bg-amber-400 rounded-t-sm -mt-0.5" />
        </div>
        <div className="absolute bottom-0 right-2 flex flex-col items-center">
          <div className="w-2 h-2 bg-cyan-300 rounded-full" />
          <div className="w-3 h-5 bg-cyan-400 rounded-t-sm -mt-0.5" />
        </div>
      </div>
    ),
  };
  
  return diagrams[type] || (
    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
      <Camera className="w-4 h-4 text-gray-500" />
    </div>
  );
};

/**
 * Visual diagrams for camera angles
 */
const CameraAngleDiagram = ({ type }) => {
  const diagrams = {
    eye_level: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 overflow-hidden">
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 border-2 border-cyan-400 rounded-sm" />
        <div className="absolute left-3 top-1/2 w-4 h-px bg-cyan-400/60" style={{ transform: 'translateY(-50%)' }} />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full" />
      </div>
    ),
    low_angle: (
      <div className="relative w-full h-full bg-gradient-to-t from-slate-700 to-slate-500 overflow-hidden">
        <div className="absolute left-1 bottom-1 w-2 h-2 border-2 border-cyan-400 rounded-sm" />
        <div className="absolute left-3 bottom-2 w-5 h-px bg-cyan-400/60" style={{ transform: 'rotate(-35deg)', transformOrigin: 'left' }} />
        <div className="absolute right-2 top-2 w-4 h-4 bg-amber-400 rounded-full" />
      </div>
    ),
    high_angle: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-700 to-slate-500 overflow-hidden">
        <div className="absolute left-1 top-1 w-2 h-2 border-2 border-cyan-400 rounded-sm" />
        <div className="absolute left-3 top-2 w-5 h-px bg-cyan-400/60" style={{ transform: 'rotate(35deg)', transformOrigin: 'left' }} />
        <div className="absolute right-2 bottom-2 w-3 h-3 bg-amber-400 rounded-full" />
      </div>
    ),
    birds_eye: (
      <div className="relative w-full h-full bg-slate-600 overflow-hidden">
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 border-2 border-cyan-400 rounded-sm" />
        <div className="absolute top-3 left-1/2 w-px h-3 bg-cyan-400/60" style={{ transform: 'translateX(-50%)' }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 rounded-full" />
      </div>
    ),
    worms_eye: (
      <div className="relative w-full h-full bg-slate-600 overflow-hidden">
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-2 border-cyan-400 rounded-sm" />
        <div className="absolute bottom-3 left-1/2 w-px h-3 bg-cyan-400/60" style={{ transform: 'translateX(-50%)' }} />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 rounded-full" />
      </div>
    ),
    dutch_angle: (
      <div className="relative w-full h-full bg-slate-600 overflow-hidden" style={{ transform: 'rotate(15deg)' }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-3 h-3 bg-amber-400 rounded-full" />
          <div className="w-4 h-4 bg-amber-500 -mt-1" />
        </div>
      </div>
    ),
    profile: (
      <div className="relative w-full h-full bg-gradient-to-r from-slate-700 to-slate-500 overflow-hidden flex items-center justify-center">
        <div className="w-4 h-5 bg-amber-400 rounded-l-full" />
      </div>
    ),
    three_quarter: (
      <div className="relative w-full h-full bg-gradient-to-br from-slate-700 to-slate-500 overflow-hidden flex items-center justify-center">
        <div className="w-5 h-5 bg-amber-400 rounded-full">
          <div className="absolute top-2 left-2.5 w-1 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    ),
  };
  
  return diagrams[type] || (
    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
      <Aperture className="w-4 h-4 text-gray-500" />
    </div>
  );
};

/**
 * Visual diagrams for lighting
 */
const LightingDiagram = ({ type }) => {
  const diagrams = {
    natural_daylight: (
      <div className="relative w-full h-full bg-gradient-to-b from-sky-400 to-sky-300 overflow-hidden">
        <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-200 rounded-full shadow-lg shadow-yellow-200/50" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full" />
      </div>
    ),
    golden_hour: (
      <div className="relative w-full h-full bg-gradient-to-b from-orange-400 to-amber-300 overflow-hidden">
        <div className="absolute bottom-2 left-1 w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-400/80" />
        <div className="absolute bottom-1 right-2 w-3 h-4 bg-amber-800/80 rounded-t-sm" />
      </div>
    ),
    blue_hour: (
      <div className="relative w-full h-full bg-gradient-to-b from-indigo-600 to-indigo-400 overflow-hidden">
        <div className="absolute top-1 right-2 w-2 h-2 bg-indigo-300 rounded-full" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-indigo-900/60 rounded-t-sm" />
      </div>
    ),
    overcast: (
      <div className="relative w-full h-full bg-gradient-to-b from-gray-400 to-gray-300 overflow-hidden">
        <div className="absolute top-1 left-1 w-5 h-2 bg-gray-500/50 rounded-full" />
        <div className="absolute top-0 right-0 w-4 h-2 bg-gray-500/40 rounded-full" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-500 rounded-full" />
      </div>
    ),
    harsh_midday: (
      <div className="relative w-full h-full bg-gradient-to-b from-yellow-100 to-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-900/30 rounded-full blur-[1px]" />
      </div>
    ),
    moonlight: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
        <div className="absolute top-1 right-1 w-3 h-3 bg-slate-300 rounded-full shadow-lg shadow-slate-400/30" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-700 rounded-full border border-slate-500/30" />
      </div>
    ),
    candlelight: (
      <div className="relative w-full h-full bg-gradient-to-t from-amber-900 to-slate-900 overflow-hidden">
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-amber-300 rounded-t-full animate-pulse" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-amber-800" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-amber-500/20 rounded-full blur-sm" />
      </div>
    ),
    neon: (
      <div className="relative w-full h-full bg-slate-900 overflow-hidden">
        <div className="absolute top-1 left-1 w-2 h-4 bg-pink-500 rounded-sm shadow-lg shadow-pink-500/50" />
        <div className="absolute top-2 right-1 w-2 h-3 bg-cyan-400 rounded-sm shadow-lg shadow-cyan-400/50" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-700 rounded-full" />
      </div>
    ),
    dramatic_shadows: (
      <div className="relative w-full h-full bg-slate-900 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-slate-800" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-slate-800 to-slate-600" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-4 overflow-hidden">
          <div className="w-full h-full bg-amber-600 rounded-t-full" />
          <div className="absolute left-0 top-0 w-1/2 h-full bg-slate-900/50" />
        </div>
      </div>
    ),
    backlit: (
      <div className="relative w-full h-full bg-gradient-to-t from-slate-900 to-amber-400 overflow-hidden">
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-5 bg-slate-900 rounded-t-full" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-6 border border-amber-400/50 rounded-t-full" />
      </div>
    ),
    rim_light: (
      <div className="relative w-full h-full bg-slate-800 overflow-hidden">
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-5 bg-slate-700 rounded-t-full">
          <div className="absolute inset-0 border-r-2 border-cyan-400 rounded-t-full" />
        </div>
      </div>
    ),
    studio_soft: (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-4 h-6 bg-white/30 rounded-br-full" />
        <div className="absolute top-0 right-0 w-3 h-5 bg-white/20 rounded-bl-full" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-500 rounded-full" />
      </div>
    ),
    firelight: (
      <div className="relative w-full h-full bg-gradient-to-t from-orange-900 to-slate-900 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
          <div className="w-1 h-3 bg-orange-500 rounded-t-full animate-pulse" />
          <div className="w-1 h-4 bg-yellow-400 rounded-t-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="w-1 h-2 bg-red-500 rounded-t-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="absolute bottom-4 right-2 w-2 h-2 bg-orange-700 rounded-full" />
      </div>
    ),
    stormy: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-700 to-slate-800 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-600" />
        <div className="absolute top-1 left-2 w-1 h-2 bg-slate-400" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-600 rounded-full" />
      </div>
    ),
  };
  
  return diagrams[type] || (
    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
      <Sun className="w-4 h-4 text-gray-500" />
    </div>
  );
};

// Shot type data with descriptions
const SHOT_TYPE_DATA = [
  { value: 'extreme_wide', label: 'Extreme Wide Shot', desc: 'Shows vast landscapes, establishes massive scale. Subject is tiny in frame.' },
  { value: 'wide', label: 'Wide Shot', desc: 'Shows full environment with subject visible. Great for establishing location.' },
  { value: 'full', label: 'Full Shot', desc: 'Shows complete subject from head to toe with some environment.' },
  { value: 'medium_wide', label: 'Medium Wide Shot', desc: 'Shows subject from knees up. Balances character and environment.' },
  { value: 'medium', label: 'Medium Shot', desc: 'Shows subject from waist up. Standard conversational framing.' },
  { value: 'medium_close', label: 'Medium Close-Up', desc: 'Shows subject from chest up. Captures emotion with context.' },
  { value: 'close', label: 'Close-Up', desc: 'Shows face or key details. Maximum emotional impact.' },
  { value: 'extreme_close', label: 'Extreme Close-Up', desc: 'Shows specific detail (eye, hand). Intense, dramatic emphasis.' },
  { value: 'over_shoulder', label: 'Over-the-Shoulder', desc: 'Camera behind one subject looking at another. Great for dialogue.' },
  { value: 'pov', label: 'POV Shot', desc: 'Viewer sees through character\'s eyes. Creates immersion.' },
  { value: 'two_shot', label: 'Two Shot', desc: 'Frames two subjects together. Shows relationships.' },
];

// Camera angle data with descriptions
const CAMERA_ANGLE_DATA = [
  { value: 'eye_level', label: 'Eye Level', desc: 'Neutral, natural perspective. Viewer feels equal to subject.' },
  { value: 'low_angle', label: 'Low Angle', desc: 'Camera looks up at subject. Creates power, heroism, dominance.' },
  { value: 'high_angle', label: 'High Angle', desc: 'Camera looks down at subject. Creates vulnerability, weakness.' },
  { value: 'birds_eye', label: "Bird's Eye View", desc: 'Directly overhead. God-like perspective, shows patterns.' },
  { value: 'worms_eye', label: "Worm's Eye View", desc: 'Extreme low angle from ground. Dramatic, imposing.' },
  { value: 'dutch_angle', label: 'Dutch Angle', desc: 'Tilted camera. Creates unease, tension, disorientation.' },
  { value: 'profile', label: 'Profile View', desc: 'Side view of subject. Classic, sculptural composition.' },
  { value: 'three_quarter', label: 'Three-Quarter', desc: 'Angled view showing depth. Most flattering portrait angle.' },
];

// Lighting data with descriptions
const LIGHTING_DATA = [
  { value: 'natural_daylight', label: 'Natural Daylight', desc: 'Bright, clean outdoor light. Fresh, optimistic mood.' },
  { value: 'golden_hour', label: 'Golden Hour', desc: 'Warm sunset/sunrise glow. Romantic, nostalgic, magical.' },
  { value: 'blue_hour', label: 'Blue Hour', desc: 'Cool twilight tones. Mysterious, contemplative, serene.' },
  { value: 'overcast', label: 'Overcast', desc: 'Soft, diffused light. Even, flattering, melancholy.' },
  { value: 'harsh_midday', label: 'Harsh Midday', desc: 'Strong overhead sun. High contrast, stark shadows.' },
  { value: 'moonlight', label: 'Moonlight', desc: 'Cool, silvery night light. Ethereal, dreamlike, quiet.' },
  { value: 'candlelight', label: 'Candlelight', desc: 'Warm, flickering glow. Intimate, cozy, ancient.' },
  { value: 'neon', label: 'Neon/Cyberpunk', desc: 'Vibrant colored lights. Urban, futuristic, edgy.' },
  { value: 'dramatic_shadows', label: 'Dramatic Noir', desc: 'High contrast shadows. Mystery, danger, tension.' },
  { value: 'backlit', label: 'Backlit/Silhouette', desc: 'Light behind subject. Mysterious, dramatic, iconic.' },
  { value: 'rim_light', label: 'Rim Lighting', desc: 'Light outlining subject. Separates from background, ethereal.' },
  { value: 'studio_soft', label: 'Studio Soft', desc: 'Professional soft lighting. Clean, controlled, flattering.' },
  { value: 'firelight', label: 'Firelight', desc: 'Warm, dancing flames. Primal, cozy, survival.' },
  { value: 'stormy', label: 'Stormy', desc: 'Dark, dramatic atmosphere. Tension, foreboding, power.' },
];

/**
 * VisualGuide Component
 * Shows visual examples for shot types, camera angles, and lighting
 */
const VisualGuide = ({ isOpen, onClose, initialTab = 'shots' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update activeTab when initialTab changes (e.g., when user clicks different help buttons)
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'shots', label: 'Shot Types', icon: Camera },
    { id: 'angles', label: 'Camera Angles', icon: Aperture },
    { id: 'lighting', label: 'Lighting', icon: Sun },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-midnight-800 rounded-2xl border border-indigo-500/20 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/10">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold gradient-text">Visual Reference Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-midnight-700 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-indigo-500/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-midnight-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'shots' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {SHOT_TYPE_DATA.map((shot) => (
                <div
                  key={shot.value}
                  className="group bg-midnight-700/50 rounded-xl border border-indigo-500/10 hover:border-purple-500/30 transition-all overflow-hidden"
                >
                  <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                    <ShotTypeDiagram type={shot.value} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-200 mb-1">{shot.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{shot.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'angles' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CAMERA_ANGLE_DATA.map((angle) => (
                <div
                  key={angle.value}
                  className="group bg-midnight-700/50 rounded-xl border border-indigo-500/10 hover:border-purple-500/30 transition-all overflow-hidden"
                >
                  <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                    <CameraAngleDiagram type={angle.value} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-200 mb-1">{angle.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{angle.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'lighting' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {LIGHTING_DATA.map((light) => (
                <div
                  key={light.value}
                  className="group bg-midnight-700/50 rounded-xl border border-indigo-500/10 hover:border-purple-500/30 transition-all overflow-hidden"
                >
                  <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                    <LightingDiagram type={light.value} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-200 mb-1">{light.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{light.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="p-3 border-t border-indigo-500/10 bg-midnight-900/50">
          <p className="text-xs text-gray-500 text-center">
            💡 Select "Auto (AI decides)" to let the AI choose the best option based on your scene
          </p>
        </div>
      </div>
    </div>
  );
};

// Export individual preview components for inline use
export const ShotTypePreview = ({ type }) => (
  <div className="w-8 h-6 rounded overflow-hidden border border-indigo-500/20">
    <ShotTypeDiagram type={type} />
  </div>
);

export const CameraAnglePreview = ({ type }) => (
  <div className="w-8 h-6 rounded overflow-hidden border border-indigo-500/20">
    <CameraAngleDiagram type={type} />
  </div>
);

export const LightingPreview = ({ type }) => (
  <div className="w-8 h-6 rounded overflow-hidden border border-indigo-500/20">
    <LightingDiagram type={type} />
  </div>
);

export default VisualGuide;
