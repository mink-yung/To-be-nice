export default function getVisibleLions(lions, filterPart, sortOrder, searchQuery) {
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
