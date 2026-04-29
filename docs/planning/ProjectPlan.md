# 프로젝트 계획서 V3

## 1. 표지

- 과제명: Word Tower (공든 탑은 무너지지 않는다는 의미를 담아, 영단어도 차근차근 외우면 좋은 토익 결과를 얻을 수 있다는 의미)
- 조 이름: 4조
- 팀장: 박준석
- 조원: 구현희, 권서윤, 박서현

---

## 2. 목차

a. 프로젝트 개요  
b. 일정 계획  
c. 기술 스택  
d. 산출물 관리  
e. 리스크 관리  
f. 스크럼 활용 방안

---

## 3. 프로젝트 개요

### 프로젝트 명칭

Word Tower (공든 탑은 무너지지 않는다는 의미를 담아, 영단어도 차근차근 외우면 좋은 토익 결과를 얻을 수 있다는 의미)

---

### Product Vision (소개, 목적)

Word Tower는 토익 준비 학습자가 모르는 단어를 저장하고, 퀴즈 및 오답노트를 통해 반복 학습하며 스트릭과 통계를 통해 동기를 유지하여 꾸준한 단어 학습을 통해 실제 점수 향상으로 이어지도록 돕는 단어 학습 플랫폼이다.

---

### Product Goal

- 출시 후 4주 이내 신규 가입자 중 40% 이상이 2주 이상 학습 수행
- 동일 단어 세트를 3회 반복 테스트 시, 1회차 대비 3회차 오답률 50% 이상 감소
- 사용자별 월 평균 정답률이 전월 대비 20% 이상 상승
- 사용자 그룹이 비사용자 대비 목표 점수 달성률 20% 이상 높음

---

### Features

#### 기본 기능

- 로그인 기능 (관리자 / 사용자)
- 관리자: 단어 추가, 수정, 삭제
- 사용자: 50개 이상의 TOEIC 단어장 제공
- 사용자: 뜻을 보고 영어로 답하는 테스트 기능

#### 추가 기능

- 오늘의 단어
- 오답 단어장 (오답 자동 저장 및 복습)
- 사용자 단어 추가 / 수정 / 삭제
- 스트릭 기능 (연속 학습 기록 및 표시)
- 통계 (학습량, 정답/오답 비율)

#### 확장 기능 (아이디어)

- 프로필 조회 기능
- AI 기반 오늘의 단어 추천 및 추가
- AI 기반 TOEIC 유사 문제 생성
- 점수 기반 단어 난이도 추천
- 단어 학습 기반 점수 예측
- 오답 횟수 및 최근 오답일 기반 테스트

---

### Product Backlog

