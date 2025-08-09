import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/competition-register.css';

type Participant = {
  id: number;
  name: string;
  events: string[];
  paid: boolean;
  total_fee: number;
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

export default function CompetitionParticipantsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [comp, setComp] = useState<Competition | null>(null);
  const [rows, setRows] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, p] = await Promise.all([
          fetch(`/api/competitions/${id}`).then(r => {
            if (!r.ok) throw new Error('대회 정보를 불러오는데 실패했습니다.');
            return r.json();
          }),
          fetch(`/api/competitions/${id}/participants`).then(r => {
            if (!r.ok) throw new Error('참가자 정보를 불러오는데 실패했습니다.');
            return r.json();
          })
        ]);
        setComp(c);
        setRows(p);
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
            <div className="empty">참가자가 없습니다.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이름</th>
                  <th>참가 종목</th>
                  <th>참가비</th>
                  <th>결제 상태</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.events.join(', ').toUpperCase()}</td>
                    <td>{r.total_fee.toLocaleString()}원</td>
                    <td>
                      <span className={`status ${r.paid ? 'paid' : 'pending'}`}>
                        {r.paid ? '결제완료' : '결제대기'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="summary">
          <p>총 참가자: {rows.length}명</p>
          <p>결제완료: {rows.filter(r => r.paid).length}명</p>
          <p>결제대기: {rows.filter(r => !r.paid).length}명</p>
        </div>
      </div>
    </div>
  );
}
