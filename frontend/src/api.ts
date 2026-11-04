// Functions for talking to the FastAPI backend in /backend.
const API_URL = 'http://127.0.0.1:8000'

export type Project = { id: number; title: string; category: string; description: string; tags: string[]; link: string | null }
export type ProjectInput = Omit<Project, 'id'>

// FastAPI sends errors as { detail: "message" } or, for validation errors, { detail: [{ loc, msg }] }.
async function readError(response: Response) {
  try {
    const { detail } = await response.json()
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) return `${detail[0].loc.at(-1)}: ${detail[0].msg}`
  } catch { /* the response had no JSON body */ }
  return `Request failed (${response.status})`
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json' } })
  } catch {
    throw new Error(`Could not reach the backend at ${API_URL}. Is it running?`)
  }
  if (!response.ok) throw new Error(await readError(response))
  return response.json()
}

// GET /projects
export function getProjects() {
  return request<Project[]>('/projects')
}

// POST /projects
export function createProject(project: ProjectInput) {
  return request<Project>('/projects', { method: 'POST', body: JSON.stringify(project) })
}

// PUT /projects/{id}
export function updateProject(id: number, project: ProjectInput) {
  return request<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(project) })
}
