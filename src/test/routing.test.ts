import { describe, it, expect, beforeEach } from 'vitest';
import { RoutingService } from '@/services/routing';
import type { RoutingConfiguration } from '@/types';

describe('RoutingService', () => {
  let routingService: RoutingService;
  
  const sampleConfig: RoutingConfiguration = {
    version: '1.0.0',
    routingGroups: [
      {
        name: 'Eheschliessung',
        description: 'Test routing group',
        dependsOnKey: 'leika',
        dependsOnValue: '99059001000000',
        routings: [
          {
            name: 'BzMitte',
            dependsOnKey: 'oeid',
            dependsOnValue: '2289',
            redirectTarget: 'https://example.com/eheschliessung/bzmitte',
          },
          {
            name: 'Default',
            redirectTarget: 'https://example.com/eheschliessung/default',
          },
        ],
      },
      {
        name: 'SimpleRedirect',
        description: 'Simple redirect without dependencies',
        routings: [
          {
            name: 'Direct',
            redirectTarget: 'https://example.com/simple',
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    routingService = new RoutingService();
  });

  describe('loadConfiguration', () => {
    it('should load valid configuration', () => {
      expect(() => routingService.loadConfiguration(sampleConfig)).not.toThrow();
      expect(routingService.isConfigurationLoaded()).toBe(true);
    });

    it('should reject configuration without version', () => {
      const invalidConfig = { ...sampleConfig, version: '' };
      expect(() => routingService.loadConfiguration(invalidConfig)).toThrow('Configuration version is required');
    });

    it('should reject configuration without routing groups', () => {
      const invalidConfig = { ...sampleConfig, routingGroups: [] };
      expect(() => routingService.loadConfiguration(invalidConfig)).toThrow('At least one routing group is required');
    });
  });

  describe('findRedirect', () => {
    beforeEach(() => {
      routingService.loadConfiguration(sampleConfig);
    });

    it('should find redirect with matching dependencies', () => {
      const result = routingService.findRedirect('Eheschliessung', {
        leika: '99059001000000',
        oeid: '2289',
      });

      expect(result.found).toBe(true);
      expect(result.targetUrl).toBe('https://example.com/eheschliessung/bzmitte');
      expect(result.matchedGroup).toBe('Eheschliessung');
      expect(result.matchedRouting).toBe('BzMitte');
    });

    it('should find default routing when specific dependencies not met', () => {
      const result = routingService.findRedirect('Eheschliessung', {
        leika: '99059001000000',
        oeid: 'different-value',
      });

      expect(result.found).toBe(true);
      expect(result.targetUrl).toBe('https://example.com/eheschliessung/default');
      expect(result.matchedRouting).toBe('Default');
    });

    it('should find simple redirect without dependencies', () => {
      const result = routingService.findRedirect('SimpleRedirect', {});

      expect(result.found).toBe(true);
      expect(result.targetUrl).toBe('https://example.com/simple');
      expect(result.matchedGroup).toBe('SimpleRedirect');
      expect(result.matchedRouting).toBe('Direct');
    });

    it('should not find redirect for non-existent group', () => {
      const result = routingService.findRedirect('NonExistent', {});

      expect(result.found).toBe(false);
      expect(result.error).toBe('No matching routing group found');
    });

    it('should not find redirect when group dependencies not met', () => {
      const result = routingService.findRedirect('Eheschliessung', {
        leika: 'wrong-value',
      });

      expect(result.found).toBe(false);
      expect(result.error).toBe('No matching routing group found');
    });

    it('should handle case insensitive group names', () => {
      const result = routingService.findRedirect('eheschliessung', {
        leika: '99059001000000',
      });

      expect(result.found).toBe(true);
    });
  });

  describe('validation', () => {
    it('should reject routing with invalid redirect target', () => {
      const invalidConfig: RoutingConfiguration = {
        version: '1.0.0',
        routingGroups: [
          {
            name: 'TestGroup',
            description: 'Test',
            routings: [
              {
                name: 'InvalidTarget',
                redirectTarget: 'not-a-valid-url',
              },
            ],
          },
        ],
      };

      expect(() => routingService.loadConfiguration(invalidConfig)).toThrow('Invalid redirect target URL');
    });

    it('should reject duplicate group names', () => {
      const invalidConfig: RoutingConfiguration = {
        version: '1.0.0',
        routingGroups: [
          {
            name: 'Duplicate',
            description: 'First',
            routings: [{ name: 'Test1', redirectTarget: 'https://example.com/1' }],
          },
          {
            name: 'Duplicate',
            description: 'Second',
            routings: [{ name: 'Test2', redirectTarget: 'https://example.com/2' }],
          },
        ],
      };

      expect(() => routingService.loadConfiguration(invalidConfig)).toThrow('Duplicate routing group names found');
    });
  });
});
