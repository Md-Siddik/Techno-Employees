import React, { useState, useEffect } from 'react';
import { google } from 'google-auth-library';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const API_KEY = 'YOUR_GOOGLE_API_KEY';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

const EmailViewer = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    window.gapi.load('client:auth2', initializeClient);
  }, []);

  const initializeClient = () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    }).then(() => {
      const authInstance = window.gapi.auth2.getAuthInstance();
      setIsSignedIn(authInstance.isSignedIn.get());
      authInstance.isSignedIn.listen(setIsSignedIn);
      if (authInstance.isSignedIn.get()) {
        fetchEmails();
      }
    });
  };

  const handleSignInClick = () => window.gapi.auth2.getAuthInstance().signIn();
  const handleSignOutClick = () => window.gapi.auth2.getAuthInstance().signOut();

  const fetchEmails = async () => {
    const response = await window.gapi.client.gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });
    const emailData = response.result.messages;
    const emailDetails = await Promise.all(
      emailData.map(async (msg) => {
        const message = await window.gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
        });
        const headers = message.result.payload.headers;
        const subject = headers.find(header => header.name === 'Subject')?.value;
        const from = headers.find(header => header.name === 'From')?.value;
        const date = headers.find(header => header.name === 'Date')?.value;
        return {
          id: msg.id,
          subject,
          from,
          date,
          snippet: message.result.snippet,
        };
      })
    );
    setEmails(emailDetails);
  };

  const fetchEmailContent = async (id) => {
    const response = await window.gapi.client.gmail.users.messages.get({
      userId: 'me',
      id,
    });
    setSelectedEmail(response.result);
  };

  return (
    <div className="email-viewer-container">
      <header>
        <h1>Email Viewer</h1>
        {isSignedIn ? (
          <button onClick={handleSignOutClick}>Sign Out</button>
        ) : (
          <button onClick={handleSignInClick}>Sign In with Google</button>
        )}
      </header>
      <main>
        <aside>
          <h2>Inbox</h2>
          <ul>
            {emails.map((email) => (
              <li
                key={email.id}
                onClick={() => fetchEmailContent(email.id)}
                className="email-list-item"
              >
                <h3>{email.subject}</h3>
                <p>From: {email.from}</p>
                <p>Date: {new Date(email.date).toLocaleDateString()}</p>
                <p>{email.snippet}</p>
              </li>
            ))}
          </ul>
        </aside>
        <section className="email-content">
          {selectedEmail ? (
            <>
              <h3>{selectedEmail.payload.headers.find(header => header.name === 'Subject').value}</h3>
              <p>{selectedEmail.payload.headers.find(header => header.name === 'From').value}</p>
              <p dangerouslySetInnerHTML={{ __html: atob(selectedEmail.payload.body.data.replace(/-/g, '+').replace(/_/g, '/')) }}></p>
            </>
          ) : (
            <p>Select an email to view</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default EmailViewer;