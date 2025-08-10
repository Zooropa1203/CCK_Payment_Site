import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../routes/paths';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('이메일을 입력해주세요');
      return;
    }
    // TODO: API 연동
    console.log('비밀번호 재설정 이메일 발송:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        {!isSubmitted ? (
          <>
            <h1 className="reset-title">비밀번호 찾기</h1>
            <p className="reset-description">
              가입 시 등록한 이메일 주소를 입력하시면
              <br />
              비밀번호 재설정 링크를 보내드립니다.
            </p>

            <form onSubmit={onSubmit}>
              <label htmlFor="reset-email" className="sr-only">
                이메일
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="이메일 주소 입력"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="reset-input"
                required
              />

              <button type="submit" className="reset-button">
                재설정 링크 발송
              </button>
            </form>

            <div className="reset-links">
              <Link to={ROUTES.LOGIN} className="text-link">
                로그인으로 돌아가기
              </Link>
              <span className="divider">|</span>
              <Link to={ROUTES.SIGNUP.TERMS} className="text-link">
                회원가입
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="reset-title">이메일 발송 완료</h1>
            <p className="reset-description">
              <strong>{email}</strong>로<br />
              비밀번호 재설정 링크를 발송했습니다.
              <br />
              이메일을 확인해주세요.
            </p>

            <Link to={ROUTES.LOGIN} className="reset-button-link">
              로그인 페이지로 이동
            </Link>
          </>
        )}
      </div>

      <style>{`
        .reset-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: var(--bg);
          color: var(--text);
          padding: 40px 16px;
        }

        .reset-card {
          position: relative;
          width: min(480px, 92vw);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow);
          padding: 48px 40px;
          text-align: center;
        }

        .reset-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 16px;
          color: var(--text);
        }

        .reset-description {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .reset-input {
          display: block;
          width: 100%;
          height: 48px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          padding: 0 16px;
          margin-bottom: 24px;
          font-size: 16px;
        }

        .reset-input::placeholder {
          color: var(--text-muted);
          opacity: 0.7;
        }

        .reset-input:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 2px;
          border-color: var(--brand);
        }

        .reset-button, .reset-button-link {
          display: block;
          width: 100%;
          height: 48px;
          border-radius: 8px;
          border: 1px solid #0f3f57;
          background: #145374;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          line-height: 46px;
          text-align: center;
          transition: background-color 0.2s;
          margin-bottom: 24px;
        }

        .reset-button:hover, .reset-button-link:hover {
          background: #0f3f57;
        }

        .reset-button:focus-visible, .reset-button-link:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 2px;
        }

        .reset-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .text-link {
          color: var(--text-muted);
          text-decoration: none;
        }

        .text-link:hover {
          text-decoration: underline;
          color: var(--brand);
        }

        .text-link:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .divider {
          color: var(--border);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 480px) {
          .reset-card {
            padding: 36px 20px;
          }

          .reset-title {
            font-size: 24px;
          }

          .reset-links {
            flex-direction: column;
            gap: 8px;
          }

          .divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
