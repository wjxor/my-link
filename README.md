<h1 align="center">🔗 MyLink</h1>

<p align="center">
  <strong>나만의 모든 링크를 한 곳에 🔗</strong>
</p>

<p align="center">
  포트폴리오, SNS, 블로그 등 흩어진 링크를<br/>
  하나의 프로필 페이지로 모아 공유하세요.
</p>

<p align="center">
  <a href="https://my-link-gamma-eight.vercel.app/"><strong>🌐 서비스 바로가기</strong></a>
</p>

<p align="center">
  <a href="#-핵심-기능">핵심 기능</a> •
  <a href="#-기술-스택">기술 스택</a> •
  <a href="#-시작하기">시작하기</a> •
  <a href="#-프로젝트-구조">프로젝트 구조</a> •
  <a href="#-라이선스">라이선스</a>
</p>

---

## 📌 프로젝트 소개

**MyLink**는 개발자와 크리에이터를 위한 **링크 모음(Link-in-Bio) 서비스**입니다.

GitHub, 기술 블로그, YouTube, Instagram 등 여러 플랫폼에 분산된 자신의 링크들을 **단 하나의 프로필 URL**로 통합하여 공유할 수 있습니다. 구글 로그인 한 번이면 **1분 안에** 나만의 링크 페이지를 만들 수 있습니다.

> `mylink.com/사용자닉네임` — 이 하나의 링크로 모든 것을 연결하세요.

### 🎯 대상 사용자

- 🧑‍💻 **개발자** — GitHub, 기술 블로그(Velog, Tistory), 포트폴리오 등 공유할 링크가 많은 분
- 🎨 **크리에이터** — YouTube, Instagram, X(Twitter) 등 여러 채널을 운영하는 분

---

## ✨ 핵심 기능

| 기능 | 설명 |
| --- | --- |
| 🔐 **구글 소셜 로그인** | Firebase Authentication 기반, 별도 회원가입 없이 구글 계정으로 즉시 시작 |
| 🔗 **고유 프로필 URL** | `mylink.com/닉네임` 형태의 개인 프로필 링크 자동 생성 |
| ✏️ **인라인 편집** | 모달이나 페이지 이동 없이 클릭 한 번으로 프로필 정보 & 링크를 바로 수정 |
| 🌐 **파비콘 자동 적용** | 링크 URL 기반 Google Favicon API로 사이트 아이콘을 자동 표시 |
| 📊 **방문자 통계** | 프로필 페이지 방문자 수를 대시보드에서 실시간 확인 |
| 📱 **모바일 반응형** | PC에서도 모바일 비율 중앙 정렬 레이아웃으로 일관된 UX 제공 |
| 🖼️ **Dynamic OG 이미지** | 사용자별 맞춤 Open Graph 이미지 자동 생성으로 SNS 공유 최적화 |
| 🔔 **실시간 피드백** | 모든 CRUD 작업에 Toast 알림을 통한 즉각적인 사용자 피드백 |

---

## 🛠 기술 스택

### Frontend

