export type TSessionContext = {
  isLoading: boolean;
  error: unknown;
  user: unknown | null;
  getMe: () => void;
};
