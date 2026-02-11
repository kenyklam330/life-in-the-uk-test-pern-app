import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, getChapters } from '../services/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, chaptersRes] = await Promise.all([
        getUserStats(),
        getChapters(),
      ]);
      setStats(statsRes.data);
      setChapters(chaptersRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const completionPercentage = stats?.chapters?.total_chapters 
    ? Math.round((stats.chapters.completed_chapters / stats.chapters.total_chapters) * 100)
    : 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Life in the UK Test</h1>
          <p style={styles.welcome}>Welcome, {user?.name}!</p>
        </div>
        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      <div style={styles.content}>
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statValue}>{completionPercentage}%</h3>
            <p style={styles.statLabel}>Course Completion</p>
            <p style={styles.statDetail}>
              {stats?.chapters?.completed_chapters || 0} / {stats?.chapters?.total_chapters || 0} chapters
            </p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statValue}>{stats?.tests?.total_tests || 0}</h3>
            <p style={styles.statLabel}>Tests Taken</p>
            <p style={styles.statDetail}>
              {stats?.tests?.passed_tests || 0} passed
            </p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statValue}>
              {stats?.tests?.average_score ? `${stats.tests.average_score}%` : 'N/A'}
            </h3>
            <p style={styles.statLabel}>Average Score</p>
            <p style={styles.statDetail}>
              Best: {stats?.tests?.best_score ? `${stats.tests.best_score}%` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actions}>
          <button 
            onClick={() => navigate('/test')} 
            style={{...styles.actionButton, ...styles.primaryButton}}
          >
            📝 Take Mock Test
          </button>
          <button 
            onClick={() => navigate('/study')} 
            style={styles.actionButton}
          >
            📚 Study Materials
          </button>
          <button 
            onClick={() => navigate('/history')} 
            style={styles.actionButton}
          >
            📊 Test History
          </button>
        </div>

        {/* Chapters Progress */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Progress</h2>
          <div style={styles.chaptersList}>
            {chapters.map((chapter) => (
              <div 
                key={chapter.id} 
                style={styles.chapterCard}
                onClick={() => navigate(`/study/${chapter.id}`)}
              >
                <div style={styles.chapterHeader}>
                  <h3 style={styles.chapterTitle}>{chapter.title}</h3>
                  {chapter.completed && (
                    <span style={styles.completedBadge}>✓ Completed</span>
                  )}
                </div>
                <p style={styles.chapterDesc}>{chapter.description}</p>
                {chapter.last_accessed && (
                  <p style={styles.lastAccessed}>
                    Last accessed: {new Date(chapter.last_accessed).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        {stats?.recentTests && stats.recentTests.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Tests</h2>
            <div style={styles.testsList}>
              {stats.recentTests.map((test) => (
                <div 
                  key={test.id} 
                  style={styles.testCard}
                  onClick={() => navigate(`/results/${test.id}`)}
                >
                  <div style={styles.testScore}>
                    <span style={{
                      ...styles.scoreCircle,
                      background: test.passed ? '#10b981' : '#ef4444'
                    }}>
                      {test.percentage}%
                    </span>
                  </div>
                  <div style={styles.testInfo}>
                    <p style={styles.testResult}>
                      {test.score}/{test.total_questions} correct
                    </p>
                    <p style={styles.testDate}>
                      {new Date(test.test_date).toLocaleString()}
                    </p>
                  </div>
                  <div style={{
                    ...styles.testBadge,
                    background: test.passed ? '#10b981' : '#ef4444'
                  }}>
                    {test.passed ? 'PASSED' : 'FAILED'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f3f4f6',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '2rem',
  },
  welcome: {
    margin: '5px 0 0 0',
    opacity: 0.9,
  },
  logoutButton: {
    padding: '10px 24px',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '0 0 10px 0',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  statDetail: {
    fontSize: '0.9rem',
    color: '#999',
    margin: 0,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '40px',
  },
  actionButton: {
    padding: '15px 25px',
    fontSize: '1.1rem',
    background: 'white',
    color: '#333',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  primaryButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#333',
  },
  chaptersList: {
    display: 'grid',
    gap: '15px',
  },
  chapterCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  chapterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  chapterTitle: {
    margin: 0,
    fontSize: '1.3rem',
    color: '#333',
  },
  completedBadge: {
    background: '#10b981',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  chapterDesc: {
    color: '#666',
    margin: '0 0 10px 0',
  },
  lastAccessed: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
  },
  testsList: {
    display: 'grid',
    gap: '15px',
  },
  testCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  testScore: {
    flex: '0 0 auto',
  },
  scoreCircle: {
    display: 'inline-block',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  testInfo: {
    flex: 1,
  },
  testResult: {
    margin: '0 0 5px 0',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  testDate: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem',
  },
  testBadge: {
    padding: '6px 16px',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
};

export default Dashboard;
