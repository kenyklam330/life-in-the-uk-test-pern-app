import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Chapters
export const getChapters = () => api.get('/api/chapters');
export const getChapter = (id) => api.get(`/api/chapters/${id}`);
export const markChapterComplete = (id) => api.post(`/api/chapters/${id}/complete`);

// Tests
export const startTest = (count = 24) => api.get(`/api/tests/start?count=${count}`);
export const submitTest = (answers, timeTaken) => 
  api.post('/api/tests/submit', { answers, timeTaken });
export const getTestHistory = () => api.get('/api/tests/history');
export const getTestResults = (testId) => api.get(`/api/tests/${testId}/results`);
export const getPracticeQuestions = (chapterId, count = 10) => 
  api.get(`/api/tests/practice/${chapterId}?count=${count}`);

// Progress
export const getUserStats = () => api.get('/api/progress/stats');
export const getUserProgress = () => api.get('/api/progress');

export default api;
