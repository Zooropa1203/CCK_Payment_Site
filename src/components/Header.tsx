import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <style>{`
        :root {
          --header-height: 64px;
          --bg-header: #e5e5e5;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-header: #1a1a1a;
          }
        }

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
          font-weight: 700;
          margin: 0;
          color: var(--text);
        }

        .header-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.2s;
        }

        .header-link:hover {
          opacity: 0.8;
          text-decoration: none;
        }

        .header-link:focus-visible {
          outline: 2px solid var(--brand, #2563eb);
          outline-offset: 2px;
          border-radius: 4px;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .header {
            padding: 0 16px;
          }

          .site-name {
            font-size: 18px;
          }

          .logo {
            height: 32px;
          }
        }

        @media (max-width: 480px) {
          .site-name {
            display: none;
          }
        }
      `}</style>
      
      <header className="header" role="banner">
        <div className="header-left">
          <Link to="/" className="header-link" aria-label="홈으로 이동">
            <img 
              src="/images/cck_logo.png" 
              alt="Cubing Club Korea 로고" 
              className="logo"
            />
            <h1 className="site-name">Cubing Club Korea</h1>
          </Link>
        </div>
      </header>
    </>
  );
}
