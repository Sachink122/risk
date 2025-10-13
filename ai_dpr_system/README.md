# DPR-AI: AI-Powered DPR Quality Assessment & Risk Prediction System

DPR-AI is a secure, AI-powered, multilingual web application designed for the Ministry of Development of North Eastern Region (MDoNER) to automate Detailed Project Report (DPR) quality assessment and risk prediction.

## Features

- **AI-Powered Analysis**: Automated assessment of DPRs using OCR, NLP, and ML
- **Risk Prediction**: Identify potential cost overruns, delays, and resource issues
- **Multilingual Support**: English, Hindi, Assamese (expandable to other Indic languages)
- **Compliance Checking**: Automated verification against MDoNER guidelines
- **Responsive Design**: Mobile-friendly with offline capabilities (PWA)
- **Secure Authentication**: Role-based access with JWT authentication
- **Interactive Dashboard**: Visualize risk scores and compliance metrics
- **Report Generation**: Downloadable PDF/CSV reports for evaluated DPRs

## Technology Stack

### Frontend
- Next.js 14
- React
- TailwindCSS
- ShadCN/UI components
- Chart.js / D3.js for visualizations
- PWA for offline capabilities

### Backend
- FastAPI (Python)
- JWT Authentication
- Tesseract OCR
- Hugging Face Transformers (BERT/RoBERTa)
- Scikit-learn / XGBoost for ML models

### Database
- PostgreSQL
- AWS S3 / NIC Cloud Storage for file storage

### Deployment
- Docker / Docker Compose
- AWS GovCloud / NIC Cloud

## Project Structure

```
ai_dpr_system/
├── backend/             # FastAPI application
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core functionality
│   │   ├── db/          # Database models and connections
│   │   ├── ml/          # Machine learning models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── utils/       # Utility functions
│   ├── tests/           # Backend tests
│   └── Dockerfile       # Backend Dockerfile
│
├── frontend/            # Next.js application
│   ├── app/             # App router directories
│   ├── components/      # Reusable React components
│   ├── lib/             # Utility functions
│   ├── public/          # Static assets
│   ├── styles/          # Global styles
│   └── Dockerfile       # Frontend Dockerfile
│
├── database/            # Database migration scripts
│   └── migrations/      # SQL migration files
│
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # Project documentation
```

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)
- PostgreSQL (for local development without Docker)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/dpr-ai.git
cd dpr-ai
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your configuration

3. Start the application with Docker:
```bash
docker-compose up -d
```

4. For local development:
   - Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
   
   - Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Security & Compliance

- HTTPS/TLS encryption
- Data encryption at rest
- JWT token-based authentication
- Role-based access control
- Follows MeitY and NIC data privacy guidelines
- Audit logging for all actions
- CAPTCHA protection for login

## License

[Specify the license here]

## Contributors

[List the contributors here]