import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/competition-register.css';

type ScheduleItem = {
  time: string;
  round: string;
  event: string;
  group?: string;
  note?: string;
};

type Competition = {
  id: number;
  name: string;
};

function SubHeader({ compName, onBack }: { compName: string; onBack: () => void }) {
  return (
    <div className="sub-header">
      <h1>🏆 {compName}</h1>
      <button className="ghost back" onClick={onBack}>← 돌아가기</button>
    </div>
  );
}

export default function CompetitionSchedulePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [comp, setComp] = useState<Competition | null>(null);
  const [rows, setRows] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, s] = await Promise.all([
          fetch(`/api/competitions/${id}`).then(r => {
            if (!r.ok) throw new Error('대회 정보를 불러오는데 실패했습니다.');
            return r.json();
          }),
          fetch(`/api/competitions/${id}/schedule`).then(r => {
            if (!r.ok) throw new Error('스케줄 정보를 불러오는데 실패했습니다.');
            return r.json();
          })
        ]);
        setComp(c);
        setRows(s);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="container">
      <div className="page-loading">로딩중…</div>
    </div>
  );

  if (error || !comp) return (
    <div className="container">
      <div className="page-error">{error || '정보를 불러오지 못했습니다.'}</div>
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
            <div className="empty">스케줄 준비 중입니다.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>시간</th>
                  <th>라운드</th>
                  <th>종목</th>
                  <th>그룹</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.time}</td>
                    <td>{r.round}</td>
                    <td>{r.event}</td>
                    <td>{r.group || '-'}</td>
                    <td>{r.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
