import { akaService } from '@/main';
import { logger } from '@/utils/logger';

/**
 * Minimal redirect-only application for the AKA URL Shortener Service
 * Handles only URL redirection without any UI components
 */

// Import KERN component styles
import '@/styles/kern-components.css';

/**
 * Frontend application for the AKA URL Shortener Service
 * Handles UI interactions and provides testing interface
 */

/**
 * Load web components with error handling
 */
async function loadWebComponents(): Promise<void> {
  try {
    // Try dynamic import first
    await import('@kern-ux-annex/webc');
    logger.info('KERN UX ANNEX web components loaded successfully via dynamic import');
  } catch (error) {
    logger.warn('Dynamic import failed, attempting alternative loading method', { error });

    try {
      // Alternative: Load via script tag if dynamic import fails
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/node_modules/@kern-ux-annex/webc/dist/index.js';

      const loadPromise = new Promise<void>((resolve, reject) => {
        script.onload = () => {
          logger.info('KERN UX ANNEX web components loaded via script tag');
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Failed to load web components via script tag'));
        };
      });

      document.head.appendChild(script);
      await loadPromise;
    } catch (scriptError) {
      logger.error('All web component loading methods failed', {
        dynamicImportError: error,
        scriptError,
      });

      // Don't throw error - let the app continue without web components
      logger.warn(
        'Web components could not be loaded. The application will continue with standard HTML elements.'
      );
    }
  }
}

/**
 * Show error dialog when redirect fails
 */
function showRedirectError(message: string): void {
  document.body.innerHTML = `
    <div style="
      font-family: 'Segoe UI', sans-serif;
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: left;
    ">
      <kern-alert variant="danger" heading="Redirect Error">
      <kern-body>The requested URL could not be redirected:</br>${message}
      </kern-body>
      <kern-button onclick="window.location.href='/status.html'" variant="primary"
        >Go to Service Status
      </kern-button>
      </kern-alert>
    </div>
  `;
}

/**
 * Handle direct redirect - core redirect logic
 */
function handleDirectRedirect(): void {
  // Check if this is a redirect request (not the main page)
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;

  // Handle root path behavior
  if (currentPath === '/' || currentPath === '/index.html') {
    // If no parameters, redirect to status page
    if (!currentSearch || currentSearch === '') {
      logger.info('Root path with no parameters, redirecting to status page');
      window.location.href = '/status.html';
      return;
    }

    // For root path with parameters, try to process as redirect
    try {
      logger.info('Processing root redirect with parameters', {
        search: currentSearch,
      });

      const redirectTarget = akaService.processRedirect('/?' + currentSearch);

      logger.info('Redirecting to target URL', {
        sourceUrl: '/?' + currentSearch,
        targetUrl: redirectTarget,
      });

      // Perform the redirect
      window.location.href = redirectTarget;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Root redirect failed', {
        error: message,
        search: currentSearch,
      });

      // Show error dialog
      showRedirectError(message);
    }
    return;
  }

  if (currentPath.startsWith('/admin') || currentPath === '/status.html') {
    return;
  }

  try {
    logger.info('Processing direct redirect request', {
      path: currentPath,
      search: currentSearch,
    });

    const fullUrl = currentPath + currentSearch;
    const redirectTarget = akaService.processRedirect(fullUrl);

    logger.info('Redirecting to target URL', {
      sourceUrl: fullUrl,
      targetUrl: redirectTarget,
    });

    // Perform the redirect
    window.location.href = redirectTarget;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Direct redirect failed', {
      error: message,
      path: currentPath,
      search: currentSearch,
    });

    // Show error dialog
    showRedirectError(message);
  }
}

/**
 * Initialize the redirect-only application
 */
async function initializeRedirectApp(): Promise<void> {
  try {
    logger.info('Initializing AKA Service redirect application');

    // Load web components first
    await loadWebComponents();

    // Initialize the service with configuration
    await akaService.initialize('/config.json');

    // Set up URL handling for direct redirects
    handleDirectRedirect();

    logger.info('Redirect application initialized successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to initialize redirect application', { error: message });
    showRedirectError('Failed to initialize service: ' + message);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRedirectApp);
} else {
  initializeRedirectApp();
}
