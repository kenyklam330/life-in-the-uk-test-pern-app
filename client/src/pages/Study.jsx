import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChapters } from '../services/api';

function Study() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const response = await getChapters();
      setChapters(response.data);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading chapters...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>Study Materials</h1>
      </header>

      <div style={styles.content}>
        <p style={styles.intro}>
          Study these chapters to prepare for the Life in the UK test. Each chapter covers 
          important aspects of British life, history, and culture.
        </p>

        <div style={styles.chaptersList}>
          {chapters.map((chapter, index) => (
            <div 
              key={chapter.id} 
              style={styles.chapterCard}
              onClick={() => navigate(`/study/${chapter.id}`)}
            >
              <div style={styles.chapterNumber}>{index + 1}</div>
              <div style={styles.chapterContent}>
                <div style={styles.chapterHeader}>
                  <h2 style={styles.chapterTitle}>{chapter.title}</h2>
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
              <div style={styles.arrow}>→</div>
            </div>
          ))}
        </div>
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
  },
  backButton: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontSize: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '2.5rem',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '1.5rem',
  },
  intro: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  chaptersList: {
    display: 'grid',
    gap: '20px',
  },
  chapterCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  chapterNumber: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  chapterContent: {
    flex: 1,
  },
  chapterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px',
  },
  chapterTitle: {
    margin: 0,
    fontSize: '1.5rem',
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
    lineHeight: '1.5',
  },
  lastAccessed: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
  },
  arrow: {
    fontSize: '1.5rem',
    color: '#667eea',
    flexShrink: 0,
  },
};

export default Study;
