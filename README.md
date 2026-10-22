# Boss Level — Hierarchy Chart

A mobile-friendly organization chart built with React and React Flow.

## Features

- Displays a 4-level hierarchy: Company → Department → Team → Employee.
- Loads initial nodes and connections from JSON.
- Add, edit, and delete employees.
- Saves changes in browser `localStorage`.
- Supports mobile touch gestures, panning, and zooming.

## JSON Data

Initial hierarchy data is stored in `src/data/hierarchyData.json`.

- `nodes` — company, departments, teams, and employees.
- `edges` — connections between the nodes.

User changes are saved in `localStorage` and restored when the page reloads.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Tech Stack

- React
- Vite
- React Flow (`@xyflow/react`)
- CSS
- JSON and browser `localStorage`
