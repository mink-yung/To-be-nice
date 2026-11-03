import { useEffect } from 'react';

/**
 * 문서 레벨 Escape — 과제 예외로 addEventListener 허용 구간.
 */
export function useDocumentEscape(enabled, onEscape) {
  useEffect(() => {
    if (!enabled) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onEscape();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onEscape]);
}
