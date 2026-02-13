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
      {/* Using HashRouter for GitHub Pages compatibility.
          Adding all v7 future flags to remove console warnings and 
          enable modern React concurrent rendering.
      */}
      <Router 
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
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
          
          {/* Optional: Add a 404 Catch-all */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;