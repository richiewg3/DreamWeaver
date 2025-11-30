# 🌙 DreamWeaver

**AI Scene Prompt Generator** - Transform your story beats into detailed, cinematic AI art prompts.

![DreamWeaver](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash--Lite-purple)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

- **Asset Library**: Upload and manage character and location reference images
- **Story Context**: Paste your story summary to provide narrative context
- **Beat Sheet**: Create scene beats with specific actions and outfit overrides
- **AI Generation**: Generate detailed, structured prompts using Google Gemini
- **Dark Mode UI**: Beautiful, modern dark interface built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A Google AI API key (get one at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/richiewg3/DreamWeaver.git
cd DreamWeaver

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your API key

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_API_KEY=your_google_ai_api_key_here
```

## 📖 The "Dragon & Duck" Workflow

1. **Context**: Paste your story summary in the Story Context area
2. **Assets**: Upload character and location reference images to the Asset Library
3. **Beats**: Create scene beats (Beat A, Beat B, etc.) with specific actions
4. **Generate**: Click "Generate" to create detailed AI art prompts

## 🎨 Generated Prompt Structure

Each generated prompt includes:

- **Cinematic Paragraph**: Flowing description of mood, atmosphere, and composition
- **Staging Details**: Camera angles, shot types, lighting, and positioning
- **Micro-Details**: Textures, colors, atmospheric effects, and style references

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini 2.5 Flash-Lite
- **Icons**: Lucide React
- **Storage**: localStorage for persistent data

## 📁 Project Structure

```
src/
├── components/
│   ├── AssetLibrary.jsx   # Sidebar for character/location assets
│   └── BeatSheet.jsx      # Main beat management UI
├── services/
│   ├── storage.js         # localStorage helpers
│   └── gemini.js          # Gemini AI integration
├── App.jsx                # Main application
├── main.jsx               # Entry point
└── index.css              # Tailwind styles
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 License

ISC License

---

Built with 💜 for creative storytellers and AI artists
