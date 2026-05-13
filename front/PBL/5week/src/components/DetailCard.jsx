import { normalizeWebsiteHref } from '../lionsValidation.js';

function DetailCard({ lion }) {
  const siteTrim = (lion.website || '').trim();

  return (
    <div className="detail-content" data-lion-id={lion.id}>
      <h2 className="detail-name">{lion.name}</h2>
      <p className="detail-part">{lion.part}</p>
      <p className="club-name">멋쟁이사자처럼 14기</p>

      <div className="info-group">
        <h3>자기소개 한문단</h3>
        <p>{lion.bio || ''}</p>
      </div>

      <div className="info-group">
        <h3>관심 기술 불렛 포인트 목록</h3>
        <ul>
          {(lion.skills || []).map((skill, idx) => (
            <li key={`${lion.id}-skill-${idx}`}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="info-group">
        <h3>연락처</h3>
        <ul>
          <li>이메일: {lion.email || '(없음)'}</li>
          <li>
            웹사이트:{' '}
            {siteTrim ? (
              <a
                className="part"
                href={normalizeWebsiteHref(siteTrim)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteTrim}
              </a>
            ) : (
              '준비 중'
            )}
          </li>
          <li>휴대전화 번호: {lion.phone || '(없음)'}</li>
        </ul>
      </div>

      <div className="info-group">
        <h3>각오 한 마디</h3>
        <p>{lion.quote || ''}</p>
      </div>
    </div>
  );
}

export default DetailCard;
