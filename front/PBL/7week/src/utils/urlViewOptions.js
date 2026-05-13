const DEFAULT_SORT = 'latest';

export function viewOptionsFromSearchParams(searchParams) {
  return {
    filterPart: searchParams.get('part') || '',
    sortOrder: searchParams.get('sort') || DEFAULT_SORT,
    searchQuery: searchParams.get('q') || '',
  };
}

/**
 * 기본값(part 빈 문자열, sort 최신, 검색 빈 문자열)은 URL에 넣지 않습니다.
 */
export function writeViewOptionsToUrl(setSearchParams, { filterPart, sortOrder, searchQuery }) {
  const p = new URLSearchParams();
  if (filterPart) p.set('part', filterPart);
  if (sortOrder && sortOrder !== DEFAULT_SORT) p.set('sort', sortOrder);
  const q = String(searchQuery || '').trim();
  if (q) p.set('q', q);
  setSearchParams(p, { replace: true });
}
