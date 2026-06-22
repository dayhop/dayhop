# Dayhop (데일리 액티비티 예약 및 관리 플랫폼)

**Dayhop**은 사용자가 일상 속 다양한 액티비티를 탐색, 예약하고 직접 액티비티를 개설하여 예약 내역과 일정을 효율적으로 관리할 수 있도록 돕는 웹 애플리케이션 플랫폼입니다.

---

### main page

<img width="1894" height="940" alt="image" src="https://github.com/user-attachments/assets/e98c8283-b9d0-46a6-a57e-c9e945841d7e" />

## 주요 기능 (Key Features)

### 1. 메인 / 랜딩 페이지

- **배너 캐러셀**: 자동 슬라이드 및 호버 시 일시 정지 기능이 포함된 메인 배너 캐러셀
- **액티비티 검색 및 필터**: 키워드 검색, 카테고리 분류, 정렬 기능(인기순/최신순)을 제공하는 검색 페이지
- **위치 기반 지도**: 카카오 지도 API를 활용해 현재 내 주변의 인기 액티비티 위치를 지도로 탐색 가능
- **맞춤형 추천**: 사용자의 취향 및 예약 이력을 기반으로 추천 상품을 제안하는 `Userfit` 추천 컴포넌트

### 2. 회원 인증 (Auth)

- **자체 가입 및 로그인**: 입력값 유효성 검사 기능이 내장된 자체 회원 가입 및 로그인 기능
- **소셜 로그인 (OAuth)**: 구글 및 카카오 간편 소셜 로그인 연동

### 3. 액티비티 상세 및 예약

- **상세 정보 조회**: 소개글, 가이드 소개, 위치 정보 제공 및 우편번호/지도 API 연동
- **예약 신청 & 결제**: 토스페이먼츠(Toss Payments) SDK 연동 테스트 결제와 예약 인원/시간 설정 패널
- **사용자 리뷰**: 참여 완료된 사용자의 평점 및 텍스트 리뷰 목록과 작성 기능

### 4. 마이페이지 (My Page)

- **내 예약 내역 (게스트)**: 무한 스크롤 및 상태 필터링이 적용된 게스트 예약 내역 확인 페이지
- **내 체험 관리 (호스트)**: 호스트가 새로운 체험을 개설 및 수정하고, 기존 등록된 체험 목록을 관리하는 폼 페이지
- **예약 관리 캘린더 (호스트)**: 월별/일별 예약 현황을 직관적인 캘린더 대시보드로 확인하고, 수락/거절 상태를 실시간 제어
- **개인 정보 수정**: 클라이언트 단 이미지 압축 업로드를 지원하는 프로필 변경 및 닉네임/비밀번호 수정 기능

---

## 프로젝트 기간 & 관련 링크

