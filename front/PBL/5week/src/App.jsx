import { useEffect, useMemo, useRef, useState } from 'react';
import { getInitialLions } from './data/lions.js';
import { fetchRandomUsers, mapApiUserToLion } from './lionsApi.js';
import LionToolbar from './components/LionToolbar.jsx';
import LionViewOptionsShell from './components/LionViewOptionsShell.jsx';
import LionAddFormShell from './components/LionAddFormShell.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import DetailCard from './components/DetailCard.jsx';

function getVisibleLions(lions, filterPart, sortOrder, searchQuery) {
  const q = searchQuery.trim().toLowerCase();
  const filtered = lions.filter((lion) => {
    if (filterPart && lion.part !== filterPart) return false;
    if (q && !String(lion.name).toLowerCase().includes(q)) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'name') {
      return String(a.name).localeCompare(String(b.name), 'ko');
    }
    return (b.addedAt || 0) - (a.addedAt || 0);
  });
  return sorted;
}

function App() {
  const [lions, setLions] = useState(getInitialLions);
  const [formOpen, setFormOpen] = useState(false);
  const [filterPart, setFilterPart] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadState, setLoadState] = useState('idle');
  const [lastError, setLastError] = useState('');
  const [hasRetry, setHasRetry] = useState(false);
  const pendingRef = useRef(false);
  const lastRunnerRef = useRef(null);
  const lionsRef = useRef(lions);

  useEffect(() => {
    lionsRef.current = lions;
  }, [lions]);

  const visibleLions = useMemo(
    () => getVisibleLions(lions, filterPart, sortOrder, searchQuery),
    [lions, filterPart, sortOrder, searchQuery]
  );

  function runExternalRequest(runner) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    lastRunnerRef.current = null;
    setHasRetry(false);
    setLastError('');
    setLoadState('loading');
    Promise.resolve()
      .then(() => runner())
      .then(() => {
        lastRunnerRef.current = null;
        setLoadState('idle');
      })
      .catch((err) => {
        lastRunnerRef.current = () => runExternalRequest(runner);
        setHasRetry(true);
        setLoadState('error');
        setLastError(err?.message || String(err));
      })
      .finally(() => {
        pendingRef.current = false;
      });
  }

  const statusText =
    loadState === 'loading'
      ? '불러오는 중...'
      : loadState === 'error'
        ? `실패: ${lastError}`
        : '준비 완료';

  const asyncBusy = loadState === 'loading';

  function handleRemoveLast() {
    setLions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }

  function handleRandom1() {
    runExternalRequest(async () => {
      const users = await fetchRandomUsers(1);
      setLions((prev) => [
        ...prev,
        ...users.map((u, i) => mapApiUserToLion(u, i)),
      ]);
    });
  }

  function handleRandom5() {
    runExternalRequest(async () => {
      const users = await fetchRandomUsers(5);
      setLions((prev) => [
        ...prev,
        ...users.map((u, i) => mapApiUserToLion(u, i)),
      ]);
    });
  }

  function handleRefreshAll() {
    runExternalRequest(async () => {
      const prev = lionsRef.current;
      const n = prev.length < 1 ? 9 : prev.length;
      const count = Math.min(Math.max(n, 1), 20);
      const users = await fetchRandomUsers(count);
      setLions(users.map((u, i) => mapApiUserToLion(u, i)));
    });
  }

  function handleRetry() {
    const run = lastRunnerRef.current;
    if (typeof run === 'function') run();
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
        showRetry={loadState === 'error' && hasRetry}
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
        runExternalRequest={runExternalRequest}
        asyncBusy={asyncBusy}
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
