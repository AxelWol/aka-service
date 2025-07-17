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
    // Normal mode initialization - UI for status page
    logger.info('Initializing AKA Service status application');
    
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
    
    logger.info('Status application initialized successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to initialize status application', { error: message });
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
      <kern-alert variant="success" heading="Redirect Found">
      <kern-body>Source: ${testUrl}</br>
      Target: <a href="${redirectTarget}" target="_blank">${redirectTarget}</a></br>
      </kern-body>
      </kern-subline>Click the link to test the redirect in a new tab.</kern-subline>
      `, 'success');
    
    logger.info('Test redirect successful', { testUrl, redirectTarget });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    showTestResult(`
      <kern-alert variant="danger" heading="Redirect Failed">
      <kern-body>URL: ${testUrl}</br>
      Error: ${message}</kern-body>
      </kern-alert>
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
