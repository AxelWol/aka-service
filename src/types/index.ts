/**
 * Configuration schema for the URL shortener service
 * Represents the structure of the routing configuration file
 */

export interface RoutingGroup {
  /** The name for the RoutingGroup - relative part of the URL */
  name: string;
  /** Description for information only, not used in rules */
  description: string;
  /** Optional: Name of the URL parameter to test for a value */
  dependsOnKey?: string;
  /** Optional: Value to test for the URL parameter */
  dependsOnValue?: string;
  /** Array of routing entries inside this group */
  routings: Routing[];
}

export interface Routing {
  /** Name of the Routing entity for information only */
  name: string;
  /** Optional: Name of a URL parameter provided on call */
  dependsOnKey?: string;
  /** Optional: Value to test for, routing only happens when this value is found */
  dependsOnValue?: string;
  /** The target URL for redirection */
  redirectTarget: string;
}

export interface RoutingConfiguration {
  /** Version of the configuration schema */
  version: string;
  /** Array of routing groups */
  routingGroups: RoutingGroup[];
  /** Optional metadata */
  metadata?: {
    created: string;
    lastModified: string;
    author?: string;
  };
}

export interface URLParams {
  [key: string]: string | undefined;
}

export interface RedirectResult {
  /** Whether a redirect target was found */
  found: boolean;
  /** The target URL if found */
  targetUrl?: string;
  /** The routing group that matched */
  matchedGroup?: string;
  /** The specific routing that matched */
  matchedRouting?: string;
  /** Error message if any */
  error?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, unknown>;
}
