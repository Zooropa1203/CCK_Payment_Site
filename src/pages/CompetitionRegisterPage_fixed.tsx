import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Competition } from '../types/competition';
import { KRW, fmt } from '../utils/format';
import '../styles/competition-register.css';

const isRegistrationOpen = (now: Date, s: string, e: string) =>
  new Date(s) <= now && now <= new Date(e);

export default function CompetitionRegisterPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [comp, setComp] = useState<Competition | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 임시로 더미 데이터 사용
  useEffect(() => {
    console.log('CompetitionRegisterPage mounted with ID:', id);
    
    // 임시 더미 데이터
    const dummyComp: Competition = {
      id: Number(id) || 1,
      date: '2025-12-15',
      name: '2025 CCK Winter Championship',
      location: '서울 강남구 코엑스',
      base_fee: 15000,
      event_fee: {
        '3x3': 5000,
        '4x4': 7000,
        '5x5': 7000,
        'OH': 6000,
        'Pyraminx': 5000
      },
      reg_start_date: '2025-08-01',
      reg_end_date: '2025-12-10',
      events: ['3x3', '4x4', '5x5', 'OH', 'Pyraminx'],
      capacity: 100
    };
    
    setTimeout(() => {
      setComp(dummyComp);
      setLoading(false);
    }, 500);
  }, [id]);

  const open = useMemo(() => 
    comp ? isRegistrationOpen(new Date(), comp.reg_start_date, comp.reg_end_date) : false, 
    [comp]
  );

  const toggle = (ev: string) => {
    setSelected(s => s.includes(ev) ? s.filter(x => x !== ev) : [...s, ev]);
  };

  const calculateTotalFee = () => {
    if (!comp) return 0;
    let total = comp.base_fee;
    selected.forEach(event => {
      if (comp.event_fee[event]) {
        total += comp.event_fee[event];
      }
    });
    return total;
  };

  if (loading) return (
    <div className="container">
      <div className="page-loading">로딩중… (대회 ID: {id})</div>
    </div>
  );

  if (!comp) return (
    <div className="container">
      <div className="page-error">대회 정보를 불러오지 못했습니다.</div>
    </div>
  );

  const eventFeeText = Object.entries(comp.event_fee || {})
    .map(([k, v]) => `${k} ${KRW(v)}`).join(" / ");

  return (
    <div className="container">
      <div className="register-page">
        <header className="register-header">
          <h1>🏆 {comp.name}</h1>
          <div className="header-actions">
            <button className="ghost" onClick={() => nav("/")}>홈</button>
            <button className="ghost" onClick={() => nav(`/competitions/${comp.id}/schedule`)}>스케줄</button>
            <button className="ghost" onClick={() => nav(`/competitions/${comp.id}/participants`)}>참가자 명단</button>
            <button className="ghost" onClick={() => nav(`/competitions/${comp.id}/waitlist`)}>대기자 명단</button>
          </div>
        </header>

        <section className="register-body">
          <div className="left-info">
            <dl className="info-list">
              <div><dt>대회 날짜</dt><dd>{fmt(comp.date)}</dd></div>
              <div><dt>대회 장소</dt><dd>{comp.location}</dd></div>
              <div><dt>참가비</dt><dd>{KRW(comp.base_fee)}</dd></div>
              {eventFeeText && <div><dt>종목별 참가비</dt><dd>{eventFeeText}</dd></div>}
              {comp.capacity && <div><dt>참가자 정원</dt><dd>{comp.capacity.toLocaleString()}명</dd></div>}
              <div><dt>접수 기간</dt><dd>{fmt(comp.reg_start_date)} ~ {fmt(comp.reg_end_date)}</dd></div>
            </dl>
          </div>

          <div className="right-panel">
            <h3>종목</h3>
            <div className="event-grid">
              {comp.events.map(ev => (
                <button
                  key={ev}
                  type="button"
                  className={`chip ${selected.includes(ev) ? "active" : ""}`}
                  onClick={() => toggle(ev)}
                  aria-pressed={selected.includes(ev)}
                >
                  {ev.toUpperCase()}
                </button>
              ))}
            </div>

            <h3>선택된 종목</h3>
            <div className="selected-grid">
              {selected.length === 0 ? (
                <span className="muted">선택된 종목이 없습니다.</span>
              ) : (
                selected.map(ev => (
                  <span 
                    key={ev} 
                    className="chip active" 
                    onClick={() => toggle(ev)}
                    style={{ cursor: 'pointer' }}
                  >
                    {ev.toUpperCase()}
                  </span>
                ))
              )}
            </div>

            {selected.length > 0 && (
              <div className="fee-summary">
                <h4>예상 참가비</h4>
                <div className="fee-breakdown">
                  <div>기본 참가비: {KRW(comp.base_fee)}</div>
                  {selected.map(event => (
                    <div key={event}>
                      {event.toUpperCase()}: {KRW(comp.event_fee[event] || 0)}
                    </div>
                  ))}
                  <div className="total">총합: {KRW(calculateTotalFee())}</div>
                </div>
              </div>
            )}

            <div className="cta">
              {open ? (
                <button 
                  className="primary lg" 
                  onClick={() => nav(`/competition/${comp.id}/register?events=${selected.join(",")}`)} 
                  disabled={selected.length === 0}
                >
                  참가 신청
                </button>
              ) : (
                <button className="ghost lg" disabled>
                  접수 기간이 아닙니다
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
