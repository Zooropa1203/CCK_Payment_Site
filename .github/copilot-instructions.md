<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CCK Payment - 루빅스 큐브 대회 접수 및 결제 시스템

## 프로젝트 개요

이 프로젝트는 루빅스 큐브 대회 접수 및 결제를 위한 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (개발용)
- **Styling**: Tailwind CSS
- **Payment**: 토스 페이먼츠 API
- **Authentication**: JWT

## 주요 기능

1. 대회 목록 및 상세 정보 표시
2. 사용자 등록 및 로그인
3. 대회 접수 및 결제
4. 관리자 페이지 (대회 관리, 회원 관리)
5. 반응형 디자인 (PC, 모바일, 태블릿)
6. 라이트/다크 모드

## 사용자 권한

- **Administrator**: 모든 기능 접근 가능
- **Organizer**: 대회 관리 기능만 접근 가능
- **Member**: 일반 회원 (대회 접수만 가능)

## 코딩 가이드라인

- TypeScript 사용 시 엄격한 타입 체크
- React 함수형 컴포넌트와 Hooks 사용
- Tailwind CSS를 활용한 반응형 디자인
- API 엔드포인트는 RESTful 설계 원칙 준수
- 보안을 위한 입력 검증 및 인증 구현
