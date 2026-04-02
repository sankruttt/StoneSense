# 🏥 StoneSense - AI-Powered Kidney Stone Detection & Analysis Platform

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-red?style=for-the-badge)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18.2+-61dafb?style=for-the-badge)](https://reactjs.org)
[![YOLO](https://img.shields.io/badge/YOLO-v11-FFD700?style=for-the-badge)](https://github.com/ultralytics/ultralytics)

**Advanced AI-powered medical imaging platform for automated kidney stone detection and analysis**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**StoneSense** is a comprehensive AI-powered platform designed for automated kidney stone detection and analysis from medical imaging scans. Leveraging state-of-the-art YOLO v11 neural networks, the platform provides real-time detection, severity assessment, and detailed medical reporting capabilities.

The system combines:
- 🧠 **Advanced AI Detection** - YOLO v11 for real-time stone identification
- 📄 **Automated Reporting** - PDF generation with analysis results
- 💬 **AI Health Advisor** - OpenAI-powered chatbot for patient guidance
- 🔐 **Secure Authentication** - Firebase for user management
- 📱 **Responsive UI** - React-based frontend for seamless experience

---

## ✨ Features

### 🧠 AI-Powered Detection
- Real-time kidney stone detection from CT/Ultrasound/X-ray scans
- Multi-stone detection with individual analysis
- Confidence scoring and size estimation
- Support for JPEG, PNG image formats

### 📊 Comprehensive Medical Reporting
- Automated PDF report generation
- Severity assessment (Mild, Moderate, Severe, Critical)
- Stone diameter calculations and volume estimations
- Visual annotations on original scans
- Treatment recommendations

### 💬 Intelligent Health Chatbot
- OpenAI GPT integration for health guidance
- Context-aware responses based on scan results
- 24/7 availability for patient queries
- Medical knowledge base support

### 👤 User Management
- Firebase authentication (email/password)
- Role-based access (Patient/Doctor)
- Secure profile management
- Session security

### 🏥 Healthcare Integration
- Doctor specialist directory
- Direct consultation system
- Secure report sharing
- Appointment scheduling support

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11+ | Core backend language |
| **Flask** | 3.0+ | Web framework |
| **Ultralytics** | 8.0+ | YOLO v11 implementation |
| **OpenCV** | 4.8+ | Computer vision |
| **Pillow** | 10.0+ | Image processing |
| **PyTorch** | Latest | Deep learning |
| **ReportLab** | 4.0+ | PDF generation |
| **OpenAI** | 1.0+ | Chatbot API |
| **Firebase Admin** | 6.0+ | Authentication & database |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2+ | UI library |
| **axios** | 1.6+ | HTTP client |
| **Firebase** | 12.9+ | Client authentication |
| **CSS3** | Latest | Styling |

### Infrastructure
- **Git** - Version control
- **Docker** - Containerization
- **CI/CD** - GitHub Actions (optional)

---

## 📋 Prerequisites

### Required Software
- Python 3.11 or higher
- Node.js 16+ (for frontend)
- Git
- pip (Python package manager)

### Required Accounts
- [Firebase Account](https://firebase.google.com) - For authentication
- [OpenRouter API Key](https://openrouter.ai) - For AI chatbot
- [Twilio Account](https://twilio.com) (optional) - For WhatsApp integration

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/sankruttt/StoneSense.git
cd StoneSense
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd StoneSense/stone
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create `.env` file in `StoneSense/stone/`:
```env
OPENROUTER_API_KEY=your_api_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
BASE_URL=http://localhost:5001
FIREBASE_SERVICE_ACCOUNT_JSON={"type": "service_account", ...}
```

#### Setup Firebase
1. Create Firebase project at [firebase.google.com](https://firebase.google.com)
2. Download service account JSON key
3. Save as `serviceAccountKey.json` in `StoneSense/stone/` (gitignored)
4. Set `FIREBASE_SERVICE_ACCOUNT_JSON` env var with full JSON content

#### Run Backend
```bash
python app.py
```
Backend runs on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd ../stone/frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

---

## 🔌 API Endpoints

### Health Check
```bash
GET /api/health
```
Response: `{"status": "ok", "model": "runs/detect/train2/weights/best.pt"}`

### Stone Detection (Protected)
```bash
POST /api/detect
Headers: Authorization: Bearer {firebase_id_token}
Body: multipart/form-data with 'image' file
```
Response: Detection results with stones, severity, confidence scores

### Generate Report (Protected)
```bash
POST /api/generate-pdf
Headers: Authorization: Bearer {firebase_id_token}
Body: JSON with detection results
```
Response: PDF file

### AI Chatbot (Protected)
```bash
POST /api/chat
Headers: Authorization: Bearer {firebase_id_token}
Body: {"message": "...", "scan_results": {...}, "history": [...]}
```
Response: AI-generated health advice

### WhatsApp Integration (Protected)
```bash
POST /api/send-whatsapp
Headers: Authorization: Bearer {firebase_id_token}
Body: {"results": {...}, "phoneNumber": "+1..."}
```
Response: Message SID and status

---

## 🌍 Deployment

### Option 1: Railway (Recommended - Free)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select repo and branch
5. Add environment variables
6. Deploy

### Option 2: Google Cloud Run
1. Create Dockerfile (included)
2. Go to [cloud.google.com/run](https://cloud.google.com/run)
3. Create new service
4. Connect GitHub repo
5. Configure environment variables
6. Deploy

### Option 3: Render
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub
4. Set root directory: `StoneSense/stone`
5. Configure build/start commands
6. Add environment variables
7. Deploy

### Environment Variables (All Platforms)
```
FIREBASE_SERVICE_ACCOUNT_JSON = {full JSON key}
TWILIO_ACCOUNT_SID = your_sid
TWILIO_AUTH_TOKEN = your_token
TWILIO_WHATSAPP_NUMBER = whatsapp:+14155238886
BASE_URL = https://yourdomain.com
OPENROUTER_API_KEY = your_key
PYTHON_VERSION = 3.12.0
```

---

## 📁 Project Structure

```
StoneSense/
├── README.md                          # This file
├── .gitignore                         # Git ignore rules
├── render.yaml                        # Render deployment config
├── stone/                             # Backend Flask app
│   ├── app.py                         # Main Flask application
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                     # Docker configuration
│   ├── stone_detection.py             # YOLO detection module
│   ├── runs/detect/train2/weights/    # Trained model weights
│   │   └── best.pt                    # Primary model (YOLO v11)
│   ├── yolo11m.pt                     # Medium YOLO model
│   ├── yolo11n.pt                     # Nano YOLO model
│   ├── uploads/                       # User uploaded scans
│   ├── outputs/                       # Detection outputs
│   ├── reports/                       # Generated PDFs
│   ├── templates/                     # HTML templates
│   └── frontend/                      # React frontend
│       ├── package.json               # Node dependencies
│       ├── public/                    # Static assets
│       └── src/                       # React source code
│           ├── App.js                 # Main component
│           ├── firebase.js            # Firebase config
│           └── components/            # UI components
└── uploads/                           # Root upload directory
```

---

## 🔒 Security Considerations

⚠️ **Important Security Notes:**

1. **Environment Variables:** Never commit `.env` files. Use platform-specific env var management.
2. **Firebase Keys:** Store service account JSON in environment variable, not as file.
3. **Secrets:** Rotate Twilio, OpenRouter, and Firebase keys regularly.
4. **CORS:** Update CORS origins to include your production domains.
5. **HTTPS:** Always use HTTPS in production.
6. **Rate Limiting:** Implement rate limiting for API endpoints.

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Yes | Firebase admin SDK service account (JSON) |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key for AI chatbot |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID for WhatsApp |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio authentication token |
| `TWILIO_WHATSAPP_NUMBER` | Yes | Twilio WhatsApp sender number |
| `BASE_URL` | Yes | Backend base URL for report sharing |
| `PYTHON_VERSION` | No | Python version (default: 3.12.0) |

---

## 🧪 Testing API Locally

### Test Health Endpoint
```bash
curl http://localhost:5001/api/health
```

### Test Detection (requires auth token)
```bash
# First, get Firebase ID token from frontend login
curl -X POST http://localhost:5001/api/detect \
  -H "Authorization: Bearer {YOUR_FIREBASE_ID_TOKEN}" \
  -F "image=@path/to/image.jpg"
```

---

## 🐛 Troubleshooting

### Common Issues

**502 Bad Gateway on Deployment**
- Check if `runs/detect/train2/weights/best.pt` exists in repository
- Verify Firebase credentials are set correctly
- Check platform logs for Python import errors

**Model Not Loading**
- Ensure YOLO model file path is correct
- Check Python and PyTorch versions compatibility
- Verify sufficient disk space for model (~100MB)

**Firebase Authentication Fails**
- Verify `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON
- Check Firebase project is still active
- Ensure service account has proper permissions

**API Returns 401 Unauthorized**
- Firebase token may be expired
- Re-authenticate on frontend
- Verify Authorization header format: `Bearer {token}`

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review error logs for debugging

---

## 🙏 Acknowledgments

- **Ultralytics** - YOLO v11 framework
- **OpenAI** - GPT models for AI features
- **Firebase** - Authentication and database
- **CMR Technical Campus** - Institution support

---

<div align="center">

Made with ❤️ for healthcare innovation

**[↑ Back to Top](#-stonesense---ai-powered-kidney-stone-detection--analysis-platform)**

</div>
