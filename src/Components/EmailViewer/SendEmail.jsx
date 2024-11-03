import { useState } from 'react';
import emailjs from 'emailjs-com';

function SendEmail() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    to_email: '',
    to_name: '', // New field for recipient's name
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // Automatically fill in the recipient's name based on the email
      if (name === 'to_email') {
        updatedData.to_name = getNameFromEmail(value);
      }

      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage('Sending...');

    emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        to_email: formData.to_email,
        to_name: formData.to_name, // Include recipient's name
      },
      import.meta.env.VITE_PUBLIC_KEY
    )
      .then((response) => {
        console.log('Email sent successfully:', response);
        setStatusMessage('Email sent successfully!');
        setFormData({ name: '', email: '', message: '', to_email: '', to_name: '' }); // Reset form
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setStatusMessage('Failed to send email. Please try again.');
      });
  };

  const getNameFromEmail = (email) => {
    const namePart = email.split('@')[0]; // Get the part before '@'
    
    // Replace '.' with spaces, remove any digits, and capitalize the first letters
    const formattedName = namePart
      .replace(/\d+/g, '') // Remove digits
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
      .trim(); // Remove any leading/trailing spaces

    return formattedName;
  };

  return (
    <div className='w-full max-w-xl mx-auto'>
      <form onSubmit={handleSubmit} className="w-full p-8 rounded-lg shadow-lg flex flex-col border border-gray-300 backdrop-filter backdrop-blur-sm bg-white/10">
        <h2 className="text-3xl font-semibold text-center mb-6 text-white">Contact Us</h2>
        <p className="text-gray-600 text-center mb-8 text-white">Feel free to reach out with any questions or feedback!</p>

        <label className='mb-1 text-white' htmlFor="name">Your Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-2 mb-4 w-full text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-500 transition duration-200"
        />

        <label className='mb-1 text-white' htmlFor="email">Your Email</label>
        <input
          type="email"
          name="email"
          placeholder="example@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-2 mb-4 w-full text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-500 transition duration-200"
        />

        <label className='mb-1 text-white' htmlFor="to_email">Recipient's Email</label>
        <input
          type="email"
          name="to_email"
          placeholder="recipient@example.com"
          value={formData.to_email}
          onChange={handleChange}
          required
          className="px-4 py-2 mb-4 w-full text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-500 transition duration-200"
        />

        <label className='mb-1 text-white' htmlFor="to_name">Recipient's Name</label>
        <input
          type="text"
          name="to_name"
          value={formData.to_name}
          readOnly
          className="px-4 py-2 mb-4 w-full text-gray-800 border border-gray-300 rounded-lg focus:outline-none bg-gray-200"
        />

        <label className='mb-1 text-white' htmlFor="message">Your Message</label>
        <textarea
          name="message"
          placeholder="Type your message here..."
          value={formData.message}
          onChange={handleChange}
          required
          className="px-4 py-2 mb-6 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-500 transition duration-200 h-36 resize-none"
        ></textarea>

        {statusMessage && (
          <p className={`text-center mb-4 ${statusMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {statusMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Send Email
        </button>
      </form>
    </div>
  );
}

export default SendEmail;
