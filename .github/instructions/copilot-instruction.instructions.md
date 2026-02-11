# Tehillim App - Project Instructions & Guidelines

## 1. Project Overview
This is a "Tehillim Together" (Psalms Reading) React application. It allows users to collectively read the Book of Psalms by raffling chapters or selecting them manually.
* **Language:** Hebrew (RTL interface).
* **Data Source:** Local JSON file (`src/appData.json`), NOT an external API.
* **Persistence:** Uses `localStorage` to save reading progress.

## 2. Tech Stack
* **Framework:** React (Vite).
* **Styling:** Tailwind CSS.
* **Icons:** Lucide React.
* **Effects:** canvas-confetti.

## 3. Visual Design System (Strict Adherence)
The application has a specific "Soft & Warm" design language.
* **Backgrounds:**
    * Main App BG: `#F9F8F4` (Warm Cream).
    * Action Island BG: `#FFF5E1` (Light Beige).
    * Error/Alert BG: `#FEF2F2`.
* **Accent Colors:**
    * **Primary Orange:** `#F6851B` (Buttons, Highlights).
    * **Success Green:** `#10B981` (Finish buttons).
    * **Blue:** `#3B82F6` (Reading list badges).
* **Typography:**
    * Font: 'Rubik', sans-serif.
    * Direction: `dir="rtl"` must be applied to the root container.
* **Shapes:**
    * Heavy use of `rounded-2xl` and `rounded-3xl` for a soft, friendly UI.
    * Cards have soft shadows (`shadow-sm`, `shadow-md`).

## 4. Component Structure & Logic

### A. Stats Cards (Top)
* **Layout:** Grid system.
    * Mobile: `grid-cols-2` (Compact).
    * Desktop: `grid-cols-4`.
* **Design:** Icon is on the **left**, text on the **right** (due to RTL). Icons have a colored square background.

### B. Action Island (Middle)
* **Features:**
    * "Raffle" button (Orange).
    * "Select" button (White) - opens a dropdown list *below* the buttons.
* **Yellow Box Mode:** When a chapter is raffled, the island transforms into a large display showing the chapter number (rotated slightly) and an "I take it" button.

### C. Split View (Bottom)
* **Layout:**
    * **Right Column:** Reading List (Narrower). Shows active chapters with "View" (Eye) and "Finish" (Check) buttons inside the row.
    * **Left Column:** Reading Pane (Wider). Displays the text of the selected chapter.
* **Interaction:** Clicking "View" on the right updates the state to show content on the left.
* **Data Handling:**
    * Text is pulled from `appData.json`.
    * **Safety Check:** Always check if `appData[id]` exists. If text is a string, convert to array. If missing, show the "Red Error Box".

## 5. Helper Functions
* **`toHebrewNumeral(num)`**: A utility function must be present to convert standard numbers (1, 2, 3) to Hebrew Gemtria (א, ב, ג).
    * *Note:* Handle special cases for 15 (ט״ו) and 16 (ט״ז).

## 6. Coding Conventions
* Use functional components with Hooks (`useState`, `useEffect`).
* Ensure all text is in Hebrew.
* Never use `fetch` for the psalm text; strictly import from the local JSON.
* Maintain responsive design (mobile-first approach).