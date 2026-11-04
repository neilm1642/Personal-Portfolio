from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

# Allow the React dev server (Vite runs on port 5173) to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Pydantic models ----------

class ProjectIn(BaseModel):
    """Data the client sends when creating or updating a project."""
    title: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=500)
    tags: list[str] = Field(default_factory=list)
    link: str | None = None


class Project(ProjectIn):
    """A project as stored in our in-memory database (includes an id)."""
    id: int


# ---------- In-memory "database" ----------

projects: list[Project] = [
    Project(
        id=1,
        title="Personal Portfolio",
        category="Web development",
        description="A home for my projects and interests, built while learning React with the App Dev Club.",
        tags=["React", "TypeScript", "CSS"],
        link="https://github.com/neilm1642/WebDev-BootCamp",
    ),
    Project(
        id=2,
        title="FTC Robotics",
        category="Robotics",
        description="Collaborating on competition robots, solving design challenges, and learning through iteration. FTC World Championship winner, 2022–2023.",
        tags=["Engineering", "Teamwork", "Robotics"],
    ),
    Project(
        id=3,
        title="Java Coursework",
        category="Computer science",
        description="Building my programming foundations through object-oriented design, linked lists, recursion, and generics.",
        tags=["Java", "Data structures", "OOP"],
    ),
]


# ---------- Endpoints ----------

@app.get("/projects")
def get_projects() -> list[Project]:
    """Return every project in the portfolio."""
    return projects


@app.post("/projects", status_code=201)
def create_project(project_in: ProjectIn) -> Project:
    """Add a new project and return it with its new id."""
    new_id = max((p.id for p in projects), default=0) + 1
    new_project = Project(id=new_id, **project_in.model_dump())
    projects.append(new_project)
    return new_project


@app.put("/projects/{project_id}")
def update_project(project_id: int, project_in: ProjectIn) -> Project:
    """Replace an existing project's details. Returns 404 if it doesn't exist."""
    for index, project in enumerate(projects):
        if project.id == project_id:
            updated_project = Project(id=project_id, **project_in.model_dump())
            projects[index] = updated_project
            return updated_project
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
