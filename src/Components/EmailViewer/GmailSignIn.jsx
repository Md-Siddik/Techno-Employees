// GmailSignIn.js
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GmailSignIn = ({ fetchEmails }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login successful. Access Token:", tokenResponse.access_token);
      fetchEmails(tokenResponse.access_token); // Fetch emails after successful login
    },
    onError: () => console.log('Login Failed'),
    scope: 'https://www.googleapis.com/auth/gmail.modify', // Make sure the scope is set correctly
  });

  return <button className='text-2xl' onClick={() => login()}>Sign in with Google</button>;
};

export default GmailSignIn;
