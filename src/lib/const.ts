type ApiEnv = 'prod' | 'dev' | 'mock';

const getApiHost = (apiEnv: ApiEnv): string => {
  switch (apiEnv) {
    case 'prod':
      return 'http://localhost:18080';
    case 'dev':
      return 'http://localhost:18081';
    case 'mock':
      return 'http://mock';
    default:
      throw new Error('apiEnv が異常です');
  }
};

export type { ApiEnv };
export { getApiHost };
