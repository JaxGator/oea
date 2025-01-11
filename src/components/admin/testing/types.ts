export interface TestResult {
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'pending';
  error?: string;
  duration?: number;
}

export interface Test {
  name: string;
  category: string;
  run: () => Promise<boolean>;
}