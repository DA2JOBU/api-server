export const getPageCountBySearchResultCountAndPagePer = (
  count: number,
  pagePer: number,
): number => Math.ceil(count / pagePer) || 0;
