import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  IdentificationIcon,
  KeyIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';

interface Registration {
  id: number;
  competition_name: string;
  competition_date: string;
  competition_location: string;
  events: string[];
  status: string;
  payment_status: string;
  registered_at: string;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cck_id: user?.cck_id || ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        cck_id: user.cck_id || ''
      });
    }
  }, [user]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/users/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        setMessage('프로필이 성공적으로 업데이트되었습니다.');
        setEditing(false);
        // Context의 user 정보도 업데이트 필요 (실제로는 refetch 또는 context 업데이트)
        window.location.reload(); // 임시 해결책
      } else {
        const data = await response.json();
        setError(data.message || '프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setMessage('비밀번호가 성공적으로 변경되었습니다.');
        setChangingPassword(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const data = await response.json();
        setError(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'waitlist':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {user?.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'administrator' ? '관리자' : 
           user?.role === 'organizer' ? '주최자' : '일반 회원'}
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="card p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700">
          <p className="text-green-700 dark:text-green-300 text-sm">{message}</p>
        </div>
      )}

      {error && (
        <div className="card p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                개인 정보
              </h2>
              <button
                onClick={() => {
                  setEditing(!editing);
                  setError('');
                  setMessage('');
                }}
                className="btn-secondary text-sm"
              >
                {editing ? '취소' : '편집'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="input-field"
                    placeholder="010-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CCK 아이디
                  </label>
                  <input
                    type="text"
                    value={profileForm.cck_id}
                    onChange={(e) => setProfileForm({...profileForm, cck_id: e.target.value})}
                    className="input-field"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  저장
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">이메일</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">전화번호</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user?.phone || '등록되지 않음'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <IdentificationIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">CCK 아이디</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user?.cck_id || '등록되지 않음'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                비밀번호 변경
              </h2>
              <button
                onClick={() => {
                  setChangingPassword(!changingPassword);
                  setError('');
                  setMessage('');
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="btn-secondary text-sm flex items-center space-x-2"
              >
                <KeyIcon className="w-4 h-4" />
                <span>{changingPassword ? '취소' : '변경'}</span>
              </button>
            </div>

            {changingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="input-field"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  비밀번호 변경
                </button>
              </form>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                보안을 위해 정기적으로 비밀번호를 변경해주세요.
              </p>
            )}
          </div>
        </div>

        {/* Registration History */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            참가 내역
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : registrations.length > 0 ? (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div key={registration.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {registration.competition_name}
                    </h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(registration.status)}`}>
                        {registration.status === 'confirmed' ? '확정' :
                         registration.status === 'pending' ? '대기' :
                         registration.status === 'waitlist' ? '대기자' : '취소'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(registration.payment_status)}`}>
                        {registration.payment_status === 'completed' ? '결제완료' :
                         registration.payment_status === 'pending' ? '결제대기' : '결제실패'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {format(new Date(registration.competition_date), 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{registration.competition_location}</span>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">참가 종목:</p>
                      <div className="flex flex-wrap gap-1">
                        {registration.events.map((event, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs">
                      접수일: {format(new Date(registration.registered_at), 'yyyy년 M월 d일')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                아직 참가한 대회가 없습니다.
              </p>
              <a href="/" className="text-primary-600 hover:text-primary-500 text-sm">
                대회 둘러보기 →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
