import type { RoutingConfiguration, RoutingGroup, Routing, URLParams, RedirectResult } from '@/types';
import { logger } from '@/utils/logger';

/**
 * Core routing service that handles URL redirection logic
 * Implements the business rules defined in the requirements
 */
export class RoutingService {
  private configuration: RoutingConfiguration | null = null;

  /**
   * Load routing configuration from a JSON object
   * @param config The routing configuration
   */
  public loadConfiguration(config: RoutingConfiguration): void {
    try {
      this.validateConfiguration(config);
      this.configuration = config;
      logger.info('Routing configuration loaded successfully', {
        groupCount: config.routingGroups.length,
        version: config.version,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to load routing configuration', { error: message });
      throw new Error(`Configuration loading failed: ${message}`);
    }
  }

  /**
   * Find redirect target for given path and URL parameters
   * @param path The relative path from the URL
   * @param urlParams The URL parameters
   * @returns Result containing redirect information
   */
  public findRedirect(path: string, urlParams: URLParams): RedirectResult {
    logger.info('Processing redirect request', { path, urlParams });

    if (!this.configuration) {
      const error = 'No routing configuration loaded';
      logger.error(error);
      return { found: false, error };
    }

    try {
      // Find matching routing group
      const matchingGroup = this.findMatchingGroup(path, urlParams);
      if (!matchingGroup) {
        logger.warn('No matching routing group found', { path, urlParams });
        return { found: false, error: 'No matching routing group found' };
      }

      // Find matching routing within the group
      const matchingRouting = this.findMatchingRouting(matchingGroup, urlParams);
      if (!matchingRouting) {
        logger.warn('No matching routing found in group', {
          groupName: matchingGroup.name,
          urlParams,
        });
        return { found: false, error: 'No matching routing found' };
      }

      logger.info('Redirect target found', {
        targetUrl: matchingRouting.redirectTarget,
        groupName: matchingGroup.name,
        routingName: matchingRouting.name,
      });

      return {
        found: true,
        targetUrl: matchingRouting.redirectTarget,
        matchedGroup: matchingGroup.name,
        matchedRouting: matchingRouting.name,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error during redirect processing', { error: message, path, urlParams });
      return { found: false, error: `Processing error: ${message}` };
    }
  }

  /**
   * Find a routing group that matches the path and URL parameters
   */
  private findMatchingGroup(path: string, urlParams: URLParams): RoutingGroup | null {
    if (!this.configuration) {return null;}

    for (const group of this.configuration.routingGroups) {
      // Check if the group name matches the path
      if (group.name.toLowerCase() !== path.toLowerCase()) {
        continue;
      }

      // If group has dependency requirements, check them
      if (group.dependsOnKey && group.dependsOnValue) {
        const paramValue = urlParams[group.dependsOnKey];
        if (paramValue !== group.dependsOnValue) {
          logger.info('Group dependency not met', {
            groupName: group.name,
            requiredKey: group.dependsOnKey,
            requiredValue: group.dependsOnValue,
            actualValue: paramValue,
          });
          continue;
        }
      }

      logger.info('Matching routing group found', { groupName: group.name });
      return group;
    }

    return null;
  }

  /**
   * Find a routing within a group that matches the URL parameters
   */
  private findMatchingRouting(group: RoutingGroup, urlParams: URLParams): Routing | null {
    for (const routing of group.routings) {
      // If routing has dependency requirements, check them
      if (routing.dependsOnKey && routing.dependsOnValue) {
        const paramValue = urlParams[routing.dependsOnKey];
        if (paramValue !== routing.dependsOnValue) {
          logger.info('Routing dependency not met', {
            routingName: routing.name,
            requiredKey: routing.dependsOnKey,
            requiredValue: routing.dependsOnValue,
            actualValue: paramValue,
          });
          continue;
        }
      }

      logger.info('Matching routing found', { routingName: routing.name });
      return routing;
    }

    // If no specific routing matched and there's only one routing without dependencies
    if (group.routings.length === 1) {
      const singleRouting = group.routings[0];
      if (singleRouting && !singleRouting.dependsOnKey && !singleRouting.dependsOnValue) {
        logger.info('Using default routing (no dependencies)', {
          routingName: singleRouting.name,
        });
        return singleRouting;
      }
    }

    return null;
  }

  /**
   * Validate the routing configuration structure
   */
  private validateConfiguration(config: RoutingConfiguration): void {
    if (!config) {
      throw new Error('Configuration is null or undefined');
    }

    if (!config.version) {
      throw new Error('Configuration version is required');
    }

    if (!Array.isArray(config.routingGroups)) {
      throw new Error('routingGroups must be an array');
    }

    if (config.routingGroups.length === 0) {
      throw new Error('At least one routing group is required');
    }

    // Validate each routing group
    for (const group of config.routingGroups) {
      this.validateRoutingGroup(group);
    }

    // Check for duplicate group names
    const groupNames = config.routingGroups.map(g => g.name.toLowerCase());
    const uniqueNames = new Set(groupNames);
    if (groupNames.length !== uniqueNames.size) {
      throw new Error('Duplicate routing group names found');
    }
  }

  /**
   * Validate a single routing group
   */
  private validateRoutingGroup(group: RoutingGroup): void {
    if (!group.name || typeof group.name !== 'string') {
      throw new Error('Routing group name is required and must be a string');
    }

    if (!Array.isArray(group.routings)) {
      throw new Error('Group routings must be an array');
    }

    if (group.routings.length === 0) {
      throw new Error(`Routing group '${group.name}' must have at least one routing`);
    }

    // Validate each routing in the group
    for (const routing of group.routings) {
      this.validateRouting(routing, group.name);
    }
  }

  /**
   * Validate a single routing
   */
  private validateRouting(routing: Routing, groupName: string): void {
    if (!routing.name || typeof routing.name !== 'string') {
      throw new Error(`Routing name is required in group '${groupName}'`);
    }

    if (!routing.redirectTarget || typeof routing.redirectTarget !== 'string') {
      throw new Error(`Redirect target is required for routing '${routing.name}' in group '${groupName}'`);
    }

    // Basic URL validation for redirect target
    try {
      new URL(routing.redirectTarget);
    } catch {
      throw new Error(`Invalid redirect target URL '${routing.redirectTarget}' in routing '${routing.name}'`);
    }
  }

  /**
   * Get current configuration
   */
  public getConfiguration(): RoutingConfiguration | null {
    return this.configuration;
  }

  /**
   * Check if configuration is loaded
   */
  public isConfigurationLoaded(): boolean {
    return this.configuration !== null;
  }
}
