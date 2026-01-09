# Smart Todo Management

A React application featuring two interactive components - Tree View and Kanban Board.

## Features

### Tree View Component
- Expand and collapse nodes
- Add child nodes to any parent
- Delete nodes with confirmation
- Drag and drop to reorder or move nodes
- Lazy loading of child nodes
- Inline editing with double-click or edit button

### Kanban Board
- Three columns: Todo, In Progress, Done
- Add cards via modal popup
- Delete cards
- Drag and drop cards between columns
- Inline editing of card titles
- Fully responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS3

## Installation

```bash
npm install
```

## Running the Application

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## Usage

The home page lets you choose between the Tree View and Kanban Board components. Each component includes a back button to return to the home page.

## Project Structure

```
src/
├── components/
│   ├── HomePage/
│   ├── TreeView/
│   └── KanbanBoard/
├── App.tsx
└── main.tsx
```

## Building for Production

```bash
npm run build
```
