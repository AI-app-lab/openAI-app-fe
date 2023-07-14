export const wss = (url: string) => {
  const baseUrl = import.meta.env.VITE_WSS_BASE_URL;
  return new WebSocket(baseUrl + url);
};
