import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorBoundary from './components/ErrorBoundary';
import { LoadingState } from './components/LoadingStates';
import { ToastProvider } from './components/Toast';
import { SignupProvider } from './context/SignupContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from "./layouts/AppLayout";
import HomePage_new from "./pages/HomePage_new"; // 메인 페이지는 즉시 로드
import LoginPage_new from "./pages/LoginPage_new";
import NotFoundPage from "./pages/NotFoundPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import { ROUTES, ROUTE_PATTERNS } from "./routes/paths";
import SignupRouter from "./routes/SignupRouter";

// 상세/스케줄/명단 페이지는 지연 로딩
const CompetitionRegisterPage = lazy(() => import("./pages/CompetitionRegisterPage"));
const CompetitionApplicationPage = lazy(() => import("./pages/CompetitionApplicationPage"));
const CompetitionSchedulePage = lazy(() => import("./pages/CompetitionSchedulePage"));
const CompetitionParticipantsPage = lazy(() => import("./pages/CompetitionParticipantsPage"));
const CompetitionWaitlistPage = lazy(() => import("./pages/CompetitionWaitlistPage"));

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
                  <Route 
                    path={ROUTE_PATTERNS.COMPETITIONS.DETAIL} 
                    element={
                      <Suspense fallback={<LoadingState message="대회 정보를 불러오는 중..." />}>
                        <CompetitionRegisterPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path={ROUTE_PATTERNS.COMPETITIONS.APPLICATION} 
                    element={
                      <Suspense fallback={<LoadingState message="신청 페이지를 불러오는 중..." />}>
                        <CompetitionApplicationPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path={ROUTE_PATTERNS.COMPETITIONS.SCHEDULE} 
                    element={
                      <Suspense fallback={<LoadingState message="일정을 불러오는 중..." />}>
                        <CompetitionSchedulePage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path={ROUTE_PATTERNS.COMPETITIONS.PARTICIPANTS} 
                    element={
                      <Suspense fallback={<LoadingState message="참가자 명단을 불러오는 중..." />}>
                        <CompetitionParticipantsPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path={ROUTE_PATTERNS.COMPETITIONS.WAITLIST} 
                    element={
                      <Suspense fallback={<LoadingState message="대기자 명단을 불러오는 중..." />}>
                        <CompetitionWaitlistPage />
                      </Suspense>
                    } 
                  />
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
