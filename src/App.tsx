import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import { SignupProvider } from './context/SignupContext';
import AppLayout from "./layouts/AppLayout";

import HomePage_new from "./pages/HomePage_new"; // 메인
import CompetitionRegisterPage from "./pages/CompetitionRegisterPage";
import CompetitionApplicationPage from "./pages/CompetitionApplicationPage";
import CompetitionSchedulePage from "./pages/CompetitionSchedulePage";
import CompetitionParticipantsPage from "./pages/CompetitionParticipantsPage";
import CompetitionWaitlistPage from "./pages/CompetitionWaitlistPage";
import LoginPage_new from "./pages/LoginPage_new";
import PasswordResetPage from "./pages/PasswordResetPage";
import SignupTerms from "./pages/SignupTerms";
import SignupInfo from "./pages/SignupInfo";
import SignupVerify from "./pages/SignupVerify";

export default function App() {
  return (
    <ThemeProvider>
      <SignupProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage_new />} />
              <Route path="/login" element={<LoginPage_new />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path="/signup" element={<Navigate to="/signup/terms" replace />} />
              <Route path="/signup/terms" element={<SignupTerms />} />
              <Route path="/signup/info" element={<SignupInfo />} />
              <Route path="/signup/verify" element={<SignupVerify />} />
              <Route path="/competitions/:id" element={<CompetitionRegisterPage />} />
              <Route path="/competitions/:id/apply" element={<CompetitionApplicationPage />} />
              <Route path="/competitions/:id/schedule" element={<CompetitionSchedulePage />} />
              <Route path="/competitions/:id/participants" element={<CompetitionParticipantsPage />} />
              <Route path="/competitions/:id/waitlist" element={<CompetitionWaitlistPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SignupProvider>
    </ThemeProvider>
  );
}
