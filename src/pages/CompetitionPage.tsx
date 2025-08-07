import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  schedule?: any;
}

interface Participant {
  name: string;
  cck_id?: string;
  events: string[];
  status: string;
}

type TabType = 'general' | 'schedule' | 'participants' | 'waitlist';

export default function CompetitionPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [waitlist, setWaitlist] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompetitionData();
    }
  }, [id]);

  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      
      // Fetch competition details
      const [compResponse, participantsResponse, waitlistResponse] = await Promise.all([
        fetch(`/api/competitions/${id}`),
        fetch(`/api/competitions/${id}/participants`),
        fetch(`/api/competitions/${id}/waitlist`)
      ]);

      if (compResponse.ok) {
        const compData = await compResponse.json();
        setCompetition(compData);
      }

      if (participantsResponse.ok) {
        const participantsData = await participantsResponse.json();
        setParticipants(participantsData);
      }

      if (waitlistResponse.ok) {
        const waitlistData = await waitlistResponse.json();
        setWaitlist(waitlistData);
      }
    } catch (error) {
      console.error('Error fetching competition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationStatus = () => {
    if (!competition) return null;
    
    const now = new Date();
    const registrationStart = new Date(competition.registration_start);
    const registrationEnd = new Date(competition.registration_end);

    if (now < registrationStart) {
      return { status: 'upcoming', text: '접수 예정', color: 'gray' };
    } else if (now >= registrationStart && now <= registrationEnd) {
      return { status: 'open', text: '접수 중', color: 'green' };
    } else {
      return { status: 'closed', text: '접수 마감', color: 'red' };
    }
  };

  const canRegister = () => {
    const regStatus = getRegistrationStatus();
    return regStatus?.status === 'open' && user;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          대회를 찾을 수 없습니다
        </h1>
        <Link to="/" className="btn-primary">
          메인 페이지로 돌아가기
        </Link>
      </div>
    );
  }

  const registrationStatus = getRegistrationStatus();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {competition.name}
        </h1>
        {competition.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {competition.description}
          </p>
        )}
        <div className="mt-4 flex justify-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            registrationStatus?.color === 'green' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : registrationStatus?.color === 'red'
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {registrationStatus?.text}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'general', label: '일반' },
            { id: 'schedule', label: '일정' },
            { id: 'participants', label: '참가자 명단' },
            { id: 'waitlist', label: '대기자 명단' }
          ].map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'participants' && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                    {participants.length}
                  </span>
                )}
                {tab.id === 'waitlist' && waitlist.length > 0 && (
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full text-xs">
                    {waitlist.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'general' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Competition Info */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                대회 정보
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {competition.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {competition.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-900 dark:text-gray-100">
                    {format(new Date(competition.date), 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-900 dark:text-gray-100">
                    정원 {competition.max_participants}명
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-900 dark:text-gray-100">
                    참가비 {competition.entry_fee.toLocaleString()}원
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    접수 기간
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(competition.registration_start), 'yyyy년 M월 d일')} - {format(new Date(competition.registration_end), 'yyyy년 M월 d일')}
                  </p>
                </div>
              </div>
            </div>

            {/* Events & Actions */}
            <div className="space-y-6">
              {/* Events */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  대회 종목
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {competition.events.map((event, index) => (
                    <div
                      key={index}
                      className="p-3 bg-primary-50 dark:bg-primary-900 rounded-lg text-center"
                    >
                      <span className="text-primary-700 dark:text-primary-300 font-medium">
                        {event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card p-6">
                <div className="space-y-3">
                  {canRegister() ? (
                    <>
                      <Link
                        to={`/competition/${competition.id}/register`}
                        className="btn-primary w-full text-center block"
                      >
                        행사 접수
                      </Link>
                      <button className="btn-secondary w-full">
                        종목 변경
                      </button>
                    </>
                  ) : !user ? (
                    <div className="text-center space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        접수하려면 로그인이 필요합니다
                      </p>
                      <Link to="/login" className="btn-primary w-full text-center block">
                        로그인 / 회원가입
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        접수 기간이 아닙니다
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              대회 일정표
            </h3>
            {competition.schedule ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">시간</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">종목</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Schedule data would be rendered here */}
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">09:00 - 09:30</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">등록</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">참가자 등록 및 체크인</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">09:30 - 10:00</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">연습</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">자유 연습 시간</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                일정표가 아직 공개되지 않았습니다.
              </p>
            )}
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              참가자 명단 ({participants.length}명)
            </h3>
            {participants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">이름</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">CCK 아이디</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">참가 종목</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                          {participant.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {participant.cck_id || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {participant.events.map((event, eventIndex) => (
                              <span
                                key={eventIndex}
                                className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                아직 참가자가 없습니다.
              </p>
            )}
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              대기자 명단 ({waitlist.length}명)
            </h3>
            {waitlist.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">순번</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">이름</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">CCK 아이디</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">참가 등록</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlist.map((person, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                          {person.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {person.cck_id || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {person.events.map((event, eventIndex) => (
                              <span
                                key={eventIndex}
                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                대기자가 없습니다.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Link to="/" className="btn-secondary">
          ← 대회 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
