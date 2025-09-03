export interface QueryResult {
  rows: {
    _array: any[];
    length: number;
  };
}

export interface IDatabaseService {
  initializeDatabase(): Promise<void>;
  query(sql: string, params?: any[]): Promise<QueryResult>;
}

