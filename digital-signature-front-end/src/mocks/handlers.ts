/**
 * MSW Request Handlers
 * Registry of all mock API handlers
 * Import feature-specific handlers and combine them here
 */

import { http, HttpResponse } from 'msw';
import { authHandlers } from './features/auth.handlers';
import { signatureHandlers } from './features/signature.handlers';
import { documentsHandlers } from './features/documents.handlers';
import { inviteSigningHandlers } from './features/invite-signing.handlers';
import { adminHandlers } from './features/admin.handlers';

// Handle static PDF files from public folder
const staticFileHandlers = [
  http.get('/doc.pdf', () => {
    // Return a minimal valid PDF for testing
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 85
>>
stream
BT
/F1 24 Tf
100 700 Td
(Digital Signature Test PDF) Tj
0 -50 Td
(This PDF is served via MSW) Tj
0 -50 Td
(IDM should NOT auto-download this) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000428 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
495
%%EOF`;

    return new HttpResponse(pdfContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="doc.pdf"',
      },
    });
  }),
];

// Combine all feature handlers
export const handlers = [
  ...staticFileHandlers,
  ...authHandlers,
  ...signatureHandlers,
  ...documentsHandlers,
  ...inviteSigningHandlers,
  // Add more feature handlers as they are created:
  ...adminHandlers,
];