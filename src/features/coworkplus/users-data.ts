export interface InternalUserSeed {
  id: string;
  name: string;
  login: string;
}

export const INTERNAL_USERS: InternalUserSeed[] = [
  { id: 'jhkim', name: '김지현', login: 'jhkim' },
  { id: 'mspark', name: '박민수', login: 'mspark' },
  { id: 'sjlee', name: '이수진', login: 'sjlee' },
  { id: 'dhjeong', name: '정도현', login: 'dhjeong' },
  { id: 'syhan', name: '한세영', login: 'syhan' },
  { id: 'wjchoi', name: '최우진', login: 'wjchoi' },
  { id: 'syyoon', name: '윤서연', login: 'syyoon' },
  { id: 'dykang', name: '강도윤', login: 'dykang' },
];
