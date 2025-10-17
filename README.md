# 2048 Game - React & TypeScript

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

This is a classic 2048 game built with React, TypeScript, and Vite. It's a simple, yet addictive puzzle game where you slide numbered tiles on a grid to combine them and create a tile with the number 2048.

## 📋 Contents

- [2048 Game - React \& TypeScript](#2048-game---react--typescript)
  - [📋 Contents](#-contents)
  - [🚀 Installation](#-installation)
  - [🎮 Running the Game](#-running-the-game)
  - [📖 Gameplay Instructions](#-gameplay-instructions)
    - [Configurable Board Size](#configurable-board-size)
  - [🛠️ Implementation Details](#️-implementation-details)
    - [Key Features](#key-features)
    - [Tech Stack](#tech-stack)
    - [Project Structure](#project-structure)

## 🚀 Installation

To get started, you'll need to have Node.js and npm installed.

1.  Clone the repository:
    ```bash
    git clone git@github.com:RoystonDAlmeida/2048-game-implementation.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd 2048-game-implementation
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## 🎮 Running the Game

To run the game in a development server, use the following command:

```bash
npm run dev
```

This will start the Vite development server and you can open the game in your browser at the URL provided (usually `http://localhost:5173`).

## 📖 Gameplay Instructions

The goal of the game is to create a tile with the number 2048.

-   **Desktop**: Use the **arrow keys** or **WASD** keys to move the tiles up, down, left, or right.
-   **Mobile**: Use the on-screen directional buttons to move the tiles.

When two tiles with the same number touch, they merge into one tile with the sum of their values. After every move, a new tile (either a 2 or a 4) will appear in a random empty spot on the board.

The game is over when the board is full and there are no more possible moves.

### Configurable Board Size

You can change the size of the board by using the "Board Size" input. Type in the desired size and press "Set" or hit Enter. The game will restart with the new board size.

## 🛠️ Implementation Details

This project is built with modern web technologies and follows best practices for React development.

### Key Features

-   **Responsive Design**: The game is playable on both desktop and mobile devices.
-   **Dynamic Board Size**: The size of the game board is configurable through the UI.
-   **Component-Based Architecture**: The UI is built with reusable React components.
-   **State Management**: The game state is managed using React's `useState` hook.

### Tech Stack

-   **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Project Structure

-   `src/main.tsx`: The entry point of the application.
-   `src/App.tsx`: The main application component that holds the game state and logic for handling user input.
-   `src/components/Board.tsx`: The component responsible for rendering the game board and the tiles.
-   `src/game/logic.ts`: This file contains the core game logic as a set of pure functions. It handles tasks like creating a new board, adding random tiles, moving tiles, and checking for game-over conditions. This separation of logic from the UI makes the code more modular and easier to test.
