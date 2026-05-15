export const setInLocalStorage = <T>(data: T, keyName: string) =>
  window.localStorage.setItem(keyName, JSON.stringify(data));

export const getFromLocalStorage = <T>(keyName: string): T | null => {
  const data = window.localStorage.getItem(keyName);
  return data ? (JSON.parse(data) as T) : null;
};
