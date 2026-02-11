import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getChapter, markChapterComplete } from '../services/api';

function ChapterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapter();
  }, [id]);

  const loadChapter = async () => {
    try {
      const response = await getChapter(id);
      setChapter(response.data);
    } catch (error) {
      console.error('Error loading chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await markChapterComplete(id);
      setChapter({ ...chapter, completed: true });
    } catch (error) {
      console.error('Error marking chapter complete:', error);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading chapter...</div>;
  }

  if (!chapter) {
    return <div style={styles.loading}>Chapter not found</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/study')} style={styles.backButton}>
          ← Back to Study
        </button>
        <h1 style={styles.title}>{chapter.title}</h1>
        {chapter.completed && (
          <span style={styles.completedBadge}>✓ Completed</span>
        )}
      </header>

      <div style={styles.content}>
        <div style={styles.description}>
          {chapter.description}
        </div>

        <div style={styles.markdown}>
          <ReactMarkdown>{chapter.content}</ReactMarkdown>
        </div>

        <div style={styles.actions}>
          {!chapter.completed && (
            <button onClick={handleComplete} style={styles.completeButton}>
              Mark as Completed
            </button>
          )}
          <button 
            onClick={() => navigate(`/practice/${id}`)} 
            style={styles.practiceButton}
          >
            Practice Questions
          </button>
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
    margin: '0 0 10px 0',
    fontSize: '2.5rem',
  },
  completedBadge: {
    background: '#10b981',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '1.5rem',
  },
  description: {
    background: '#e0e7ff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    fontSize: '1.1rem',
    color: '#4c51bf',
  },
  markdown: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    lineHeight: '1.8',
    fontSize: '1.05rem',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  completeButton: {
    padding: '15px 30px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  practiceButton: {
    padding: '15px 30px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default ChapterDetail;
