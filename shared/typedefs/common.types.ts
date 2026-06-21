export type TDeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<TDeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<TDeepPartial<U>>
      : T[P] extends object
        ? TDeepPartial<T[P]>
        : T[P];
};

export type TPartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ITimelineItem {
  id: string;
  version_number: number;
  source: "AI" | "HUMAN";
  data: {
    filename?: string;
    summary?: string;
    summary_title?: string;
    tags?: string[];
    category?: string;
  };
  created_at: string;
}
