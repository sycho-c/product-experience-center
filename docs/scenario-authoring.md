# 시나리오 작성 가이드

이 문서는 **Product Experience Lab** 의 시나리오 저자가 새 시나리오를 작성·수정할 때의 기준을 정리한다. 시나리오 = 사용자에게 보여줄 micro-action 시퀀스이며, 한 액션 = 한 화면 인터랙션이 되도록 잘게 쪼개는 것이 원칙이다.

---

## 1. 시나리오 모듈 구조

시나리오는 `src/data/scenarios/` 아래에 **두 파일 한 쌍**으로 작성한다.

| 파일 | 역할 | 로드 시점 |
|------|------|----------|
| `<id>.meta.ts` | `ScenarioMeta` (id/title/summary/category/customer/difficulty/durationMinutes/devices) 만 named export | `_index.ts` 가 즉시 import — 카드 목록 표시용 |
| `<id>.ts` | `Scenario` 본체 (`...meta` + steps/seed/extends/beforeSteps/metrics/goals) default export | `loadScenario(id)` 가 호출될 때 lazy import |

이 분리는 (a) `_index.ts` 에서 메타 중복 제거, (b) 시나리오 본체의 lazy chunk 분리 유지, 두 가지를 동시에 만족시킨다. `Scenario` 본체가 `...meta` 로 합성되므로 메타 필드는 `<id>.meta.ts` 가 **단일 source**.

### `<id>.meta.ts` 표준 형태
```ts
import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'my-scenario',
  title: '새 시나리오',
  summary: '한 줄 설명',
  category: 'customer-case',           // 'customer-case' | 'feature' | 'future-concept' | 'industry'
  customer: { id: 'acme', name: 'ACME' }, // customer-case 일 때만
  difficulty: 'medium',                // 'easy' | 'medium' | 'hard'
  durationMinutes: 10,
  devices: ['pc', 'mobile'],
};
```

### `<id>.ts` 표준 형태
```ts
import type { Scenario } from '@/types/scenario';
import { meta } from './my-scenario.meta';

const scenario: Scenario = {
  ...meta,
  goals: ['...'],
  steps: [...],
  beforeSteps: [...],   // 비교 데모가 필요한 경우
  metrics: [...],       // ImpactMetrics 표시용
  // seed, extends 등 필요 시
};

export default scenario;
```

### `_index.ts` 등록
```ts
import { meta as myMeta } from './my-scenario.meta';

export const scenarioRegistry: ScenarioRegistryEntry[] = [
  // ... 기존 entries
  { ...myMeta, load: lazy(() => import('./my-scenario')) },
];
```

`lazy` 헬퍼는 `_index.ts` 안에 정의되어 있다. **추가 시 한 줄, 수정 시 `<id>.meta.ts` 만 손대면 된다.**

`Scenario` 객체의 핵심 필드:

```ts
interface Scenario {
  id: string;
  title: string;
  summary?: string;
  category: 'customer-case' | 'feature' | 'future-concept' | 'industry';
  customer?: { id: string; name: string };
  difficulty: 'easy' | 'medium' | 'hard';
  durationMinutes: number;
  devices: ('pc' | 'mobile' | 'web' | 'all')[];
  extends?: string;       // 부모 시나리오 id (extends 인프라)
  seed?: UISimSeed;       // 시작 시점 ui-simulation 상태
  steps: Step[];
  beforeSteps?: Step[];   // 카카오톡(Before) 모드 시퀀스
  metrics?: ImpactMetric[];
  goals?: string[];
}
```

---

## 2. seed — 시작 시점 상태 주입

`seed` 는 시나리오 진입 즉시 ui-simulation 스토어에 적용된다. step 액션이 흐르기 전의 "이미 협업 중인 상태" 를 만든다.

```ts
seed: {
  rooms: [
    { id: 'wc-room', title: '여신팀 ↔ 거래처', participantCount: 72,
      preview: '한도 검토 진행 중', device: 'PC', timestamp: '오늘' },
  ],
  currentRoomId: 'wc-room',
  mobileViewerParticipantId: 'ext-001',  // Guest 가 시점으로 보고 있는 외부 참여자
  participants: { 'wc-room': [...] },     // 내부/외부 참여자 list
  roomTalks:    { 'wc-room': [...] },     // 사전 메시지
  inputs:       { ... },
  modals:       { ... },
}
```

