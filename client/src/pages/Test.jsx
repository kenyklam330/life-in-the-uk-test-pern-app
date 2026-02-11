import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startTest, submitTest } from '../services/api';

function Test() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [started, timeLeft]);

  const startNewTest = async () => {
    setLoading(true);
    try {
      const response = await startTest(24);
      setQuestions(response.data.questions);
      setStarted(true);
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!confirm('You have not answered all questions. Submit anyway?')) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, userAnswer]) => ({
        questionId: parseInt(questionId),
        userAnswer,
      }));

      const timeTaken = (45 * 60) - timeLeft;
      const response = await submitTest(formattedAnswers, timeTaken);
      
      navigate(`/results/${response.data.testResultId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div style={styles.container}>
        <div style={styles.startScreen}>
          <h1 style={styles.startTitle}>Life in the UK Mock Test</h1>
          <div style={styles.testInfo}>
            <p>📝 24 multiple choice questions</p>
            <p>⏱️ 45 minutes time limit</p>
            <p>✅ 75% pass mark (18 correct answers)</p>
            <p>🎯 Good luck!</p>
          </div>
          <button 
            onClick={startNewTest} 
            style={styles.startButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Test'}
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.testHeader}>
        <div style={styles.timer}>
          <span style={timeLeft < 300 ? styles.timerWarning : {}}>
            ⏱️ {formatTime(timeLeft)}
          </span>
        </div>
        <div style={styles.progress}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div style={styles.progressBar}>
        <div style={{...styles.progressFill, width: `${progress}%`}} />
      </div>

      <div style={styles.questionContainer}>
        <h2 style={styles.questionText}>{question.question_text}</h2>

        <div style={styles.options}>
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = question[`option_${option.toLowerCase()}`];
            if (!optionText) return null;

            const isSelected = answers[question.id] === option;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                style={{
                  ...styles.option,
                  ...(isSelected ? styles.selectedOption : {}),
                }}
              >
                <span style={styles.optionLetter}>{option}</span>
                <span style={styles.optionText}>{optionText}</span>
              </button>
            );
          })}
        </div>

        <div style={styles.navigation}>
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            style={styles.navButton}
          >
            ← Previous
          </button>
          
          <div style={styles.answerStatus}>
            {Object.keys(answers).length} / {questions.length} answered
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button 
              onClick={handleSubmit} 
              style={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button 
              onClick={handleNext} 
              style={styles.navButton}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <div style={styles.questionGrid}>
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(idx)}
            style={{
              ...styles.gridButton,
              ...(idx === currentQuestion ? styles.gridButtonActive : {}),
              ...(answers[q.id] ? styles.gridButtonAnswered : {}),
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f3f4f6',
    padding: '20px',
  },
  startScreen: {
    maxWidth: '600px',
    margin: '100px auto',
    background: 'white',
    padding: '50px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  startTitle: {
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#333',
  },
  testInfo: {
    fontSize: '1.3rem',
    lineHeight: '2',
    marginBottom: '40px',
    color: '#666',
  },
  startButton: {
    padding: '15px 50px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '15px',
  },
  cancelButton: {
    padding: '15px 50px',
    background: '#e5e7eb',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  testHeader: {
    maxWidth: '800px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
  },
  timer: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  timerWarning: {
    color: '#ef4444',
  },
  progress: {
    fontSize: '1.1rem',
    color: '#666',
  },
  progressBar: {
    maxWidth: '800px',
    margin: '0 auto 30px',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#667eea',
    transition: 'width 0.3s',
  },
  questionContainer: {
    maxWidth: '800px',
    margin: '0 auto 30px',
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  questionText: {
    fontSize: '1.5rem',
    marginBottom: '30px',
    color: '#333',
    lineHeight: '1.6',
  },
  options: {
    display: 'grid',
    gap: '15px',
    marginBottom: '30px',
  },
  option: {
    padding: '20px',
    background: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '1.1rem',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  selectedOption: {
    background: '#ede9fe',
    border: '2px solid #667eea',
  },
  optionLetter: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  submitButton: {
    padding: '12px 24px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  answerStatus: {
    color: '#666',
    fontSize: '1rem',
  },
  questionGrid: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
    gap: '10px',
  },
  gridButton: {
    padding: '12px',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  gridButtonActive: {
    background: '#667eea',
    color: 'white',
    border: '2px solid #667eea',
  },
  gridButtonAnswered: {
    background: '#d1fae5',
    border: '2px solid #10b981',
  },
};

export default Test;
