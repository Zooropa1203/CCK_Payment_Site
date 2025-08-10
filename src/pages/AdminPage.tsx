import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';

interface Competition {
  id: number;
  name: string;
  date: string;
  location: string;
  max_participants: number;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  cck_id?: string;
  role: string;
  created_at: string;
}

type TabType = 'competitions' | 'users';

export default function AdminPage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('competitions');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Competition form state
  const [competitionForm, setCompetitionForm] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    address: '',
    max_participants: 100,
    registration_start: '',
    registration_end: '',
    events: [] as string[],
    entry_fee: 0,
  });

  const availableEvents = [
    '3x3x3',
    '2x2x2',
    '4x4x4',
    '5x5x5',
    '6x6x6',
    '7x7x7',
    '3x3x3 One-Handed',
    '3x3x3 Blindfolded',
    '3x3x3 Feet',
    'Pyraminx',
    'Megaminx',
    'Skewb',
    'Square-1',
    'Clock',
    '3x3x3 Multi-Blind',
    '4x4x4 Blindfolded',
    '5x5x5 Blindfolded',
  ];

  useEffect(() => {
    if (activeTab === 'competitions') {
      fetchCompetitions();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission triggered');
    console.log('Competition form data:', competitionForm);
    console.log('Token:', token);

    try {
      console.log('Sending request to /api/competitions');
      const response = await fetch('/api/competitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(competitionForm),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        console.log('Competition created successfully');
        setShowCreateForm(false);
        setCompetitionForm({
          name: '',
          description: '',
          date: '',
          location: '',
          address: '',
          max_participants: 100,
          registration_start: '',
          registration_end: '',
          events: [],
          entry_fee: 0,
        });
        fetchCompetitions();
      } else {
        const errorData = await response.text();
        console.error(
          'Failed to create competition:',
          response.status,
          errorData
        );
      }
    } catch (error) {
      console.error('Error creating competition:', error);
    }
  };

  const handleDeleteCompetition = async (id: number) => {
    if (!confirm('정말로 이 대회를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/competitions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCompetitions();
      }
    } catch (error) {
      console.error('Error deleting competition:', error);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleEventToggle = (event: string) => {
    console.log(
      'Event toggle clicked:',
      event,
      'Current events:',
      competitionForm.events
    );
    setCompetitionForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'organizer':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'registration_open':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'registration_closed':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!user || (user.role !== 'administrator' && user.role !== 'organizer')) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          접근 권한이 없습니다
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          관리자 또는 주최자 권한이 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          관리자 페이지
        </h1>
        <p className="text-gray-600 dark:text-gray-400">대회 및 회원 관리</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('competitions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'competitions'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span>대회 관리</span>
          </button>

          {user.role === 'administrator' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>회원 관리</span>
            </button>
          )}
        </nav>
      </div>

      {/* Competitions Tab */}
      {activeTab === 'competitions' && (
        <div className="space-y-6">
          {/* Create Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              대회 목록
            </h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <span>새 대회 만들기</span>
            </button>
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    새 대회 만들기
                  </h3>

                  <form
                    onSubmit={handleCreateCompetition}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="comp-name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          대회명 *
                        </label>
                        <input
                          id="comp-name"
                          type="text"
                          required
                          value={competitionForm.name}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              name: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="comp-date"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          대회 날짜 *
                        </label>
                        <input
                          id="comp-date"
                          type="date"
                          required
                          value={competitionForm.date}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              date: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="comp-description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        설명
                      </label>
                      <textarea
                        id="comp-description"
                        value={competitionForm.description}
                        onChange={e =>
                          setCompetitionForm({
                            ...competitionForm,
                            description: e.target.value,
                          })
                        }
                        className="input-field h-20"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="comp-location"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          장소명 *
                        </label>
                        <input
                          id="comp-location"
                          type="text"
                          required
                          value={competitionForm.location}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              location: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="comp-address"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          주소 *
                        </label>
                        <input
                          id="comp-address"
                          type="text"
                          required
                          value={competitionForm.address}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              address: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="comp-capacity"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          최대 참가자 수
                        </label>
                        <input
                          id="comp-capacity"
                          type="number"
                          value={competitionForm.max_participants}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              max_participants: parseInt(e.target.value),
                            })
                          }
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="comp-fee"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          참가비 (원)
                        </label>
                        <input
                          id="comp-fee"
                          type="number"
                          value={competitionForm.entry_fee}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              entry_fee: parseInt(e.target.value),
                            })
                          }
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="comp-reg-start"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          접수 시작일 *
                        </label>
                        <input
                          id="comp-reg-start"
                          type="datetime-local"
                          required
                          value={competitionForm.registration_start}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              registration_start: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="comp-reg-end"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          접수 마감일 *
                        </label>
                        <input
                          id="comp-reg-end"
                          type="datetime-local"
                          required
                          value={competitionForm.registration_end}
                          onChange={e =>
                            setCompetitionForm({
                              ...competitionForm,
                              registration_end: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        대회 종목 선택 * ({competitionForm.events.length}개
                        선택됨)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                        {availableEvents.map(event => (
                          <button
                            key={event}
                            type="button"
                            onClick={() => handleEventToggle(event)}
                            className={`p-2 text-sm rounded border transition-colors ${
                              competitionForm.events.includes(event)
                                ? ''
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                            style={
                              competitionForm.events.includes(event)
                                ? {
                                    backgroundColor: 'rgb(10, 10, 233)',
                                    borderColor: 'rgb(10, 10, 233)',
                                    color: 'white',
                                  }
                                : {}
                            }
                          >
                            {event}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button type="submit" className="btn-primary flex-1">
                        대회 만들기
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="btn-secondary flex-1"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Competitions List */}
          <div className="card">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        대회명
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        날짜
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        장소
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        정원
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        상태
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitions.map(competition => (
                      <tr
                        key={competition.id}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                          {competition.name}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {format(new Date(competition.date), 'M월 d일', {
                            locale: ko,
                          })}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {competition.location}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {competition.max_participants}명
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(competition.status)}`}
                          >
                            {competition.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button className="p-1 text-gray-600 hover:text-primary-600">
                              편집
                            </button>
                            {user.role === 'administrator' && (
                              <button
                                onClick={() =>
                                  handleDeleteCompetition(competition.id)
                                }
                                className="p-1 text-gray-600 hover:text-red-600"
                              >
                                삭제
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && user.role === 'administrator' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            회원 목록
          </h2>

          <div className="card">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        이름
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        CCK 아이디
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        전화번호
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        이메일
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        권한
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                        가입일
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(userData => (
                      <tr
                        key={userData.id}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                          <div className="flex items-center space-x-2">
                            <span>{userData.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {userData.cck_id || '-'}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {userData.phone || '-'}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {userData.email}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={userData.role}
                            onChange={e =>
                              handleRoleChange(userData.id, e.target.value)
                            }
                            className={`px-2 py-1 text-xs rounded-full border-none ${getRoleColor(userData.role)}`}
                          >
                            <option value="member">Member</option>
                            <option value="organizer">Organizer</option>
                            <option value="administrator">Administrator</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {format(new Date(userData.created_at), 'yyyy.M.d')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
