import { Link } from 'react-router-dom';

import { ROUTES } from '../routes/paths';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
