# CareerSync AI

> **Switch Careers in Days, Not Years.**

CareerSync AI is an AI-powered career transition platform built around **Pivot Mode** — a tool that takes your resume, maps your transferable skills to a target industry, generates a personalised learning roadmap, and prepares you for domain-specific interviews. All inference runs locally via Ollama (no external AI API required).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [AI Agents](#ai-agents)
- [Tech Stack](#tech-stack)
- [Running the Application](#running-the-application)

---

## Overview

CareerSync AI solves a real problem: career switching is hard. Most people have transferable skills but don't know how they map to a new domain, where to start learning, or how to prepare for interviews in a field they've never worked in.

Pivot Mode addresses this by:
1. Parsing a pasted resume to extract skills
2. Mapping those skills to the target domain
3. Identifying skill gaps
4. Generating a phased learning roadmap with real study resources
5. Producing domain-specific interview questions
6. Displaying everything in a structured dashboard

---

## Features

### Pivot Mode
- Paste resume text, select a target domain (Healthcare IT, Railway, Finance) and a timeline (2 Days, 1 Week, 1 Month)
- Fullscreen animated loading overlay while AI processes
- Auto-navigates to Dashboard on completion
- Results persist in app state for the session — navigating away and back does not reset them

### Dashboard
- Confidence score, skills detected, skill gaps count, job matches count
- AI-scored skill relevance bars (0–100%)
- Clickable job match cards that open LinkedIn job searches
- AI-generated insight and action tip
- Skill gaps list

### Roadmap
- 4-phase AI-generated roadmap broken down from the selected timeline
- Click any phase card to view its topics and study resources
- Each resource links to Coursera, YouTube, freeCodeCamp, Medium, or Google
- "Mark Phase as Done" button updates a market readiness progress circle (0% → 100%)

### Interview Prep
- Domain-specific interview questions generated from skill gaps and mapped skills

### Landing Page (`/`)
- Fullscreen looping background video
- Glassmorphic navigation with liquid-glass effect
- Cinematic typography using Instrument Serif

### Onboarding Page (`/onboarding`)
- Multi-section scrollable page explaining the problem and Pivot Mode features
- Links to `/pivot` to start the analysis

---

## Architecture

```
Browser (localhost:5173)
    └── Node.js Express Proxy (localhost:5000)
            ├── POST /analyze        → FastAPI (localhost:8000) /analyze
            └── POST /roadmap/detailed → FastAPI (localhost:8000) /roadmap/detailed
                        └── Ollama (llama3) — runs all LLM inference locally
```

The frontend never talks directly to FastAPI. All requests go through the Node.js proxy on port 5000, which forwards them to the FastAPI AI layer on port 8000.

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero page with video background |
| `/onboarding` | Onboarding | Multi-section product explainer |
| `/pivot` | Pivot Mode | Resume input + AI analysis form |
| `/dashboard` | Dashboard | Analysis results snapshot |
| `/roadmap` | Roadmap | 4-phase learning roadmap |
| `/interview` | Interview Prep | Domain-specific interview questions |

---

## AI Agents

All agents live in `careersync-ai/ai-services/agents/` and use LangChain with a local Ollama `llama3` model.

| Agent | File | Purpose |
|---|---|---|
| Profile Agent | `profile_agent.py` | Extracts skills from resume text |
| Mapping Agent | `mapping_agent.py` | Maps skills to target domain, identifies gaps |
| Roadmap Agent | `roadmap_agent.py` | Generates basic and detailed 4-phase roadmaps |
| Interview Agent | `interview_agent.py` | Generates 5 domain-specific interview questions |
| Dashboard Agent | `dashboard_agent.py` | Generates skill scores, job matches, AI insight |

### API Endpoints (FastAPI — port 8000)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/analyze` | Full pivot analysis (skills, gaps, roadmap, questions, dashboard) |
| `POST` | `/roadmap/detailed` | Detailed 4-phase roadmap with resources and tips |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS v4 |
| Backend proxy | Node.js, Express |
| AI layer | Python, FastAPI, LangChain, Uvicorn |
| LLM | Ollama (`llama3`) — runs locally |
| Fonts | Manrope, Inter, Instrument Serif (Google Fonts) |

---

## Running the Application

This project has three services that must all be running simultaneously:

| Service | Tech | Port |
|---|---|---|
| AI Services (FastAPI) | Python / Uvicorn | `8000` |
| Backend (Node.js proxy) | Express | `5000` |
| Frontend | React / Vite | `5173` |

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm**
- **[Ollama](https://ollama.com)** installed and running locally with the `llama3` model pulled

```bash
ollama pull llama3
```

### 1. AI Services (FastAPI — Port 8000)

```bash
cd careersync-ai/ai-services
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `careersync-ai/ai-services/` if it doesn't exist:

```
GOOGLE_API_KEY=your_key_here
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

### 2. Backend Proxy (Node.js — Port 5000)

```bash
cd careersync-ai/backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

### 3. Frontend (Vite — Port 5173)

```bash
cd careersync-ai/frontend
```

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

### Startup Order

Always start the services in this order:

1. Ollama (must be running in the background)
2. FastAPI (`uvicorn main:app --reload --port 8000`)
3. Node.js proxy (`node server.js`)
4. Frontend (`npm run dev`)

Once all three are running, open **http://localhost:5173** in your browser.