[PBI 문서](https://www.notion.so/PBI-343103a7928e80f3b07ef8e05b291c60?pvs=21)

[WBS 문서](https://www.notion.so/WBS-343103a7928e80b3b62ace32e33d314c?pvs=21)

---

### 개발 Lifecycle (간단 버전)

- Kickoff (Sprint 3)
  - 목표, 범위, 역할, 협업 규칙 합의
  - 산출물: Working Agreement, Vision / Goal

- Backlog 정제
  - 기능 정의, 설명, 우선순위, 완료 기준 설정

- Sprint Cycle (Sprint 1~3 반복)
  - Planning: Sprint Goal, 작업 분해, 용량 산정
  - Execution: 구현 → PR → 리뷰 → 테스트 → merge
  - Review: 데모 및 피드백 반영
  - Retrospective: 개선 사항 및 액션 아이템 도출

- Release / 운영
  - 산출물: 릴리즈 노트, 운영 이슈

- Project Closing
  - 산출물: 최종 보고서, 발표 자료, 회고

---

## 4. 일정 계획

- 4/10: 프로젝트 계획서 제출
- 5/8: MVP 개발 보고서
- 5/29: 최종 보고서 제출

---

## 5. 기술 스택

- Frontend: React, CSS, HTML, JavaScript
- Backend: Spring
- Database: MySQL
- 개발 도구: VS Code
- AI 도구: Claude, Gemini, ChatGPT

---

## 6. 산출물 관리

- 회의록: Notion
- 소통: 카카오톡 오픈채팅
- 버전 관리: GitHub

## Git 규칙

### 1.1 Commit Type

| Type     | Description         | Example                  |
| -------- | ------------------- | ------------------------ |
| feat     | 새로운 기능 추가    | feat: 로그인 기능 구현   |
| remove   | 코드/파일 삭제      | remove: 이미지 삭제      |
| bug      | 버그 수정           | bug: 중복 클릭 수정      |
| docs     | 문서 수정           | docs: README 수정        |
| style    | UI/CSS 수정         | style: 버튼 스타일 변경  |
| refactor | 리팩토링            | refactor: 코드 구조 개선 |
| test     | 테스트 코드         | test: 테스트 추가        |
| assets   | 이미지 등 파일 추가 | assets: 아이콘 추가      |
| chore    | 환경 설정           | chore: 설정 파일 수정    |
| deploy   | 배포                | deploy: 배포 진행        |

---

### 1.2 Git Branch

- main: 배포용
- develop: 개발 통합

작업 브랜치: 목적에 따라 prefix를 구분하여 사용

branch 명 규칙: 기능 / 이슈번호 - 작업명

- Feature/#(이슈번호)-Button-Component
- Refactor/#(이슈번호)-Login-Page

---

### 1.3 PR 규칙

- 최소 1명 승인 후 merge
- merge는 작성자가 진행
- develop 브랜치로 병합
- 최신화는 main 기준 rebase

---

## 2. 변수 및 파일명

- 파일: PascalCase
- 변수: camelCase
- 함수/인터페이스: PascalCase
- 이미지: kebab-case
- 상수: UPPER_CASE

코드는 "[현재 진행 중인 스프린트 번호]\_[백로그 번호 두자리].[파일명]" 형식

예시:

- 2_01.py

---

## 7. 리스크 관리

[Risk Management 문서](https://www.notion.so/risk-management-343103a7928e80e49a52e04875541f8e?pvs=21)

---

## 8. 스크럼 및 협업 규칙

### 역할분배

- Team Representative: 박준석
- Developers: 전원
- Recorder: 교대

---

### 코드 품질 관리 전략

- 코드 리뷰 기반 관리한다.
- 주요 검토 항목:
  - 기능 정상 동작 여부
  - 코드 가독성
  - 중복 코드 여부

---

### 변경 대응 전략

- Sprint 진행 중 새로운 요구사항 발생 시 (기능 추가 요청 시)
  - 현재 Sprint에는 반영하지 않고 Backlog에 추가
  - 우선순위 재조정 후 다음 Sprint에 반영
- 정해진 기간 내 작업 완료
- 작업 지연 시 즉시 공유
- 모든 의사결정은 기록 (Notion 활용)
- 의견 충돌 시 조율 방식: 다수결

---

### 점진적 통합 전략

- 기능 완성 후 즉시 develop 브랜치에 통합
- 마지막에 한 번에 합치는 방식이 아닌 지속적 통합 적용

---

### Daily SCRUM

- Daily Scrum → Weekly Scrum으로 대체
- 매주 목요일 13:00 ~ 14:00 (KST)
- 변경 사항 발생 시 Zoom을 통한 온라인 미팅 진행

---

### Prompt 규칙

- 역할 및 순서 지정
- 제약 및 조건 명확히 포함하여 요청
- 반복 수정

---

### UI 예시

[UI 예시 문서](https://www.notion.so/UI-343103a7928e80e48de2d5b8e0eaabdd?pvs=21)

## Gantt (PBI 기반, 스프린트 3개, 5/28 이전 종료)

### Sprint 1 핵심 골격 구축 (Core Foundation)

- 목표: 메인 화면과 단어장 리스트 등 핵심 플로우의 기본 기능 구현
- 내용: High 우선순위 PBI 중심으로 MVP 기틀 마련

---

### Sprint 2 사용자 경험 고도화 (Feature Expansion)

- 목표: 프로필, 통계, 설정 등 부가 UX 확장
- 내용: Sprint 1 피드백 반영 및 사용자 스토리 기반 기능 완성

---

### Sprint 3 안정화 및 완성 (Polishing & QA)

- 목표: UI/UX 미세 조정 및 AC 기반 최종 검수
- 내용: 버그 수정 및 최적화, 배포 가능한 수준으로 마무리

---

## 스프린트 일정 (한눈에 보기)

| 구분     | 시작       | 종료       | 비고                            |
| -------- | ---------- | ---------- | ------------------------------- |
| Sprint 1 | 2026-04-10 | 2026-04-20 | Core Foundation (High PBI 중심) |
| 휴식     | 2026-04-21 | 2026-04-27 | 중간고사 기간 (개발 중지)       |
| Sprint 2 | 2026-04-28 | 2026-05-13 | Feature Expansion (UX 확장)     |
| Sprint 3 | 2026-05-14 | 2026-05-28 | Polishing & QA (안정화/릴리즈)  |

[Gantt 차트 문서](https://www.notion.so/gantt-343103a7928e80989fd3d7613bcaf798?pvs=21)
