import { akaService } from '@/main';
import { logger } from '@/utils/logger';

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
        scriptError 
      });
      
      // Don't throw error - let the app continue without web components
      logger.warn('Web components could not be loaded. The application will continue with standard HTML elements.');
    }
  }
}

// Global variables for UI elements
let serviceStatusEl: HTMLElement | null = null;
let configStatusEl: HTMLElement | null = null;
let groupCountEl: HTMLElement | null = null;
let routingCountEl: HTMLElement | null = null;
let configVersionEl: HTMLElement | null = null;
let configLastModifiedEl: HTMLElement | null = null;
let lastUpdatedEl: HTMLElement | null = null;
let testUrlInput: HTMLInputElement | null = null;
let testResultEl: HTMLElement | null = null;

/**
 * Initialize the application
 */
async function initializeApp(): Promise<void> {
  try {
    // Check if hide=true parameter is present first (before any logging or UI work)
    const urlParams = new URLSearchParams(window.location.search);
    const hideUI = urlParams.get('hide') === 'true';
    
    if (hideUI) {
      // Hide UI mode - suppress all output and perform redirect immediately
      // Override console methods to suppress all output
       
      const originalConsole = {
        // eslint-disable-next-line no-console
        log: console.log,
        // eslint-disable-next-line no-console
        info: console.info,
        // eslint-disable-next-line no-console
        warn: console.warn,
        // eslint-disable-next-line no-console
        error: console.error
      };
      
      // Suppress all console output
      // eslint-disable-next-line no-console
      console.log = console.info = console.warn = console.error = () => {};
      
      try {
        // Minimal white screen setup
        document.body.innerHTML = '<div style="background: white; width: 100vw; height: 100vh;"></div>';
        document.body.style.cssText = 'background: white; margin: 0; padding: 0; overflow: hidden;';
        
        // Initialize service for redirect processing (silently)
        await akaService.initialize('/config.json');
        
        // Perform redirect immediately
        handleDirectRedirectHidden();
      } catch (error) {
        // Restore console for critical errors only
        Object.assign(console, originalConsole);
        // eslint-disable-next-line no-console
        console.error('Critical error in hidden mode:', error);
        
        // Show minimal white screen on error
        document.body.innerHTML = '<div style="background: white; width: 100vw; height: 100vh;"></div>';
      }
      return;
    }
    
    // Normal mode initialization
    logger.info('Initializing AKA Service application');
    
    // Load web components first
    await loadWebComponents();
    
    // Get DOM elements for normal UI mode
    serviceStatusEl = document.getElementById('service-status');
    configStatusEl = document.getElementById('config-status');
    groupCountEl = document.getElementById('group-count');
    routingCountEl = document.getElementById('routing-count');
    configVersionEl = document.getElementById('config-version');
    configLastModifiedEl = document.getElementById('config-last-modified');
    lastUpdatedEl = document.getElementById('last-updated');
    testUrlInput = document.getElementById('test-url') as HTMLInputElement;
    testResultEl = document.getElementById('test-result');

    // Initialize the service with configuration
    await akaService.initialize('/config.json');
    
    // Update UI with service status
    updateServiceStatus();
    
    // Set up URL handling for direct redirects
    handleDirectRedirect();
    
    logger.info('Application initialized successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to initialize application', { error: message });
    updateStatusError('Failed to initialize service: ' + message);
  }
}

/**
 * Update service status in the UI
 */
function updateServiceStatus(): void {
  try {
    const status = akaService.getStatus();
    
    if (serviceStatusEl) {
      serviceStatusEl.textContent = status.initialized ? 'Active' : 'Inactive';
      serviceStatusEl.style.color = status.initialized ? '#28a745' : '#dc3545';
    }
    
    if (configStatusEl) {
      configStatusEl.textContent = status.configLoaded ? 'Loaded' : 'Not Loaded';
      configStatusEl.style.color = status.configLoaded ? '#28a745' : '#dc3545';
    }
    
    if (groupCountEl && status.groupCount !== undefined) {
      groupCountEl.textContent = status.groupCount.toString();
    }
    
    if (routingCountEl && status.routingCount !== undefined) {
      routingCountEl.textContent = status.routingCount.toString();
    }
    
    if (configVersionEl && status.configVersion) {
      configVersionEl.textContent = status.configVersion;
    }
    
    if (configLastModifiedEl && status.configLastModified) {
      // Format the date for better display
      try {
        const date = new Date(status.configLastModified);
        configLastModifiedEl.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      } catch {
        configLastModifiedEl.textContent = status.configLastModified;
      }
    }
    
    if (lastUpdatedEl && status.lastConfigLoad) {
      lastUpdatedEl.textContent = status.lastConfigLoad.toLocaleString();
    }
    
    logger.info('Service status updated', status);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to update service status', { error: message });
  }
}

/**
 * Update status with error message
 */
function updateStatusError(message: string): void {
  if (serviceStatusEl) {
    serviceStatusEl.textContent = 'Error';
    serviceStatusEl.style.color = '#dc3545';
  }
  
  if (configStatusEl) {
    configStatusEl.textContent = message;
    configStatusEl.style.color = '#dc3545';
  }
}

