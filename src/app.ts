import { akaService } from '@/main';
import { logger } from '@/utils/logger';

/**
 * Frontend application for the AKA URL Shortener Service
 * Handles UI interactions and provides testing interface
 */

// Global variables for UI elements
let serviceStatusEl: HTMLElement | null = null;
let configStatusEl: HTMLElement | null = null;
let groupCountEl: HTMLElement | null = null;
let configVersionEl: HTMLElement | null = null;
let lastUpdatedEl: HTMLElement | null = null;
let testUrlInput: HTMLInputElement | null = null;
let testResultEl: HTMLElement | null = null;

/**
 * Initialize the application
 */
async function initializeApp(): Promise<void> {
  try {
    logger.info('Initializing AKA Service application');
    
    // Check if hide=true parameter is present
    const urlParams = new URLSearchParams(window.location.search);
    const hideUI = urlParams.get('hide') === 'true';
    
    if (hideUI) {
      // Hide UI mode - show only white screen and perform redirect
      document.body.innerHTML = '<div style="background: white; width: 100vw; height: 100vh;"></div>';
      document.body.style.background = 'white';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      
      // Initialize service for redirect processing
      await akaService.initialize('/config.json');
      
      // Perform redirect immediately
      handleDirectRedirectHidden();
      return;
    }
    
    // Get DOM elements for normal UI mode
    serviceStatusEl = document.getElementById('service-status');
    configStatusEl = document.getElementById('config-status');
    groupCountEl = document.getElementById('group-count');
    configVersionEl = document.getElementById('config-version');
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
    
    if (configVersionEl && status.configVersion) {
      configVersionEl.textContent = status.configVersion;
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
    
    logger.info('Processing hidden redirect request', { 
      path: currentPath, 
      search: cleanSearch 
    });
    
    // For root path, try to redirect based on remaining parameters
    if (currentPath === '/' || currentPath === '/index.html') {
      if (cleanSearch) {
        // If there are parameters, try to find a matching route
        const redirectTarget = akaService.processRedirect('/' + cleanSearch);
        logger.info('Redirecting from root with parameters', { 
          sourceUrl: cleanUrl, 
          targetUrl: redirectTarget 
        });
        window.location.href = redirectTarget;
      } else {
        // No parameters, show white screen indefinitely
        logger.info('No redirect target found for root path without parameters');
      }
    } else {
      // Process redirect for non-root paths
      const redirectTarget = akaService.processRedirect(cleanUrl);
      logger.info('Redirecting to target URL', { 
        sourceUrl: cleanUrl, 
        targetUrl: redirectTarget 
      });
      window.location.href = redirectTarget;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Hidden redirect failed', { 
      error: message, 
      path: currentPath, 
      search: currentSearch 
    });
    
    // In hidden mode, just show white screen on error
    // Optionally, redirect to a fallback URL after a delay
    setTimeout(() => {
      if (window.location.pathname === '/') {
        // Stay on white screen for root errors
        logger.info('Staying on white screen due to redirect error');
      }
    }, 1000);
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