**규칙**
- `mobileViewerParticipantId` 는 단체방 비밀 메시지 가시성 판정의 기준점이다. 외부 참여자 1명을 지정.
- 사전 메시지(`roomTalks`) 는 stepId 를 `'seed'` 로 두고 talk id 를 명시 (재실행/seek 시 dedupe).
- 70명 같은 대규모 참여자 list 는 `.ts` 모듈에서 `Array.from({length:N}, ...)` 으로 생성한다 (JSON 으로는 비효율).

---

## 3. extends — 부모 시나리오 상속

`extends: 'basic-room-creation'` 같이 부모 id 를 지정하면, `loadScenario` 가 부모를 먼저 로드하고 부모의 모든 step.actions 를 적용한 **최종 상태** 를 추출(`extract-final-seed.ts`)해 자식의 시작 seed 로 합친다 (`mergeSeed`: 자식 우선 shallow merge).

```ts
{
  id: 'hana-contract',
  extends: 'basic-room-creation',  // basic 종료 상태 = 대화방 생성 + 양쪽 합류 = 시작점
  seed: {
    // 자식 자체 추가 사항만 작성
    mobileViewerParticipantId: 'ext-001',
  },
  steps: [...],
}
```

**병합 정책**
- 자식 seed 의 필드는 부모를 덮어쓴다.
- `roomTalks`/`participants` 는 roomId 키 단위 shallow merge — 동일 roomId 면 자식이 부모를 교체.
- 부모의 도메인 store 변화(tasks/bizforms/knowledge) 는 final seed 에 보존되지 않는다 (휘발).
- 부모의 mobile 휘발 상태(notices, menu, modal, mobileRoomId) 도 보존하지 않는다.

**가드**
- 자기 자신을 extends 할 수 없다 (`mock-api.ts` 가 throw).
- 깊이 5 초과 시 throw (재귀 보호).

---

## 4. UIAction 카탈로그 (총 34종)

UIAction 은 `src/types/uiaction.ts` 의 discriminated union 이며, zod 스키마는 `src/lib/schema.ts` 의 `UIActionSchema` 에 1:1 대응한다. **모든 액션은 `description: string` 을 필수**로 가지며 좌측 가이드 자막에 자연어로 노출된다.

### 4.1 모달 (4)

| kind | 필수 필드 | 효과 |
|------|----------|------|
| `open_modal` | `modalId`, `description`, `initialStep?`, `initialTab?` | 모달 열기 |
| `close_modal` | `modalId` | 닫기 |
| `set_modal_step` | `modalId`, `step` | 모달 단계 변경 |
| `set_tab` | `modalId`, `tab` | 모달 내 탭 변경 |

```json
{ "kind": "open_modal", "modalId": "create-room", "initialStep": 1, "initialTab": "internal", "description": "새 대화방 만들기 모달을 엽니다." }
```

### 4.2 입력/체크/버튼 (3)

| kind | 필수 필드 |
|------|----------|
| `fill_input` | `field`, `value` |
| `toggle_check` | `itemId`, `on` |
| `click_button` | `buttonId` (시각/자막용 placeholder) |

### 4.3 토스트/대화방 (3)

| kind | 필수 필드 | 효과 |
|------|----------|------|
| `show_toast` | `message`, `tone?` | 좌하단 토스트 |
| `add_room` | `roomId`, `title`, `participantCount`, `preview` | 대화방 리스트 추가 |
| `select_room` | `roomId` | Workspace 측 활성 방 |

### 4.4 메시지 (3)

| kind | 필수 필드 | 효과 |
|------|----------|------|
| `append_system_message` | `roomId`, `content` | "입장: ~" 같은 시스템 버블 |
| `append_chat` | `roomId`, `from`, `content`, `messageId?`, `deviceTarget?` | 일반 메시지 |
| `add_participant` | `roomId`, `participantId`, `displayName`, `external`, `device?`, `isHost?` | 참여자 추가 |

