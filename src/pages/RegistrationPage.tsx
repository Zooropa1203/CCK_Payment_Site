import { CheckIcon, CurrencyYenIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

interface Competition {
  id: number;
  name: string;
  date: string;
  location: string;
  events: string[];
  entry_fee: number;
  max_participants: number;
}

interface EventSelection {
  [key: string]: boolean;
}

// 루빅스 큐브 종목별 아이콘 (이모지로 표현)
const eventIcons: { [key: string]: string } = {
  '3x3x3': '🧩',
  '2x2x2': '🔶',
  '4x4x4': '🟦',
  '5x5x5': '🟪',
  '6x6x6': '⬜',
  '7x7x7': '⬛',
  '3x3x3 One-Handed': '🖐️',
  '3x3x3 Blindfolded': '👁️',
  '3x3x3 Feet': '🦶',
  'Pyraminx': '🔺',
  'Megaminx': '⬟',
  'Skewb': '◊',
  'Square-1': '⬜',
  'Clock': '🕐',
  '3x3x3 Multi-Blind': '👁️‍🗨️',
  '4x4x4 Blindfolded': '👁️',
  '5x5x5 Blindfolded': '👁️'
};

export default function RegistrationPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<EventSelection>({});
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCompetition();
    }
  }, [id]);

  const fetchCompetition = async () => {
    try {
      const response = await fetch(`/api/competitions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCompetition(data);
      } else {
        setError('대회 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching competition:', error);
      setError('대회 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventToggle = (event: string) => {
    setSelectedEvents(prev => ({
      ...prev,
      [event]: !prev[event]
    }));
  };

  const getSelectedEventsList = () => {
    return Object.keys(selectedEvents).filter(event => selectedEvents[event]);
  };

  const handleRegistration = async () => {
    const selected = getSelectedEventsList();
    
    if (selected.length === 0) {
      setError('최소 하나의 종목을 선택해주세요.');
      return;
    }

    setRegistering(true);
    setError('');

    try {
      const response = await fetch('/api/payments/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          competition_id: parseInt(id!),
          events: selected
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'pending') {
          // 결제 진행
          await initiatePayment(data.payment_id, data.amount);
        } else if (data.status === 'waitlist') {
          // 대기자 등록 완료
          setRegistrationComplete(true);
        }
      } else {
        setError(data.message || '접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('접수 중 오류가 발생했습니다.');
    } finally {
      setRegistering(false);
    }
  };

  const initiatePayment = async (paymentId: string, amount: number) => {
    // 토스 페이먼츠 연동 (실제 구현 시 토스 페이먼츠 SDK 사용)
    try {
      // 여기서 토스 페이먼츠 위젯을 호출
      // 현재는 시뮬레이션으로 처리
      const paymentSuccess = await simulatePayment(paymentId, amount);
      
      if (paymentSuccess) {
        setRegistrationComplete(true);
      } else {
        setError('결제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('결제 중 오류가 발생했습니다.');
    }
  };

  // 결제 시뮬레이션 (실제로는 토스 페이먼츠 API 호출)
  const simulatePayment = async (paymentId: string, amount: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% 확률로 성공
        resolve(Math.random() > 0.1);
      }, 2000);
    });
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

  if (registrationComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card p-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            접수가 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {competition.name} 대회 접수가 성공적으로 완료되었습니다.
          </p>
          <div className="space-y-4">
            <Link 
              to={`/competition/${competition.id}`}
              className="btn-primary w-full block text-center"
            >
              대회 페이지로 돌아가기
            </Link>
            <Link 
              to="/profile"
              className="btn-secondary w-full block text-center"
            >
              내 접수 내역 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedCount = getSelectedEventsList().length;
  const totalFee = competition.entry_fee * selectedCount;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          대회 접수
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {competition.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          참가하고 싶은 종목을 선택해주세요 (복수 선택 가능)
        </p>
      </div>

      {/* User Info */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          참가자 정보
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">이름:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {user?.name}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">이메일:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {user?.email}
            </span>
          </div>
          {user?.cck_id && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">CCK 아이디:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                {user.cck_id}
              </span>
            </div>
          )}
          {user?.phone && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">전화번호:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                {user.phone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Event Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          종목 선택
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {competition.events.map((event) => (
            <button
              key={event}
              onClick={() => handleEventToggle(event)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedEvents[event]
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {eventIcons[event] || '🧩'}
                </div>
                <div className="text-sm font-medium">
                  {event}
                </div>
                {selectedEvents[event] && (
                  <div className="mt-2">
                    <CheckIcon className="w-5 h-5 text-primary-600 mx-auto" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fee Summary */}
      {selectedCount > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            참가비 안내
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                선택한 종목 ({selectedCount}개)
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {getSelectedEventsList().join(', ')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                종목당 참가비
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {competition.entry_fee.toLocaleString()}원
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-gray-100">총 참가비</span>
                <span className="text-primary-600 dark:text-primary-400 text-lg">
                  {totalFee.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Payment Button */}
      <div className="card p-6">
        <button
          onClick={handleRegistration}
          disabled={selectedCount === 0 || registering}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CurrencyYenIcon className="w-5 h-5" />
          <span>
            {registering 
              ? '처리 중...' 
              : selectedCount === 0 
                ? '종목을 선택해주세요'
                : `결제하기 (${totalFee.toLocaleString()}원)`
            }
          </span>
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            참가자 정원 초과 시 자동으로 대기자 명단에 등록됩니다.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="text-center">
        <Link 
          to={`/competition/${competition.id}`}
          className="btn-secondary"
        >
          ← 대회 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