| 기술 | 버전 | 용도 |
| --- | --- | --- |
| [Next.js](https://nextjs.org/) | 16 | App Router 기반 풀스택 프레임워크 |
| [React](https://react.dev/) | 19 | UI 라이브러리 |
| [TypeScript](https://www.typescriptlang.org/) | 5 | 정적 타입 검사 |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | 유틸리티 기반 스타일링 |
| [shadcn/ui](https://ui.shadcn.com/) | 4 | 컴포넌트 디자인 시스템 |
| [Recharts](https://recharts.org/) | 3 | 통계 차트 시각화 |
| [Lucide React](https://lucide.dev/) | - | 아이콘 라이브러리 |
| [Sonner](https://sonner.emilkowal.dev/) | - | Toast 알림 |

### Backend / 인프라

| 기술 | 용도 |
| --- | --- |
| [Firebase Authentication](https://firebase.google.com/docs/auth) | 구글 소셜 로그인 |
| [Cloud Firestore](https://firebase.google.com/docs/firestore) | NoSQL 실시간 데이터베이스 |
| [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started) | 서버리스 보안 규칙 |

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.17 이상
- **npm** 9 이상
- **Firebase 프로젝트** (Authentication + Firestore 활성화)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/wjxor/my-link.git
cd my-link

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Firebase 설정 값을 입력하세요
```

### 환경변수 (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

### 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 코드 검사 |
| `npm run format` | Prettier 코드 포맷팅 |
| `npm run typecheck` | TypeScript 타입 검사 |

---

## 📁 프로젝트 구조

```
my-link/
├── app/                      # Next.js App Router
│   ├── [displayName]/        # 사용자 퍼블릭 프로필 페이지
│   │   ├── page.tsx          # 서버 컴포넌트 (데이터 페칭 + SEO)
│   │   ├── user-page-client.tsx  # 클라이언트 프로필 뷰
│   │   └── opengraph-image.tsx   # 동적 OG 이미지 생성
│   ├── stats/                # 방문자 통계 대시보드
│   ├── home-client.tsx       # 메인 대시보드 (링크 관리)
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈 페이지
│   ├── not-found.tsx         # 404 페이지
│   ├── globals.css           # 글로벌 스타일
│   └── opengraph-image.tsx   # 기본 OG 이미지
│
├── components/               # 재사용 컴포넌트
│   ├── ui/                   # shadcn/ui 기반 원자 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── header.tsx            # 글로벌 네비게이션 헤더
│   ├── stats-chart.tsx       # 통계 차트 컴포넌트
│   └── theme-provider.tsx    # 테마 프로바이더
│
├── data/                     # 데이터 타입 정의
│   ├── links.ts              # Link 타입
│   └── user.ts               # User 타입
│
├── hooks/                    # 커스텀 React 훅
│   └── use-auth.ts           # 인증 상태 관리 훅
│
├── lib/                      # 유틸리티 & 설정
│   ├── firebase.ts           # Firebase 초기화
│   └── utils.ts              # 공통 유틸리티 (cn 함수 등)
│
├── docs/                     # 프로젝트 설계 문서
│   ├── PRD.md                # 제품 요구사항 정의서
│   ├── WIREFRAME.md          # UI/UX 와이어프레임
│   └── USER_SCENARIO.md      # 사용자 시나리오
│
├── public/                   # 정적 에셋
├── firestore.rules           # Firestore 보안 규칙
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🗄️ 데이터 모델링 (Firestore)

```
📦 Collection: users
 ┗ 📜 Document: {uid}
    ┣ displayName  : string      // URL 슬러그 (고유, 변경 불가)
    ┣ username     : string      // 프로필에 표시되는 이름
    ┣ bio          : string      // 한줄 소개글
    ┣ visitorCount : number      // 누적 방문자 수
    ┣ createdAt    : timestamp
    ┣ updatedAt    : timestamp
    ┃
    ┗ 📦 Sub-collection: links
       ┗ 📜 Document: {auto-id}
          ┣ title      : string    // 링크 제목
          ┣ url        : string    // 링크 URL
          ┣ clickCount : number    // 클릭 수
          ┣ createdAt  : timestamp
          ┗ updatedAt  : timestamp
```

### 보안 규칙 요약

- ✅ **프로필 & 링크 조회** — 누구나 가능
- ✅ **프로필 & 링크 수정/삭제** — 소유자(본인)만 가능
- ✅ **displayName 변경** — 생성 이후 변경 불가
- ✅ **visitorCount 증가** — 방문자가 1씩만 증가 가능
- ✅ **clickCount 증가** — 클릭 시 1씩만 증가 가능
- ✅ **닉네임 중복 방지** — `usernames` 컬렉션으로 고유성 보장

---

## 🔧 주요 설계 결정

### 모바일 퍼스트 레이아웃
PC에서도 모바일 비율(`max-w-md`)로 중앙 정렬하여 소유자 편집 화면과 방문자 뷰를 일관되게 유지합니다.

### 인라인 편집
모달이나 별도 페이지 없이 텍스트를 직접 클릭하고 `Enter` 키로 저장하는 방식을 채택했습니다. 최소한의 뎁스(depth)로 UX를 단순화합니다.

### 파비콘 동적 호출
파비콘 이미지를 DB에 저장하지 않고, Google Favicon API(`https://www.google.com/s2/favicons?domain=...`)를 클라이언트에서 실시간으로 호출하여 항상 최신 상태를 유지합니다.

### 서버리스 보안
Firestore Security Rules로 데이터 유효성 검증과 접근 제어를 처리합니다. 별도의 백엔드 서버 없이 보안을 확보합니다.

---

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m '새로운 기능 추가'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/wjxor">wjxor</a>
</p>
