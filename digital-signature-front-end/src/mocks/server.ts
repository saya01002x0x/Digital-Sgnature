import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server for tests
export const server = setupServer(...handlers);

// Enable API mocking before tests
beforeAll(() => { server.listen(); });

// Reset request handlers between tests
afterEach(() => { server.resetHandlers(); });

// Disable API mocking after tests
afterAll(() => { server.close(); });
