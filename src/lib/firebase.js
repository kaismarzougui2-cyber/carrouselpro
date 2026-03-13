// src/lib/firebase.js
// ─────────────────────────────────────────────────────────────
// Variables à définir dans Vercel > Settings > Environment Variables :
//   VITE_FIREBASE_API_KEY
//   VITE_FIREBASE_AUTH_DOMAIN
//   VITE_FIREBASE_PROJECT_ID
//   VITE_FIREBASE_STORAGE_BUCKET
//   VITE_FIREBASE_MESSAGING_SENDER_ID
//   VITE_FIREBASE_APP_ID
//
// Règles Firestore à configurer dans Firebase Console :
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /users/{uid} { allow read, write: if request.auth.uid == uid; }
//       match /carousels/{id} {
//         allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
//         allow create: if request.auth != null;
//       }
//       match /templates/{id} {
//         allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
//         allow create: if request.auth != null;
//       }
//     }
//   }
// ─────────────────────────────────────────────────────────────

import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged as fbOnAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  serverTimestamp,
} from 'firebase/firestore'

// ─── Init ─────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)

// Normalise le user Firebase → ajoute user.id = user.uid pour compatibilité
export const normalizeUser = (u) => u ? {
  uid:         u.uid,
  id:          u.uid,       // alias pour le reste du code
  email:       u.email,
  displayName: u.displayName,
  photoURL:    u.photoURL,
} : null

export { fbOnAuthStateChanged as onAuthStateChanged }

// ─── AUTH ─────────────────────────────────────────────────────

export const signInWithEmail = async (email, pass) => {
  try {
    await signInWithEmailAndPassword(auth, email, pass)
    return { error: null }
  } catch (e) { return { error: e } }
}

export const signUpWithEmail = async (email, pass) => {
  try {
    await createUserWithEmailAndPassword(auth, email, pass)
    return { error: null }
  } catch (e) { return { error: e } }
}

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider())
    return { error: null }
  } catch (e) { return { error: e } }
}

export const signOut = () => fbSignOut(auth)

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (e) { return { error: e } }
}

// ─── PROFIL ───────────────────────────────────────────────────

export const getProfile = async (userId) => {
  const ref  = doc(db, 'users', userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    const defaults = { is_premium: false, avatar_url: null, created_at: serverTimestamp() }
    await setDoc(ref, defaults)
    return defaults
  }
  return { id: userId, ...snap.data() }
}

// ─── CAROUSELS ────────────────────────────────────────────────

export const saveCarousel = async (userId, carousel) => {
  const { id, title, data, platform, slide_count, thumbnail } = carousel
  const payload = { title, data, platform, slide_count: slide_count ?? 0, thumbnail: thumbnail ?? null, user_id: userId, updated_at: serverTimestamp() }
  if (id) {
    await updateDoc(doc(db, 'carousels', id), payload)
    return { id, ...payload }
  } else {
    const ref = await addDoc(collection(db, 'carousels'), payload)
    return { id: ref.id, ...payload }
  }
}

export const getUserCarousels = async (userId) => {
  const q    = query(collection(db, 'carousels'), where('user_id', '==', userId), orderBy('updated_at', 'desc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const deleteCarousel = async (_userId, carouselId) => {
  await deleteDoc(doc(db, 'carousels', carouselId))
}

export const countUserCarousels = async (userId) => {
  const q    = query(collection(db, 'carousels'), where('user_id', '==', userId))
  const snap = await getCountFromServer(q)
  return snap.data().count
}

// ─── TEMPLATES ───────────────────────────────────────────────

export const saveTemplate = async (userId, template) => {
  const { id, name, data } = template
  if (id) {
    await updateDoc(doc(db, 'templates', id), { name, data })
    return { id, name, data }
  } else {
    const ref = await addDoc(collection(db, 'templates'), {
      user_id: userId, name, data, created_at: serverTimestamp(),
    })
    return { id: ref.id, name, data }
  }
}

export const getUserTemplates = async (userId) => {
  const q    = query(collection(db, 'templates'), where('user_id', '==', userId), orderBy('created_at', 'desc'), limit(20))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const deleteTemplate = async (_userId, templateId) => {
  await deleteDoc(doc(db, 'templates', templateId))
}
