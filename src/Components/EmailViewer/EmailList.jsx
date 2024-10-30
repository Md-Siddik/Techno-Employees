import React, { useState } from 'react';

const EmailList = ({ emails = [], fetchEmailContent, selectedEmail }) => {
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const handleViewContent = async (emailId) => {
    if (selectedEmailId === emailId) {
      setSelectedEmailId(null); // Close the email if it's already open
    } else {
      setIsLoading(true); // Start loading state
      setSelectedEmailId(emailId);
      await fetchEmailContent(emailId); // Fetch the content
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="p-8 bg-gray-900 h-fit text-gray-100">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-500">Email List</h2>
      <ul className="space-y-6 max-w-2xl mx-auto">
        {emails.length > 0 ? (
          emails.map((email) => (
            <li key={email.id} className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-5">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => handleViewContent(email.id)}>
                <div>
                  <h3 className="text-lg font-bold text-indigo-500">From: {email.payload.headers.find(header => header.name === 'From')?.value}</h3>
                  <p className="font-semibold text-indigo-300 hover:text-indigo-400 transition-colors duration-150 cursor-pointer">
                    Subject: {email.payload.headers.find(header => header.name === 'Subject')?.value || 'No Subject'}
                  </p>
                </div>
              </div>
              {selectedEmailId === email.id && (
                <div className="mt-4 bg-gray-800 p-4 rounded-md shadow-inner border-l-4 border-indigo-500">
                  {isLoading ? (
                    <p className="text-gray-400">Loading...</p>
                  ) : (
                    <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {decodeHtml(selectedEmail.snippet)}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">No emails to show.</p>
        )}
      </ul>
    </div>
  );
};

export default EmailList;
