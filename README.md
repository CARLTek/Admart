# AdMart - Smart Social Media Marketing Platform

A comprehensive smart social media marketing platform with billboard advertising and AI-powered ad generation.

## Features

### Billboard Marketing Platform
- User accounts (Customers & Billboard Owners)
- Billboard registration and management
- Proposal creation by customers
- Bidding system for billboard owners
- Proposal acceptance workflow

### Smart Social Media Marketing Agent
- AI-powered ad generation
- Auto-upload to social media accounts
- Support for multiple platforms (Facebook, Instagram, Twitter, LinkedIn, TikTok)
- Post scheduling

## Tech Stack

### Backend
- **Framework:** Django 5.x
- **API:** Django REST Framework
- **Authentication:** JWT (SimpleJWT)
- **Database:** SQLite (development) / PostgreSQL (production)
- **AI:** Ollama (local models)

### Frontend
- React 18+
- React Router
- Axios
- TailwindCSS

## Prerequisites

- Python 3.10+
- PostgreSQL (for production)
- Node.js 18+ (for frontend)
- Ollama (for AI features)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Admart
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
```bash
cp .env .env.local
# Edit .env with your configuration
```

### 5. Run migrations
```bash
python manage.py migrate
```

### 6. Create superuser
```bash
python manage.py createsuperuser
```

### 7. Run development server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`
Admin panel at `http://localhost:8000/admin/`

## Project Structure

```
Admart/
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
├── admart/                      # Django project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── users/                       # User authentication & profiles
├── billboards/                  # Billboard management
├── proposals/                   # Customer proposals
├── bidding/                     # Bidding system
├── ads/                         # AI Ad generation
├── social_media/                # Social media integrations
└── notifications/              # In-app notifications
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Current user info

### Billboards
- `GET /api/billboards/` - List all billboards
- `POST /api/billboards/` - Create billboard
- `GET /api/billboards/<id>/` - Get billboard details
- `PUT /api/billboards/<id>/` - Update billboard
- `DELETE /api/billboards/<id>/` - Delete billboard

### Proposals
- `GET /api/proposals/` - List proposals
- `POST /api/proposals/` - Create proposal
- `GET /api/proposals/<id>/` - Get proposal details
- `POST /api/proposals/<id>/accept-bid/` - Accept a bid

### Bidding
- `GET /api/bids/` - List bids
- `POST /api/bids/` - Create bid
- `PUT /api/bids/<id>/` - Update bid
- `DELETE /api/bids/<id>/` - Withdraw bid

### Ads
- `POST /api/ads/generate/` - Generate AI ad
- `GET /api/ads/history/` - Ad generation history

### Social Media
- `GET /api/social-media/accounts/` - List connected accounts
- `POST /api/social-media/connect/` - Connect new account
- `POST /api/social-media/post/` - Create post
- `POST /api/social-media/schedule/` - Schedule post

### Notifications
- `GET /api/notifications/` - List notifications
- `POST /api/notifications/<id>/read/` - Mark as read

## Database Configuration

### SQLite (Development)
Default configuration uses SQLite. No additional setup required.

### PostgreSQL (Production)
1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE admart;
CREATE USER admart_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE admart TO admart_user;
```
3. Update `.env`:
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=admart
DB_USER=admart_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| SECRET_KEY | Django secret key | - |
| DEBUG | Debug mode | True |
| ALLOWED_HOSTS | Allowed hosts | localhost,127.0.0.1 |
| DB_ENGINE | Database engine | sqlite3 |
| DB_NAME | Database name | db.sqlite3 |
| DB_USER | PostgreSQL user | postgres |
| DB_PASSWORD | PostgreSQL password | - |
| JWT_SECRET_KEY | JWT secret key | - |
| CORS_ALLOWED_ORIGINS | React frontend URL | localhost:5173 |
| OLLAMA_BASE_URL | Ollama API URL | http://localhost:11434 |
| OLLAMA_MODEL | Ollama model name | llama2 |

## Running Tests

```bash
python manage.py test
```

## License

MIT License
