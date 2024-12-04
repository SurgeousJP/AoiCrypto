export const clearCache = (apollClient: any, queryName: string) => {
  apollClient.cache.evict({ fieldName: queryName });
  apollClient.cache.gc();
};
