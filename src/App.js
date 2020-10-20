import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCbMhFmmjpZT-cLrLDkq8XqgCX14LlnrFA",
  authDomain: "firechat-a6bbf.firebaseapp.com",
  databaseURL: "https://firechat-a6bbf.firebaseio.com",
  projectId: "firechat-a6bbf",
  storageBucket: "firechat-a6bbf.appspot.com",
  messagingSenderId: "364236066851",
  appId: "1:364236066851:web:2b4df30794fad4ded9a196"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>🔥F1R3CH4T🔥</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {}
function ChatMessage() {}

export default App;
