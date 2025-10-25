from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import polls, websocket

app = FastAPI(
    title="QuickPoll API",
    description="A real-time opinion polling platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS to allow both local and production environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://real-time-opinion-polling-platform.onrender.com",
        "https://real-time-opinion-polling-platform.vercel.app/"
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(polls.router, prefix="/api", tags=["polls"])
app.include_router(websocket.router, prefix="/api", tags=["websocket"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to QuickPoll API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "polls": "/api/polls",
            "websocket": "/api/ws"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}