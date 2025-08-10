import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !pw.trim()) {
      alert("아이디와 비밀번호를 입력해주세요");
      return;
    }
    console.log({ id, pw, remember }); // TODO: API 연동
  };

  return (
    <>
      <style>{`
        :root {
          --max-width: 1160px;

          /* Light theme (default) */
          --bg: #ffffff;
          --bg-muted: #f3f4f6;
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
          --table-hover: #f9fafb;
          --error-bg: #fef2f2;
          --error-border: #fecaca;
          --text-on-dark: #ffffff;
        }

        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0b0f14;
            --bg-muted: #0f141a;
            --text: #e5e7eb;
            --text-muted: #94a3b8;
            --brand: #60a5fa;
            --brand-secondary: #34d399;
            --border: #273345;
            --border-light: #374151;
            --border-dark: #6b7280;
            --surface: #111827;
            --shadow: 0 1px 3px rgba(0,0,0,.4);
            --table-hover: #1f2937;
            --error-bg: #7f1d1d;
            --error-border: #dc2626;
            --text-on-dark: #ffffff;
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

        /* 접근성 헬퍼 */
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

        /* 페이지 레이아웃 */
        .page-wrapper {
          background-color: var(--bg);
          color: var(--text);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* 로그인 페이지 레이아웃 */
        .login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: var(--bg);
          color: var(--text);
          padding: 40px 16px;
        }

        .login-card {
          position: relative;
          width: min(560px, 92vw);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow);
          padding: 48px 40px 56px;
        }

        .login-title {
          font-size: 28px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 28px;
          color: var(--text);
        }

        /* 입력 */
        .login-input {
          display: block;
          width: 100%;
          height: 48px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          padding: 0 16px;
          margin-bottom: 14px;
          font-size: 16px;
        }

        .login-input::placeholder {
          color: var(--text-muted);
          opacity: 0.7;
        }

        .login-input:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 2px;
          border-color: var(--brand);
        }

        /* 하단 행 */
        .login-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 6px 0 24px;
          flex-wrap: wrap;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 14px;
          cursor: pointer;
        }

        .remember input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--brand);
        }

        .login-links {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .login-links a {
          color: var(--text-muted);
          text-decoration: none;
        }

        .login-links a:hover {
          text-decoration: underline;
          color: var(--brand);
        }

        .login-links a:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .divider {
          color: var(--border);
        }

        /* 버튼 */
        .login-button {
          display: block;
          width: 100%;
          height: 64px;
          border-radius: 12px;
          border: 1px solid #0f3f57;
          background: #145374;
          color: #fff;
          font-weight: 800;
          font-size: 20px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .login-button:hover {
          background: #0f3f57;
        }

        .login-button:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 3px;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* 장식 (선택) */
        .login-deco {
          position: absolute;
          background-repeat: no-repeat;
          background-size: contain;
          opacity: 0.2;
        }

        .deco-top-right {
          top: -16px;
          right: -16px;
          width: 120px;
          height: 120px;
          background-image: url("/images/login_deco_top.svg");
        }

        .deco-bottom-left {
          bottom: -16px;
          left: -16px;
          width: 140px;
          height: 140px;
          background-image: url("/images/login_deco_bottom.svg");
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
          .login-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .footer-content {
            font-size: 12px;
            padding: 0 16px;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 36px 20px 44px;
          }

          .login-title {
            font-size: 24px;
          }

          .login-button {
            height: 56px;
            font-size: 18px;
          }

          .login-page {
            padding: 20px 16px;
          }
        }

        /* 다크모드 추가 스타일 */
        @media (prefers-color-scheme: dark) {
          .login-page {
            background: var(--bg);
            color: var(--text);
          }

          .login-card {
            background: var(--surface);
            border-color: var(--border);
          }

          .login-input {
            background: var(--surface);
            color: var(--text);
            border-color: var(--border);
          }

          .login-links a {
            color: var(--text-muted);
          }

          .login-links a:hover {
            color: var(--brand);
          }

          .remember {
            color: var(--text-muted);
          }
        }
      `}</style>

      <div className="page-wrapper">
        {/* 로그인 메인 콘텐츠 */}
        <main className="login-page" aria-labelledby="login-title">
          <form className="login-card" onSubmit={onSubmit}>
            <h1 id="login-title" className="login-title">로그인</h1>

            <label htmlFor="login-id" className="sr-only">아이디</label>
            <input
              id="login-id"
              name="id"
              type="text"
              autoComplete="username"
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="login-input"
            />

            <label htmlFor="login-pw" className="sr-only">비밀번호</label>
            <input
              id="login-pw"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호 입력"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="login-input"
            />

            <div className="login-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>아이디 저장</span>
              </label>

              <nav className="login-links" aria-label="계정 링크">
                <Link to={ROUTES.SIGNUP.TERMS}>회원가입</Link>
                <span className="divider" aria-hidden="true">|</span>
                <Link to={ROUTES.PASSWORD_RESET}>비밀번호 찾기</Link>
              </nav>
            </div>

            <button type="submit" className="login-button">로그인</button>

            {/* 장식 패턴은 선택: 필요 시 배경 이미지로 처리 */}
            <div className="login-deco deco-top-right" aria-hidden="true" />
            <div className="login-deco deco-bottom-left" aria-hidden="true" />
          </form>
        </main>

        {/* 푸터 */}
        <footer className="footer" role="contentinfo">
          <div className="footer-content">
            <div className="footer-line">
              큐빙클럽코리아 | 사업자등록번호 : 358-54-00896 | 대표 : 정현재 | 이메일 : cubingclubkorea@gmail.com
            </div>
            <div className="footer-line">
              COPYRIGHT © Cubing Club Korea
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
