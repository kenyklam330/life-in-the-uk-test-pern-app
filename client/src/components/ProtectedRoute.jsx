import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <>
        {/* Injecting keyframes since inline styles can't do animations */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    // replace={true} is good here! It prevents the user from 
    // hitting "back" and getting stuck in a redirect loop.
    return <Navigate to="/" replace />;
  }

  return children;
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'sans-serif',
    color: '#667eea',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f4f6',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
};

export default ProtectedRoute;