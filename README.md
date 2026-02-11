# Tehillim Dashboard - תהילים ביחד

Pixel-perfect clone of the Hebrew Tehillim reading management dashboard.

## Features

- ✨ Full RTL (Right-to-Left) support for Hebrew
- 📊 Statistics dashboard with 4 metric cards
- 🎲 Random chapter lottery system
- 📱 Fully responsive design
- 🎨 Modern, clean UI with Tailwind CSS
- 🔤 Rubik font for Hebrew text

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 18
- Tailwind CSS 3
- Vite
- Lucide React (icons)
- Rubik font (Google Fonts)

## Project Structure

```
├── App.jsx              # Main dashboard component
├── src/
│   └── main.jsx         # React entry point
├── index.html           # HTML template with RTL support
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Design Details

The UI matches the original screenshot exactly:

- **Header**: Centered title with icon badge
- **Stats Cards**: 4 cards showing completion metrics
- **Action Box**: Primary lottery section with 2 CTAs
- **Empty State**: Dashed border placeholder box

All spacing, colors, shadows, and typography are matched pixel-perfectly.
