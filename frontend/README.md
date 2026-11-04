# Neil's Portfolio

Week 3 App Dev Bootcamp portfolio, built with React, TypeScript, and Vite.

## Run locally

The projects come from the FastAPI backend in `../backend`, so start it first (in its own terminal):

```sh
cd backend
uv run fastapi dev
```

Then start the frontend in a second terminal:

```sh
cd frontend
bun install
bun run dev
```

Open the local URL printed by Vite (http://localhost:5173). npm also works (`npm install`, then `npm run dev`).

## Features

- Introduction, About, Projects & Experience, and Contact sections
- Responsive layout for desktop and mobile
- Search by project name, topic, or description
- Save/unsave buttons and a Saved filter (saves reset on reload)
- Projects loaded from the backend (`GET /projects`), with forms to add (`POST /projects`) and edit (`PUT /projects/{id}`) projects, and a Delete button (`DELETE /projects/{id}`)
- Empty states, keyboard focus styles, and accessible input/button labels

## React concepts

`App` manages search, saved IDs, and the selected filter with `useState`. It passes projects and a save callback to `ProjectGrid`, which renders reusable `ProjectCard` components through props. The cards call the callback to update state in the parent.

`src/api.ts` holds the `fetch` calls to the backend. `App` loads the projects with `useEffect` when the page opens, `ProjectForm` sends new or edited projects to the backend, and each card's Delete button asks for confirmation before deleting. The backend keeps projects in memory, so added or edited projects reset when the backend restarts; edit the `projects` list in `backend/main.py` to change the starting data. Only the portfolio currently has a public code link; the other cards describe robotics experience and Java coursework.

## Checks

```sh
bun run build
bun run lint
```
