/**
 * MSW Request Handlers
 * Registry of all mock API handlers
 * Import feature-specific handlers and combine them here
 */

import { authHandlers } from './features/auth.handlers';
import { signatureHandlers } from './features/signature.handlers';
import { documentsHandlers } from './features/documents.handlers';
import { inviteSigningHandlers } from './features/invite-signing.handlers';

// Combine all feature handlers
export const handlers = [
  ...authHandlers,
  ...signatureHandlers,
  ...documentsHandlers,
  ...inviteSigningHandlers,
  // Add more feature handlers as they are created:
  // ...adminHandlers,
];