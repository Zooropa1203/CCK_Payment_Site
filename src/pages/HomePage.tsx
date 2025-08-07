import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, UsersIcon, CurrencyYenIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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

  const getStatusBadge = (competition: Competition) => {
    const now = new Date();
    const registrationStart = new Date(competition.registration_start);
    const registrationEnd = new Date(competition.registration_end);
    const competitionDate = new Date(competition.date);

    if (now < registrationStart) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">등록 예정</span>;
    } else if (now >= registrationStart && now <= registrationEnd) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">접수 중</span>;
    } else if (now > registrationEnd && now < competitionDate) {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">접수 마감</span>;
    } else if (now >= competitionDate) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">종료</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          루빅스 큐브 대회
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          최신 루빅스 큐브 대회 정보를 확인하고 온라인으로 접수하세요.
        </p>
      </div>

      {/* Competitions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {competitions.map((competition) => (
          <div key={competition.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {competition.name}
              </h3>
              {getStatusBadge(competition)}
            </div>

            {competition.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {competition.description}
              </p>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>
                  {format(new Date(competition.date), 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>{competition.location}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <UsersIcon className="w-4 h-4 mr-2" />
                <span>정원 {competition.max_participants}명</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CurrencyYenIcon className="w-4 h-4 mr-2" />
                <span>참가비 {competition.entry_fee.toLocaleString()}원</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">종목:</p>
              <div className="flex flex-wrap gap-1">
                {competition.events.map((event, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">접수 기간:</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {format(new Date(competition.registration_start), 'M/d')} - {format(new Date(competition.registration_end), 'M/d')}
              </p>
            </div>

            <Link
              to={`/competition/${competition.id}`}
              className="btn-primary w-full text-center block"
            >
              상세 보기
            </Link>
          </div>
        ))}
      </div>

      {competitions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            현재 등록된 대회가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
