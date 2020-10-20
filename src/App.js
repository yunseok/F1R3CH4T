import React, { useEffect, useRef, useState } from 'react';

import styled from "styled-components"
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

  const Header = styled.header`
    display: flex;
    justify-content: space-between;
  `

  const Title = styled.span`
    font-size: 32px;
  `

  const InfoPanel = styled.div`
    display: flex;
    margin-top: auto;
    margin-bottom: auto;

    span {
      margin-right: 12px;
    }
  `

  return (
    <div className="App">
      <Header>
        <Title>F1R3CH4T</Title>
        <InfoPanel>
          <LoggedInAs />
          <SignOut />
        </InfoPanel>
      </Header>

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

  const LogInButton = styled.span`
    cursor: pointer;
  `

  return (
    <LogInButton onClick={signInWithGoogle}>[LOG IN]</LogInButton>
  )
}

function SignOut() {
  const LogOutButton = styled.span`
    cursor: pointer;
  `

  return auth.currentUser && (
    <LogOutButton onClick={() => auth.signOut()}>[DISCONNECT]</LogOutButton>
  )
}

function LoggedInAs() {
  const DisplayUsername = styled.span`
  `

  return auth.currentUser && (
    <DisplayUsername>
      [LOGGED IN AS { auth.currentUser.displayName.replace(/ .*/,'') }]
    </DisplayUsername>
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

  const StartSpan = styled.span`
    margin-right: 4px;
  `

  return (<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>
      <input
        value={formValue} 
        placeholder="ENTER YOUR MESSAGE..."
        onChange={(e) => setFormValue(e.target.value)} 
      />
      <button type="submit" disabled={!formValue}>SEND</button>
    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, userName, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  const Message = styled.p`
    margin: 0;
  `

  return (<>
    <div className={`message ${messageClass}`}>
      <Message>{userName.replace(/ .*/,'')}: {text}</Message>
    </div>
  </>)
}

export default App;
