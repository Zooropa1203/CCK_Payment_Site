import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CompetitionPage from './pages/CompetitionPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/competition/:id" element={
              <Layout>
                <CompetitionPage />
              </Layout>
            } />
            <Route path="/competition/:id/register" element={
              <Layout>
                <ProtectedRoute>
                  <RegistrationPage />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/login" element={
              <Layout>
                <LoginPage />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/admin" element={
              <Layout>
                <ProtectedRoute requiredRole={['administrator', 'organizer']}>
                  <AdminPage />
                </ProtectedRoute>
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
