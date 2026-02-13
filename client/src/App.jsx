import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import ChapterDetail from './pages/ChapterDetail';
import Test from './pages/Test';
import TestResults from './pages/TestResults';

function App() {
  return (
    <AuthProvider>
      <Router 
        // Future flags are great for keeping console clean for v7
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          {/* Removed basename from here - it was causing the 404/Matching error */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study" 
            element={
              <ProtectedRoute>
                <Study />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study/:id" 
            element={
              <ProtectedRoute>
                <ChapterDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test" 
            element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results/:testId" 
            element={
              <ProtectedRoute>
                <TestResults />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all for real 404s within your app */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;