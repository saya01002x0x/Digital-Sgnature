import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW worker
export const worker = setupWorker(...handlers);

// Start MSW worker in development
export const startMsw = async () => {
  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('🎭 [MSW] Mocking enabled with', handlers.length, 'handlers');
  } catch (error) {
    console.error('❌ [MSW] Failed to start:', error);
    throw error;
  }
};