`append_chat` 의 `messageId` 는 `attach_task_chip` 같은 후속 액션이 참조하려면 명시한다.

```json
{
  "kind": "append_chat",
  "roomId": "wc-room",
  "messageId": "wc-host-reply",
  "from": { "role": "me", "userId": "host-1", "displayName": "조승열" },
  "content": "확인했습니다. 신용도 검토 후 안내드리겠습니다.",
  "deviceTarget": "all",
  "description": "호스트가 단체방에 1차 답변을 보냅니다."
}
```

### 4.5 모바일 (6)

| kind | 효과 |
|------|------|
| `mobile_push_notice` | Guest 알림 + 채팅 리스트 unread 항목 추가 |
| `mobile_open_room` | Guest 측 활성 방. 알림 consume + 채팅 read |
| `mobile_open_menu` / `mobile_close_menu` | 햄버거 dropdown 토글 |
| `mobile_select_menu` (`menuId`) | 메뉴 선택. `bizform` 외는 placeholder |
| `mobile_open_bizform` (`templateId`, `title`, `fields[]`) | Mobile 비즈폼 모달 오픈 |
| `mobile_fill_bizform_field` (`fieldId`, `value`) | 모달 내 한 필드 입력 |

`menuId` 는 `'notice' | 'knowledge' | 'board' | 'bizform' | 'participants' | 'guide'` 6종.

### 4.6 도메인 — 할 일 (2)

| kind | 효과 |
|------|------|
| `add_task` (`roomId`, `taskId`, `title`, `assignee?`, `dueDate?`, `status?`) | RightRail 할 일 패널에 추가 |
| `update_task_status` (`taskId`, `status`) | 도메인 task 상태 변경 |

### 4.7 도메인 — 비즈폼 (4)

| kind | 효과 |
|------|------|
| `attach_bizform` (`roomId`, `bizformId`, `title`, `templateId?`, `fields[]`, `messageId?`) | 비즈폼 첨부 (+ messageId 있으면 inline 카드) |
| `submit_bizform` (`roomId`, `bizformId`, `title`, `messageId?`) | Mobile 비즈폼 모달 → 대화방 inline 카드 |
| `approve_bizform` (`bizformId`) | 승인 |
| `reject_bizform` (`bizformId`, `reason?`) | 반려 + 사유 |

### 4.8 도메인 — 지식 / 파일 (2)

| kind | 효과 |
|------|------|
| `attach_knowledge` (`roomId`, `knowledgeId`, `title`, `excerpt?`, `source?`) | 지식 카드 첨부 |
| `attach_file` (`roomId`, `fileId`, `name`, `size?`, `mime?`) | 파일 메시지 |

### 4.9 비밀 메시지 / 메시지 chip (3)

```json
{
  "kind": "send_secret_message",
  "roomId": "wc-room",
  "messageId": "wc-secret-1",
  "from": { "role": "me", "userId": "host-1", "displayName": "조승열" },
  "recipientParticipantId": "ext-001",
  "content": "내부 검토 결과 한도 상향 가능합니다.",
  "deviceTarget": "all",
  "description": "ext-001 에게만 보이는 비밀 메시지를 전송합니다."
}
```

| kind | 가시성 |
|------|--------|
| `send_secret_message` | navy 톤 메시지. PC: 풀 표시 / Mobile: viewer === recipient 또는 me 면 풀, 외 placeholder |
| `attach_task_chip` (`roomId`, `messageId`, `taskId`, `title`) | 메시지 하단 "처리중" chip + 도메인 task 함께 등록 |
| `update_task_chip_status` (`roomId`, `messageId`, `taskId`, `status`) | chip + task 상태 동시 갱신 |

### 4.10 시점 / 보조 (3)

| kind | 효과 |
|------|------|
| `switch_mobile_viewer` (`participantId`) | Guest 시점 외부 참여자 전환 |
| `highlight` (`selector`) | UI 요소 강조 (현재 단순 표시) |
| `wait` (`ms`) | 자동 재생 시 간격 |

---

## 5. Step 작성 룰

