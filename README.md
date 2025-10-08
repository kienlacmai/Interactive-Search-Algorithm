# Interactive Search Algorithm Visualization

## Overview
The **Interactive Search Algorithm** project is a web-based educational platform designed to teach and visualize core graph traversal algorithms, including **Depth-First Search (DFS)**, **Breadth-First Search (BFS)**, and **A\***.  
Users can explore algorithmic concepts through interactive demonstrations, quizzes, coding exercises, and a maze-based pathfinding lab, each providing a dynamic and guided learning experience.

The application is entirely client-side, requiring no installation or dependencies, and can be accessed directly at:  
**[https://kienlacmai.github.io/Interactive-Search-Algorithm/](https://kienlacmai.github.io/Interactive-Search-Algorithm/)**

---

## Objectives
This project was developed to create an engaging and intuitive learning environment for computer science students to:
- Understand the operational logic of classical search algorithms.
- Visualize step-by-step traversal and node exploration processes.
- Compare algorithmic strategies across different problem contexts.
- Reinforce understanding through guided practice and interactive exercises.

By integrating algorithmic explanation with interactivity, the platform helps bridge the gap between conceptual understanding and hands-on experimentation.

---

## Algorithms Implemented
The platform features three major search algorithms, each with unique instructional modules:

- **Depth-First Search (DFS)**  
  Explores nodes through a stack-based approach, illustrating recursive exploration and backtracking behavior.

- **Breadth-First Search (BFS)**  
  Traverses level by level using a queue-based implementation, emphasizing shortest path discovery in unweighted graphs.

- **A\***  
  Introduces pathfinding with weighted edges and heuristic functions. The visualization dynamically displays `g(n)`, `h(n)`, and `f(n) = g + h` values, enabling users to observe how heuristic estimation influences node selection.

---

## Functionality and Design
Each algorithm contains multiple interactive modules, guiding users through increasing levels of engagement and mastery:

### 1. Example Activity
A pre-built graph visualization demonstrates the algorithm in motion.  
Each step highlights the current node, frontier, and visited nodes, synchronized with pseudocode execution.

### 2. Interactive Mode
Users actively participate by predicting the algorithm’s next move.  
The interface provides real-time feedback, allowing learners to correct misconceptions about traversal order and data structure behavior.

### 3. Quiz Mode
Short conceptual quizzes test comprehension of the algorithm’s structure and properties.  
Immediate feedback reinforces learning outcomes.

### 4. Coding Activity
Users complete fill-in-the-blank code segments that represent canonical algorithm patterns (e.g., stack operations for DFS, queue logic for BFS, open-set updates for A\*).  
The system automatically validates answers against accepted logic templates.

### 5. Maze Lab
A dynamic grid-based maze environment enables users to:
- Compare DFS, BFS, and A\* performance on identical maps.
- Observe differences in traversal strategy, path cost, and optimality.
- Switch between automatic and manual stepping modes.

---

## Technical Implementation
The project is implemented using **HTML**, **CSS**, and **JavaScript**, with visualization powered by **Cytoscape.js**.  
Key design components include:

- **Graph Rendering:**  
  Cytoscape.js provides interactive graph visualization, node highlighting, and animation control.

- **Algorithm Modules:**  
  Each algorithm is structured within dedicated directories (DFS, BFS, AStar), containing:
  - `interactive.js` – mode control and user interaction handling.  
  - `visualization.js` – traversal animation and pseudocode synchronization.  
  - `quiz.js` and `codingActivity.js` – assessment and code validation logic.  

- **User Interface:**  
  Each activity page shares a consistent layout with navigation buttons, pseudocode panels, and a theme toggle supporting light/dark modes.

- **Extensibility:**  
  The modular JavaScript architecture allows future integration of additional algorithms or visualization modes with minimal refactoring.

---

## Usage and Deployment

### Accessing the Application
The application is hosted publicly on **GitHub Pages** and can be accessed at:  
**[https://kienlacmai.github.io/Interactive-Search-Algorithm/](https://kienlacmai.github.io/Interactive-Search-Algorithm/)**

### Local Execution
To run locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/kienlacmai/Interactive-Search-Algorithm.git
   cd Interactive-Search-Algorithm

