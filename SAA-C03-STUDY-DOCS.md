# SAA-C03 스터디 앱

> AWS SAA-C03 시험 준비를 위한 개인 학습 웹 앱. 문제 풀기 · 오답 관리 · 학습 로드맵을 Notion과 연동해 통합 관리.

---

## 1. 개요

### 핵심 가치

- **체계적 학습 순서** — AWS 개념 선후관계를 반영한 Phase 1~6 로드맵
- **실전 문제 풀기** — 시험 유형 문제 + 정답/오답 Notion 자동 기록
- **오답 관리** — 틀린 문제를 해설과 함께 Notion에 저장, 복습 추적
- **모바일 최적화** — 이동 중에도 학습 가능한 모바일 퍼스트 UI

### 기술 스택

- **Next.js 16** (App Router) + **Tailwind CSS 4**
- **Notion API** — 문제 기록 DB, 학습 노트 DB 연동
- **Vercel** 배포

---

## 2. 화면 구성 (탭 5개)

| 탭 | 경로 | 설명 |
|----|------|------|
| 문제풀기 | `/` | 문제 순서대로 풀기, 답안 제출 시 Notion에 정답/오답 자동 기록 |
| 문제목록 | `/questions` | 전체 문제 리스트. 전체·정답·오답·미풀기 필터, 특정 문제로 바로 이동 |
| 로드맵 | `/roadmap` | Phase별 학습 순서, 토픽 완료 여부 시각화 |
| 토픽 | `/topics` | 로드맵 전체 토픽 목록, Notion 노트 저장 여부 표시 |
| 오답노트 | `/wrong` | 오답 기록 조회, 복습 완료 처리, 오답 Notion 페이지 바로가기 |

---

## 3. 아키텍처

```
[브라우저]
    │
    ├── /                → 문제풀기
    ├── /questions       → 문제목록
    ├── /roadmap         → 로드맵
    ├── /topics          → 토픽목록
    ├── /wrong           → 오답노트
    └── /notes/[topic]   → 토픽 학습 노트
    │
    ↓ fetch (same origin)
    │
[Next.js API Routes]
    │
    ├── GET  /api/questions       → questions.json 서빙
    ├── POST /api/explain         → Notion 문제 기록 저장 + 해설 반환
    ├── GET  /api/answered        → 전체 답안 기록 (questionNum + status)
    ├── GET  /api/wrong           → 오답 목록 조회
    ├── PATCH /api/wrong          → 복습 완료 상태 업데이트
    ├── GET  /api/notes?topic=X   → 토픽 학습 노트 조회
    └── GET  /api/notes/list      → 저장된 토픽 목록
    │
    ↓
[Notion API]
    ├── NOTION_DB_EXPLAIN  → 문제 기록 (정답/오답 통합)
    └── NOTION_DB_NOTES    → 토픽별 학습 노트
```

---

## 4. Notion DB 구조

### 문제 기록 DB (`NOTION_DB_EXPLAIN`)

정답/오답 구분 없이 문제 풀기 결과를 단일 DB에 저장. `Status` 필드로 구분.

| 속성명 | 타입 | 값 |
|--------|------|----|
| Question | Title | `Q.{num} - {question 앞 50자}` |
| Question Number | Number | 문제 번호 |
| Status | Select | `정답` / `오답` |
| My Answer | Rich Text | 내가 선택한 선지 |
| Correct Answer | Rich Text | 정답 선지 |
| Key Concept | Rich Text | 핵심 개념 (수동 입력) |
| Explanation | Rich Text | 해설 (수동 입력) |
| Reviewed | Checkbox | 복습 완료 여부 |
| Review Count | Number | 복습 횟수 |
| Date Added | Created Time | 자동 |

페이지 본문: 문제 / 선지 블록 자동 생성. Key Concept·Explanation은 Notion에서 직접 입력.

### 학습 노트 DB (`NOTION_DB_NOTES`)

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Topic | Title | 토픽명 (예: "IAM") |
| Domain | Select | 시험 도메인 |
| Status | Select | 학습 상태 |
| Summary | Rich Text | 한 줄 요약 |

페이지 본문은 `##` 기준으로 섹션 구분, `###`은 하위 섹션. 코드블록·인라인 코드·불릿 자동 렌더링.

```
## 🔍 한 줄 정의
## 🎯 언제 / 왜 사용하나
## ⚙️ 작동 원리
  ### 하위 개념 A
  ### 하위 개념 B
## 💡 시험 포인트
```

---

## 5. 주요 동작 흐름

### 문제 풀기

```
선지 선택 → "정답 확인"
  → POST /api/explain  (questionNum, question, options, answer, myAnswer)
  → Notion에 결과 저장 (이미 있으면 Status만 UPDATE)
  → 저장된 keyConcept / explanation 반환 → 화면에 표시
  → "다음" 또는 "건너뜀"으로 다음 문제 이동
```

- 정답/오답 카운트는 `/api/answered` 기반 (Notion DB 기준, localStorage 없음)
- 중복 제출 방지: 이미 저장된 문제는 UPDATE만 수행

### 학습 노트 조회

```
토픽 클릭 → /notes/[topic]
  → server: getNoteByTopic(topic)
  → Notion 페이지 블록 파싱 (heading_2 기준 섹션 분리)
  → NoteViewer 렌더링
  → 하단에 다음 추천 토픽 표시
```

---

## 6. 환경변수

```env
NOTION_API_KEY=
NOTION_DB_NOTES=
NOTION_DB_EXPLAIN=
```

---

## 7. 로드맵 구성

| Phase | 제목 | 토픽 |
|-------|------|------|
| 1 | 기초 인프라 | IAM, Security Groups, NACLs, VPC Endpoints |
| 2 | 컴퓨팅 & 스토리지 | EC2 인스턴스 타입, EBS & EFS, S3 보안, S3 스토리지 클래스 |
| 3 | 고가용성 아키텍처 | ELB, Auto Scaling, RDS Multi-AZ, Aurora, Route 53 |
| 4 | 서버리스 & 이벤트 | SQS, SNS, Lambda, API Gateway, Kinesis |
| 5 | 보안 심화 & 네트워킹 | KMS, Secrets Manager, WAF & Shield, CloudFront, Global Accelerator |
| 6 | 비용 최적화 | EC2 구매 옵션, Spot, Savings Plans, 비용 관리 도구 |
