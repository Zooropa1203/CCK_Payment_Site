import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SignupProvider } from './context/SignupContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HomePage_new from './pages/HomePage_new';
import CompetitionPage from './pages/CompetitionPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage_new from './pages/LoginPage_new';
import SignupTerms from './pages/SignupTerms';
import SignupInfo from './pages/SignupInfo';
import SignupVerify from './pages/SignupVerify';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SignupProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage_new />} />
              <Route path="/old" element={<HomePage />} />
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
              <Route path="/login" element={<LoginPage_new />} />
              <Route path="/signup" element={<SignupTerms />} />
              <Route path="/signup/info" element={<SignupInfo />} />
              <Route path="/signup/verify" element={<SignupVerify />} />
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
        </SignupProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
