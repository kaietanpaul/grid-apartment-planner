# Project Plan: Grid Apartment Planner

## Purpose

This project aims to create an ADHD‑friendly web application that lets users visualise their apartment or rooms on a precise grid where **1 pixel equals 1 mm**.  It helps with interior design, tiling calculations and furniture placement by combining intuitive drag‑and‑drop tools with accurate measurement.

## Core Features

- **Grid canvas** – A scalable grid representing millimetres. Users can zoom/pan but measurements always stay consistent.
- **Room & wall definition** – Tools for drawing walls and setting room dimensions so that surfaces correspond to real‑world sizes.
- **Object library** – Predefined shapes for common items (e.g. shower tray 900×1800 mm, toilet, sink, basin). Users can place these objects on the grid, resize them and give them names and colours.
- **Custom shapes** – Tools for drawing rectangles, circles and free‑form polygons for custom objects or areas. Each object can store metadata (name, colour, type, dimensions).
- **Tile calculator** – Given a surface size and tile dimensions, the app calculates how many tiles are needed, including optional allowances for wastage.
- **Import/Export** – Save and load room layouts as JSON files so users can back up or share designs. Optionally export images (PNG/SVG) for printing.
- **Layers & visibility** – Users can toggle layers (e.g. plumbing, furniture, tiles) on and off to reduce visual clutter.
- **Undo/Redo** – History management so users can explore without fear of mistakes.
- **Accessibility & ADHD friendly design** – Clean interface, large clickable controls, consistent iconography, minimal text, and optional dark mode.  Quick onboarding and hints to reduce cognitive load.

## Technical Approach

- **Front‑end** – Use a modern web framework (e.g. React or Vue) to manage UI state. Render the grid and objects via HTML5 Canvas or SVG; Canvas offers speed for complex drawings while SVG simplifies hit‑detection and scaling.
- **Coordinate system** – Maintain a mapping between pixel coordinates and real‑world millimetres. Implement zoom/pan controls that do not distort measurements.
- **State management** – Represent rooms and objects as JSON structures (id, type, position, dimensions, colour, name, etc.).  Use a state manager (Redux/Pinia) or React context to keep components in sync.
- **Tile calculation** – Implement helper functions that compute the number of tiles given surface width/height and tile dimensions, factoring in grout lines and waste margin.
- **Persistence** – Implement import/export with JSON. For persistence across sessions, store current state in `localStorage` or a backend API.
- **Testing** – Plan unit tests for geometry calculations and tile algorithms. Provide interactive prototypes to gather feedback.

## Next Steps

1. Research existing open‑source floor‑planner libraries for potential reuse of grid and drawing components.
2. Draft wireframes of the main screens (room editor, object library, tile calculator).
3. Set up the repository structure (e.g. `/src`, `/public`) and choose the tech stack.
4. Build a minimal prototype: display a grid, allow drawing rectangles representing rooms, and implement zoom/pan.
5. Iterate on user experience with frequent feedback, prioritising simplicity and responsiveness.
