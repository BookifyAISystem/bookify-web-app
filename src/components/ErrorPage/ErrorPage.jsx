import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.scss'; // Import the CSS file

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="home-button">
        Back to Homepage
      </Link>
    </div>
  );
};

export default ErrorPage;