# ConvoPilot 🚀

A modern language learning platform that helps users improve their active language skills (speaking and writing) through AI-powered conversations. Users can engage in appropriate-level conversations with Large Language Models (LLMs) in their target language, receive detailed feedback on mistakes, and get personalized learning tips.

## 🌟 Features

- **Personalized Learning**: Tailored conversations based on user's proficiency level
- **Real-time Feedback**: Grammar, vocabulary, and fluency analysis
- **Multiple Languages**: Support for various language pairs
- **Progress Tracking**: Detailed analytics and learning progress monitoring
- **Session Management**: Pause, resume, and review conversation sessions
- **User Profiles**: Customizable learning goals and preferences

## 🏗️ Architecture

- **Backend**: FastAPI with SQLAlchemy ORM
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: JWT-based authentication
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## 📁 Project Structure

```
convopilot/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality (config, security)
│   │   ├── db/             # Database configuration
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic layer
│   │   └── main.py         # FastAPI application
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── components/    # React components
│   └── package.json       # Node dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL (for production) or SQLite (for development)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

6. **Start the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📊 Database Schema

### Core Models

- **User**: User profiles with language learning preferences
- **ConversationSession**: Individual conversation sessions
- **Message**: Messages within conversations
- **Feedback**: AI-generated feedback and analysis

### Key Features

- **Multi-language support**: Users can learn multiple languages
- **Proficiency tracking**: From beginner to proficient levels
- **Session analytics**: Duration, message count, complexity scores
- **Learning recommendations**: Personalized study suggestions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/check-email` - Email availability
- `POST /api/auth/check-username` - Username availability

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/statistics` - User learning statistics
- `GET /api/users/language-peers` - Find other learners

### Sessions (Coming Soon)
- `POST /api/sessions` - Create new conversation session
- `GET /api/sessions` - List user sessions
- `GET /api/sessions/{id}` - Get session details
- `PUT /api/sessions/{id}` - Update session

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive an access token
2. Include the token in the Authorization header: `Bearer <token>`
3. Tokens expire after 30 minutes (configurable)

## 🌍 Environment Configuration

### Backend (.env)

```env
# Application
APP_NAME=ConvoPilot
DEBUG=false
VERSION=1.0.0

# Database
DATABASE_URL=sqlite:///./convopilot.db  # SQLite for development
# DATABASE_URL=mysql+pymysql://user:pass@localhost/convopilot  # MySQL for production

# Security
SECRET_KEY=your-super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# AI Integration (Future)
OPENAI_API_KEY=your-openai-api-key
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Production)

1. **Set up MySQL database**
2. **Configure production environment variables**
3. **Run migrations**:
   ```bash
   alembic upgrade head
   ```
4. **Deploy with Gunicorn**:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Frontend (Production)

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📈 Future Enhancements

- **Real-time conversation**: WebSocket support for live chat
- **Voice integration**: Speech-to-text and text-to-speech
- **Mobile app**: React Native/Expo mobile application
- **Gamification**: Achievements, streaks, and leaderboards
- **Advanced analytics**: ML-powered learning insights
- **Community features**: User forums and study groups

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` endpoint when running the backend
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- Next.js for the powerful React framework
- SQLAlchemy for robust ORM capabilities
- The open-source community for inspiration and tools

---

**Built with ❤️ for language learners worldwide**