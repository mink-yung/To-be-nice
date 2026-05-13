import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import getVisibleLions from '../utils/getVisibleLions.js';
import { viewOptionsFromSearchParams, writeViewOptionsToUrl } from '../utils/urlViewOptions.js';
import LionToolbar from '../components/LionToolbar.jsx';
import LionViewOptionsShell from '../components/LionViewOptionsShell.jsx';
import LionAddFormShell from '../components/LionAddFormShell.jsx';
import ProfileCard from '../components/ProfileCard.jsx';

function LionListPage({
  lions,
  formOpen,
  setFormOpen,
  asyncBusy,
  statusText,
  showRetry,
  onRetry,
  onRandom1,
  onRandom5,
  onRefreshAll,
  onRemoveLast,
  onAddLion,
  formPrefillLion,
  onFormPrefillConsumed,
  onRandomFillFromApi,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { filterPart, sortOrder, searchQuery } = viewOptionsFromSearchParams(searchParams);
  const visibleLions = getVisibleLions(lions, filterPart, sortOrder, searchQuery);

  function updateUrl(next) {
    writeViewOptionsToUrl(setSearchParams, next);
  }

  return (
    <>
      <LionToolbar
        totalCount={lions.length}
        onAddClick={() => setFormOpen(true)}
        onRemoveLast={onRemoveLast}
        onRandom1={onRandom1}
        onRandom5={onRandom5}
        onRefreshAll={onRefreshAll}
        asyncBusy={asyncBusy}
        statusText={statusText}
        showRetry={showRetry}
        onRetry={onRetry}
      />
      <LionViewOptionsShell
        filterPart={filterPart}
        sortOrder={sortOrder}
        searchQuery={searchQuery}
        onFilterPartChange={(next) =>
          updateUrl({ filterPart: next, sortOrder, searchQuery })
        }
        onSortOrderChange={(next) =>
          updateUrl({ filterPart, sortOrder: next, searchQuery })
        }
        onSearchQueryChange={(next) =>
          updateUrl({ filterPart, sortOrder, searchQuery: next })
        }
      />
      <LionAddFormShell
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onAddLion={onAddLion}
        asyncBusy={asyncBusy}
        formPrefillLion={formPrefillLion}
        onFormPrefillConsumed={onFormPrefillConsumed}
        onRandomFillFromApi={onRandomFillFromApi}
      />
      <div
        id="lion-empty-state"
        className="lion-empty-state"
        hidden={visibleLions.length > 0}
      >
        <p className="lion-empty-title">표시할 아기 사자가 없습니다</p>
        <p className="lion-empty-desc">
          필터·정렬·검색 조건을 바꾸거나, 랜덤 추가로 명단을 채워 보세요.
        </p>
      </div>
      <main>
        <section className="summary-section" aria-label="요약 카드">
          {visibleLions.map((lion) => (
            <ProfileCard
              key={lion.id}
              lion={lion}
              onSelect={() =>
                navigate(`/lions/${lion.id}`, {
                  state: { fromList: `${location.pathname}${location.search}` },
                })
              }
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default LionListPage;