/**
 * Handle direct redirect for incoming URLs
 */
function handleDirectRedirect(): void {
  // Check if this is a redirect request (not the main page)
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  
  // Skip redirect for root path and admin paths
  if (currentPath === '/' || currentPath === '/index.html' || currentPath.startsWith('/admin')) {
    return;
  }
  
  try {
    logger.info('Processing direct redirect request', { 
      path: currentPath, 
      search: currentSearch 
    });
    
    const fullUrl = currentPath + currentSearch;
    const redirectTarget = akaService.processRedirect(fullUrl);
    
    logger.info('Redirecting to target URL', { 
      sourceUrl: fullUrl, 
      targetUrl: redirectTarget 
    });
    
    // Perform the redirect
    window.location.href = redirectTarget;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Direct redirect failed', { 
      error: message, 
      path: currentPath, 
      search: currentSearch 
    });
    
    // Show error page or redirect to home
    showRedirectError(message);
  }
}

/**
 * Handle direct redirect for hidden UI mode
 */
function handleDirectRedirectHidden(): void {
  // Get current URL without the hide parameter
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  
  try {
    // Remove hide parameter from the URL for processing
    const urlParams = new URLSearchParams(currentSearch);
    urlParams.delete('hide');
    const cleanSearch = urlParams.toString();
    const cleanUrl = currentPath + (cleanSearch ? '?' + cleanSearch : '');
    
    // For root path, only redirect if there are other parameters
    if (currentPath === '/' || currentPath === '/index.html') {
      if (cleanSearch) {
        // If there are parameters, try to find a matching route
        const redirectTarget = akaService.processRedirect('/?' + cleanSearch);
        window.location.href = redirectTarget;
      }
      // If no parameters, stay on white screen (no redirect needed)
      return;
    }
    
    // Process redirect for non-root paths
    const redirectTarget = akaService.processRedirect(cleanUrl);
    window.location.href = redirectTarget;
  } catch (error) {
    // In hidden mode, silently fail and show white screen
    // No error logging or UI in hidden mode
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Direct redirect failed', { 
      error: message, 
      path: currentPath, 
      search: currentSearch
    });
  }
}

/**
 * Show redirect error
 */
function showRedirectError(message: string): void {
  document.body.innerHTML = `
    <div style="
      font-family: 'Segoe UI', sans-serif;
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: center;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #dc3545;
    ">
      <h1 style="color: #dc3545; margin-bottom: 1rem;">Redirect Error</h1>
      <p style="color: #666; margin-bottom: 1rem;">The requested URL could not be redirected:</p>
      <p style="
        background: #fff;
        padding: 1rem;
        border-radius: 5px;
        font-family: monospace;
        color: #dc3545;
        border: 1px solid #f5c6cb;
      ">${message}</p>
      <button onclick="window.location.href='/'" style="
        background: #007bff;
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 1rem;
      ">Go to Home Page</button>
    </div>
  `;
}

/**
 * Test redirect functionality
 */
function testRedirect(): void {
  if (!testUrlInput || !testResultEl) {
    logger.error('Test UI elements not found');
    return;
  }
  
  const testUrl = testUrlInput.value.trim();
  if (!testUrl) {
    showTestResult('Please enter a URL to test', 'error');
    return;
  }
  
  try {
    logger.info('Testing redirect for URL', { testUrl });
    
    const redirectTarget = akaService.processRedirect(testUrl);
    
    showTestResult(`
      <strong>✅ Redirect Found!</strong><br>
      <strong>Source:</strong> ${testUrl}<br>
      <strong>Target:</strong> <a href="${redirectTarget}" target="_blank">${redirectTarget}</a><br>
      <small>Click the link to test the redirect in a new tab</small>
    `, 'success');
    
    logger.info('Test redirect successful', { testUrl, redirectTarget });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    showTestResult(`
      <strong>❌ Redirect Failed</strong><br>
      <strong>URL:</strong> ${testUrl}<br>
      <strong>Error:</strong> ${message}
    `, 'error');
    
    logger.warn('Test redirect failed', { testUrl, error: message });
  }
}

/**
 * Show test result in UI
 */
function showTestResult(message: string, type: 'success' | 'error'): void {
  if (!testResultEl) {return;}
  
  testResultEl.innerHTML = `<div class="result ${type}">${message}</div>`;
}

/**
 * Clear test result
 */
function clearResult(): void {
  if (testResultEl) {
    testResultEl.innerHTML = '';
  }
  if (testUrlInput) {
    testUrlInput.value = '';
  }
}

/**
 * Set test URL in input field
 */
function setTestUrl(url: string): void {
  if (testUrlInput) {
    testUrlInput.value = url;
  }
}

// Extend Window interface for global functions
declare global {
  interface Window {
    testRedirect: () => void;
    clearResult: () => void;
    // eslint-disable-next-line no-unused-vars
    setTestUrl: (url: string) => void;
  }
}

// Make functions available globally for HTML onclick handlers
window.testRedirect = testRedirect;
window.clearResult = clearResult;
window.setTestUrl = setTestUrl;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle browser back/forward navigation
window.addEventListener('popstate', handleDirectRedirect);
