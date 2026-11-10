// Content from Neil's latest resume (Oct 2026). Edit this file to update the site.
import type { Project } from './api'

export const contact = {
  email: 'neilm1642@gmail.com',
  github: 'https://github.com/neilm1642',
}

export const experience = [
  {
    role: 'Software & Robotics Engineering Intern',
    org: 'Zaic Design',
    dates: 'Jun 2026 – Aug 2026',
    points: [
      'Automated robotic spray programming by developing a Python/RoboDK path planner that generates reusable toolpaths directly from CAD geometry.',
      'Enabled targeted coating rework across 14 measurement points by integrating PLC digital I/O, ultrasonic feedback, and surface-normal tool orientation.',
    ],
  },
  {
    role: 'Aviation Concepts & Design Intern',
    org: 'NASA Ames Research Center',
    dates: 'Jun 2024 – Sep 2024',
    points: [
      'Developed a parent-child UAV concept for tracking locust swarms by combining algorithmic mission planning with aviation systems research.',
      'Published UAV research on NASA’s Technical Reports Server and presented findings to NASA scientists.',
    ],
  },
  {
    role: 'Young Astro-Scholars Research Intern',
    org: 'NASA TESS Mission, George Mason University',
    dates: 'Jun 2024 – Sep 2024',
    points: [
      'Identified candidate exoplanet transits in NASA TESS data using Python-based machine learning to analyze stellar light curves.',
      'Co-authored and presented published research on TOI 5868.01 with Prof. Peter Plavchan.',
    ],
  },
  {
    role: 'Captain, FIRST Tech Challenge – Team Don’t Blink',
    org: 'Competitive robotics',
    dates: '2020 – 2026',
    points: [
      'Led a 16-member robotics team to a World Championship win by developing Java autonomous and tele-op routines.',
      'Improved robot functionality through drivetrain control tuning, sensor integration, and CAD-based design.',
    ],
  },
  {
    role: 'Web Development Bootcamp',
    org: 'UMD App Dev Club',
    dates: '2026 – Present',
    points: [
      'Building foundational web development skills through hands-on React and JavaScript coursework.',
      'Practicing frontend development through project-based exercises and Git/GitHub workflows.',
    ],
  },
]

export const honors = [
  'FIRST Tech Challenge World Championship Winner (2023)',
  'Inspire Award 2nd, Ochoa Division, FTC World Championship (2025)',
  'NJ State Champion, FIRST Tech Challenge (2023)',
  'FTC Dean’s List Semi-Finalist (2025)',
  'Publication: NASA Technical Reports Server (2024)',
  'Publication: George Mason University TESS Mission Research Journal (2024)',
]

export const skills: { label: string; items: string[] }[] = [
  { label: 'Languages', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'HTML/CSS'] },
  { label: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'] },
  { label: 'Tools', items: ['Git', 'GitHub', 'RoboDK', 'Arduino'] },
  { label: 'Other', items: ['Machine Learning', 'PLC I/O', 'CAD (Onshape)', 'Sensor Integration'] },
]

// Used by the published (static) site, where the FastAPI backend isn't running.
export const projects: Project[] = [
  {
    id: 1,
    title: 'SkillCard',
    category: 'Web development',
    description: 'A robotics-fix marketplace built with Next.js and React that makes published solutions accessible to developers, with metered access to reusable robot code to cut repeated debugging of known problems.',
    tags: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
    link: 'https://github.com/arnavsharmaa/SkillCard',
  },
  {
    id: 2,
    title: 'Robotic Spray Path Planner',
    category: 'Robotics',
    description: 'At Zaic Design: a Python/RoboDK planner that generates reusable spray toolpaths straight from CAD geometry, with PLC I/O and ultrasonic feedback for targeted coating rework across 14 measurement points.',
    tags: ['Python', 'RoboDK', 'PLC I/O', 'CAD'],
    link: null,
  },
  {
    id: 3,
    title: 'Exoplanet Transit Detection',
    category: 'Machine learning',
    description: 'Used Python-based machine learning on NASA TESS stellar light curves to identify candidate exoplanet transits; co-authored published research on TOI 5868.01.',
    tags: ['Python', 'Machine Learning', 'Astronomy'],
    link: null,
  },
  {
    id: 4,
    title: 'Locust-Tracking UAV Concept',
    category: 'Aerospace',
    description: 'At NASA Ames: designed a parent-child UAV system for tracking locust swarms, combining algorithmic mission planning with aviation systems research. Published on NASA’s Technical Reports Server.',
    tags: ['Mission planning', 'UAV', 'Research'],
    link: null,
  },
  {
    id: 5,
    title: 'FTC Robotics – Team Don’t Blink',
    category: 'Robotics',
    description: 'Captained a 16-member team to the 2023 FTC World Championship, writing Java autonomous and tele-op routines and tuning drivetrain control and sensor integration.',
    tags: ['Java', 'Control', 'Sensors', 'Leadership'],
    link: null,
  },
  {
    id: 6,
    title: 'Personal Portfolio',
    category: 'Web development',
    description: 'This site — built with React and TypeScript in the UMD App Dev Club bootcamp, with a FastAPI backend for managing projects.',
    tags: ['React', 'TypeScript', 'FastAPI'],
    link: 'https://github.com/neilm1642/WebDev-BootCamp',
  },
]
