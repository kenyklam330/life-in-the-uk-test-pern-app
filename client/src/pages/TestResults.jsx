import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestResults } from '../services/api';

function TestResults() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    loadResults();
  }, [testId]);

  const loadResults = async () => {
    try {
      const response = await getTestResults(testId);
      setResults(response.data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading results...</div>;
  }

  if (!results) {
    return <div style={styles.loading}>Results not found</div>;
  }

  const { test, questions } = results;
  const passed = test.passed;
  const percentage = parseFloat(test.percentage);

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.resultBanner,
        background: passed 
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      }}>
        <div style={styles.resultIcon}>
          {passed ? '🎉' : '📚'}
        </div>
        <h1 style={styles.resultTitle}>
          {passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
        </h1>
        <div style={styles.score}>
          <div style={styles.scoreCircle}>
            <div style={styles.scorePercentage}>{percentage}%</div>
            <div style={styles.scoreDetail}>
              {test.score} / {test.total_questions}
            </div>
          </div>
        </div>
        <p style={styles.resultMessage}>
          {passed 
            ? 'You achieved the required 75% pass mark. Well done!'
            : 'You need 75% to pass. Review the questions below and keep studying.'}
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{test.score}</div>
            <div style={styles.statLabel}>Correct</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{test.total_questions - test.score}</div>
            <div style={styles.statLabel}>Incorrect</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>
              {test.time_taken ? Math.floor(test.time_taken / 60) : 'N/A'}min
            </div>
            <div style={styles.statLabel}>Time Taken</div>
          </div>
        </div>

        <div style={styles.controls}>
          <button 
            onClick={() => setShowExplanations(!showExplanations)}
            style={styles.toggleButton}
          >
            {showExplanations ? 'Hide' : 'Show'} Explanations
          </button>
        </div>

        <div style={styles.questions}>
          <h2 style={styles.sectionTitle}>Review Your Answers</h2>
          {questions.map((q, idx) => {
            const isCorrect = q.is_correct;
            
            return (
              <div key={q.question_id} style={styles.questionCard}>
                <div style={styles.questionHeader}>
                  <span style={styles.questionNumber}>Question {idx + 1}</span>
                  <span style={{
                    ...styles.resultBadge,
                    background: isCorrect ? '#10b981' : '#ef4444'
                  }}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                <p style={styles.questionText}>{q.question_text}</p>

                <div style={styles.answers}>
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = q[`option_${option.toLowerCase()}`];
                    if (!optionText) return null;

                    const isUserAnswer = q.user_answer === option;
                    const isCorrectAnswer = q.correct_answer === option;

                    let optionStyle = { ...styles.answer };
                    if (isCorrectAnswer) {
                      optionStyle = { ...optionStyle, ...styles.correctAnswer };
                    } else if (isUserAnswer && !isCorrect) {
                      optionStyle = { ...optionStyle, ...styles.wrongAnswer };
                    }

                    return (
                      <div key={option} style={optionStyle}>
                        <span style={styles.answerLetter}>{option}</span>
                        <span style={styles.answerText}>{optionText}</span>
                        {isCorrectAnswer && <span style={styles.checkMark}>✓</span>}
                        {isUserAnswer && !isCorrect && <span style={styles.crossMark}>✗</span>}
                      </div>
                    );
                  })}
                </div>

                {showExplanations && q.explanation && (
                  <div style={styles.explanation}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.actions}>
          <button onClick={() => navigate('/test')} style={styles.retakeButton}>
            Take Another Test
          </button>
          <button onClick={() => navigate('/dashboard')} style={styles.dashboardButton}>
            Back to Dashboard
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
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '1.5rem',
  },
  resultBanner: {
    color: 'white',
    padding: '50px 20px',
    textAlign: 'center',
  },
  resultIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  resultTitle: {
    fontSize: '2.5rem',
    margin: '0 0 30px 0',
  },
  score: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  scoreCircle: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid white',
  },
  scorePercentage: {
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  scoreDetail: {
    fontSize: '1.2rem',
    opacity: 0.9,
  },
  resultMessage: {
    fontSize: '1.2rem',
    maxWidth: '600px',
    margin: '0 auto',
    opacity: 0.95,
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statItem: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#666',
    fontSize: '1rem',
  },
  controls: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  toggleButton: {
    padding: '12px 30px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  questions: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#333',
  },
  questionCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  questionNumber: {
    fontSize: '1rem',
    color: '#666',
    fontWeight: '600',
  },
  resultBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  questionText: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  answers: {
    display: 'grid',
    gap: '10px',
  },
  answer: {
    padding: '15px',
    background: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  correctAnswer: {
    background: '#d1fae5',
    border: '2px solid #10b981',
  },
  wrongAnswer: {
    background: '#fee2e2',
    border: '2px solid #ef4444',
  },
  answerLetter: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  answerText: {
    flex: 1,
  },
  checkMark: {
    color: '#10b981',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  crossMark: {
    color: '#ef4444',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  explanation: {
    marginTop: '15px',
    padding: '15px',
    background: '#fffbeb',
    border: '1px solid #fbbf24',
    borderRadius: '6px',
    color: '#92400e',
    lineHeight: '1.6',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  retakeButton: {
    padding: '15px 30px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  dashboardButton: {
    padding: '15px 30px',
    background: '#e5e7eb',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
};

export default TestResults;