```ts
interface Step {
  id: string;
  order: number;
  title: string;          // "1. 외부 고객 문의" 같이 사용자에게 보일 챕터명
  description?: string;   // 가이드 자막
  durationMs?: number;    // legacy talks 모드용 (action 모드는 영향 적음)
  talks: Talk[];          // legacy. 신규 시나리오는 빈 배열
  actions?: UIAction[];   // 마이크로 액션 시퀀스
}
```

**원칙**
- 1 step = 1 챕터 (예: "비밀 메시지 전송"). step 클릭 시 그 step 의 **모든 액션을 적용한 end 상태** 로 점프한다.
- 1 action = 1 micro 인터랙션 (모달 한 번 열기, 입력 한 번, 체크 한 번). 너무 합치지 말 것.
- `description` 은 사용자에게 보이는 자막. 자연어 1-2 문장.
- 인접 액션이 너무 사소하면 그대로 두기 — 시나리오 박자가 살아남.
- `deviceTarget` 으로 메시지 표시 대상을 명시 (`'all'` 권장 — 양쪽 디바이스 동시 표시).

---

## 6. 자유 인터랙션과의 조화 — `progressOrDo`

화면 안의 자유 클릭은 `src/lib/use-scenario-match.ts` 의 `progressOrDo(fallback)` 패턴을 따른다.

```ts
const onCreateRoomClick = () =>
  progressOrDo(() =>
    setModal('create-room', { open: true, step: 1, tab: 'internal' })
  );
```

- 시나리오 미로드 / 완료 상태 → `fallback()` 즉시 실행 (자유 인터랙션).
- 시나리오 진행 중 → `nextAction()` dispatch. 다음 액션이 클릭 의도와 무관해도 한 칸 진행.
- 시나리오 끝에 도달했지만 더 다음 없을 때도 `fallback()` 으로 안전망.

**저자 관점**: 자유 모드에서 사용자가 직접 클릭해도 시나리오와 동일한 결과가 나오도록, 시나리오 액션 시퀀스가 자유 인터랙션과 같은 reducer 를 거치도록 설계한다 (`applyUIAction`).

---

## 7. 검증 체크리스트

새 시나리오 작성 후:

```bash
npm run typecheck
npm run build
npm run dev
```

브라우저에서 (`http://localhost:5173/product-experience-lab/#/scenarios/<id>/experience`):

- [ ] 시나리오 진입 즉시 seed 가 반영된 상태 노출 (대화방·참여자·사전 메시지·viewer)
- [ ] ▶ 자동 진행으로 모든 step 정상 통과 — 마지막 step 종료 시 `completed`
- [ ] 좌측 step list 항목 클릭으로 해당 step end 상태 점프 (제목 ↔ 화면 일치)
- [ ] step 0 (또는 "처음으로") 클릭 → 시나리오 시작 상태로 복원
- [ ] 진행 중 화면 안 자유 클릭이 시나리오와 충돌 없이 동작 (시나리오 진행 OR fallback)
- [ ] 새 메시지 추가 시 자동 스크롤 (PC + Mobile)
- [ ] 비밀 메시지 step: PC 풀 표시 + Mobile viewer 매칭 시 풀 / 외 시점 시 placeholder
- [ ] 비즈폼 제출 step: 대화방 inline 카드 + RightRail 비즈폼 패널 등록
- [ ] 할 일 chip 갱신 step: chip "처리중" → "완료"

---

## 8. 사례 — 두 시나리오 비교

| 시나리오 | seed | 액션 분포 | 핵심 시연 |
|---------|------|----------|----------|
| `basic-room-creation` (7 step) | seed 없음 (빈 상태) | 모달 흐름 + 메시지 + 모바일 합류 | 외부 사용자 초대·합류 절차 |
| `woori-credit` (11 step, 72명) | 단체방 + 사전 메시지 4 + viewer ext-001 | 비밀 메시지 + chip + 비즈폼 | 단체방 보안 + 처리 추적 |

`basic-room-creation` 의 종료 상태(대화방 생성 + 양쪽 합류) 는 다른 고객사 시나리오의 `extends` 시작점으로 재활용 가능하다 (`hana-contract` 등). `woori-credit` 은 단체방 컨텍스트가 다르므로 자체 seed 를 사용한다.
