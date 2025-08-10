import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import type { Competition } from '../types';
import { KRW, fmt } from '../utils/format';
import '../styles/application.css';

interface RegistrationFormData {
  name: string;
  wca_id: string;
  birth_date: string;
  phone: string;
  email: string;
  emergency_contact: string;
  emergency_phone: string;
}

export default function CompetitionApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [comp, setComp] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    wca_id: '',
    birth_date: '',
    phone: '',
    email: '',
    emergency_contact: '',
    emergency_phone: '',
  });

  // URL에서 선택된 종목들 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const events = searchParams.get('events');
    if (events) {
      setSelectedEvents(events.split(',').filter(Boolean));
    }
  }, [location.search]);

  // 대회 정보 로드
  useEffect(() => {
    const loadCompetition = async () => {
      try {
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
        
        setComp(dummyComp);
        setLoading(false);
      } catch (error) {
        console.error('대회 정보 로드 실패:', error);
        setLoading(false);
      }
    };

    loadCompetition();
  }, [id]);

  const calculateTotalFee = () => {
    if (!comp) return 0;
    let total = comp.base_fee;
    selectedEvents.forEach(event => {
      if (comp.event_fee[event]) {
        total += comp.event_fee[event];
      }
    });
    return total;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comp) return;

    setSubmitting(true);
    
    try {
      // 1. 임시 사용자 생성 (실제로는 로그인된 사용자 정보 사용)
      const userResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: 'temp123',
          wca_id: formData.wca_id,
          birth_date: formData.birth_date,
          phone: formData.phone,
        }),
      });

      let userId;
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userId = userData.data.user.id;
      } else {
        // 이미 존재하는 사용자일 수 있으므로 임시로 ID 1 사용
        userId = 1;
      }

      // 2. 등록 생성
      const registrationResponse = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competition_id: comp.id,
          user_id: userId,
          selected_events: selectedEvents,
          participant_info: formData,
        }),
      });

      if (!registrationResponse.ok) {
        throw new Error('등록 실패');
      }

      const registrationData = await registrationResponse.json();
      
      // 2. 결제 준비
      const paymentResponse = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_id: registrationData.data.id,
          payment_method: 'card',
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('결제 준비 실패');
      }

      const paymentData = await paymentResponse.json();
      
      // 3. 토스페이먼츠 결제 페이지로 이동
      // TODO: 실제 토스페이먼츠 SDK 사용
      alert(`결제를 진행합니다.\n주문번호: ${paymentData.data.order_id}\n결제금액: ${KRW(paymentData.data.amount)}`);
      
      // 임시로 바로 결제 완료 처리
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentData.data.payment_id,
          payment_key: 'temp_payment_key_' + Date.now(),
          order_id: paymentData.data.order_id,
          amount: paymentData.data.amount,
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error('결제 승인 실패');
      }

      alert('참가 신청 및 결제가 완료되었습니다!');
      navigate(`/competitions/${comp.id}`);
      
    } catch (error) {
      console.error('신청 처리 에러:', error);
      alert('참가 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-loading">
          로딩중...
        </div>
      </div>
    );
  }

  if (!comp) {
    return (
      <div className="container">
        <div className="page-error">
          대회 정보를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="application-page">
        <header className="application-header">
          <h1>🏆 {comp.name} - 참가 신청</h1>
          <button 
            className="ghost" 
            onClick={() => navigate(`/competitions/${comp.id}`)}
          >
            ← 뒤로
          </button>
        </header>

        <div className="application-content">
          <div className="application-summary">
            <h3>신청 내용</h3>
            <div className="summary-info">
              <div><span>대회:</span> {comp.name}</div>
              <div><span>날짜:</span> {fmt(comp.date)}</div>
              <div><span>장소:</span> {comp.location}</div>
              <div><span>선택 종목:</span> {selectedEvents.join(', ')}</div>
              <div className="fee-breakdown">
                <div><span>기본 참가비:</span> {KRW(comp.base_fee)}</div>
                {selectedEvents.map(event => (
                  <div key={event}>
                    <span>{event}:</span> {KRW(comp.event_fee[event] || 0)}
                  </div>
                ))}
                <div className="total"><span>총 참가비:</span> {KRW(calculateTotalFee())}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="application-form">
            <h3>참가자 정보</h3>
            
            <div className="form-group">
              <label htmlFor="name">성명 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="홍길동"
              />
            </div>

            <div className="form-group">
              <label htmlFor="wca_id">WCA ID</label>
              <input
                type="text"
                id="wca_id"
                name="wca_id"
                value={formData.wca_id}
                onChange={handleInputChange}
                placeholder="2023HONG01 (선택사항)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="birth_date">생년월일 *</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">연락처 *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="010-1234-5678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="example@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergency_contact">비상연락처(보호자) *</label>
              <input
                type="text"
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                required
                placeholder="보호자 성명"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergency_phone">비상연락처 전화번호 *</label>
              <input
                type="tel"
                id="emergency_phone"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleInputChange}
                required
                placeholder="010-1234-5678"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="ghost lg"
                onClick={() => navigate(`/competitions/${comp.id}`)}
                disabled={submitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="primary lg"
                disabled={submitting || selectedEvents.length === 0}
              >
                {submitting ? '처리중...' : `${KRW(calculateTotalFee())} 결제하고 신청하기`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
