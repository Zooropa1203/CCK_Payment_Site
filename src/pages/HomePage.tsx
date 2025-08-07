import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Competition {
  id: number;
  name: string;
  description?: string;
  date: string;
  location: string;
  address: string;
  max_participants: number;
  registration_start: string;
  registration_end: string;
  events: string[];
  entry_fee: number;
  status: string;
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await fetch('/api/competitions');
      if (response.ok) {
        const data = await response.json();
        setCompetitions(data);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* CSS 스타일 정의 */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* 기본 스타일 */
        .custom-header {
          background-color: #ffffff;
          border-bottom: 1px solid #d1d5db;
          padding: 12px 0;
        }
        
        .custom-header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .custom-logo {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .custom-logo-image {
          height: 36px;
          width: auto;
          margin-right: 12px;
        }
        
        .custom-login-button {
          display: flex;
          align-items: center;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .custom-login-button:hover {
          color: #1d4ed8;
        }
        
        .custom-login-icon {
          margin-right: 6px;
          width: 16px;
          height: 16px;
        }
        
        .custom-main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .custom-section {
          margin-bottom: 60px;
        }
        
        .custom-section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 3px solid #2563eb;
          display: inline-block;
        }
        
        .custom-section-title.upcoming {
          border-bottom-color: #10b981;
        }
        
        .custom-table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .custom-table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
          border: 2px solid #000000;
          background-color: #ffffff;
        }
        
        .custom-table th {
          background-color: rgb(161, 161, 161);
          color: #000000;
          font-weight: 500;
          text-align: left;
          padding: 12px 16px;
          border: 1px solid #000000;
          white-space: nowrap;
        }
        
        .custom-table td {
          padding: 12px 16px;
          border: 1px solid #000000;
          color: #374151;
        }
        
        .custom-table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .custom-card-container {
          display: none;
        }
        
        .custom-card {
          background-color: #ffffff;
          border: 2px solid #000000;
          margin-bottom: 16px;
          padding: 16px;
          border-radius: 8px;
        }
        
        .custom-card-item {
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
        }
        
        .custom-card-label {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .custom-card-value {
          color: #374151;
          font-size: 16px;
        }
        
        .custom-footer {
          background-color: #f3f4f6;
          border-top: 1px solid #d1d5db;
          padding: 24px 0;
          margin-top: 60px;
        }
        
        .custom-footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .custom-footer-info {
          margin-bottom: 8px;
        }
        
        .custom-copyright {
          font-size: 12px;
          color: #9ca3af;
        }
        
        .footer-text-mobile {
          display: none;
        }
        
        .footer-text-desktop {
          display: inline;
        }
        
        /* 태블릿 스타일 (768px ~ 1023px) */
        @media (max-width: 1023px) and (min-width: 768px) {
          .custom-header-container {
            flex-direction: column;
            gap: 12px;
            align-items: center;
            padding: 16px 20px;
          }
          
          .custom-logo {
            font-size: 16px;
          }
          
          .custom-logo-image {
            height: 32px;
            margin-right: 10px;
          }
          
          .custom-main-content {
            padding: 30px 16px;
          }
          
          .custom-section {
            margin-bottom: 40px;
          }
          
          .custom-table {
            min-width: 700px;
          }
        }
        
        /* 모바일 스타일 (< 768px) */
        @media (max-width: 767px) {
          .custom-header-container {
            flex-direction: column;
            gap: 12px;
            align-items: center;
            padding: 16px 12px;
          }
          
          .custom-logo {
            font-size: 16px;
          }
          
          .custom-logo-image {
            height: 28px;
            margin-right: 8px;
          }
          
          .custom-main-content {
            padding: 20px 12px;
          }
          
          .custom-section {
            margin-bottom: 32px;
          }
          
          .custom-section-title {
            font-size: 18px;
            text-align: center;
            display: block;
            margin-bottom: 16px;
          }
          
          .custom-table-container {
            display: none;
          }
          
          .custom-card-container {
            display: block;
          }
          
          .custom-footer-content {
            padding: 0 12px;
            font-size: 12px;
          }
          
          .custom-footer-info {
            line-height: 1.8;
          }
          
          .footer-text-desktop {
            display: none;
          }
          
          .footer-text-mobile {
            display: inline;
          }
        }
        
        /* 작은 모바일 화면 (< 480px) */
        @media (max-width: 479px) {
          .custom-main-content {
            padding: 16px 8px;
          }
          
          .custom-card {
            padding: 12px;
          }
          
          .custom-section-title {
            font-size: 16px;
          }
        }
      `
      }} />

      {/* 헤더 */}
      <header className="custom-header">
        <div className="custom-header-container">
          <div className="custom-logo">
            <img 
              src="/images/CCK_LOGO.png" 
              alt="CCK Logo" 
              className="custom-logo-image"
            />
            Cubing Club Korea
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.name}님</span>
              <button onClick={logout} className="custom-login-button">
                로그아웃
              </button>
              {(user.role === 'administrator' || user.role === 'organizer') && (
                <Link to="/admin" className="custom-login-button">
                  관리자
                </Link>
              )}
            </div>
          ) : (
            <Link to="/login" className="custom-login-button">
              <svg className="custom-login-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="custom-main-content">
        {/* 접수 진행중인 행사 섹션 */}
        <section className="custom-section">
          <h2 className="custom-section-title">접수 진행중인 행사</h2>
          
          {/* 테이블 형식 (PC/태블릿) */}
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>날짜</th>
                  <th style={{ width: '50%' }}>대회명</th>
                  <th style={{ width: '30%' }}>장소</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>##2025-09-15##</td>
                  <td>##서울 큐브 오픈 2025##</td>
                  <td>##서울시 강남구##</td>
                </tr>
                <tr>
                  <td>##2025-09-22##</td>
                  <td>##부산 스피드큐빙 대회##</td>
                  <td>##부산시 해운대구##</td>
                </tr>
                <tr>
                  <td>##2025-10-05##</td>
                  <td>##대구 큐브 챔피언십##</td>
                  <td>##대구시 중구##</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* 카드 형식 (모바일) */}
          <div className="custom-card-container">
            <div className="custom-card">
              <div className="custom-card-item">
                <div className="custom-card-label">날짜</div>
                <div className="custom-card-value">##2025-09-15##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">대회명</div>
                <div className="custom-card-value">##서울 큐브 오픈 2025##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">장소</div>
                <div className="custom-card-value">##서울시 강남구##</div>
              </div>
            </div>
            
            <div className="custom-card">
              <div className="custom-card-item">
                <div className="custom-card-label">날짜</div>
                <div className="custom-card-value">##2025-09-22##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">대회명</div>
                <div className="custom-card-value">##부산 스피드큐빙 대회##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">장소</div>
                <div className="custom-card-value">##부산시 해운대구##</div>
              </div>
            </div>
            
            <div className="custom-card">
              <div className="custom-card-item">
                <div className="custom-card-label">날짜</div>
                <div className="custom-card-value">##2025-10-05##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">대회명</div>
                <div className="custom-card-value">##대구 큐브 챔피언십##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">장소</div>
                <div className="custom-card-value">##대구시 중구##</div>
              </div>
            </div>
          </div>
        </section>

        {/* 접수 예정인 행사 섹션 */}
        <section className="custom-section">
          <h2 className="custom-section-title upcoming">접수 예정인 행사</h2>
          
          {/* 테이블 형식 (PC/태블릿) */}
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>날짜</th>
                  <th style={{ width: '50%' }}>대회명</th>
                  <th style={{ width: '30%' }}>장소</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>##2025-11-10##</td>
                  <td>##전국 큐브 마스터즈##</td>
                  <td>##인천시 남동구##</td>
                </tr>
                <tr>
                  <td>##2025-11-24##</td>
                  <td>##겨울 큐브 페스티벌##</td>
                  <td>##광주시 서구##</td>
                </tr>
                <tr>
                  <td>##2025-12-08##</td>
                  <td>##연말 큐브 그랑프리##</td>
                  <td>##울산시 남구##</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* 카드 형식 (모바일) */}
          <div className="custom-card-container">
            <div className="custom-card">
              <div className="custom-card-item">
                <div className="custom-card-label">날짜</div>
                <div className="custom-card-value">##2025-11-10##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">대회명</div>
                <div className="custom-card-value">##전국 큐브 마스터즈##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">장소</div>
                <div className="custom-card-value">##인천시 남동구##</div>
              </div>
            </div>
            
            <div className="custom-card">
              <div className="custom-card-item">
                <div className="custom-card-label">날짜</div>
                <div className="custom-card-value">##2025-11-24##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">대회명</div>
                <div className="custom-card-value">##겨울 큐브 페스티벌##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">장소</div>
                <div className="custom-card-value">##광주시 서구##</div>
              </div>
            </div>
            
            <div className="custom-card">
              <div className="custom-card-item">
                <div className="custom-card-label">날짜</div>
                <div className="custom-card-value">##2025-12-08##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">대회명</div>
                <div className="custom-card-value">##연말 큐브 그랑프리##</div>
              </div>
              <div className="custom-card-item">
                <div className="custom-card-label">장소</div>
                <div className="custom-card-value">##울산시 남구##</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="custom-footer">
        <div className="custom-footer-content">
          <div className="custom-footer-info">
            <span className="footer-text-desktop">큐빙클럽코리아 | 사업자등록번호 : 358-54-00896 | 대표 : 정현재 | 이메일 : cubingclubkorea@gmail.com</span>
            <span className="footer-text-mobile">
              큐빙클럽코리아<br />
              사업자등록번호 : 358-54-00896<br />
              대표 : 정현재<br />
              이메일 : cubingclubkorea@gmail.com
            </span>
          </div>
          <div className="custom-copyright">
            COPYRIGHT © Cubing Club Korea
          </div>
        </div>
      </footer>
    </div>
  );
}
