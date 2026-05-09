<div align="center">
<img width="1200" height="475" alt="Tower Odyssey Image" src="image.png"/>
</div>

## Tower Odyssey

## Project Overview

Tower Odyssey is a modern web implementation of the classic Tower of Hanoi puzzle, showcasing advanced React development skills with TypeScript. This project demonstrates proficiency in:

- **Algorithm Implementation**: Recursive Tower of Hanoi solution with optimal move calculation
- **Interactive UI/UX**: Drag-and-drop functionality with smooth animations
- **State Management**: Complex game state handling with React hooks
- **Performance Optimization**: Efficient rendering of dynamic disk movements
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Technical Highlights

- **Recursive Algorithm**: Implemented the mathematical Tower of Hanoi solution with O(2^n) complexity visualization
- **Advanced Animations**: Smooth disk transitions using Framer Motion with collision detection
- **TypeScript Integration**: Full type safety with custom interfaces and type definitions
- **Performance Monitoring**: Real-time move counting and timer functionality
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Live Demo

[Play Tower Odyssey](https://tower-of-hanoi-colourful.vercel.app/)

## Development Journey

This project was built to demonstrate modern web development skills while solving a classic algorithmic problem. Key challenges included:

- **Algorithm Optimization**: Implementing an efficient recursive solution that scales from 3 to 8 disks
- **Animation Complexity**: Coordinating multiple disk movements with collision detection and smooth transitions
- **State Management**: Managing complex game states including undo/redo functionality and move validation
- **Performance**: Ensuring smooth 60fps animations even with maximum disk configurations

## Features
- **Visual Feedback**: Smooth animations and color-coded disks
- **Difficulty Levels**: Choose from 3 to 8 disks
- **Move Counter**: Track your progress with real-time move counting
- **Timer**: Challenge yourself with time-based scoring
- **Responsive Design**: Play on desktop and mobile devices
- **Minimalist UI**: Clean, modern interface with Tailwind CSS
- **Auto-Solve**: Watch the optimal solution play out automatically

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Backend**: Express.js (for potential future features)

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tower-odyssey
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## How to Play

1. **Objective**: Move all disks from the first tower to the third tower
2. **Rules**:
   - Only one disk can be moved at a time
   - A larger disk cannot be placed on top of a smaller disk
   - All disks must be moved to complete the puzzle
3. **Controls**:
   - Click and drag disks between towers
   - Use the control buttons to pause, reset, or auto-solve
   - Adjust difficulty with the disk selector

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run clean` - Remove the dist directory
- `npm run lint` - Run TypeScript type checking

## Game Features

### Difficulty Settings
- **3 Disks**: Beginner level (7 moves minimum)
- **4 Disks**: Easy (15 moves minimum)
- **5 Disks**: Medium (31 moves minimum)
- **6 Disks**: Hard (63 moves minimum)
- **7 Disks**: Expert (127 moves minimum)
- **8 Disks**: Master (255 moves minimum)

### Controls
- **Play/Pause**: Control game timer
- **Reset**: Start over with current difficulty
- **Auto-Solve**: Watch the optimal solution
- **Settings**: Adjust game parameters

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by the classic Tower of Hanoi puzzle
- Built with modern web technologies
- Icons provided by Lucide React

