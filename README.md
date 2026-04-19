# AWS SAA Study App

AWS Solutions Architect Associate(SAA-C03) 시험을 준비하는 개인 학습용 웹 앱입니다.  
문제 풀기 · 오답 노트 · 학습 로드맵을 Notion과 연동해서 관리합니다.

---

## 주요 기능

| 화면 | 설명 |
|------|------|
| **문제풀기** | 문제를 순서대로 풀고 정답/오답 여부를 Notion에 기록 |
| **문제 목록** | 전체 문제를 전체·정답·오답·미풀기 필터로 조회, 특정 문제로 바로 이동 |
| **로드맵** | Phase별 학습 순서 안내, 토픽별 노트 완료 여부 시각화 |
| **토픽** | 로드맵 전체 토픽 목록, 학습 완료된 토픽 표시 |
| **오답노트** | Notion에 저장된 오답 목록 조회 및 복습 완료 처리 |
| **토픽 노트** | 토픽별 학습 노트(Notion 페이지) 렌더링 — 섹션·하위섹션·코드블록 지원 |

---

## 기술 스택

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Notion API** — 학습 노트 DB, 문제 해설 DB 연동

---

## 사전 준비

### 1. Notion 설정

두 개의 Notion 데이터베이스가 필요합니다.

#### 학습 노트 DB (`NOTION_DB_NOTES`)

| 속성명 | 타입 |
|--------|------|
| Topic | Title |
| Domain | Select |
| Status | Select |
| Summary | Rich Text |

페이지 본문은 `## 섹션 제목` / `### 하위 섹션` / 코드블록 / 불릿 형식으로 작성합니다.

#### 문제 해설 DB (`NOTION_DB_EXPLAIN`)

| 속성명 | 타입 |
|--------|------|
| Question | Title |
| Question Number | Number |
| Key Concept | Rich Text |
| Explanation | Rich Text |
| Status | Select (`정답` / `오답`) |
| My Answer | Rich Text |
| Correct Answer | Rich Text |
| Reviewed | Checkbox |
| Review Count | Number |
| Date Added | Created time |

### 2. Notion Integration 생성

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 Integration 생성
2. 위 두 DB 페이지에서 **Share → Invite** 로 Integration 연결
3. Integration의 **Internal Integration Token** 복사

---

## 설치 및 실행

```bash
git clone <repo-url>
cd saa-study
npm install
```

`.env.local` 파일 생성:

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_DB_NOTES=your_notes_database_id
NOTION_DB_EXPLAIN=your_explain_database_id
```

> Database ID는 Notion DB 페이지 URL에서 확인합니다.  
> `notion.so/workspace/<database_id>?v=...`

문제 데이터를 `public/questions.json`에 추가합니다 (형식은 아래 참고).

```bash
npm run dev
```

`http://localhost:3000` 에서 앱을 확인합니다.

---

## 문제 데이터 형식

`public/questions.json`은 아래 형식의 배열이어야 합니다.

```json
[
  {
    "num": 1,
    "question": "문제 본문",
    "options": {
      "A": "선택지 A",
      "B": "선택지 B",
      "C": "선택지 C",
      "D": "선택지 D"
    },
    "answer": "A",
    "explanation": "해설 텍스트"
  }
]
```

`answer`가 빈 문자열인 항목은 자동으로 제외됩니다.

---

## 학습 노트 작성 가이드

Notion 학습 노트 DB에 페이지를 추가하고 본문을 아래 구조로 작성하면 앱에서 자동으로 섹션별로 렌더링됩니다.

```
## 🔍 한 줄 정의
서비스 한 줄 요약

## ⚙️ 작동 원리
### 핵심 개념 A
설명...

### 핵심 개념 B
설명...

## 💡 시험 포인트
• 불릿 포인트 1
• 불릿 포인트 2
```

- `heading_2 (##)` — 섹션 구분자
- `heading_3 (###)` — 섹션 내 하위 항목
- 코드블록 / 인라인 코드 — 자동으로 코드 스타일 적용
- 불릿 리스트 — `•` 로 렌더링
