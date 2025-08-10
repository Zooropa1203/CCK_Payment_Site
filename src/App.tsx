import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import { SignupProvider } from './context/SignupContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from "./layouts/AppLayout";
import { ROUTES, ROUTE_PATTERNS } from "./routes/paths";
import SignupRouter from "./routes/SignupRouter";

import HomePage_new from "./pages/HomePage_new"; // 메인
import CompetitionRegisterPage from "./pages/CompetitionRegisterPage";
import CompetitionApplicationPage from "./pages/CompetitionApplicationPage";
import CompetitionSchedulePage from "./pages/CompetitionSchedulePage";
import CompetitionParticipantsPage from "./pages/CompetitionParticipantsPage";
import CompetitionWaitlistPage from "./pages/CompetitionWaitlistPage";
import LoginPage_new from "./pages/LoginPage_new";
import PasswordResetPage from "./pages/PasswordResetPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <SignupProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<HomePage_new />} />
                  <Route path={ROUTE_PATTERNS.COMPETITIONS.DETAIL} element={<CompetitionRegisterPage />} />
                  <Route path={ROUTE_PATTERNS.COMPETITIONS.APPLICATION} element={<CompetitionApplicationPage />} />
                  <Route path={ROUTE_PATTERNS.COMPETITIONS.SCHEDULE} element={<CompetitionSchedulePage />} />
                  <Route path={ROUTE_PATTERNS.COMPETITIONS.PARTICIPANTS} element={<CompetitionParticipantsPage />} />
                  <Route path={ROUTE_PATTERNS.COMPETITIONS.WAITLIST} element={<CompetitionWaitlistPage />} />
                  <Route path={ROUTES.LOGIN} element={<LoginPage_new />} />
                  <Route path={`${ROUTES.SIGNUP.ROOT}/*`} element={<SignupRouter />} />
                  <Route path={ROUTES.PASSWORD_RESET} element={<PasswordResetPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SignupProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
