const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Firebase Admin Setup
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}
);
// Add this after admin.initializeApp()
console.log('Firebase Admin initialized:', admin.app().name);

// Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Firebase Authentication
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    // Verify and get user data
    const decodedToken = await admin.auth().verifyIdToken(response.data.idToken);
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();

    // Set cookie
    // In all cookie-setting endpoints (/login, /google/callback, /signup)
        res.cookie('token', tokenValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600 * 1000,
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : undefined
        });

    res.json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      },
      isAdmin: userDoc.data()?.isAdmin || false
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/auth/google', (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=email profile`;
  res.redirect(redirectUrl);
});

app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    // Get Google user info
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
    });

    // Firebase custom token creation
    const uid = `google:${userInfo.data.id}`;
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const customToken = await admin.auth().createCustomToken(uid);
    const idToken = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
      { token: customToken, returnSecureToken: true }
    );


    if (!userDoc.exists) {
        await admin.firestore().collection('users').doc(uid).set({
            email: userInfo.data.email,
            fullName: userInfo.data.name,
            profileComplete: false,
            isAdmin: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    // Set cookie and redirect
    res.cookie('token', idToken.data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000
    });
    
    const redirectPath = userDoc.exists && userDoc.data().profileComplete 
    ? '/home' 
    : '/complete-profile';
  res.redirect(process.env.CLIENT_URL + redirectPath);
  } catch (error) {
    res.redirect(process.env.CLIENT_URL + '/login?error=google_auth_failed');
  }
});

app.get('/api/auth/validate', async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    res.json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name
      },
      isAdmin: userDoc.data()?.isAdmin || false
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});


app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, fullName, mobileNumber, dateOfBirth } = req.body;
  
      // Create Firebase user
      const userRecord = await admin.auth().createUser({ 
        email, 
        password,
        displayName: fullName
      });
  
      // Create Firestore document
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        fullName,
        email,
        mobileNumber,
        dateOfBirth,
        profileComplete: true,
        isAdmin: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
  
      // Create session token
      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      const idToken = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
        { token: customToken, returnSecureToken: true }
      );
      
      res.cookie('token', idToken.data.idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 * 1000
      });
  
      res.status(201).json({
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: fullName
        },
        isAdmin: false
      });
    } catch (error) {
      console.error('Signup Error:', error);
    const errorCode = error.code || 'unknown';
    const errorMessage = error.message || 'Registration failed';
    
    res.status(400).json({ 
      code: errorCode.replace('auth/', ''),
      message: errorMessage 
    });
  }
  });

  app.post('/api/auth/complete-profile', async (req, res) => {
    try {
      const token = req.cookies.token;
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      await admin.firestore().collection('users').doc(decodedToken.uid).update({
        mobileNumber: req.body.mobileNumber,
        dateOfBirth: req.body.dateOfBirth,
        profileComplete: true
      });
  
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: 'Profile update failed' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));