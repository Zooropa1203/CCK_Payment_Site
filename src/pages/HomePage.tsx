import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

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

  const getCurrentCompetitions = () => {
    const now = new Date();
    return competitions.filter(comp => new Date(comp.date) >= now);
  };

  const getPastCompetitions = () => {
    const now = new Date();
    return competitions.filter(comp => new Date(comp.date) < now);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          대회
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex border-b-2 border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-8 py-2 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              현재 대회
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-2 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              지난 대회
            </button>
          </div>
        </div>

        {/* Competition Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {(activeTab === 'current' ? getCurrentCompetitions() : getPastCompetitions()).map((competition, index) => (
                <tr 
                  key={competition.id} 
                  className={`${index !== 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50`}
                >
                  <td className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/competition/${competition.id}`}
                          className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {competition.name}
                        </Link>
                      </div>
                      <div className="text-right text-gray-600 dark:text-gray-400">
                        <div className="font-medium">{competition.location}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(activeTab === 'current' ? getCurrentCompetitions() : getPastCompetitions()).length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {activeTab === 'current' ? '현재 등록된 대회가 없습니다.' : '지난 대회가 없습니다.'}
              </p>
            </div>
          )}
        </div>

        {/* Notice */}
        <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
            각 대회의 정원으로 인하여, 대회 신청에 성공하더라도 대회 참가자 명단에 포함되지 못할 수도 있습니다. 
            이러한 경우 대기자 명단에 올라가게 됩니다. 더 자세한 정보는 WCA의 해당 대회 페이지를 확인해주세요.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">CCK</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>큐빙클럽코리아 | 사업자등록번호 : 358-54-00896 |</div>
              <div>대표 : 정헌재 | 이메일 : cubingclubkorea@gmail.com</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 pt-4">
              COPYRIGHT ⓒ Cubing Club Korea
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
