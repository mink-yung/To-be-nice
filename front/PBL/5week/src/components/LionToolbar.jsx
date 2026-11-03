function LionToolbar({
  totalCount,
  onAddClick,
  onRemoveLast,
  onRandom1,
  onRandom5,
  onRefreshAll,
  asyncBusy,
  statusText,
  showRetry,
  onRetry,
}) {
  return (
    <>
      <p className="lion-top-actions">
        <button type="button" onClick={onAddClick}>
          아기 사자 추가
        </button>
        <button type="button" disabled={totalCount <= 1} onClick={onRemoveLast}>
          마지막 아기 사자 삭제
        </button>
        <span className="lion-count" aria-live="polite">
          총 {totalCount}명
        </span>
      </p>
      <div className="lion-async-bar" aria-label="외부 데이터 불러오기">
        <div className="lion-async-buttons">
          <button type="button" disabled={asyncBusy} onClick={onRandom1}>
            랜덤 1명 추가
          </button>
          <button type="button" disabled={asyncBusy} onClick={onRandom5}>
            랜덤 5명 추가
          </button>
          <button type="button" disabled={asyncBusy} onClick={onRefreshAll}>
            전체 새로고침
          </button>
        </div>
        <div className="lion-async-status-wrap">
          <span className="lion-async-status" aria-live="polite">
            {statusText}
          </span>
          <button
            type="button"
            className="lion-btn-retry"
            hidden={!showRetry}
            onClick={onRetry}
          >
            재시도
          </button>
        </div>
      </div>
    </>
  );
}

export default LionToolbar;
