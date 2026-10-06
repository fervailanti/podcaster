const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();

export const matchesSearch = (values: readonly string[], query: string): boolean => {
  const term = normalizeSearchText(query);
  return values.some((value) => normalizeSearchText(value).includes(term));
};
