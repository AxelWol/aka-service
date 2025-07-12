import type { LogEntry } from '@/types';

/**
 * Simple logger utility for browser console logging
 * Follows the requirement to log all actions to browser console
 */
export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(level: LogEntry['level'], message: string, data?: Record<string, unknown>): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    
    if (data) {
      entry.data = data;
    }
    
    return entry;
  }

  public info(message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, data);
    this.logs.push(entry);
    // eslint-disable-next-line no-console
    console.info(`[AKA-Service] ${entry.timestamp} - INFO: ${message}`, data || '');
  }

  public warn(message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, data);
    this.logs.push(entry);
    // eslint-disable-next-line no-console
    console.warn(`[AKA-Service] ${entry.timestamp} - WARN: ${message}`, data || '');
  }

  public error(message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', message, data);
    this.logs.push(entry);
    // eslint-disable-next-line no-console
    console.error(`[AKA-Service] ${entry.timestamp} - ERROR: ${message}`, data || '');
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
