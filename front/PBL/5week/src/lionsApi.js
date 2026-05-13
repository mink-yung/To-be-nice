const RANDOM_USER_API = 'https://randomuser.me/api/';
const TECH_POOL = [
  'TypeScript',
  'React',
  'Vue',
  'Node.js',
  'GraphQL',
  'CSS Grid',
  'Figma',
  'Docker',
  'REST API',
  'Web Accessibility',
  'Typography',
];

export function newLionId() {
  return `lion-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function shuffleCopy(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function pickRandomSkills() {
  const pool = shuffleCopy(TECH_POOL);
  const n = 3 + Math.floor(Math.random() * 2);
  return pool.slice(0, n);
}

export function mapApiUserToLion(u, idx) {
  const parts = ['Frontend', 'Backend', 'Design'];
  const part = parts[Math.floor(Math.random() * parts.length)];
  const first = (u.name && u.name.first) || '';
  const last = (u.name && u.name.last) || '';
  const name = `${first} ${last}`.trim() || (u.login && u.login.username) || '이름 없음';
  const city = (u.location && u.location.city) || '';
  const age = u.dob && u.dob.age;
  const skills = pickRandomSkills();
  const introLine = city ? `${city}에서 활동 중인 아기 사자입니다.` : '새로 합류한 아기 사자입니다.';
  const bio = `안녕하세요! 저는 ${name}입니다. ${age ? `나이는 ${age}살, ` : ''}멋쟁이사자처럼 14기 ${part} 파트에서 함께 성장하고 싶습니다.`;
  return {
    id: newLionId(),
    name,
    part,
    introLine,
    bio,
    skills,
    email: u.email || '',
    phone: String((u.cell || u.phone || '').replace(/\D/g, '') || '01000000000'),
    website: '',
    quote: '오늘도 한 걸음씩!',
    imageSrc: (u.picture && (u.picture.large || u.picture.medium)) || '',
    addedAt: Date.now() + idx,
  };
}

export function fetchRandomUsers(results) {
  const url = `${RANDOM_USER_API}?results=${results}&nat=kr,us,gb`;
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 응답 ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        throw new Error('사용자 데이터가 비어 있습니다.');
      }
      return data.results;
    });
}
