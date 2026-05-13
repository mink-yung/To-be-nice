import { Link, useParams, useLocation } from 'react-router-dom';
import DetailCard from '../components/DetailCard.jsx';

function LionDetailPage({ lions }) {
  const { id } = useParams();
  const location = useLocation();
  const lion = lions.find((l) => l.id === id);

  const fromList = location.state && location.state.fromList;
  const listTo = fromList && String(fromList).length > 0 ? fromList : '/';

  if (!lion) {
    return (
      <main>
        <div className="lion-empty-state">
          <p className="lion-empty-title">아기 사자를 찾을 수 없습니다</p>
          <p className="lion-empty-desc">목록에서 다시 선택해 주세요.</p>
          <p className="lion-empty-desc">
            <Link className="lion-btn-primary" to="/">
              목록으로
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="lion-detail-back-wrap">
        <Link className="lion-detail-back-bar" to={listTo}>
          ← 목록으로
        </Link>
      </div>
      <section className="detail-section" aria-label="상세 프로필">
        <DetailCard lion={lion} />
      </section>
    </main>
  );
}

export default LionDetailPage;
