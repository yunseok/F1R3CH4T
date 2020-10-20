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
        <h2>F1R3CH4T</h2>
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
    <span onClick={() => auth.signOut()}>[DISCONNECT]</span>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(25);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;
    const userName = auth.currentUser.displayName;

    await messagesRef.add({
      userName: userName,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    })

    setFormValue('');
  }

  const dummy = useRef();

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  return (<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>
      <input 
        value={formValue} 
        onChange={(e) => setFormValue(e.target.value)} 
      />
      <button type="submit" disabled={!formValue}>SEND</button>
    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, userName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <p>{userName.replace(/ .*/,'')} : {text}</p>
    </div>
  </>)
}

export default App;
