# QuickPoll - Real-Time Opinion Polling Platform

![QuickPoll Banner](https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=QuickPoll+-+Real-Time+Opinion+Polling)

A modern, full-stack real-time opinion polling platform that allows users to create polls, vote, like, and see live updates as other users interact. Built with FastAPI, Next.js, and WebSocket technology for seamless real-time communication.

## 🌟 Features

- **Real-time Updates**: Live vote and like counts using WebSocket connections
- **Poll Management**: Create polls with multiple options (2-10 options supported)
- **Interactive Voting**: One vote per user per poll with real-time result visualization
- **Like System**: Like/unlike polls with instant feedback
- **Responsive Design**: Mobile-first design with modern UI components
- **Data Persistence**: JSON-file based storage with in-memory caching
- **Clean Architecture**: Modular, maintainable codebase following best practices

## 🏗️ System Architecture

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│   Backend       │◄──►│   Data Layer    │
│   (Next.js)     │    │   (FastAPI)     │    │   (JSON Files)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │
         │                        │
         └────────WebSocket────────┘
           (Real-time Updates)
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Native WebSocket API
- **UI Components**: 
  - shadcn/ui (buttons, cards, inputs, labels)
  - Lucide React (icons)
  - Sonner (toast notifications)

#### Backend
- **Framework**: FastAPI 0.104.1
- **Language**: Python 3.10+
- **Real-time**: FastAPI WebSockets
- **Data Validation**: Pydantic 2.5
- **ASGI Server**: Uvicorn 0.24
- **CORS**: FastAPI CORS middleware

#### Data Storage
- **Primary**: In-memory Python dictionaries
- **Persistence**: JSON file serialization
- **Format**: Structured JSON with datetime handling

### System Components

#### Backend Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI application & CORS setup
│   ├── models/
│   │   └── poll.py          # Pydantic models (Poll, PollOption, Requests)
│   ├── routers/
│   │   ├── polls.py         # REST API endpoints
│   │   └── websocket.py     # WebSocket endpoints
│   ├── services/
│   │   └── websocket.py     # WebSocket connection management
│   └── data/
│       └── manager.py       # Data persistence & in-memory storage
├── requirements.txt         # Python dependencies
└── run.py                  # Application entry point
```

**Key Backend Components:**

1. **Data Manager** (`app/data/manager.py`):
   - Handles in-memory storage using Python dictionaries
   - Manages JSON file persistence
   - Provides CRUD operations for polls
   - Handles vote counting and user tracking

2. **WebSocket Manager** (`app/services/websocket.py`):
   - Manages active WebSocket connections
   - Broadcasts real-time updates to all connected clients
   - Handles connection lifecycle (connect/disconnect)
   - Supports both global and poll-specific connections

3. **API Routes** (`app/routers/polls.py`):
   - RESTful endpoints for poll operations
   - Integration with WebSocket broadcasting
   - Request validation using Pydantic models
   - Error handling and HTTP status codes

#### Frontend Architecture

```
frontend/src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Main application interface
├── components/
│   ├── CreatePollForm.tsx  # Poll creation component
│   ├── PollCard.tsx        # Individual poll display & interaction
│   ├── PollsList.tsx       # Polls listing with loading states
│   ├── WebSocketProvider.tsx # WebSocket connection management
│   └── ui/                 # shadcn/ui components
├── services/
│   ├── api.ts              # HTTP API client (Axios)
│   └── websocket.ts        # WebSocket service
├── store/
│   └── poll.ts             # Zustand state management
└── lib/
    └── user.ts             # User ID generation utilities
```

**Key Frontend Components:**

1. **State Management** (`store/poll.ts`):
   - Zustand store for global state
   - Handles polls, loading states, and errors
   - Provides actions for CRUD operations

2. **WebSocket Provider** (`components/WebSocketProvider.tsx`):
   - Manages WebSocket connection lifecycle
   - Handles real-time message processing
   - Updates global state on real-time events

3. **API Service** (`services/api.ts`):
   - Axios-based HTTP client
   - Type-safe API calls using TypeScript interfaces
   - Centralized error handling

### Data Flow

#### Poll Creation Flow
1. User fills out poll creation form
2. Frontend validates input and sends POST request to `/api/polls`
3. Backend creates poll and saves to JSON file
4. Backend broadcasts new poll to all WebSocket connections
5. All connected clients receive real-time update

#### Voting Flow
1. User clicks on poll option
2. Frontend sends POST request to `/api/polls/{id}/vote`
3. Backend updates vote count and user voting record
4. Backend broadcasts updated poll data via WebSocket
5. All connected clients see updated vote counts instantly

#### Real-time Updates
- WebSocket connection established on app load
- Server broadcasts on: poll creation, voting, liking/unliking
- Client handles different message types: `poll_created`, `vote_update`, `like_update`
- UI updates automatically without page refresh

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **Python** 3.10 or higher
- **Git** for cloning the repository

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Real-Time-Opinion-Polling-Platform
   ```

2. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create virtual environment
   python3 -m venv venv
   
   # Activate virtual environment
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the backend server
   python run.py
   ```
   
   The backend server will start at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

3. **Frontend Setup**
   ```bash
   # Open new terminal and navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```
   
   The frontend will start at `http://localhost:3000`

### Environment Configuration

#### Frontend Environment Variables
Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/ws
```

#### Backend Configuration
The backend uses default configurations but can be customized:
- Server port: 8000 (configurable in `run.py`)
- Data file: `polls.json` (created automatically)
- CORS origins: `http://localhost:3000`, `http://127.0.0.1:3000`

### Project Scripts

#### Backend
```bash
# Start development server
python run.py

# Start with uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🧪 Testing the Application

### Manual Testing Steps

1. **Start both servers** (backend on :8000, frontend on :3000)

2. **Test Poll Creation**:
   - Navigate to "Create Poll" tab
   - Enter poll title and at least 2 options
   - Click "Create Poll"
   - Verify poll appears in "All Polls" tab

3. **Test Real-time Voting**:
   - Open application in multiple browser tabs/windows
   - Vote on a poll in one tab
   - Verify vote counts update immediately in other tabs

4. **Test Like System**:
   - Like a poll in one tab
   - Verify like count updates in other tabs

5. **Test WebSocket Connection**:
   - Check browser console for WebSocket connection logs
   - Test connection resilience by temporarily stopping backend

### API Testing with cURL

```bash
# Test server health
curl http://localhost:8000/health

# Get all polls
curl http://localhost:8000/api/polls

# Create a poll
curl -X POST http://localhost:8000/api/polls \
  -H "Content-Type: application/json" \
  -d '{"title": "Favorite Language", "options": ["Python", "JavaScript", "TypeScript"]}'

# Vote on a poll
curl -X POST http://localhost:8000/api/polls/{poll_id}/vote \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user123", "option_id": "option_id_here"}'
```

## 🔧 Technical Implementation Details

### Real-time Communication
- **WebSocket Protocol**: Native WebSocket for low-latency communication
- **Connection Management**: Automatic reconnection with exponential backoff
- **Message Types**: Structured JSON messages with type-based routing
- **Broadcast Strategy**: Server-side fan-out to all connected clients

### Data Persistence
- **In-memory Storage**: Python dictionaries for fast access
- **File Persistence**: JSON serialization on every data change
- **Data Consistency**: Synchronous writes ensure data integrity
- **User Tracking**: Session-based user identification via localStorage

### Security Considerations
- **CORS Configuration**: Explicit origin allowlist
- **Input Validation**: Pydantic models for request validation
- **Rate Limiting**: Can be added using FastAPI middleware
- **Authentication**: Ready for integration (user_id based system)

### Performance Optimizations
- **Efficient Updates**: Only changed data is broadcast
- **Connection Pooling**: Reused WebSocket connections
- **Minimal Payloads**: Structured data without unnecessary fields
- **Client-side Caching**: Zustand store prevents unnecessary re-renders

## 📚 Resources & References

### Technologies Used
- **FastAPI**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **Next.js**: [https://nextjs.org/](https://nextjs.org/)
- **Pydantic**: [https://docs.pydantic.dev/](https://docs.pydantic.dev/)
- **Tailwind CSS**: [https://tailwindcss.com/](https://tailwindcss.com/)
- **shadcn/ui**: [https://ui.shadcn.com/](https://ui.shadcn.com/)
- **Zustand**: [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)

### WebSocket Implementation References
- **FastAPI WebSockets**: [https://fastapi.tiangolo.com/advanced/websockets/](https://fastapi.tiangolo.com/advanced/websockets/)
- **MDN WebSocket API**: [https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

### UI/UX Design Inspiration
- **Radix UI**: [https://www.radix-ui.com/](https://www.radix-ui.com/)
- **Lucide Icons**: [https://lucide.dev/](https://lucide.dev/)

## 🛠️ Development Notes

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js recommended rules
- **Python**: PEP8 compliance with type hints
- **Component Structure**: Modular, reusable components
- **Error Handling**: Comprehensive error boundaries and try-catch blocks

### Future Enhancements
- **Authentication**: User registration and login system
- **Poll Analytics**: Detailed voting statistics and charts
- **Poll Expiration**: Time-based poll closing
- **Comments**: User comments on polls
- **Sharing**: Social media integration for poll sharing
- **Database Migration**: PostgreSQL/MongoDB for production
- **Deployment**: Docker containerization and cloud deployment

## 📄 License

This project is built as a demonstration of full-stack development capabilities with real-time features. Feel free to use it as a reference or starting point for similar applications.

## 🤝 Contributing

This is a showcase project, but feedback and suggestions are welcome! Please feel free to:
- Report issues
- Suggest improvements
- Share your experience using the code

---

**Built with ❤️ using modern web technologies**