- **진행 기간**: 2026년 5월 26일 ~ 2026년 6월 24일
- **Figma 디자인 시안**: [Figma Link](https://www.figma.com/design/vUwbAuQG4baW29K0J9vmn0/-CCC-GlobalNomad?node-id=0-1&t=RsbZ7MJIztyFOje5-1)
- **API Swagger 문서**: [Swagger API Docs](https://sp-globalnomad-api.vercel.app/docs/#/)
- **Vercel 배포 주소**: [Vercel 배포 링크](https://dayhop.vercel.app)

---

## 팀원 소개 (Team Members)

|                                                  박현우 (Leader)                                                  |                                                  최유현 (Tech Lead)                                                   |                                                       양채원                                                        |                                                       유채민                                                        |                                                       최문경                                                       |
| :---------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/pho9902.png" width="100px" height="100px" style="border-radius: 50%;" alt="박현우"/> | <img src="https://github.com/Choiyuhyeon.png" width="100px" height="100px" style="border-radius: 50%;" alt="최유현"/> | <img src="https://github.com/devchae10.png" width="100px" height="100px" style="border-radius: 50%;" alt="양채원"/> | <img src="https://github.com/chaemin58.png" width="100px" height="100px" style="border-radius: 50%;" alt="유채민"/> | <img src="https://github.com/moonky-1.png" width="100px" height="100px" style="border-radius: 50%;" alt="최문경"/> |
|                                      [@pho9902](https://github.com/pho9902)                                       |                                    [@Choiyuhyeon](https://github.com/Choiyuhyeon)                                     |                                     [@devchae10](https://github.com/devchae10)                                      |                                     [@chaemin58](https://github.com/chaemin58)                                      |                                      [@moonky-1](https://github.com/moonky-1)                                      |

---

## 역할 분담 (Roles & Responsibilities)

|    이름    |      역할      | 담당 기능 및 작업 내역                                                                                                   |
| :--------: | :------------: | :----------------------------------------------------------------------------------------------------------------------- |
| **박현우** |   팀장 (PM)    | • 스켈레톤, 스피너 <br>• 후기 작성<br>• 알림<br>• 404 페이지                                                        |
| **최유현** | 테크 리드 (TL) | • 메인 페이지 내 검색 컴포넌트 (현재 위치기반 지도 페이지)<br>• 체험 상세 예약 결제하기 시스템 (토스페이먼츠 테스트 SDK) |
| **양채원** |      팀원      | • 예약 현황 (내정보)<br>• 내정보 수정<br>• 왼쪽 카드                                                                     |
| **유채민** |      팀원      | • 로그인 및 회원가입 (OAuth)<br>• 메인페이지 내 추천 컴포넌트<br>• 예약 내역 (내 정보)<br>• 체험 등록 및 수정            |
| **최문경** |      팀원      | • 메인페이지 카테고리부터 전체<br>• 배너 슬라이드 캐러셀<br>• 전체 조회 및 검색<br>• 내 체험 관리                        |

---

## 기술 스택 (Tech Stack)

### Core & Framework

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Styling & Animation

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### State & API Management

![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Tooling & Quality Assurance

![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

### Collaboration

![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 폴더 구조 (Folder Structure)

```text
src/
├── app/               # Next.js App Router (Page, Layout, API Routes)
│   ├── (auth)/        # 로그인, 회원가입, OAuth 관련 페이지
│   ├── (main)/        # 메인 홈, 액티비티 목록 및 상세, FAQ, 약관 페이지
│   ├── (myactivity)/  # 액티비티 추가 및 편집 페이지
│   └── mypage/        # 예약 내역, 내 액티비티, 캘린더, 프로필 설정 페이지
├── assets/            # 이미지, 아이콘 등 정적 에셋
├── components/        # 공통 컴포넌트 및 UI 컴포넌트
│   ├── blocks/        # 도메인/비즈니스 로직 단위의 블록 컴포넌트
│   ├── layout/        # GNB, Sidebar, Footer 등 레이아웃 컴포넌트
│   └── ui/            # 버튼, 입력창 등 재사용 가능한 공통 UI Atom
├── constants/         # 공통 상수 정의 (API 경로, 정적 데이터 등)
├── hooks/             # 커스텀 훅 모음
├── lib/               # 라이브러리 설정 (API Axios 인스턴스, 공통 API 핸들러)
│   └── api/           # API 요청 함수
├── providers/         # 전역 Context Provider 설정
├── store/             # Zustand 상태 정의
├── styles/            # Tailwind CSS 전역 스타일 및 테마 정의
├── types/             # 공용 TypeScript 인터페이스 및 타입 정의
└── utils/             # 날짜 포맷팅, 데이터 변환 등 유틸리티 함수
```

---

## 시작하기 (Getting Started)

### 1. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성한 뒤, 아래와 같이 API 주소를 입력합니다.

```env
NEXT_PUBLIC_API_BASE_URL=여기에_API_서버_주소_입력
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 4. 스토리북(Storybook) 실행

UI 컴포넌트 개발 및 단위 확인을 위해 스토리북을 지원합니다.

```bash
npm run storybook
```

스토리북은 기본적으로 `http://localhost:6006`에서 실행됩니다.

### 5. 테스트 실행

```bash
# Vitest 테스트 실행
npx vitest
```

---

## 스크립트 명령어 (Available Scripts)

- `npm run dev`: 개발 환경에서 Next.js 실행
- `npm run build`: 프로덕션 배포용 빌드 생성
- `npm run start`: 빌드된 프로덕션 서버 시작
- `npm run lint`: ESLint를 사용한 코드 스타일 및 오류 검사
- `npm run storybook`: 컴포넌트 문서화 도구 스토리북 실행
- `npm run build-storybook`: 스토리북 정적 빌드 생성
