# CareerSync AI — Running the Application

This project has three services that must all be running simultaneously:

| Service | Tech | Port |
|---|---|---|
| AI Services (FastAPI) | Python / Uvicorn | `8000` |
| Backend (Node.js proxy) | Express | `5000` |
| Frontend | React / Vite | `5173` |

---

## Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm**
- **[Ollama](https://ollama.com)** installed and running locally with the `llama3` model pulled

```bash
ollama pull llama3
```

---

## 1. AI Services (FastAPI — Port 8000)

```bash
cd careersync-ai/ai-services
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

---

## 2. Backend Proxy (Node.js — Port 5000)

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

---

## 3. Frontend (Vite — Port 5173)

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

---

## Startup Order

Always start the services in this order:

1. Ollama (must be running in the background)
2. FastAPI (`uvicorn main:app --reload --port 8000`)
3. Node.js proxy (`node server.js`)
4. Frontend (`npm run dev`)

Once all three are running, open **http://localhost:5173** in your browser.

---

## How It Works

```
Browser (5173)
    └── Node.js proxy (5000)
            └── FastAPI AI layer (8000)
                        └── Ollama (llama3)
```

The frontend talks to the Node.js proxy on port 5000. The proxy forwards requests to the FastAPI server on port 8000, which runs all AI agents using the local Ollama `llama3` model.
