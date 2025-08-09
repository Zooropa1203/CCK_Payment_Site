import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>CCK Payment - 루빅스 큐브 대회 접수</h1>
      <p>환영합니다! 대회 접수 시스템입니다.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>진행 중인 대회</h2>
        <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
          <h3>2025 CCK Winter Championship</h3>
          <p>📅 2025-12-15</p>
          <p>📍 서울 강남구 코엑스</p>
          <button 
            onClick={() => navigate('/competitions/1')}
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            참가 신청
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleHomePage;
