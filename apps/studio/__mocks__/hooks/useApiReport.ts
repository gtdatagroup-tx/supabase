export const useApiReport = jest.fn().mockReturnValue({
  data: {
    totalRequests: [{ count: 4, timestamp: '2024-05-09T04:00:00.000Z' }],
    topRoutes: [
      { count: 1, method: 'HEAD', path: '/rest/v1/', search: null, status_code: 200 },
      { count: 2, method: 'GET', path: '/rest/v1/', search: null, status_code: 200 },
      { count: 3, method: 'GET', path: '/auth/v1/health', search: null, status_code: 200 },
    ],
    topErrorRoutes: [
      { count: 1, method: 'GET', path: '/auth/v1/user', search: null, status_code: 403 },
    ],
  },
  params: {
    totalRequests: {
      iso_timestamp_start: '2024-05-09T03:00:00.000Z',
      project: 'default',
      sql: '',
    },
  },
  error: {
    totalRequests: null,
    topRoutes: null,
    topErrorRoutes: null,
  },
  filters: [],
  isLoading: false,
  mergeParams: jest.fn(),
  addFilter: jest.fn(),
  removeFilter: jest.fn(),
  removeFilters: jest.fn(),
  refresh: jest.fn(),
})
