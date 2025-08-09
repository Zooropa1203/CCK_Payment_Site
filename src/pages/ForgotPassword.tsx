import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/auth.css';

export default function ForgotPassword() {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  
  const canSubmit = value.trim().length > 0; // 어떤 글씨든 1자 이상이면 활성화

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || sending) return;
    
    try {
      setSending(true);
      setMsg(null);
      setIsError(false);
      
      // Stub API — 실제 백엔드 연동 시 교체
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrText: value })
      });
      
      if (!res.ok) throw new Error('request failed');
      
      setMsg('입력하신 주소로 임시 비밀번호 또는 재설정 링크를 보냈습니다. 메일함(스팸 포함)을 확인해 주세요.');
      setIsError(false);
    } catch (err) {
      setMsg('요청 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setIsError(true);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit && !sending) {
      onSubmit(e as any);
    }
  };

  return (
    <>
      <Header />
      <main className="auth-page" aria-labelledby="forgot-title">
        <form className="auth-card" onSubmit={onSubmit} noValidate>
          <h1 id="forgot-title" className="title">비밀번호 찾기</h1>
          
          <div className="field">
            <label htmlFor="forgot-input">
              회원가입 시 입력한 이메일 주소
            </label>
            <input
              id="forgot-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예) example@gmail.com"
              aria-describedby="forgot-help"
            />
            <small id="forgot-help" className="hint">
              아무 글씨라도 입력 시 "임시 비밀번호 받기" 버튼이 활성화됩니다.
            </small>
          </div>

          <button
            type="submit"
            className="primary lg"
            disabled={!canSubmit || sending}
          >
            {sending ? '요청 중...' : '임시 비밀번호 받기'}
          </button>

          {msg && (
            <div
              className={`message ${isError ? 'error' : 'success'}`}
              role={isError ? 'alert' : 'status'}
              aria-live="polite"
            >
              {msg}
            </div>
          )}

          <div className="auth-bottom" aria-label="빠른 이동">
            <Link to="/login" className="text-link">
              로그인
            </Link>
            <Link to="/signup" className="text-link">
              회원가입
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
