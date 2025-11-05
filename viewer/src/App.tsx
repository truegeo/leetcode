// viewer/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProblemViewer from './ProblemViewer';

// We'll create a simple component for the home page.
const HomePage = () => (
  <div style={{ padding: '2rem 4rem', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
    <h1>Coding Problem Viewer</h1>
    <p>This is the central application for viewing your dynamically generated problem UIs.</p>
    <p>
      To view a problem, construct a URL with its folder name (slug). For example, to view the "Two Sum" problem, you would navigate to:
      <br />
      <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
        /view/0001_two-sum
      </code>
    </p>
    <hr style={{ margin: '2rem 0' }} />
    <h3>Quick Links (Examples)</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li>
        <Link to="/view/0001_two-sum" style={{ color: '#007bff' }}>
          View Problem #1: Two Sum
        </Link>
      </li>
      {/* You could add more links here as you solve more problems */}
    </ul>
  </div>
);

// This is the main App component that defines the routes.
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* This route tells the app: when the URL looks like "/view/SOMETHING", */}
        {/* render the <ProblemViewer /> component. The ":slug" part is a dynamic */}
        {/* parameter that will be passed to our component. */}
        <Route path="/view/:slug" element={<ProblemViewer />} />

        {/* This is the route for the main landing page. */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;