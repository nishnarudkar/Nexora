# Nexora Platform

AI-powered Nuclear Infrastructure Planning and Decision Intelligence Platform.

## Project Structure

- `frontend/`: Next.js 15, React 19, Tailwind CSS v3 app with Recharts for the Dashboard.
- `backend/`: FastAPI Python backend with SQLAlchemy for PostgreSQL compatibility (using SQLite as fallback for rapid local dev).

## Deployment

### Deploying the Backend (e.g., Render, Heroku)

1. Connect your GitHub repository to a service like Render.
2. Set the Root Directory to `backend`.
3. Set the Build Command to `pip install -r requirements.txt`.
4. Set the Start Command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.

### Deploying the Frontend (e.g., Vercel)

1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed FastAPI backend (e.g., `https://atomready-backend.onrender.com`).
4. Deploy!

## Local Development

**Backend:**
```bash
cd backend
python -m venv venv
# Activate venv
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
