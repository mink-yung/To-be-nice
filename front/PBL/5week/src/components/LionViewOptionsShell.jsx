function LionViewOptionsShell({
  filterPart,
  sortOrder,
  searchQuery,
  onFilterPartChange,
  onSortOrderChange,
  onSearchQueryChange,
}) {
  return (
    <div
      className="lion-view-options lion-view-options-bar"
      role="search"
      aria-label="보기 옵션"
    >
      <label className="lion-view-label">
        <span>파트</span>
        <select value={filterPart} onChange={(e) => onFilterPartChange(e.target.value)}>
          <option value="">전체</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Design">Design</option>
        </select>
      </label>
      <label className="lion-view-label">
        <span>정렬</span>
        <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)}>
          <option value="latest">최신추가순</option>
          <option value="name">이름순</option>
        </select>
      </label>
      <label className="lion-view-label lion-view-search">
        <span>검색</span>
        <input
          type="search"
          placeholder="이름으로 검색"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export default LionViewOptionsShell;
