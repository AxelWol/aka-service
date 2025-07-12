/**
 * Type definitions for @kern-ux-annex/webc
 * Provides TypeScript support for KERN UX ANNEX web components
 */

declare module '@kern-ux-annex/webc' {
  // Main module export
  const webComponents: Record<string, unknown>;
  export default webComponents;
}

// Custom element interfaces for KERN web components
interface KernGridContainerElement extends HTMLElement {}

interface KernGridRowElement extends HTMLElement {}

interface KernGridColElement extends HTMLElement {
  size?: string | number;
}

interface KernHeadingElement extends HTMLElement {
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

interface KernSublineElement extends HTMLElement {}

interface KernButtonElement extends HTMLElement {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

interface KernAlertElement extends HTMLElement {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

interface KernBadgeElement extends HTMLElement {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

declare global {
  // HTML Element interfaces for KERN web components
  interface HTMLElementTagNameMap {
    'kern-grid-container': KernGridContainerElement;
    'kern-grid-row': KernGridRowElement;
    'kern-grid-col': KernGridColElement;
    'kern-heading': KernHeadingElement;
    'kern-subline': KernSublineElement;
    'kern-button': KernButtonElement;
    'kern-alert': KernAlertElement;
    'kern-badge': KernBadgeElement;
  }
}

export {};
