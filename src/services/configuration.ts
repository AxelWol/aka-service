import type { RoutingConfiguration } from '@/types';
import { logger } from '@/utils/logger';

/**
 * Service for loading and managing routing configuration
 * Handles both local and remote configuration sources
 */
export class ConfigurationService {
  private static instance: ConfigurationService;
  private configCache: RoutingConfiguration | null = null;
  private lastLoaded: Date | null = null;

  private constructor() {}

  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  /**
   * Load configuration from a file path
   * @param configPath Path to the configuration file
   * @returns Promise resolving to the configuration
   */
  public async loadFromFile(configPath: string): Promise<RoutingConfiguration> {
    try {
      logger.info('Loading configuration from file', { configPath });
      
      const response = await fetch(configPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status} ${response.statusText}`);
      }

      const config = (await response.json()) as RoutingConfiguration;
      this.configCache = config;
      this.lastLoaded = new Date();

      logger.info('Configuration loaded successfully from file', {
        configPath,
        version: config.version,
        groupCount: config.routingGroups.length,
      });

      return config;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to load configuration from file', { configPath, error: message });
      throw new Error(`Configuration loading failed: ${message}`);
    }
  }

  /**
   * Load configuration from a direct object
   * @param config The configuration object
   * @returns The validated configuration
   */
  public loadFromObject(config: RoutingConfiguration): RoutingConfiguration {
    try {
      logger.info('Loading configuration from object', {
        version: config.version,
        groupCount: config.routingGroups.length,
      });

      // Validate the configuration
      this.validateConfiguration(config);
      
      this.configCache = config;
      this.lastLoaded = new Date();

      logger.info('Configuration loaded successfully from object');
      return config;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to load configuration from object', { error: message });
      throw new Error(`Configuration loading failed: ${message}`);
    }
  }

  /**
   * Get cached configuration
   * @returns Cached configuration or null if not loaded
   */
  public getConfiguration(): RoutingConfiguration | null {
    return this.configCache;
  }

  /**
   * Check if configuration is loaded and valid
   * @returns True if configuration is available
   */
  public isConfigurationAvailable(): boolean {
    return this.configCache !== null;
  }

  /**
   * Get information about when configuration was last loaded
   * @returns Date of last load or null if never loaded
   */
  public getLastLoaded(): Date | null {
    return this.lastLoaded;
  }

  /**
   * Clear cached configuration
   */
  public clearCache(): void {
    this.configCache = null;
    this.lastLoaded = null;
    logger.info('Configuration cache cleared');
  }

  /**
   * Reload configuration from the same source
   * Note: This requires storing the source information
   */
  public async reloadConfiguration(): Promise<RoutingConfiguration | null> {
    if (!this.configCache) {
      logger.warn('No configuration to reload');
      return null;
    }

    // For now, just return the cached configuration
    // In a real implementation, you'd store the source and reload from it
    logger.info('Configuration reload requested (returning cached version)');
    return this.configCache;
  }

  /**
   * Validate configuration structure
   * @param config Configuration to validate
   * @throws Error if configuration is invalid
   */
  private validateConfiguration(config: unknown): RoutingConfiguration {
    if (!config || typeof config !== 'object') {
      throw new Error('Configuration must be a valid object');
    }

    const typedConfig = config as Record<string, unknown>;

    if (!typedConfig.version || typeof typedConfig.version !== 'string') {
      throw new Error('Configuration version is required and must be a string');
    }

    if (!Array.isArray(typedConfig.routingGroups)) {
      throw new Error('routingGroups must be an array');
    }

    return config as RoutingConfiguration;
  }
}

// Export singleton instance
export const configurationService = ConfigurationService.getInstance();
