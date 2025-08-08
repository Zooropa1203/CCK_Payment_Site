import React, { useState, useEffect } from 'react';

// 더미 데이터 사용 여부 (true=샘플 표시, false=모두 없음 상태)
// URL 쿼리로도 제어 가능: ?dummy=true | ?dummy=false
const getUseDummy = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const dummyParam = urlParams.get('dummy');
  if (dummyParam === 'true') return true;
  if (dummyParam === 'false') return false;
  return true; // 기본값
};

interface Competition {
  id: number;
  date: string;
  name: string;
  location: string;
}

const HomePage_new: React.FC = () => {
  const [useDummy, setUseDummy] = useState<boolean>(getUseDummy());
  const [ongoingCompetitions, setOngoingCompetitions] = useState<Competition[]>([]);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<Competition[]>([]);

  // 더미 데이터
  const dummyOngoing: Competition[] = [
    { id: 1, date: '2025-08-15', name: '2025 큐빙클럽코리아 여름 대회', location: '서울시립청소년미디어센터' },
    { id: 2, date: '2025-08-22', name: '제5회 부산 오픈', location: '부산문화회관' },
  ];

  const dummyUpcoming: Competition[] = [
    { id: 3, date: '2025-09-01', name: '2025 추석 특별대회', location: '대전컨벤션센터' },
    { id: 4, date: '2025-09-15', name: '제3회 대구 챔피언십', location: '대구 EXCO' },
    { id: 5, date: '2025-09-29', name: '2025 가을 정기대회', location: '서울올림픽공원' },
  ];

  useEffect(() => {
    if (useDummy) {
      setOngoingCompetitions(dummyOngoing);
      setUpcomingCompetitions(dummyUpcoming);
    } else {
      setOngoingCompetitions([]);
      setUpcomingCompetitions([]);
    }
  }, [useDummy]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #ffffff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* 헤더 스타일 */
        .header {
          background-color: #e5e5e5;
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid #d1d5db;
        }

        .header-content {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          color: #333333;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .header-right:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .profile-icon {
          height: 36px;
          width: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .login-text {
          font-size: 16px;
          color: #333333;
          font-weight: 500;
        }

        /* 메인 콘텐츠 */
        .main-content {
          flex: 1;
          padding: 40px 0;
        }

        .section {
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: #333333;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 8px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background-color: #3b82f6;
        }

        .section-title.upcoming::after {
          background-color: #10b981;
        }

        /* 테이블 스타일 */
        .table-container {
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .competition-table {
          width: 100%;
          border-collapse: collapse;
        }

        .competition-table caption {
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

        .competition-table thead th {
          background-color: #8b8b8b;
          color: #ffffff;
          font-weight: 600;
          padding: 16px;
          text-align: left;
          border-bottom: 2px solid #6b7280;
        }

        .competition-table tbody td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .competition-table tbody tr:last-child td {
          border-bottom: none;
        }

        .competition-table tbody tr:hover {
          background-color: #f9fafb;
        }

        /* 빈 상태 메시지 */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
          font-size: 16px;
        }

        /* 푸터 스타일 */
        .footer {
          background-color: #f3f4f6;
          padding: 24px 0;
          border-top: 1px solid #e5e7eb;
          margin-top: auto;
        }

        .footer-content {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .footer-line {
          margin-bottom: 8px;
        }

        .footer-line:last-child {
          margin-bottom: 0;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }

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

          .main-content {
            padding: 24px 0;
          }

          .section {
            margin-bottom: 40px;
          }

          .section-title {
            font-size: 20px;
          }

          .competition-table {
            font-size: 14px;
          }

          .competition-table thead th,
          .competition-table tbody td {
            padding: 12px 8px;
          }

          .footer-content {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .competition-table thead th,
          .competition-table tbody td {
            padding: 8px 4px;
            font-size: 12px;
          }

          .section-title {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="page-wrapper">
        {/* 헤더 */}
        <header className="header">
          <div className="header-left">
            <img 
              src="/images/cck_logo.png" 
              alt="Cubing Club Korea 로고" 
              className="logo"
            />
            <h1 className="site-name">Cubing Club Korea</h1>
          </div>
          <div className="header-right" onClick={handleLoginClick}>
            <img 
              src="/images/person_icon.png" 
              alt="사용자 프로필" 
              className="profile-icon"
            />
            <span className="login-text">로그인</span>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="main-content">
          <div className="container">
            {/* 접수 진행중인 행사 섹션 */}
            <section className="section">
              <h2 className="section-title">접수 진행중인 행사</h2>
              {ongoingCompetitions.length > 0 ? (
                <div className="table-container">
                  <table className="competition-table">
                    <caption>접수 진행중인 행사 목록</caption>
                    <thead>
                      <tr>
                        <th scope="col">날짜</th>
                        <th scope="col">대회명</th>
                        <th scope="col">장소</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ongoingCompetitions.map((competition) => (
                        <tr key={competition.id}>
                          <td>{formatDate(competition.date)}</td>
                          <td>{competition.name}</td>
                          <td>{competition.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>접수 진행중인 행사가 없습니다.</p>
                </div>
              )}
            </section>

            {/* 접수 예정인 행사 섹션 */}
            <section className="section">
              <h2 className="section-title upcoming">접수 예정인 행사</h2>
              {upcomingCompetitions.length > 0 ? (
                <div className="table-container">
                  <table className="competition-table">
                    <caption>접수 예정인 행사 목록</caption>
                    <thead>
                      <tr>
                        <th scope="col">날짜</th>
                        <th scope="col">대회명</th>
                        <th scope="col">장소</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingCompetitions.map((competition) => (
                        <tr key={competition.id}>
                          <td>{formatDate(competition.date)}</td>
                          <td>{competition.name}</td>
                          <td>{competition.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>접수 예정인 행사가 없습니다.</p>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* 푸터 */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-line">
                큐빙클럽코리아 | 사업자등록번호 : 358-54-00896 | 대표 : 정현재 | 이메일 : cubingclubkorea@gmail.com
              </div>
              <div className="footer-line">
                COPYRIGHT © Cubing Club Korea
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage_new;
