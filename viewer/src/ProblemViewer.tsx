// viewer/src/ProblemViewer.tsx

import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

// This is a special type definition that tells TypeScript
// what a dynamically imported React component looks like.
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

const ProblemViewer: React.FC = () => {
  // This hook from react-router-dom reads the dynamic parts of the URL.
  // If the URL is "/view/0001_two-sum", the 'slug' will be "0001_two-sum".
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <div>Error: No problem slug was found in the URL.</div>;
  }

  // This is the magic!
  // `React.lazy` combined with a dynamic import() tells React to only load this file
  // when it's needed. The `@problems` alias we created in the Vite config is used here
  // to construct the correct path to the problem's UI file.
  const ProblemComponent = React.lazy(() => 
    import(`@problems/${slug}/ui/ProblemViewTemplate.tsx`)
  ) as LazyComponent;

  return (
    <div>
      {/* A <Suspense> boundary is required when using React.lazy. */}
      {/* It lets us show a fallback UI (like a loading message) */}
      {/* while React is fetching the component in the background. */}
      <Suspense fallback={
        <div style={{
          display: 'grid',
          placeContent: 'center',
          minHeight: '100vh',
          fontFamily: 'sans-serif',
          fontSize: '2rem',
          color: '#333'
        }}>
          <h1>Loading Problem...</h1>
        </div>
      }>
        <ProblemComponent />
      </Suspense>
    </div>
  );
};

export default ProblemViewer;