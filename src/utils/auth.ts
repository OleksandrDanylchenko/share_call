// Inspired with - https://stackoverflow.com/a/70405437/10963661
export const reloadAuthSession = (): boolean => {
  const event = new Event('visibilitychange');
  return document.dispatchEvent(event);
};
