import { useSignup } from "../context/SignupContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignupTerms() {
  const { state, setAgreements } = useSignup();
  const nav = useNavigate();
  const [openTos, setOpenTos] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const onAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    setAgreements({ tos: v, privacy: v });
  };

  const onNext = () => {
    if (!(state.tos && state.privacy)) {
      alert("필수 항목을 체크해주시기 바랍니다");
      return;
    }
    nav("/signup/info");
  };

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

        .chk-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 8px;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .chk-row:hover {
          background-color: var(--bg-muted);
        }

        .chk-row input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--brand);
          cursor: pointer;
        }

        .chk-row span {
          flex: 1;
          font-size: 16px;
          font-weight: 500;
        }

        .chk-acc {
          margin: 16px 0;
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .acc-btn {
          margin-left: auto;
          background: transparent;
          border: 0;
          font-size: 18px;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .acc-btn:hover {
          background-color: var(--bg-muted);
          color: var(--text);
        }

        .acc-btn:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }

        .acc-panel {
          padding: 20px;
          background: var(--bg-muted);
          border-top: 1px solid var(--border);
          font-size: 14px;
          line-height: 1.6;
        }

        .acc-panel p {
          margin: 0;
        }

        .acc-panel ol {
          margin: 12px 0;
          padding-left: 20px;
        }

        .acc-panel li {
          margin: 8px 0;
        }

        .divider {
          height: 1px;
          background: var(--border);
          margin: 24px 0;
        }

        .primary.lg {
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
          margin-top: 32px;
        }

        .primary.lg:hover {
          background: #0f3f57;
        }

        .primary.lg:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 3px;
        }

        .primary.lg:disabled {
          background: #9CA3AF;
          border-color: #9CA3AF;
          cursor: not-allowed;
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

          .chk-row {
            padding: 12px 4px;
          }

          .primary.lg {
            height: 56px;
            font-size: 18px;
          }
        }

        /* 다크모드 추가 스타일 */
        @media (prefers-color-scheme: dark) {
          .steps .on {
            color: var(--text);
          }

          .acc-panel {
            background: var(--surface);
            border-color: var(--border);
          }

          .chk-row:hover {
            background-color: var(--bg-muted);
          }

          .acc-btn:hover {
            background-color: var(--bg-muted);
          }
        }
      `}</style>

      <div className="page-wrapper">
        {/* 헤더 */}
        <header className="header" role="banner">
          <div className="header-left">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
              <img 
                src="/images/cck_logo.png" 
                alt="Cubing Club Korea 로고" 
                className="logo"
                width="auto"
                height="36"
              />
              <h1 className="site-name">Cubing Club Korea</h1>
            </Link>
          </div>
          <Link to="/login" className="header-right" aria-label="로그인 페이지로 이동">
            <img 
              src="/images/person_icon.png" 
              alt="" 
              aria-hidden="true"
              className="profile-icon"
              width="36"
              height="36"
            />
            <span className="login-text">로그인</span>
          </Link>
        </header>

        {/* 회원가입 메인 콘텐츠 */}
        <main className="signup-page">
          <div className="signup step1">
            <h1 className="title">회원가입</h1>
            <ol className="steps">
              <li className="on">1 약관동의</li>
              <li>2 정보입력</li>
              <li>3 이메일인증</li>
            </ol>

            <label className="chk-row">
              <input 
                type="checkbox" 
                checked={state.tos && state.privacy} 
                onChange={onAll}
                aria-describedby="all-agree-desc"
              />
              <span>전체 동의합니다.</span>
            </label>
            <div id="all-agree-desc" className="sr-only">모든 필수 약관에 동의합니다</div>

            <div className="divider" />

            <div className="chk-acc">
              <label className="chk-row">
                <input 
                  type="checkbox" 
                  checked={state.tos}
                  onChange={(e) => setAgreements({ tos: e.target.checked })}
                  aria-describedby="tos-desc"
                />
                <span>(필수) 이용약관 동의</span>
                <button 
                  type="button" 
                  className="acc-btn" 
                  aria-expanded={openTos} 
                  onClick={() => setOpenTos(!openTos)}
                  aria-controls="tos-panel"
                >
                  ▾
                </button>
              </label>
              <div id="tos-desc" className="sr-only">서비스 이용약관에 동의합니다</div>
              {openTos && (
                <div id="tos-panel" className="acc-panel" role="region" aria-label="이용약관">
                  <p><strong>이용약관 (요약)</strong></p>
                  <ol>
                    <li>서비스 제공 및 계정 이용에 관한 기본 사항을 규정합니다.</li>
                    <li>회원은 계정과 비밀번호를 안전하게 관리해야 하며, 제3자에게 양도/대여할 수 없습니다.</li>
                    <li>회사는 안정적인 서비스 제공을 위해 필요한 범위에서 서비스 내용을 변경할 수 있습니다.</li>
                    <li>회원은 관련 법령과 본 약관, 공지사항을 준수해야 합니다.</li>
                    <li>회사의 귀책 없는 서비스 중단, 회원의 귀책 사유로 인한 손해에 대해서 회사는 책임을 지지 않습니다.</li>
                    <li>계약 해지 및 이용 제한, 분쟁의 관할은 회사 소재지 관할 법원으로 합니다.</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="chk-acc">
              <label className="chk-row">
                <input 
                  type="checkbox" 
                  checked={state.privacy}
                  onChange={(e) => setAgreements({ privacy: e.target.checked })}
                  aria-describedby="privacy-desc"
                />
                <span>(필수) 개인정보 수집 및 이용 동의</span>
                <button 
                  type="button" 
                  className="acc-btn" 
                  aria-expanded={openPrivacy} 
                  onClick={() => setOpenPrivacy(!openPrivacy)}
                  aria-controls="privacy-panel"
                >
                  ▾
                </button>
              </label>
              <div id="privacy-desc" className="sr-only">개인정보 수집 및 이용에 동의합니다</div>
              {openPrivacy && (
                <div id="privacy-panel" className="acc-panel" role="region" aria-label="개인정보 수집 및 이용">
                  <p><strong>개인정보 수집 및 이용 동의 (요약)</strong></p>
                  <ol>
                    <li>수집 항목: 아이디, 이메일, 비밀번호(해시), 접속 로그</li>
                    <li>이용 목적: 회원 식별/가입 처리, 서비스 제공, 고객문의 대응, 보안 및 부정이용 방지</li>
                    <li>보유/이용 기간: 회원 탈퇴 시까지(단, 관계법령에 따라 필요한 경우 해당 기간 보관)</li>
                    <li>동의를 거부할 권리: 동의 거부 시 회원가입 및 서비스 이용이 제한될 수 있습니다.</li>
                  </ol>
                  <p><em>※ 실제 배포 전, 자사 개인정보처리방침에 맞춰 최종 검토/수정 필요</em></p>
                </div>
              )}
            </div>

            <button className="primary lg" onClick={onNext}>
              정보입력
            </button>
          </div>
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
