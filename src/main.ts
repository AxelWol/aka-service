import { RoutingService } from '@/services/routing';
import { configurationService } from '@/services/configuration';
import { URLUtils } from '@/utils/url';
import { logger } from '@/utils/logger';
import type { RoutingConfiguration } from '@/types';

/**
 * Main application class for the AKA URL Shortener Service
 * Handles initialization, routing, and redirection logic
 */
export class AKAService {
  private routingService: RoutingService;
  private isInitialized = false;

  constructor() {
    this.routingService = new RoutingService();
  }

  /**
   * Initialize the service with configuration
   * @param configPath Path to configuration file or configuration object
   */
  public async initialize(configPath: string | RoutingConfiguration): Promise<void> {
    try {
      logger.info('Initializing AKA Service', { configPath: typeof configPath });

      let config: RoutingConfiguration;

      if (typeof configPath === 'string') {
        config = await configurationService.loadFromFile(configPath);
      } else {
        config = configurationService.loadFromObject(configPath);
      }

      this.routingService.loadConfiguration(config);
      this.isInitialized = true;

      logger.info('AKA Service initialized successfully', {
        groupCount: config.routingGroups.length,
        version: config.version,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to initialize AKA Service', { error: message });
      throw new Error(`Service initialization failed: ${message}`);
    }
  }

  /**
   * Process a redirect request
   * @param url The full URL or pathname with query parameters
   * @returns Redirect result or throws error
   */
  public processRedirect(url: string): string {
    if (!this.isInitialized) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    try {
      logger.info('Processing redirect request', { url });

      // Parse the URL
      const path = URLUtils.extractPath(url);
      const urlObj = new URL(url, 'https://example.com'); // Use dummy base for relative URLs
      const urlParams = URLUtils.parseURLParams(urlObj.search);

      logger.info('Parsed URL components', { path, urlParams });

      // Find redirect target
      const result = this.routingService.findRedirect(path, urlParams);

      if (!result.found || !result.targetUrl) {
        const error = result.error || 'No redirect target found';
        logger.warn('Redirect not found', { path, urlParams, error });
        throw new Error(error);
      }

      logger.info('Redirect target found', {
        targetUrl: result.targetUrl,
        matchedGroup: result.matchedGroup,
        matchedRouting: result.matchedRouting,
      });

      return result.targetUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error processing redirect', { error: message, url });
      throw error;
    }
  }

  /**
   * Get service status and configuration info
   */
  public getStatus(): {
    initialized: boolean;
    configLoaded: boolean;
    configVersion?: string;
    groupCount?: number;
    lastConfigLoad?: Date;
  } {
    const config = configurationService.getConfiguration();
    const status: {
      initialized: boolean;
      configLoaded: boolean;
      configVersion?: string;
      groupCount?: number;
      lastConfigLoad?: Date;
    } = {
      initialized: this.isInitialized,
      configLoaded: config !== null,
    };

    if (config) {
      status.configVersion = config.version;
      status.groupCount = config.routingGroups.length;
    }

    const lastLoad = configurationService.getLastLoaded();
    if (lastLoad) {
      status.lastConfigLoad = lastLoad;
    }

    return status;
  }

  /**
   * Reload configuration
   */
  public async reloadConfiguration(): Promise<void> {
    try {
      logger.info('Reloading configuration');
      const config = await configurationService.reloadConfiguration();
      if (config) {
        this.routingService.loadConfiguration(config);
        logger.info('Configuration reloaded successfully');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to reload configuration', { error: message });
      throw error;
    }
  }
}

// Export singleton instance
export const akaService = new AKAService();
