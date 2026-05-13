import { useEffect, useState } from 'react';
import { getInitialLions, MY_CARD_ID } from './data/lions.js';
import { fetchRandomUsers, mapApiUserToLion } from './utils/randomUser.js';
import getVisibleLions from './utils/getVisibleLions.js';
import LionToolbar from './components/LionToolbar.jsx';
import LionViewOptionsShell from './components/LionViewOptionsShell.jsx';
import LionAddFormShell from './components/LionAddFormShell.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import DetailCard from './components/DetailCard.jsx';

function App() {
  const [lions, setLions] = useState(getInitialLions);
  const [formOpen, setFormOpen] = useState(false);
  const [filterPart, setFilterPart] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadState, setLoadState] = useState('idle');
  const [lastError, setLastError] = useState('');
  const [lastOp, setLastOp] = useState(null);
  const [formPrefillLion, setFormPrefillLion] = useState(null);

  useEffect(() => {
    if (loadState !== 'success') return undefined;
    const id = setTimeout(() => {
      setLoadState('idle');
    }, 800);
    return () => clearTimeout(id);
  }, [loadState]);

  const visibleLions = getVisibleLions(lions, filterPart, sortOrder, searchQuery);

  const asyncBusy = loadState === 'loading';

  const statusText =
    loadState === 'loading'
      ? '불러오는 중...'
      : loadState === 'error'
        ? `실패: ${lastError}`
        : loadState === 'success'
          ? '완료!'
          : '준비 완료';

  function beginExternal(opKey, runner) {
    if (loadState === 'loading') return;
    setLastOp(opKey);
    setLastError('');
    setLoadState('loading');

    Promise.resolve()
      .then(() => runner())
      .then(() => {
        setLastOp(null);
        setLoadState('success');
      })
      .catch((err) => {
        setLoadState('error');
        setLastError(err?.message || String(err));
      });
  }

  function handleRandom1() {
    beginExternal('random1', async () => {
      const users = await fetchRandomUsers(1);
      setLions((prev) => [...prev, ...users.map((u, i) => mapApiUserToLion(u, i))]);
    });
  }

  function handleRandom5() {
    beginExternal('random5', async () => {
      const users = await fetchRandomUsers(5);
      setLions((prev) => [...prev, ...users.map((u, i) => mapApiUserToLion(u, i))]);
    });
  }

  function handleRefreshAll() {
    const snapshot = lions;
    beginExternal('refresh', async () => {
      const my = snapshot.find((l) => l.id === MY_CARD_ID);
      const need = Math.max(0, snapshot.length - (my ? 1 : 0));
      if (need === 0) {
        setLions(my ? [my] : []);
        return;
      }
      const users = await fetchRandomUsers(need);
      const newOthers = users.map((u, i) => mapApiUserToLion(u, i));
      setLions(my ? [my, ...newOthers] : newOthers);
    });
  }

  function handleFormRandomFill() {
    beginExternal('formRandomFill', async () => {
      const users = await fetchRandomUsers(1);
      setFormPrefillLion(mapApiUserToLion(users[0], 0));
    });
  }

  function handleRetry() {
    if (loadState !== 'error' || !lastOp) return;
    if (lastOp === 'random1') handleRandom1();
    else if (lastOp === 'random5') handleRandom5();
    else if (lastOp === 'refresh') handleRefreshAll();
    else if (lastOp === 'formRandomFill') handleFormRandomFill();
  }

  function handleRemoveLast() {
    setLions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }

  function handleAddLion(lion) {
    setLions((prev) => [...prev, lion]);
  }

  return (
    <>
      <LionToolbar
        totalCount={lions.length}
        onAddClick={() => setFormOpen(true)}
        onRemoveLast={handleRemoveLast}
        onRandom1={handleRandom1}
        onRandom5={handleRandom5}
        onRefreshAll={handleRefreshAll}
        asyncBusy={asyncBusy}
        statusText={statusText}
        showRetry={loadState === 'error' && lastOp !== null}
        onRetry={handleRetry}
      />
      <LionViewOptionsShell
        filterPart={filterPart}
        sortOrder={sortOrder}
        searchQuery={searchQuery}
        onFilterPartChange={setFilterPart}
        onSortOrderChange={setSortOrder}
        onSearchQueryChange={setSearchQuery}
      />
      <LionAddFormShell
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onAddLion={handleAddLion}
        asyncBusy={asyncBusy}
        formPrefillLion={formPrefillLion}
        onFormPrefillConsumed={() => setFormPrefillLion(null)}
        onRandomFillFromApi={handleFormRandomFill}
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
            <ProfileCard key={lion.id} lion={lion} />
          ))}
        </section>
        <section className="detail-section" aria-label="상세 카드">
          {visibleLions.map((lion) => (
            <DetailCard key={lion.id} lion={lion} />
          ))}
        </section>
      </main>
    </>
  );
}

export default App;
