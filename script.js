// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyAGrxDE5Y2iRJUDcDH3pN3rQ_nMVXhs9bM",
  authDomain: "biography-site.firebaseapp.com",
  projectId: "biography-site",
  storageBucket: "biography-site.firebasestorage.app",
  messagingSenderId: "146909873713",
  appId: "1:146909873713:web:17c3766354d1491ed43710"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SIGN UP
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      document.getElementById('signup-message').textContent =
        'Verification email sent. Please check your inbox.';
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          if (userCredential.user.emailVerified) {
            window.location.href = 'welcome.html';
          } else {
            document.getElementById('signup-message').textContent =
              'Account exists but not verified. Please verify your email.';
          }
        } catch (signinError) {
          document.getElementById('signup-message').textContent = signinError.message;
        }
      } else {
        document.getElementById('signup-message').textContent = error.message;
      }
    }
  });
}

// SIGN IN
const signinForm = document.getElementById('signin-form');
if (signinForm) {
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        window.location.href = 'welcome.html';
      } else {
        document.getElementById('signin-message').textContent =
          'Please verify your email before signing in.';
      }
    } catch (error) {
      document.getElementById('signin-message').textContent = error.message;
    }
  });
}

// WELCOME PAGE
if (window.location.pathname.includes('welcome.html')) {
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      document.getElementById('user-email').textContent = `You are signed in as ${user.email}`;
    } else {
      window.location.href = 'signin.html';
    }
  });

  // profile upload logic
  const profileUpload = document.getElementById('profile-upload');
  const profilePreview = document.getElementById('profile-preview');

  profileUpload?.addEventListener('change', () => {
    const file = profileUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePreview.src = e.target.result;
        localStorage.setItem("profileImage", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  const savedProfile = localStorage.getItem("profileImage");
  if (savedProfile) profilePreview.src = savedProfile;

  // headline & summary logic
  const headlineText = document.getElementById('headline-text');
  const summaryText = document.getElementById('summary-text');
  const headlineBtn = document.getElementById('headline-edit-btn');
  const summaryBtn = document.getElementById('summary-edit-btn');

  // load saved
  headlineText.value = localStorage.getItem('headline') || 'Click Edit to change your headline';
  summaryText.value = localStorage.getItem('summary') || 'Click Edit to change your summary';

  headlineBtn.addEventListener('click', () => {
    if (headlineText.disabled) {
      headlineText.disabled = false;
      headlineBtn.textContent = 'Save';
    } else {
      headlineText.disabled = true;
      headlineBtn.textContent = 'Edit';
      localStorage.setItem('headline', headlineText.value);
    }
  });

  summaryBtn.addEventListener('click', () => {
    if (summaryText.disabled) {
      summaryText.disabled = false;
      summaryBtn.textContent = 'Save';
    } else {
      summaryText.disabled = true;
      summaryBtn.textContent = 'Edit';
      localStorage.setItem('summary', summaryText.value);
    }
  });

  // sign out
  const signoutBtn = document.getElementById('signout-btn');
  signoutBtn?.addEventListener('click', () => {
    signOut(auth).then(() => {
      window.location.href = 'signin.html';
    });
  });
}
