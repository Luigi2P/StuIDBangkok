"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaSmile } from 'react-icons/fa';

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{ margin: '30px 0 10px 0', fontSize:'16px', fontWeight: 'bold' }}>
          Welcome, {session?.user?.name?.slice(0, 10)}!
        </div>
        <button
          onClick={() => signOut()}
          style={{
            backgroundColor: '#FF4040',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px'
          }}
        >
          Sign out
        </button>
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{ margin: '30px 0 10px 0',  fontSize:'16px', fontWeight: 'bold' }}>
          Sorry, Not signed in!
        </div>
        <button
          onClick={() => signIn()}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px'
          }}
        >
          Sign in
        </button>
      </div>
    );
  }
};
