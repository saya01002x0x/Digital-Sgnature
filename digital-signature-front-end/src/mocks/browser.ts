import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW worker
export const worker = setupWorker(...handlers);

// Start MSW worker in development
export const startMsw = async () => {
  if (process.env.NODE_ENV === 'development') {
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
};
