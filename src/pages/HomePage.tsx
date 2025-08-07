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
        
        .custom-table {
          width: 100%;
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
        }
        
        .custom-table td {
          padding: 12px 16px;
          border: 1px solid #000000;
          color: #374151;
        }
        
        .custom-table tr:nth-child(even) {
          background-color: #f9fafb;
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
        </section>

        {/* 접수 예정인 행사 섹션 */}
        <section className="custom-section">
          <h2 className="custom-section-title upcoming">접수 예정인 행사</h2>
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
        </section>
      </main>

      {/* 푸터 */}
      <footer className="custom-footer">
        <div className="custom-footer-content">
          <div className="custom-footer-info">
            큐빙클럽코리아 | 사업자등록번호 : 358-54-00896 | 대표 : 정현재 | 이메일 : cubingclubkorea@gmail.com
          </div>
          <div className="custom-copyright">
            COPYRIGHT © Cubing Club Korea
          </div>
        </div>
      </footer>
    </div>
  );
}
