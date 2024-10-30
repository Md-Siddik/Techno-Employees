import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import GmailSignIn from './GmailSignIn';
import EmailList from './EmailList';

const EmailViewer = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // New state for the access token

  const fetchEmails = async (token) => {
    setAccessToken(token); // Store the token to pass it down
    try {
      const response = await axios.get(
        'https://www.googleapis.com/gmail/v1/users/me/messages',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { maxResults: 10 },
        }
      );

      const messageIds = response.data.messages;

      const emailDetails = await Promise.all(
        messageIds.map(async (message) => {
          const messageResponse = await axios.get(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return messageResponse.data;
        })
      );

      setEmails(emailDetails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const fetchEmailContent = async (emailId) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setSelectedEmail(response.data);
    } catch (error) {
      console.error('Error fetching email content:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="469961376322-8q920q3e61q07bmg35k07r9ak269ehgt.apps.googleusercontent.com">
      <div>
        <GmailSignIn fetchEmails={fetchEmails} />
        <EmailList emails={emails} fetchEmailContent={fetchEmailContent} selectedEmail={selectedEmail} accessToken={accessToken} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default EmailViewer;
