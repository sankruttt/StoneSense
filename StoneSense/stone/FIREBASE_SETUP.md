# Firebase Authentication Setup Guide

## Complete Setup Instructions

Firebase authentication with Google OAuth and email/password has been integrated into your StoneSense app!

### 🔥 Firebase Console Setup (Required Before Testing)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Add project" or select existing project

2. **Create/Select Project**
   - Name: "StoneSense" (or your preferred name)
   - Follow the setup wizard

3. **Enable Authentication**
   - In Firebase Console, go to **Build → Authentication**
   - Click "Get started"
   - Enable **Email/Password** sign-in method
   - Enable **Google** sign-in method
   - For Google: You'll get a Web Client ID automatically

4. **Create Firestore Database**
   - Go to **Build → Firestore Database**
   - Click "Create database"
   - Choose **Start in test mode** (for development)
   - Select a region close to you
   - Click "Enable"

5. **Get Frontend Configuration**
   - Go to **Project Settings** (gear icon)
   - Scroll to "Your apps"
   - Click "Web" icon (</>) to add a web app
   - Register app name: "StoneSense Web"
   - Copy the `firebaseConfig` object

6. **Update Frontend Config**
   - Open: `frontend/src/firebase.js`
   - Replace the placeholder config with your actual config:
   
   ```javascript
   const firebaseConfig = {
    apiKey: "AIzaSyDLczZpkk7KL38OLMwN63_VcjCORn3CD7Q",
    authDomain: "stonesense-93a14.firebaseapp.com",
    projectId: "stonesense-93a14",
    storageBucket: "stonesense-93a14.firebasestorage.app",
    messagingSenderId: "375330200156",
    appId: "1:375330200156:web:100a1f4eca699f7612e499",
   };
   ```

7. **Setup Backend Service Account**
   - In Firebase Console, go to **Project Settings → Service accounts**
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccountKey.json` in the `stone` directory
   
   **Update app.py to use it:**
   ```python
   # In app.py, update the Firebase initialization:
   cred = credentials.Certificate('serviceAccountKey.json')
   firebase_admin.initialize_app(cred)
   ```

8. **Security Rules (Production)**
   - Go to **Firestore → Rules**
   - Update rules for production:
   
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### 📦 What's Been Implemented

#### Frontend Components:
- ✅ `Login.js` - Email/password login + Google OAuth
- ✅ `Signup.js` - Email/password registration + Google OAuth
- ✅ `Profile.js` - Update age, gender, doctor name
- ✅ `AuthContext.js` - Authentication state management
- ✅ `firebase.js` - Firebase configuration
- ✅ Updated `App.js` - Protected routes, user menu, logout

#### Backend Changes:
- ✅ Firebase Admin SDK integration
- ✅ `@firebase_required` decorator for protected endpoints
- ✅ Token verification on `/api/detect`, `/api/generate-pdf`, `/api/chat`
- ✅ Automatic patient info from Firebase user profile

#### User Flow:
1. **First Visit** → Login/Signup screen
2. **Signup** → Creates user in Firebase Auth + Firestore profile
3. **Login** → Authenticates and loads profile
4. **Profile Page** → User can add/update age, gender, doctor
5. **Upload Scan** → Patient info auto-filled from profile
6. **PDF Report** → Uses authenticated user's information
7. **Chatbot** → Requires authentication
8. **Logout** → Clears session, returns to login

### 🚀 Testing Steps

1. **Start React App:**
   ```bash
   cd frontend
   npm start
   ```

2. **Start Flask Backend:**
   ```bash
   cd ..
   python3 app.py
   ```

3. **Test Signup:**
   - Open http://localhost:3000
   - Click "Sign up"
   - Enter name, email, password
   - Or click "Sign up with Google"

4. **Complete Profile:**
   - Click "Profile" button
   - Add age, gender, doctor name
   - Click "Update Profile"

5. **Test Detection:**
   - Upload a kidney stone scan image
   - Click "Analyze Scan"
   - Patient info will be auto-filled from your profile!

6. **Test PDF & Chatbot:**
   - Download PDF report (should include your profile info)
   - Open chatbot and ask questions

### 🔐 Security Features

- ✅ Firebase ID tokens for authentication
- ✅ Backend verifies every API request
- ✅ User data stored in Firestore
- ✅ Secure password hashing by Firebase
- ✅ Google OAuth integration
- ✅ Auto-generated unique patient IDs

### 📝 User Data Structure (Firestore)

```javascript
users/{uid}: {
  name: "John Doe",
  email: "john@example.com",
  patientId: "P1739589123",
  age: 45,
  gender: "Male",
  doctorName: "Dr. Smith",
  createdAt: "2026-02-15T10:30:00Z"
}
```

### ⚠️ Important Notes

1. **Service Account:** Backend needs `serviceAccountKey.json` for token verification
2. **Firestore Rules:** Set to test mode initially, update for production
3. **Google OAuth:** Enable in Firebase Console before testing
4. **Environment:** All authentication happens through Firebase (no local database needed)

### 🐛 Troubleshooting

**"Firebase Admin initialization error":**
- Add serviceAccountKey.json file
- Update app.py initialization code

**"Authorization token required":**
- Make sure frontend is sending Authorization header
- Check if user is logged in

**"Invalid or expired token":**
- Try logging out and logging back in
- Check Firebase Console for auth status

**Google Sign-in not working:**
- Verify Google OAuth is enabled in Firebase Console
- Check authorized domains include localhost

### 📚 Additional Resources

- Firebase Auth Docs: https://firebase.google.com/docs/auth
- Firestore Docs: https://firebase.google.com/docs/firestore
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup

---

**Next Steps After Setup:**
1. Complete Firebase Console configuration
2. Update firebase.js with your config
3. Add serviceAccountKey.json for backend
4. Test complete signup → profile → scan flow
5. Enable production Firestore security rules

Happy coding! 🎉
