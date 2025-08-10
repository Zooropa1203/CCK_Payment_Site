import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/competition-register.css';

type WaitlistItem = {
  id: number;
  name: string;
  events: string[];
  registered_at: string;
};

type Competition = {
  id: number;
  name: string;
};

function SubHeader({
  compName,
  onBack,
}: {
  compName: string;
  onBack: () => void;
}) {
  return (
    <div className="sub-header">
      <h1>🏆 {compName}</h1>
      <button className="ghost back" onClick={onBack}>
        ← 돌아가기
      </button>
    </div>
  );
}

export default function CompetitionWaitlistPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [comp, setComp] = useState<Competition | null>(null);
  const [rows, setRows] = useState<WaitlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, w] = await Promise.all([
          fetch(`/api/competitions/${id}`).then(r => {
            if (!r.ok) throw new Error('대회 정보를 불러오는데 실패했습니다.');
            return r.json();
          }),
          fetch(`/api/competitions/${id}/waitlist`).then(r => {
            if (!r.ok)
              throw new Error('대기자 정보를 불러오는데 실패했습니다.');
            return r.json();
          }),
        ]);
        setComp(c);
        setRows(w);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="container">
        <div className="page-loading">로딩중…</div>
      </div>
    );

  if (error || !comp)
    return (
      <div className="container">
        <div className="page-error">
          {error || '정보를 불러오지 못했습니다.'}
        </div>
      </div>
    );

  return (
    <div className="container">
      <div className="subpage">
        <SubHeader
          compName={comp?.name || '대회 정보'}
          onBack={() => nav(`/competitions/${id}`)}
        />
        <div className="table-wrap">
          {rows.length === 0 ? (
            <div className="empty">대기자가 없습니다.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>대기 순번</th>
                  <th>이름</th>
                  <th>신청 종목</th>
                  <th>신청일시</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.events.join(', ').toUpperCase()}</td>
                    <td>
                      {new Date(r.registered_at).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="summary">
          <p>총 대기자: {rows.length}명</p>
        </div>
      </div>
    </div>
  );
}
