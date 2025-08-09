import { useSignup } from "../context/SignupContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const EMAIL_DOMAINS = [
  "직접입력",
  "naver.com",
  "daum.net", 
  "gmail.com",
  "nate.com",
  "hanmail.net",
  "dreamwiz.com",
  "yahoo.com",
  "icloud.com",
  "hotmail.com",
];

// 간단한 이메일 검증 (RFC-lite)
function isValidEmailLocal(s: string) {
  // 영문/숫자/._%+- 허용, 길이 1+
  return /^[A-Za-z0-9._%+-]+$/.test(s);
}

function isValidEmailDomain(s: string) {
  // 영문/숫자/.-, 점 최소 1개, 양끝/연속점 금지
  if (!/^[A-Za-z0-9.-]+$/.test(s)) return false;
  if (!s.includes(".")) return false;
  if (s.startsWith(".") || s.endsWith(".")) return false;
  if (s.includes("..")) return false;
  return true;
}

export default function SignupInfo() {
  const { state, setForm } = useSignup();
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 비밀번호 관련 state
  const [pw, setPw] = useState(state.password || "");
  const [pw2, setPw2] = useState("");

  // 이메일 관련 state
  const [emailLocal, setEmailLocal] = useState(state.email.split("@")[0] || "");
  const initialDomain = state.email.split("@")[1] || "naver.com";
  const [domainMode, setDomainMode] = useState(
    EMAIL_DOMAINS.includes(initialDomain) ? initialDomain : "직접입력"
  );
  const [emailDomain, setEmailDomain] = useState(
    EMAIL_DOMAINS.includes(initialDomain) ? initialDomain : initialDomain
  );

  // 비밀번호 유효성 검증
  function validatePassword(pw: string, id: string) {
    if (pw.length < 8 || pw.length > 16) return "8~16자로 입력하세요";
    if (/\s/.test(pw)) return "공백은 사용할 수 없습니다";
    const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].reduce((n, r) => n + (r.test(pw)?1:0), 0);
    if (kinds < 2) return "영문과 숫자를 포함해 주세요";
    if (/(.)\1\1/.test(pw)) return "같은 문자를 3회 이상 연속 사용할 수 없습니다";
    if (id && pw.toLowerCase().includes(id.toLowerCase())) return "아이디를 비밀번호에 포함할 수 없습니다";
    return "";
  }

  const pwErr = validatePassword(pw, state.id);
  const pw2Err = pw && pw2 && pw !== pw2 ? "비밀번호가 일치하지 않습니다" : "";

  // 합성 이메일 (도메인은 소문자)
  const domainActual = (domainMode === "직접입력" ? emailDomain : domainMode).toLowerCase();
  const emailComposed = emailLocal && domainActual ? `${emailLocal}@${domainActual}` : "";

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!state.id.trim()) {
      newErrors.id = "아이디를 입력해주세요";
    } else if (state.id.length < 4) {
      newErrors.id = "아이디는 4자 이상이어야 합니다";
    } else if (!/^[a-zA-Z0-9_]+$/.test(state.id)) {
      newErrors.id = "아이디는 영문, 숫자, 언더바(_)만 사용 가능합니다";
    }

    // 이메일 검증
    const emailLocalErr = emailLocal && !isValidEmailLocal(emailLocal) ? "이메일 앞자리를 확인해 주세요." : "";
    const emailDomainErr = domainActual && !isValidEmailDomain(domainActual) ? "도메인을 올바르게 입력해 주세요." : "";
    
    if (!emailLocal || !domainActual) {
      newErrors.email = "이메일을 올바르게 입력하세요.";
    } else if (emailLocalErr) {
      newErrors.email = emailLocalErr;
    } else if (emailDomainErr) {
      newErrors.email = emailDomainErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 가능 여부 계산
  const canSubmit = !pwErr && !pw2Err && pw.length > 0 && pw2.length > 0 && 
                    state.id.length >= 4 && emailLocal && domainActual && 
                    !errors.email && !errors.id;

  const onNext = () => {
    if (!validate() || !canSubmit) return;
    
    setForm({ email: emailComposed, password: pw });
    nav("/signup/verify");
  };

  const onBack = () => {
    nav("/signup");
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
          --error: #dc2626;
          --success: #059669;
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

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-btn {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-btn .form-input {
          width: 100%;
          padding-right: 72px;
        }

        .input-with-btn .ghost {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 8px;
          height: 36px;
          padding: 0 10px;
          font-size: 14px;
          cursor: pointer;
          color: var(--text);
          transition: all 0.2s;
        }

        .input-with-btn .ghost:hover {
          background: var(--bg-muted);
          border-color: var(--text-muted);
        }

        .input-with-btn .ghost:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }

        .form-input {
          width: 100%;
          height: 52px;
          padding: 16px;
          border: 2px solid var(--border);
          border-radius: var(--border-radius);
          font-size: 16px;
          background: var(--surface);
          color: var(--text);
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--brand);
        }

        .form-input:invalid,
        .form-input[aria-invalid="true"] {
          border-color: var(--error);
        }

        .form-input.error {
          border-color: var(--error);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 14px;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .password-toggle:hover {
          background: var(--bg-muted);
          color: var(--text);
        }

        .password-toggle:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }

        .email-container {
          display: flex;
          align-items: center;
          gap: 0;
          border: 2px solid var(--border);
          border-radius: var(--border-radius);
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .email-container:focus-within {
          border-color: var(--brand);
        }

        .email-container.error {
          border-color: var(--error);
        }

        .email-input {
          flex: 1;
          height: 52px;
          padding: 16px;
          border: none;
          font-size: 16px;
          background: var(--surface);
          color: var(--text);
        }

        .email-input:focus {
          outline: none;
        }

        .email-domain {
          padding: 16px;
          background: var(--bg-muted);
          color: var(--text-muted);
          font-size: 16px;
          font-weight: 500;
          border-left: 1px solid var(--border);
        }

        .email-field {
          display: grid;
          grid-template-columns: 1fr auto minmax(180px, 1fr);
          gap: 10px;
          align-items: center;
        }

        .email-local,
        .email-domain-select,
        .email-domain-input {
          height: 52px;
          padding: 16px;
          border: 2px solid var(--border);
          border-radius: var(--border-radius);
          font-size: 16px;
          background: var(--surface);
          color: var(--text);
          transition: border-color 0.2s;
        }

        .email-local:focus,
        .email-domain-select:focus,
        .email-domain-input:focus {
          outline: none;
          border-color: var(--brand);
        }

        .email-local.error,
        .email-domain-select.error,
        .email-domain-input.error {
          border-color: var(--error);
        }

        .email-at {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          text-align: center;
        }

        .email-domain-input {
          grid-column: 1 / -1;
          margin-top: 10px;
        }

        .form-error {
          margin-top: 8px;
          color: var(--error);
          font-size: 14px;
          font-weight: 500;
        }

        .form-help {
          margin-top: 8px;
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.4;
        }

        .form-help.success {
          color: var(--success);
        }

        .form-help.error {
          color: var(--error);
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

        .btn.primary:hover {
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

        @media (max-width: 540px) {
          .email-field {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .email-at {
            display: none;
          }

          .email-domain-input {
            grid-column: 1;
            margin-top: 0;
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

          .email-domain {
            background: var(--bg-muted);
            border-color: var(--border);
          }

          .email-local,
          .email-domain-select,
          .email-domain-input {
            background: var(--surface);
            color: var(--text);
            border-color: var(--border);
          }

          .email-local:focus,
          .email-domain-select:focus,
          .email-domain-input:focus {
            border-color: var(--brand);
          }

          .input-with-btn .ghost {
            background: var(--surface);
            border-color: var(--border);
            color: var(--text);
          }

          .input-with-btn .ghost:hover {
            background: var(--bg-muted);
            border-color: var(--text-muted);
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
          <div className="signup step2">
            <h1 className="title">회원가입</h1>
            <ol className="steps">
              <li>1 약관동의</li>
              <li className="on">2 정보입력</li>
              <li>3 이메일인증</li>
            </ol>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="signup-id" className="form-label">
                  아이디
                </label>
                <input
                  id="signup-id"
                  type="text"
                  className={`form-input ${errors.id ? 'error' : ''}`}
                  value={state.id}
                  onChange={(e) => setForm({ id: e.target.value })}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  aria-describedby={errors.id ? "id-error" : "id-help"}
                />
                {errors.id ? (
                  <div id="id-error" className="form-error" role="alert">
                    {errors.id}
                  </div>
                ) : (
                  <div id="id-help" className="form-help">
                    4자 이상, 영문/숫자/언더바(_)만 사용 가능
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-password" className="form-label">
                  비밀번호
                </label>
                <div className="input-with-btn">
                  <input
                    id="signup-password"
                    type={showPw ? "text" : "password"}
                    className={`form-input ${pwErr ? 'error' : ''}`}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="new-password"
                    aria-describedby="pw-help"
                    aria-invalid={!!pwErr}
                  />
                  <button
                    type="button"
                    className="password-toggle ghost"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPw ? "숨기기" : "보기"}
                  </button>
                </div>
                <div id="pw-help" className={`form-help ${pwErr ? 'error' : ''}`} role={pwErr ? "alert" : undefined}>
                  {pwErr || "8~16자, 공백 금지, 영문/숫자 포함"}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-password2" className="form-label">
                  비밀번호 확인
                </label>
                <div className="input-with-btn">
                  <input
                    id="signup-password2"
                    type={showPw2 ? "text" : "password"}
                    className={`form-input ${pw2Err ? 'error' : ''}`}
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    autoComplete="new-password"
                    aria-invalid={!!pw2Err}
                  />
                  <button
                    type="button"
                    className="password-toggle ghost"
                    onClick={() => setShowPw2(!showPw2)}
                    aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPw2 ? "숨기기" : "보기"}
                  </button>
                </div>
                {pw2 && (
                  <div className={`form-help ${pw2Err ? 'error' : 'success'}`} role={pw2Err ? "alert" : undefined}>
                    {pw2Err || "비밀번호가 일치합니다"}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">
                  이메일
                </label>
                <div className="email-field" aria-describedby="email-help">
                  <input
                    id="signup-email"
                    type="text"
                    className={`email-local ${errors.email ? 'error' : ''}`}
                    value={emailLocal}
                    onChange={(e) => {
                      setEmailLocal(e.target.value);
                      if (errors.email) setErrors({...errors, email: ""});
                    }}
                    placeholder="이메일 앞자리"
                    inputMode="email"
                    aria-invalid={!!errors.email}
                  />
                  <span className="email-at">@</span>
                  <select
                    className={`email-domain-select ${errors.email ? 'error' : ''}`}
                    value={domainMode}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDomainMode(v);
                      if (v !== "직접입력") setEmailDomain(v);
                      if (errors.email) setErrors({...errors, email: ""});
                    }}
                    aria-label="이메일 도메인 선택"
                  >
                    {EMAIL_DOMAINS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {domainMode === "직접입력" && (
                    <input
                      type="text"
                      className={`email-domain-input ${errors.email ? 'error' : ''}`}
                      value={emailDomain}
                      onChange={(e) => {
                        setEmailDomain(e.target.value);
                        if (errors.email) setErrors({...errors, email: ""});
                      }}
                      placeholder="도메인 입력 (예: gmail.com)"
                      inputMode="email"
                      aria-invalid={!!errors.email}
                    />
                  )}
                </div>
                {errors.email ? (
                  <div id="email-error" className="form-error" role="alert">
                    {errors.email}
                  </div>
                ) : (
                  <div id="email-help" className="form-help">
                    도메인을 선택하거나 직접 입력해 주세요.
                  </div>
                )}
              </div>
            </form>

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
                onClick={onNext}
                disabled={!canSubmit}
                aria-label="다음 단계로 진행하기"
              >
                이메일인증
              </button>
            </div>
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
