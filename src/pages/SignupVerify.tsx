import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSignup } from '../context/SignupContext';
import { ROUTES } from '../routes/paths';

export default function SignupVerify() {
  const { state, reset } = useSignup();
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5분
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  // 타이머 효과
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // 인증번호 재발송
  const resendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      // TODO: 실제 API 호출
      console.log(`인증번호 재발송: ${state.email}`);

      // 임시 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTimeLeft(300);
      alert('인증번호가 재발송되었습니다.');
    } catch {
      setError('인증번호 재발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsResending(false);
    }
  };

  // 인증 확인
  const verifyCode = async () => {
    if (!code.trim()) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    if (code.length !== 6) {
      setError('인증번호는 6자리입니다.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // TODO: 실제 API 호출
      console.log(`인증 확인: ${state.email}, 코드: ${code}`);

      // 임시 지연
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 임시 인증 성공 처리 (실제로는 API 응답에 따라)
      if (code === '123456') {
        alert('회원가입이 완료되었습니다!');
        reset();
        nav('/login');
      } else {
        setError('인증번호가 올바르지 않습니다.');
      }
    } catch {
      setError('인증 확인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsVerifying(false);
    }
  };

  const onBack = () => {
    nav(ROUTES.SIGNUP.INFO);
  };

  // 이메일이 없으면 첫 단계로 리다이렉트
  useEffect(() => {
    if (!state.email) {
      nav(ROUTES.SIGNUP.TERMS);
    }
  }, [state.email, nav]);

  return (
    <>
      <style>{`
        :root {
          --max-width: 1160px;
          --header-height: 64px;

          /* Light theme (default) */
          --bg: #ffffff;
          --bg-muted: #f3f4f6;
          --bg-header: #e5e5e5;
          --text: #111827;
          --text-muted: #6b7280;
          --brand: #2563eb;
          --brand-secondary: #10b981;
          --border: #d1d5db;
          --border-light: #e5e7eb;
          --border-dark: #6b7280;
          --surface: #ffffff;
          --shadow: 0 1px 3px rgba(0,0,0,.1);
          --border-radius: 8px;
          --border-radius-sm: 6px;
          --text-on-dark: #ffffff;
          --error: #dc2626;
          --success: #059669;
          --warning: #d97706;
        }

        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0b0f14;
            --bg-muted: #0f141a;
            --bg-header: #1a1a1a;
            --text: #e5e7eb;
            --text-muted: #94a3b8;
            --brand: #60a5fa;
            --brand-secondary: #34d399;
            --border: #273345;
            --border-light: #374151;
            --border-dark: #6b7280;
            --surface: #111827;
            --shadow: 0 1px 3px rgba(0,0,0,.4);
            --text-on-dark: #ffffff;
            --error: #ef4444;
            --success: #10b981;
            --warning: #f59e0b;
          }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: var(--bg);
          color: var(--text);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* 헤더 스타일 */
        .header {
          background-color: var(--bg-header);
          color: var(--text);
          height: var(--header-height);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid var(--border);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          height: 36px;
          width: auto;
        }

        .site-name {
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--border-radius-sm);
          text-decoration: none;
          color: var(--text);
          transition: background-color 0.2s;
        }

        .header-right:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .header-right:focus-visible {
          background-color: rgba(255, 255, 255, 0.2);
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }

        .profile-icon {
          height: 36px;
          width: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .login-text {
          font-size: 16px;
          color: var(--text);
          font-weight: 500;
        }

        /* 메인 페이지 */
        .signup-page {
          min-height: calc(100vh - var(--header-height));
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: var(--bg);
          padding: 40px 16px;
        }

        .signup {
          width: min(560px, 92vw);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow);
          padding: 48px 40px 56px;
        }

        .title {
          font-size: 28px;
          font-weight: 800;
          text-align: center;
          margin: 0 0 24px 0;
          color: var(--text);
        }

        .steps {
          display: flex;
          justify-content: center;
          gap: 20px;
          color: var(--text-muted);
          margin-bottom: 32px;
          list-style: none;
          padding: 0;
        }

        .steps li {
          position: relative;
          font-weight: 500;
        }

        .steps li:not(:last-child)::after {
          content: '>';
          position: absolute;
          right: -12px;
          color: var(--text-muted);
          font-weight: normal;
        }

        .steps .on {
          font-weight: 800;
          color: var(--text);
        }

        .verify-info {
          text-align: center;
          margin-bottom: 32px;
          padding: 24px;
          background: var(--bg-muted);
          border-radius: var(--border-radius);
          border: 1px solid var(--border);
        }

        .verify-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text);
        }

        .verify-email {
          font-size: 16px;
          font-weight: 600;
          color: var(--brand);
          margin-bottom: 8px;
        }

        .verify-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text);
          font-size: 16px;
        }

        .code-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .code-input {
          flex: 1;
          height: 52px;
          padding: 16px;
          border: 2px solid var(--border);
          border-radius: var(--border-radius);
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          letter-spacing: 2px;
          background: var(--surface);
          color: var(--text);
          transition: border-color 0.2s;
        }

        .code-input:focus {
          outline: none;
          border-color: var(--brand);
        }

        .code-input.error {
          border-color: var(--error);
        }

        .timer {
          font-size: 16px;
          font-weight: 600;
          color: var(--warning);
          min-width: 60px;
          text-align: center;
        }

        .timer.expired {
          color: var(--error);
        }

        .resend-section {
          text-align: center;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--bg-muted);
          border-radius: var(--border-radius);
        }

        .resend-text {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .resend-btn {
          background: transparent;
          border: 1px solid var(--brand);
          color: var(--brand);
          padding: 8px 16px;
          border-radius: var(--border-radius-sm);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .resend-btn:hover:not(:disabled) {
          background: var(--brand);
          color: var(--text-on-dark);
        }

        .resend-btn:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }

        .resend-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-error {
          margin-top: 8px;
          color: var(--error);
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .form-help {
          margin-top: 8px;
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.4;
          text-align: center;
        }

        .btn-group {
          display: flex;
          gap: 16px;
          margin-top: 32px;
        }

        .btn {
          flex: 1;
          height: 64px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn.secondary {
          background: var(--surface);
          border-color: var(--border-dark);
          color: var(--text);
        }

        .btn.secondary:hover {
          background: var(--bg-muted);
          border-color: var(--text-muted);
        }

        .btn.secondary:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 3px;
        }

        .btn.primary {
          background: #145374;
          border-color: #0f3f57;
          color: #fff;
        }

        .btn.primary:hover:not(:disabled) {
          background: #0f3f57;
        }

        .btn.primary:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 3px;
        }

        .btn:disabled {
          background: #9CA3AF;
          border-color: #9CA3AF;
          color: #ffffff;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* 푸터 스타일 */
        .footer {
          background-color: var(--bg-muted);
          color: var(--text);
          padding: 24px 0;
          border-top: 1px solid var(--border-light);
          margin-top: auto;
        }

        .footer-content {
          text-align: center;
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.6;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-line {
          margin-bottom: 8px;
        }

        .footer-line:last-child {
          margin-bottom: 0;
        }

        /* 반응형 */
        @media (max-width: 768px) {
          .header {
            height: auto;
            padding: 12px 16px;
            flex-direction: column;
            gap: 12px;
          }

          .header-left,
          .header-right {
            justify-content: center;
          }

          .site-name {
            font-size: 18px;
          }

          .signup {
            padding: 36px 20px 44px;
          }

          .title {
            font-size: 24px;
          }

          .steps {
            gap: 16px;
            font-size: 14px;
          }

          .btn-group {
            flex-direction: column;
          }

          .btn {
            height: 56px;
            font-size: 18px;
          }

          .footer-content {
            font-size: 12px;
            padding: 0 16px;
          }
        }

        @media (max-width: 480px) {
          .signup-page {
            padding: 20px 16px;
          }

          .steps {
            gap: 12px;
            font-size: 13px;
          }

          .code-input-group {
            flex-direction: column;
            gap: 8px;
          }

          .timer {
            font-size: 14px;
          }
        }

        /* 접근성 */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* 다크모드 추가 스타일 */
        @media (prefers-color-scheme: dark) {
          .steps .on {
            color: var(--text);
          }

          .verify-info {
            background: var(--bg-muted);
            border-color: var(--border);
          }

          .resend-section {
            background: var(--bg-muted);
          }

          .btn.secondary {
            background: var(--surface);
            border-color: var(--border-dark);
          }

          .btn.secondary:hover {
            background: var(--bg-muted);
          }
        }
      `}</style>

      <div className="page-wrapper">
        {/* 회원가입 메인 콘텐츠 */}
        <main className="signup-page">
          <div className="signup step3">
            <h1 className="title">회원가입</h1>
            <ol className="steps">
              <li>1 약관동의</li>
              <li>2 정보입력</li>
              <li className="on">3 이메일인증</li>
            </ol>

            <div className="verify-info">
              <h2 className="verify-title">이메일 인증</h2>
              <div className="verify-email">{state.email}</div>
              <p className="verify-desc">
                위 이메일로 발송된 6자리 인증번호를 입력해주세요.
              </p>
            </div>

            <form onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="verify-code" className="form-label">
                  인증번호
                </label>
                <div className="code-input-group">
                  <input
                    id="verify-code"
                    type="text"
                    className={`code-input ${error ? 'error' : ''}`}
                    value={code}
                    onChange={e => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6);
                      setCode(value);
                      if (error) setError('');
                    }}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                    aria-describedby={error ? 'code-error' : 'code-help'}
                  />
                  <div className={`timer ${timeLeft <= 0 ? 'expired' : ''}`}>
                    {timeLeft > 0 ? formatTime(timeLeft) : '만료'}
                  </div>
                </div>
                {error ? (
                  <div id="code-error" className="form-error" role="alert">
                    {error}
                  </div>
                ) : (
                  <div id="code-help" className="form-help">
                    인증번호는 발송 후 5분간 유효합니다
                  </div>
                )}
              </div>
            </form>

            <div className="resend-section">
              <p className="resend-text">인증번호를 받지 못하셨나요?</p>
              <button
                type="button"
                className="resend-btn"
                onClick={resendCode}
                disabled={isResending || timeLeft > 240} // 1분 후부터 재발송 가능
              >
                {isResending ? (
                  <>
                    <div className="spinner" />
                    발송중...
                  </>
                ) : (
                  '인증번호 재발송'
                )}
              </button>
            </div>

            <div className="btn-group">
              <button
                type="button"
                className="btn secondary"
                onClick={onBack}
                aria-label="이전 단계로 돌아가기"
              >
                이전
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={verifyCode}
                disabled={!code || code.length !== 6 || isVerifying}
                aria-label="이메일 인증 완료하기"
              >
                {isVerifying ? (
                  <>
                    <div className="spinner" />
                    인증중...
                  </>
                ) : (
                  '가입완료'
                )}
              </button>
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <footer className="footer" role="contentinfo">
          <div className="footer-content">
            <div className="footer-line">
              큐빙클럽코리아 | 사업자등록번호 : 358-54-00896 | 대표 : 정현재 |
              이메일 : cubingclubkorea@gmail.com
            </div>
            <div className="footer-line">COPYRIGHT © Cubing Club Korea</div>
          </div>
        </footer>
      </div>
    </>
  );
}
