import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createProject, deleteProject, getProjects, updateProject } from './api'
import type { Project } from './api'
import './App.css'

// The backend stores project data; the card artwork is chosen here based on the category.
const cardStyles: Record<string, { symbol: string; color: string }> = {
  'Web development': { symbol: '</>', color: 'lavender' },
  Robotics: { symbol: '⚙', color: 'peach' },
  'Computer science': { symbol: '{ }', color: 'sage' },
}
const fallbackColors = ['lavender', 'peach', 'sage']
function styleFor(project: Project) {
  return cardStyles[project.category] ?? { symbol: '✦', color: fallbackColors[project.id % fallbackColors.length] }
}

type CardActions = { onToggleSave: (id: number) => void; onEdit: (project: Project) => void; onDelete: (project: Project) => void }

function ProjectCard({ project, saved, onToggleSave, onEdit, onDelete }: { project: Project; saved: boolean } & CardActions) {
  const { symbol, color } = styleFor(project)
  return <article className="project-card">
    <div className={`project-art ${color}`} aria-hidden="true"><span>{symbol}</span><small>{project.category}</small></div>
    <div className="card-body"><p className="eyebrow">{project.category}</p><h3>{project.title}</h3><p className="description">{project.description}</p>
      <ul className="tags" aria-label={`${project.title} topics`}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <div className="card-actions">{project.link ? <a href={project.link} target="_blank" rel="noreferrer">View code ↗</a> : <span>No public link</span>}
        <div><button type="button" aria-label={`Edit ${project.title}`} onClick={() => onEdit(project)}>Edit</button>
          <button type="button" aria-label={`Delete ${project.title}`} onClick={() => onDelete(project)}>Delete</button>
          <button type="button" className={saved ? 'saved' : ''} aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${project.title}`} onClick={() => onToggleSave(project.id)}>{saved ? '★ Saved' : '☆ Save'}</button></div>
      </div>
    </div>
  </article>
}
function ProjectGrid({ items, savedIds, ...actions }: { items: Project[]; savedIds: number[] } & CardActions) {
  return <div className="project-grid">{items.map(project => <ProjectCard key={project.id} project={project} saved={savedIds.includes(project.id)} {...actions} />)}</div>
}

// One form for both adding (POST) and editing (PUT) a project.
function ProjectForm({ project, onSaved, onCancel }: { project: Project | null; onSaved: (project: Project) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [category, setCategory] = useState(project?.category ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [tags, setTags] = useState(project?.tags.join(', ') ?? '')
  const [link, setLink] = useState(project?.link ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // When the form opens, scroll to it and put the cursor in the first field.
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    formRef.current?.querySelector('input')?.focus({ preventScroll: true })
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const data = { title: title.trim(), category: category.trim(), description: description.trim(), tags: [...new Set(tags.split(',').map(tag => tag.trim()).filter(Boolean))], link: link.trim() || null }
    try {
      onSaved(project ? await updateProject(project.id, data) : await createProject(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return <form ref={formRef} className="project-form" onSubmit={handleSubmit} aria-labelledby="project-form-title">
    <h3 id="project-form-title">{project ? `Edit “${project.title}”` : 'Add a project'}</h3>
    <div className="form-grid">
      <label>Title<input value={title} onChange={event => setTitle(event.target.value)} required maxLength={100} /></label>
      <label>Category<input value={category} onChange={event => setCategory(event.target.value)} required maxLength={50} placeholder="e.g. Web development" /></label>
      <label className="wide">Description<textarea value={description} onChange={event => setDescription(event.target.value)} required maxLength={500} rows={3} /></label>
      <label>Tags <small>(comma separated)</small><input value={tags} onChange={event => setTags(event.target.value)} placeholder="React, TypeScript" /></label>
      <label>Link <small>(optional)</small><input type="url" value={link} onChange={event => setLink(event.target.value)} placeholder="https://github.com/…" /></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" onClick={onCancel}>Cancel</button><button type="submit" className="submit" disabled={submitting}>{submitting ? 'Saving…' : project ? 'Save changes' : 'Add project'}</button></div>
  </form>
}

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [savedIds, setSavedIds] = useState<number[]>([])
  const [showSaved, setShowSaved] = useState(false)
  // null = form closed, 'new' = adding a project, a Project = editing that project
  const [formMode, setFormMode] = useState<null | 'new' | Project>(null)
  const [actionError, setActionError] = useState('')

  function loadProjects() {
    getProjects()
      .then(data => { setProjects(data); setLoadError('') })
      .catch(() => setLoadError('Could not load projects. Is the backend running at http://127.0.0.1:8000?'))
      .finally(() => setLoading(false))
  }
  useEffect(loadProjects, [])

  function toggleSave(id: number) {
    setSavedIds(current => current.includes(id) ? current.filter(savedId => savedId !== id) : [...current, id])
  }
  function handleSaved(saved: Project) {
    setProjects(current => current.some(project => project.id === saved.id) ? current.map(project => project.id === saved.id ? saved : project) : [...current, saved])
    setFormMode(null)
  }
  async function handleDelete(project: Project) {
    if (!window.confirm(`Delete “${project.title}”? This can't be undone.`)) return
    setActionError('')
    try {
      await deleteProject(project.id)
      setProjects(current => current.filter(item => item.id !== project.id))
      setSavedIds(current => current.filter(id => id !== project.id))
      setFormMode(current => current !== null && current !== 'new' && current.id === project.id ? null : current)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the project.')
    }
  }
  const visibleProjects = projects.filter(project => [project.title, project.category, project.description, ...project.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase()) && (!showSaved || savedIds.includes(project.id)))
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="#main" aria-label="Neil home">neil<span>.</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact ↗</a></nav></header>
    <main id="main">
      <section className="hero" aria-labelledby="intro-title"><p className="eyebrow"><span className="status-dot" /> COMPUTER SCIENCE @ UNIVERSITY OF MARYLAND</p><h1 id="intro-title">Hey, I'm Neil.<br /><span>I like building things.</span></h1><p className="hero-description">From competition robots to my first web apps, I enjoy figuring out how things work and making them better.</p><a className="primary-link" href="#projects">Explore my work ↓</a><div className="hero-footer"><span>Software · AI · Robotics</span><span>Always learning, always iterating.</span></div></section>
      <section id="about" className="about-section" aria-labelledby="about-title"><div><p className="eyebrow">A LITTLE ABOUT ME</p><h2 id="about-title">Curiosity comes first.</h2></div><div><p>I'm a Computer Science student at UMD with a background in competitive robotics. I’m interested in software engineering, AI, and technology that helps people.</p><p>I love the process of building with a team: trying an idea, learning what went wrong, and coming back with something better.</p></div></section>
      <section id="projects" className="projects-section" aria-labelledby="projects-title"><div className="section-heading"><div><p className="eyebrow">THINGS I'VE BEEN WORKING ON</p><h2 id="projects-title">Projects & experience<span>.</span></h2></div><span className="section-number">01 — {String(projects.length).padStart(2, '0')}</span></div>
        <div className="project-toolbar"><div className="filters" role="group" aria-label="Project filters"><button type="button" className={!showSaved ? 'active' : ''} aria-pressed={!showSaved} onClick={() => setShowSaved(false)}>All projects <span>{projects.length}</span></button><button type="button" className={showSaved ? 'active' : ''} aria-pressed={showSaved} onClick={() => setShowSaved(true)}>Saved <span>{savedIds.length}</span></button></div>
          <div className="toolbar-right"><div className="search-field"><label className="sr-only" htmlFor="project-search">Search projects</label><span aria-hidden="true">⌕</span><input id="project-search" type="search" placeholder="Search projects…" value={query} onChange={event => setQuery(event.target.value)} /></div><button type="button" className="add-button" onClick={() => setFormMode('new')} disabled={!!loadError}>+ Add project</button></div></div>
        {formMode && <ProjectForm key={formMode === 'new' ? 'new' : formMode.id} project={formMode === 'new' ? null : formMode} onSaved={handleSaved} onCancel={() => setFormMode(null)} />}
        {loading && <p className="load-message" role="status">Loading projects…</p>}
        {loadError && <div className="empty-state" role="alert"><h3>Projects are unavailable.</h3><p>{loadError}</p><button type="button" onClick={() => { setLoading(true); loadProjects() }}>Try again</button></div>}
        {!loading && !loadError && <>
          <p className="sr-only" role="status">{visibleProjects.length} projects shown. {savedIds.length} saved.</p>{actionError && <p className="form-error action-error" role="alert">{actionError}</p>}<ProjectGrid items={visibleProjects} savedIds={savedIds} onToggleSave={toggleSave} onEdit={setFormMode} onDelete={handleDelete} />
          {visibleProjects.length === 0 && <div className="empty-state"><h3>{showSaved && savedIds.length === 0 ? 'Your collection starts here.' : 'No matching projects.'}</h3><p>{showSaved && savedIds.length === 0 ? 'Use the Save button on a project to keep it in this view.' : 'Try another search or reset the filters.'}</p><button type="button" onClick={() => { setQuery(''); setShowSaved(false) }}>Show all projects</button></div>}
        </>}
      </section>
      <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="eyebrow">LET'S CONNECT</p><h2 id="contact-title">Have something in mind?</h2><p>I'm always up for talking about code, robots, or a new idea.</p><a className="primary-link" href="https://github.com/neilm1642" target="_blank" rel="noreferrer">Find me on GitHub ↗</a></section>
    </main>
    <footer className="site-footer"><a className="wordmark" href="#main">neil<span>.</span></a><span>Built with React. Made to keep growing.</span><a href="#main">Back to top ↑</a></footer>
  </>
}
export default App
