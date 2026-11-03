import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getInitialLions, MY_CARD_ID } from './data/lions.js';
import { fetchRandomUsers, mapApiUserToLion } from './utils/randomUser.js';
import LionListPage from './pages/LionListPage.jsx';
import LionDetailPage from './pages/LionDetailPage.jsx';

function App() {
  const [lions, setLions] = useState(getInitialLions);
  const [formOpen, setFormOpen] = useState(false);
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
    <Routes>
      <Route
        path="/"
        element={
          <LionListPage
            lions={lions}
            formOpen={formOpen}
            setFormOpen={setFormOpen}
            asyncBusy={asyncBusy}
            statusText={statusText}
            showRetry={loadState === 'error' && lastOp !== null}
            onRetry={handleRetry}
            onRandom1={handleRandom1}
            onRandom5={handleRandom5}
            onRefreshAll={handleRefreshAll}
            onRemoveLast={handleRemoveLast}
            onAddLion={handleAddLion}
            formPrefillLion={formPrefillLion}
            onFormPrefillConsumed={() => setFormPrefillLion(null)}
            onRandomFillFromApi={handleFormRandomFill}
          />
        }
      />
      <Route path="/lions/:id" element={<LionDetailPage lions={lions} />} />
    </Routes>
  );
}

export default App;
