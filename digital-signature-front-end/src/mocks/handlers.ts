/**
 * MSW Request Handlers
 * Registry of all mock API handlers
 * Import feature-specific handlers and combine them here
 */

import { authHandlers } from './features/auth.handlers';
import { signatureHandlers } from './features/signature.handlers';

// Combine all feature handlers
export const handlers = [
  ...authHandlers,
  ...signatureHandlers,
  // Add more feature handlers as they are created:
  // ...documentsHandlers,
  // ...inviteSigningHandlers,
  // ...adminHandlers,
];