/**
 * MSW browser setup for client-side mocking
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Start the worker
export function startMocking() {
    if (typeof window !== 'undefined') {
        return worker.start({
            onUnhandledRequest: 'warn',
            serviceWorker: {
                url: '/mockServiceWorker.js'
            }
        });
    }
}

export default worker;


