import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Life in the UK Test</h1>
          <p style={styles.subtitle}>
            Prepare for your British citizenship test with comprehensive study materials and practice tests
          </p>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📚</div>
            <h3>Study Materials</h3>
            <p>Comprehensive chapters covering British history, culture, and values</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>✍️</div>
            <h3>Mock Tests</h3>
            <p>Practice with realistic test questions and track your progress</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your performance and see your improvement over time</p>
          </div>
        </div>

        <button onClick={login} style={styles.loginButton}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            style={styles.googleIcon}
          />
          Sign in with Google
        </button>

        <div style={styles.info}>
          <h2>About the Test</h2>
          <p>
            The Life in the UK test is a computer-based test constituting one of the requirements for 
            anyone seeking Indefinite Leave to Remain in the UK or naturalisation as a British citizen.
          </p>
          <ul style={styles.list}>
            <li>24 multiple choice questions</li>
            <li>45 minutes to complete</li>
            <li>75% pass mark (18 correct answers)</li>
            <li>Questions based on the official handbook</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  hero: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '60px',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.3rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '60px',
  },
  feature: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    margin: '0 auto',
    padding: '15px 40px',
    fontSize: '1.1rem',
    background: 'white',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  },
  googleIcon: {
    width: '24px',
    height: '24px',
  },
  info: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    marginTop: '60px',
  },
  list: {
    lineHeight: '2',
    fontSize: '1.1rem',
  },
};

export default Home;
