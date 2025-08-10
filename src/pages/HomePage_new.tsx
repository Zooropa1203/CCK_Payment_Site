import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [useDummy, _setUseDummy] = useState<boolean>(getUseDummy());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ongoingCompetitions, setOngoingCompetitions] = useState<Competition[]>([]);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<Competition[]>([]);

  // 더미 데이터 - 메모이제이션
  const dummyOngoing: Competition[] = useMemo(() => [
    { id: 1, date: '2025-08-15', name: '2025 큐빙클럽코리아 여름 대회', location: '서울시립청소년미디어센터' },
    { id: 2, date: '2025-08-22', name: '제5회 부산 오픈', location: '부산문화회관' },
  ], []);

  const dummyUpcoming: Competition[] = useMemo(() => [
    { id: 3, date: '2025-09-01', name: '2025 추석 특별대회', location: '대전컨벤션센터' },
    { id: 4, date: '2025-09-15', name: '제3회 대구 챔피언십', location: '대구 EXCO' },
    { id: 5, date: '2025-09-29', name: '2025 가을 정기대회', location: '서울올림픽공원' },
  ], []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (useDummy) {
        setOngoingCompetitions(dummyOngoing);
        setUpcomingCompetitions(dummyUpcoming);
      } else {
        setOngoingCompetitions([]);
        setUpcomingCompetitions([]);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [useDummy, dummyOngoing, dummyUpcoming]);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }, []);

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
          --table-header-bg: #8b8b8b;
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
            --table-header-bg: #1b2430;
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

        .container {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
        }

        /* 페이지 레이아웃 */
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
          color: var(--text);
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
          background-color: var(--brand);
        }

        .section-title.upcoming::after {
          background-color: var(--brand-secondary);
        }

        /* 테이블 기본 스타일 */
        .table-container {
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          overflow: hidden;
          background-color: var(--surface);
          box-shadow: var(--shadow);
        }

        .competition-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--surface);
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

        .competition-table th,
        .competition-table td {
          border-bottom: 1px solid var(--border-light);
          padding: 16px;
          text-align: left;
        }

        .competition-table thead th {
          background-color: var(--table-header-bg);
          color: var(--text-on-dark);
          font-weight: 600;
          border-bottom: 2px solid var(--border-dark);
        }

        .competition-table tbody td {
          color: var(--text);
        }

        .competition-table tbody tr:last-child td {
          border-bottom: none;
        }

        .competition-table tbody tr:hover {
          background-color: var(--table-hover);
        }

        /* 빈 상태 메시지 */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
          font-size: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
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
        }

        /* 로딩 및 에러 상태 스타일 */
        .loading-state, .error-state {
          text-align: center;
          padding: 60px 20px;
          font-size: 16px;
        }

        .loading-state {
          color: var(--text-muted);
        }

        .error-state {
          color: #dc2626;
          background-color: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: var(--border-radius);
          margin: 20px 0;
        }

        .footer-line {
          margin-bottom: 8px;
        }

        .footer-line:last-child {
          margin-bottom: 0;
        }

        /* 1024px 이하: 가로 스크롤 */
        @media (max-width: 1024px) {
          .table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .competition-table {
            min-width: 600px;
          }
        }

        /* 768px 이하: 카드형 전환 (data-label 사용) */
        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
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

          .footer-content {
            font-size: 12px;
          }

          /* 테이블 -> 카드형 전환 */
          .competition-table thead {
            display: none;
          }

          .competition-table,
          .competition-table tbody,
          .competition-table tr,
          .competition-table td {
            display: block;
            width: 100%;
          }

          .competition-table tr {
            border: 1px solid var(--border);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            background: var(--surface);
            margin-bottom: 12px;
          }

          .competition-table td {
            position: relative;
            padding-left: 120px;
            min-height: 44px;
            border-bottom: 1px solid var(--border-light);
          }

          .competition-table tr:last-child td:last-child {
            border-bottom: none;
          }

          .competition-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 12px;
            top: 12px;
            width: 96px;
            font-weight: 600;
            color: var(--text-muted);
            text-align: left;
            white-space: nowrap;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 18px;
          }

          .competition-table td {
            padding-left: 100px;
            font-size: 14px;
          }

          .competition-table td::before {
            width: 80px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="page-wrapper">
        {/* 메인 콘텐츠 */}
        <main className="main-content">
          <div className="container">
            {/* 에러 상태 */}
            {error && (
              <div className="error-state">
                <p>{error}</p>
              </div>
            )}

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="loading-state">
                <p>데이터를 불러오는 중입니다...</p>
              </div>
            )}

            {/* 정상 상태 - 접수 진행중인 행사 섹션 */}
            {!isLoading && !error && (
              <>
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
                            <tr 
                              key={competition.id}
                              role="button"
                              tabIndex={0}
                              className="row-clickable"
                              onClick={() => navigate(`/competitions/${competition.id}`)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  navigate(`/competitions/${competition.id}`);
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <td data-label="날짜">{formatDate(competition.date)}</td>
                              <td data-label="대회명">{competition.name}</td>
                              <td data-label="장소">{competition.location}</td>
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
                            <tr 
                              key={competition.id}
                              role="button"
                              tabIndex={0}
                              className="row-clickable"
                              onClick={() => navigate(`/competitions/${competition.id}`)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  navigate(`/competitions/${competition.id}`);
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <td data-label="날짜">{formatDate(competition.date)}</td>
                              <td data-label="대회명">{competition.name}</td>
                              <td data-label="장소">{competition.location}</td>
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
              </>
            )}
          </div>
        </main>

        {/* 푸터 */}
        <footer className="footer" role="contentinfo">
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

export default React.memo(HomePage_new);
