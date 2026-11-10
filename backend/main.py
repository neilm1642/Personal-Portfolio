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
        title="SkillCard",
        category="Web development",
        description="A robotics-fix marketplace built with Next.js and React that makes published solutions accessible to developers, with metered access to reusable robot code.",
        tags=["TypeScript", "Next.js", "React", "Tailwind CSS"],
        link="https://github.com/arnavsharmaa/SkillCard",
    ),
    Project(
        id=2,
        title="Robotic Spray Path Planner",
        category="Robotics",
        description="At Zaic Design: a Python/RoboDK planner that generates reusable spray toolpaths straight from CAD geometry, with PLC I/O and ultrasonic feedback for targeted coating rework.",
        tags=["Python", "RoboDK", "PLC I/O", "CAD"],
    ),
    Project(
        id=3,
        title="Exoplanet Transit Detection",
        category="Machine learning",
        description="Used Python-based machine learning on NASA TESS stellar light curves to identify candidate exoplanet transits; co-authored published research on TOI 5868.01.",
        tags=["Python", "Machine Learning", "Astronomy"],
    ),
    Project(
        id=4,
        title="FTC Robotics - Team Don't Blink",
        category="Robotics",
        description="Captained a 16-member team to the 2023 FTC World Championship, writing Java autonomous and tele-op routines.",
        tags=["Java", "Control", "Sensors", "Leadership"],
    ),
    Project(
        id=5,
        title="Personal Portfolio",
        category="Web development",
        description="This site, built with React and TypeScript in the UMD App Dev Club bootcamp, with a FastAPI backend.",
        tags=["React", "TypeScript", "FastAPI"],
        link="https://github.com/neilm1642/WebDev-BootCamp",
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


@app.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: int) -> None:
    """Remove a project. Returns 404 if it doesn't exist."""
    for index, project in enumerate(projects):
        if project.id == project_id:
            projects.pop(index)
            return
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
