export interface TalkSearchParticipant {
  id: string;
  name: string;
  isHost?: boolean;
  external?: boolean;
}

export interface TalkSearchTalk {
  id: string;
  fromId: string;
  fromName: string;
  isMe?: boolean;
  type?: 'message' | 'system';
  content: string;
  /** 'HH:mm' (전시용) */
  time: string;
}

export interface TalkSearchRoom {
  id: string;
  title: string;
  manager: string;
  channel: string;
  center?: string;
  /** ISO date — 'YYYY-MM-DD' */
  date: string;
  /** 'MM-DD HH:mm:ss' (리스트 카드 표시) */
  lastTimestamp: string;
  preview: string;
  participants: TalkSearchParticipant[];
  talks: TalkSearchTalk[];
}

export const TALK_SEARCH_ROOMS: TalkSearchRoom[] = [
  {
    id: 'ts-a',
    title: '협업 대화방',
    manager: '김도윤',
    channel: 'PC-협업용',
    center: '협업기획팀',
    date: '2026-05-10',
    lastTimestamp: '05-10 14:23:11',
    preview: '내일 회의 자료 공유드릴게요.',
    participants: [
      { id: 'host-doyoon', name: '김도윤', isHost: true },
      { id: 'p-jihyun', name: '김지현' },
      { id: 'p-saeyoung', name: '한세영' },
    ],
    talks: [
      {
        id: 'ts-a-sys-1',
        fromId: 'system',
        fromName: '시스템',
        type: 'system',
        content: '입장: 김지현, 한세영',
        time: '13:40',
      },
      {
        id: 'ts-a-1',
        fromId: 'host-doyoon',
        fromName: '김도윤',
        isMe: true,
        content: '안녕하세요, 다음 주 협업 킥오프 일정 공유드립니다.',
        time: '13:42',
      },
      {
        id: 'ts-a-2',
        fromId: 'p-jihyun',
        fromName: '김지현',
        content: '확인했습니다! 자료는 미리 정리해 둘게요.',
        time: '13:45',
      },
      {
        id: 'ts-a-3',
        fromId: 'p-saeyoung',
        fromName: '한세영',
        content: '저는 이슈 트래커 정리해서 공유드릴게요.',
        time: '14:01',
      },
      {
        id: 'ts-a-4',
        fromId: 'host-doyoon',
        fromName: '김도윤',
        isMe: true,
        content: '내일 회의 자료 공유드릴게요.',
        time: '14:23',
      },
    ],
  },
  {
    id: 'ts-b',
    title: '박정균 고객 상담',
    manager: '박지원',
    channel: '상담센터',
    center: '고객지원팀',
    date: '2026-05-07',
    lastTimestamp: '05-07 17:08:42',
    preview: '서류 접수 완료되어 처리 진행하겠습니다.',
    participants: [
      { id: 'host-jiwon', name: '박지원', isHost: true },
      { id: 'ext-jeonggyun', name: '박정균', external: true },
    ],
    talks: [
      {
        id: 'ts-b-sys-1',
        fromId: 'system',
        fromName: '시스템',
        type: 'system',
        content: '입장: 박정균',
        time: '16:20',
      },
      {
        id: 'ts-b-1',
        fromId: 'ext-jeonggyun',
        fromName: '박정균',
        content: '안녕하세요, 어제 신청한 건 처리 상황 좀 확인 가능할까요?',
        time: '16:22',
      },
      {
        id: 'ts-b-2',
        fromId: 'host-jiwon',
        fromName: '박지원',
        isMe: true,
        content: '안녕하세요 고객님, 확인해드리겠습니다. 잠시만 기다려주세요.',
        time: '16:30',
      },
      {
        id: 'ts-b-3',
        fromId: 'host-jiwon',
        fromName: '박지원',
        isMe: true,
        content: '추가 서류 1건이 필요해서 메일로 안내드렸습니다. 확인 부탁드립니다.',
        time: '16:55',
      },
      {
        id: 'ts-b-4',
        fromId: 'ext-jeonggyun',
        fromName: '박정균',
        content: '방금 회신드렸습니다.',
        time: '17:05',
      },
      {
        id: 'ts-b-5',
        fromId: 'host-jiwon',
        fromName: '박지원',
        isMe: true,
        content: '서류 접수 완료되어 처리 진행하겠습니다.',
        time: '17:08',
      },
    ],
  },
  {
    id: 'ts-c',
    title: 'GA 설계지원 채널',
    manager: '이수민',
    channel: 'PC-협업용',
    center: 'GA 설계지원',
    date: '2026-04-20',
    lastTimestamp: '04-20 11:15:03',
    preview: '제안서 PDF 전달드렸습니다. 확인 부탁드려요.',
    participants: [
      { id: 'host-sumin', name: '이수민', isHost: true },
      { id: 'ext-cheolsu', name: '김철수', external: true },
    ],
    talks: [
      {
        id: 'ts-c-sys-1',
        fromId: 'system',
        fromName: '시스템',
        type: 'system',
        content: '입장: 김철수',
        time: '09:50',
      },
      {
        id: 'ts-c-1',
        fromId: 'ext-cheolsu',
        fromName: '김철수',
        content: '월 1만원 내외로 운전자보험 설계 부탁드립니다.',
        time: '10:02',
      },
      {
        id: 'ts-c-2',
        fromId: 'host-sumin',
        fromName: '이수민',
        isMe: true,
        content: '확인했습니다. 고객 정보 받아 설계 진행하겠습니다.',
        time: '10:12',
      },
      {
        id: 'ts-c-3',
        fromId: 'ext-cheolsu',
        fromName: '김철수',
        content: '감사합니다. 천천히 진행 부탁드릴게요.',
        time: '10:30',
      },
      {
        id: 'ts-c-4',
        fromId: 'host-sumin',
        fromName: '이수민',
        isMe: true,
        content: '제안서 PDF 전달드렸습니다. 확인 부탁드려요.',
        time: '11:15',
      },
    ],
  },
];
