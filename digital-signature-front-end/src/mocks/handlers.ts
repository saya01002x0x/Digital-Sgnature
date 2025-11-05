/**
 * MSW Request Handlers
 * Registry of all mock API handlers
 * Import feature-specific handlers and combine them here
 */

import { authHandlers } from './features/auth.handlers';

// Combine all feature handlers
export const handlers = [
  ...authHandlers,
  // Add more feature handlers as they are created:
  // ...signatureHandlers,
  // ...documentsHandlers,
  // ...inviteSigningHandlers,
  // ...adminHandlers,
];