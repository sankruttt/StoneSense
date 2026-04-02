# 🏥 StoneSense - AI-Powered Kidney Stone Detection & Analysis Platform

<div align="center">
  <img src="stones-web/public/splash-screen.png" alt="StoneSense Logo" width="200">
  
  [![Hackathon](https://img.shields.io/badge/Hackathon-NeuraX%202025-blue?style=for-the-badge)](https://github.com)
  [![Institution](https://img.shields.io/badge/Developed%20at-CMR%20Technical%20Campus-green?style=for-the-badge)](https://cmrtc.ac.in)

  [![React](https://img.shields.io/badge/Frontend-Next.js%2015-blue?style=for-the-badge)](https://nextjs.org)
  [![Flask](https://img.shields.io/badge/Backend-Flask-red?style=for-the-badge)](https://flask.palletsprojects.com)
</div>

## 📖 Overview

**StoneSense** is an advanced AI-powered medical imaging platform specifically designed for automated kidney stone detection and analysis. This comprehensive solution combines cutting-edge computer vision technology with intuitive user interfaces to revolutionize kidney stone diagnosis and patient care.

The platform leverages YOLO v11 (You Only Look Once) neural networks for real-time stone detection, integrated with a modern Next.js frontend and robust Flask backend, providing healthcare professionals and patients with instant, accurate analysis of medical scans.

---



## ✨ Key Features & Functionalities

### 🧠 **1. AI-Powered Stone Detection**
- **YOLO v11 Integration**: State-of-the-art object detection for kidney stones
- **Real-time Analysis**: Instant processing of medical scans (CT, Ultrasound, X-ray)
- **Multi-format Support**: JPEG, PNG, DICOM image compatibility
- **Precision Metrics**: Confidence scores, size estimation, and location mapping
- **Batch Processing**: Multiple image analysis capabilities

### 🏥 **2. Comprehensive Medical Reporting**
- **PDF Report Generation**: Detailed medical reports with findings
- **Visual Annotations**: Highlighted stone locations on original scans
- **Size Analysis**: Diameter calculations and volume estimations
- **Treatment Recommendations**: AI-suggested next steps based on findings
- **Historical Tracking**: Patient scan history and progression analysis

### 💬 **3. Intelligent Health Chatbot**
- **OpenAI Integration**: GPT-powered health advisor
- **Context-Aware**: Personalized advice based on scan results
- **24/7 Availability**: Instant responses to patient queries
- **Medical Knowledge Base**: Extensive kidney stone information
- **Multilingual Support**: Communication in multiple languages

### 👤 **4. User Authentication & Management**
- **Firebase Authentication**: Secure user account management
- **Role-Based Access**: Patient and doctor account types
- **Profile Management**: Personal health information storage
- **Session Security**: Encrypted data transmission
- **Password Recovery**: Secure account recovery options

### 🔗 **5. Doctor Integration System**
- **Specialist Directory**: Curated list of kidney stone specialists
- **Direct Communication**: Email integration for doctor consultations
- **Appointment Scheduling**: Calendar integration for bookings
- **Report Sharing**: Secure medical report distribution
- **Emergency Contacts**: Quick access to healthcare providers

### 📊 **6. Advanced Analytics Dashboard**
- **Detection Statistics**: Success rates and accuracy metrics
- **Patient Insights**: Health trend analysis
- **Performance Monitoring**: System usage and response times
- **Data Visualization**: Interactive charts and graphs
- **Export Capabilities**: CSV, PDF data export options

### 🔒 **7. Security & Compliance**
- **HIPAA Considerations**: Medical data protection protocols
- **Data Encryption**: End-to-end encrypted data transmission
- **Secure Storage**: Protected cloud storage solutions
- **Access Logging**: Comprehensive audit trails
- **Privacy Controls**: User data management options

---

## 🛠️ Technology Stack

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Core backend language |
| **Flask** | 3.0+ | Web application framework |
| **Flask-CORS** | 4.0.0+ | Cross-origin resource sharing |
| **Ultralytics** | 8.0.196+ | YOLO v11 model implementation |
| **OpenCV** | 4.8.0.74+ | Computer vision operations |
| **Pillow** | 10.0.0+ | Image processing library |
| **PyTorch** | Latest | Deep learning framework |
| **ReportLab** | 4.0.0+ | PDF report generation |
| **OpenAI** | 1.0.0+ | AI chatbot integration |
| **Pandas** | Latest | Data manipulation |
| **NumPy** | Latest | Numerical computations |

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.3 | React-based web framework |
| **React** | 19.1.0 | User interface library |
| **React DOM** | 19.1.0 | DOM rendering for React |
| **Tailwind CSS** | 4.0+ | Utility-first CSS framework |
| **Firebase** | 12.3.0+ | Authentication & database |
| **Firebase Admin** | 13.5.0+ | Server-side Firebase operations |
| **Lucide React** | Latest | Icon component library |
| **ESLint** | 9.0+ | Code quality enforcement |

### **AI & Machine Learning**
- **YOLO v11**: Latest object detection architecture
- **OpenRouter API**: Advanced language model integration
- **Custom Training Pipeline**: Specialized kidney stone detection
- **Transfer Learning**: Pre-trained model fine-tuning

### **Infrastructure & Deployment**
- **Node.js**: JavaScript runtime environment
- **npm**: Package management
- **Git**: Version control system
- **Environment Management**: Secure configuration handling

---

## 📋 Prerequisites

Before setting up StoneSense, ensure you have the following installed:

### **Required Software**
- **Python 3.8 or higher** - [Download Python](https://python.org/downloads/)
- **Node.js 18+ and npm** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

### **Required Accounts & API Keys**
- **OpenRouter API Key** - [Get API Key](https://openrouter.ai/)
- **Firebase Account** - [Create Firebase Project](https://firebase.google.com/)
- **Gmail App Password** - [Setup Guide](https://support.google.com/accounts/answer/185833)

---

## 🚀 Installation & Setup Guide

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/stone-sense.git
cd stones
```

### **Step 2: Backend Setup (Flask Application)**

#### **2.1 Navigate to Backend Directory**
```bash
cd stone
```

#### **2.2 Create Python Virtual Environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### **2.3 Install Python Dependencies**
```bash
pip install -r requirements.txt
```

#### **2.4 Configure Environment Variables**
Create a `.env` file in the `stone` directory:
```bash
# OpenRouter API Key for chatbot functionality
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Security
SECRET_KEY=your_secret_key_here_change_in_production

# Gmail Configuration for Email Sending
GMAIL_PASS=your_gmail_app_password_here
```

#### **2.5 Download YOLO Models**
```bash
# The YOLO models (yolo11m.pt, yolo11n.pt) should be downloaded automatically
# If not, download from: https://github.com/ultralytics/ultralytics
```

#### **2.6 Start Flask Server**
```bash
python flask_app.py
```
The backend will be available at `http://localhost:5000`

### **Step 3: Frontend Setup (Next.js Application)**

#### **3.1 Navigate to Frontend Directory**
```bash
cd ../stones-web
```

#### **3.2 Install Node.js Dependencies**
```bash
npm install
```

#### **3.3 Configure Environment Variables**
Create a `.env.local` file in the `stones-web` directory:
```bash
# Firebase Client (exposed to browser)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (server only)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"

# Flask API URL
FLASK_API_URL=http://localhost:5000

# Gmail Configuration
GMAIL_PASS=your_gmail_app_password_here
```

#### **3.4 Start Development Server**
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`

### **Step 4: Firebase Setup**

#### **4.1 Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password
4. Generate service account credentials

#### **4.2 Configure Firebase Authentication**
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password provider
3. Add authorized domains (localhost:3000 for development)

#### **4.3 Download Service Account Key**
1. Go to Project Settings > Service Accounts
2. Generate new private key
3. Add the credentials to your `.env.local` file

---

## 🎯 Usage Guide

### **For Patients:**

1. **Registration/Login**
   - Visit `http://localhost:3000`
   - Create account or login with existing credentials
   - Complete profile information

2. **Upload Medical Scan**
   - Navigate to upload page
   - Select CT scan, X-ray, or ultrasound image
   - Upload supported formats (JPEG, PNG)
   - Wait for AI analysis

3. **View Results**
   - Review detection results with visual annotations
   - Download comprehensive PDF report
   - Access treatment recommendations

4. **Consult AI Chatbot**
   - Ask questions about scan results
   - Get personalized health advice
   - Receive treatment suggestions

5. **Doctor Consultation**
   - Access specialist directory
   - Send reports directly to doctors
   - Schedule appointments

### **For Healthcare Providers:**

1. **Doctor Login**
   - Access specialized doctor portal
   - Review patient submissions
   - Generate professional reports

2. **Patient Management**
   - View patient scan history
   - Track treatment progress
   - Collaborate with colleagues

---

## 🧪 Testing

### **Backend API Testing**
```bash
cd stone

# Test basic API functionality
python test_api.py

# Test improved API features
python test_improved_api.py

# Test complete workflow
node test_complete_flow.js

# Test data flow
node test_data_flow.js
```

### **Frontend Testing**
```bash
cd stones-web

# Run ESLint for code quality
npm run lint

# Build production version
npm run build

# Start production server
npm start
```

---

## 📊 API Documentation

### **Backend Endpoints (Flask - Port 5000)**

#### **POST /predict**
- **Purpose**: Analyze uploaded medical scan for kidney stones
- **Input**: Multipart form data with image file
- **Output**: JSON with detection results, confidence scores, locations
- **Example**:
```bash
curl -X POST -F "image=@scan.jpg" http://localhost:5000/predict
```

#### **POST /chatbot**
- **Purpose**: Get AI health advice based on scan results
- **Input**: JSON with message and context
- **Output**: Personalized health recommendations
- **Example**:
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"message":"What should I do about my kidney stones?","context":{"stones":[...]}}' \
     http://localhost:5000/chatbot
```

#### **GET /doctors**
- **Purpose**: Retrieve list of specialist doctors
- **Output**: JSON array of doctor information
- **Example**:
```bash
curl http://localhost:5000/doctors
```

### **Frontend API Routes (Next.js - Port 3000)**

#### **POST /api/detect**
- **Purpose**: Proxy image detection to Flask backend
- **Input**: Multipart form data with image
- **Output**: Processed detection results

#### **POST /api/auth/register**
- **Purpose**: User registration via Firebase
- **Input**: Email, password, user details
- **Output**: Authentication tokens

#### **POST /api/auth/login**
- **Purpose**: User authentication
- **Input**: Email and password
- **Output**: Session tokens

---

## 🔒 Security Considerations

### **Data Protection**
- All medical data is encrypted in transit and at rest
- HIPAA compliance considerations implemented
- Secure file upload with validation
- Session-based authentication

### **API Security**
- CORS configuration for cross-origin requests
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Error handling without information disclosure

### **Environment Security**
- Sensitive credentials stored in environment variables
- Production-ready secret management
- Regular security dependency updates
- Secure random key generation

---

## 🚀 Deployment

### **Production Deployment Options**

#### **Backend Deployment (Flask)**
- **Heroku**: Easy Python app deployment
- **Google Cloud Run**: Containerized deployment
- **AWS EC2**: Full server control
- **DigitalOcean**: Cost-effective hosting

#### **Frontend Deployment (Next.js)**
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment
- **AWS Amplify**: Full-stack deployment
- **Google Cloud Platform**: Enterprise solutions

#### **Database & Storage**
- **Firebase**: Real-time database and authentication
- **AWS S3**: Medical image storage
- **Google Cloud Storage**: Secure file storage
- **MongoDB Atlas**: Document database

---

## 🤝 Contributing

We welcome contributions to improve StoneSense! Here's how you can help:

### **Development Setup**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style and conventions
- Add comprehensive tests for new features
- Update documentation for API changes
- Ensure HIPAA compliance for medical features
- Test thoroughly before submitting

---

## 📞 Support & Contact

### **Technical Support**
- **Issues**: [GitHub Issues](https://github.com/yourusername/stone-sense/issues)
- **Documentation**: This README and inline code comments
- **Community**: [Discussions](https://github.com/yourusername/stone-sense/discussions)

### **Medical Disclaimer**
⚠️ **Important**: StoneSense is designed as a diagnostic aid and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Hackathon Project

<div align="center">
  <h3>🎉 Developed during NeuraX Hackathon 2025</h3>
  <h4>🏫 CMR Technical Campus (CMRTC)</h4>
  
  **StoneSense** was conceived, designed, and developed during the prestigious **NeuraX Hackathon 2025** held at **CMR Technical Campus**. This project represents the innovative spirit and technical excellence fostered at CMRTC, combining cutting-edge AI technology with practical healthcare solutions.

  ### **Hackathon Achievements**
  - ✅ **Complete Full-Stack Solution**: End-to-end medical imaging platform
  - ✅ **AI Integration**: Advanced YOLO v11 implementation
  - ✅ **User Experience**: Intuitive interface for patients and doctors
  - ✅ **Real-World Impact**: Practical healthcare application
  - ✅ **Technical Innovation**: Modern web technologies and best practices

  ### **Team Recognition**
  This project showcases the collaborative effort and technical prowess of the development team, representing the high standards of innovation encouraged at CMR Technical Campus during the NeuraX Hackathon.

  **Institution**: [CMR Technical Campus](https://cmrtc.ac.in)  
  **Event**: NeuraX Hackathon 2025  
  **Category**: Healthcare AI Solutions  
</div>

---

## 🙏 Acknowledgments

- **CMR Technical Campus** for hosting the NeuraX Hackathon 2025
- **Ultralytics** for the YOLO v11 architecture
- **OpenAI** for language model integration
- **Firebase** for authentication infrastructure
- **Next.js & React** for modern web development
- **Flask** for backend framework
- **The Open Source Community** for invaluable tools and libraries

---

<div align="center">
  <h3>🌟 Star this repository if you found it helpful! 🌟</h3>
  <p>Made with ❤️ during NeuraX Hackathon 2025 at CMR Technical Campus</p>
</div>
