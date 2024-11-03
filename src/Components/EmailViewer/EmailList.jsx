import { useEffect, useState } from 'react';
import { FaReply, FaPaperPlane, FaFileInvoiceDollar, FaClock, FaForward, FaTrashAlt } from 'react-icons/fa';

const EmailList = ({ emails, fetchEmailContent }) => {
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
    <div className="w-full p-8 bg-gray-900 text-gray-100 mt-[30px]">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-500">Email List</h2>
      <ul className="space-y-6 max-w-2xl mx-auto">
        {emails.length > 0 ? (
          emails.map((email) => (
            <li key={email.id} className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-5">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => handleViewContent(email.id)}>
                <div>
                  <h3 className="text-lg font-bold text-indigo-500">From: {email.from}</h3>
                  <p className="font-semibold text-indigo-300 hover:text-indigo-400 transition-colors duration-150 cursor-pointer">
                    Subject: {email.subject}
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-gray-800 p-4 rounded-md shadow-inner border-l-4 border-indigo-500">
                <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {decodeHtml(email.snippet)}
                </p>
              </div>

              <div className="flex mt-4 justify-between">
                <div className="flex gap-4 text-sm text-gray-400">
                  <p>Date: {email.date}</p>
                  <p>Time: {email.time}</p>
                </div>
                <div>
                  <button className="text-gray-300 hover:text-indigo-500 transition-colors duration-200 px-2" title="Reply">
                    <FaReply size={20} />
                  </button>
                  <button className="text-gray-300 hover:text-indigo-500 transition-colors duration-200 px-2" title="Send Offer">
                    <FaPaperPlane size={20} />
                  </button>
                  <button className="text-gray-300 hover:text-indigo-500 transition-colors duration-200 px-2" title="Send Invoice">
                    <FaFileInvoiceDollar size={20} />
                  </button>
                  <button className="text-gray-300 hover:text-indigo-500 transition-colors duration-200 px-2" title="Add to Waiting">
                    <FaClock size={20} />
                  </button>
                  <button className="text-gray-300 hover:text-indigo-500 transition-colors duration-200 px-2" title="Forward">
                    <FaForward size={20} />
                  </button>
                  <button className="text-gray-300 hover:text-red-500 transition-colors duration-200 px-2" title="Delete">
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>
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
