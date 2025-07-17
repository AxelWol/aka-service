# AKA-URL Shortener Service

## Software Requirements Specification - Version 2.1.4

### Last Updated: July 17, 2025

## Vision

Build a static web app which can redirect to configured URLs based on parameters provided when called. This is a classic URL shortener service with a dual-interface approach: a minimal redirect-only interface for production use and a comprehensive status/testing interface for administration.

### Example

The web app is called with:

```url
https://aka.mein-service.net/Eheschliessung?oeid=2289&leika=99059001104000
```

Then the app looks up a static configuration file and redirects to a configured destination:

```url
https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung
```

## Application Architecture

### Dual Interface System

The application provides two distinct interfaces:

1. **Redirect Interface (`/index.html`)** - Minimal, redirect-only interface
   - Pure white background with no visible UI elements
   - Immediate redirect processing without UI overhead
   - Error dialog only displayed when redirects fail
   - Automatic redirect to status page when no parameters provided

2. **Status Interface (`/status.html`)** - Full administrative interface
   - Complete service status dashboard
   - Interactive URL testing capabilities
   - Configuration information display
   - KERN UX component-based UI

### File Structure

```
/
├── index.html                    # Minimal redirect-only interface
├── status.html                   # Full status/admin interface
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── vitest.config.ts             # Testing configuration
├── eslint.config.mjs            # ESLint configuration
├── azure.yaml                   # Azure Developer CLI config
├── swa-cli.config.json          # Static Web App CLI config
├── public/
│   ├── config.json              # Routing configuration
│   └── staticwebapp.config.json # Azure SWA routing rules
├── src/
│   ├── app.ts                   # Status page application logic
│   ├── redirect.ts              # Redirect-only application logic
│   ├── main.ts                  # Core service class
│   ├── services/
│   │   ├── configuration.ts     # Configuration loading service
│   │   └── routing.ts          # URL routing logic
│   ├── utils/
│   │   ├── logger.ts           # Logging utilities
│   │   └── url.ts              # URL processing utilities
│   ├── types/
│   │   ├── index.ts            # TypeScript type definitions
│   │   └── webc.d.ts           # Web component type declarations
│   ├── styles/
│   │   └── kern-components.css  # KERN UX component styles
│   └── test/
│       ├── routing.test.ts      # Routing logic tests
│       └── url.test.ts          # URL utility tests
├── infra/
│   ├── main.bicep              # Azure infrastructure as code
│   └── main.parameters.json    # Bicep parameters
└── docs/
    ├── requirements.md          # This document
    ├── instructions.md          # Setup instructions
    └── prompt.md               # Development prompts
```

## Use Cases

| # | As a              | I want                                                                    | To                                                                                                                                                  |
|---|-------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | End User          | to access complex URLs via simple, memorable short URLs                  | easily navigate to services without remembering complex parameters                                                                                |
| 2 | End User          | to be redirected immediately without seeing any UI                       | have a seamless experience when using short URLs                                                                                                  |
| 3 | Administrator     | to view service status and configuration details                         | monitor the health and state of the URL shortener service                                                                                         |
| 4 | Administrator     | to test URL redirections before deploying configuration changes          | ensure redirect rules work correctly before users encounter them                                                                                  |
| 5 | Administrator     | to change destination URLs without affecting users                       | update redirects while maintaining the same short URLs that users know                                                                            |
| 6 | Administrator     | to configure flexible routing with conditional parameters                | provide both simple redirects and complex parameter-based routing rules                                                                           |
| 7 | Developer         | to access detailed logs and error information                            | debug issues and monitor system behavior                                                                                                          |
| 8 | Developer         | to have a clean separation between redirect and admin functionality      | maintain and deploy different aspects of the application independently                                                                             |

## Data Schema

The configuration is stored in `/public/config.json` as a single JSON file.

### RoutingConfiguration (Root Object)

| Field | Type | Description |
|-------|------|-------------|
| version | string | Configuration version for tracking changes |
| metadata | ConfigurationMetadata | Metadata about the configuration |
| routingGroups | RoutingGroup[] | Array of routing group definitions |

### ConfigurationMetadata

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| created | string (ISO date) | "2025-07-12T00:00:00.000Z" | When the configuration was created |
| lastModified | string (ISO date) | "2025-07-12T11:20:00.000Z" | Last modification timestamp |
| author | string | "AKA Service Team" | Author of the configuration |

### RoutingGroup

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| name | string | "Eheschliessung" | Path segment used in URLs (e.g., `/Eheschliessung`) |
| description | string | "Routing for marriage registration" | Human-readable description for documentation |
| dependsOnKey | string (optional) | "leika" | URL parameter name to check for activation |
| dependsOnValue | string (optional) | "99059001104000" | Required parameter value for group activation |
| routings | Routing[] | Array of routing rules | Individual routing rules within this group |

### Routing

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| name | string | "BzMitte" | Human-readable identifier for the routing rule |
| dependsOnKey | string (optional) | "oeid" | URL parameter name for conditional routing |
| dependsOnValue | string (optional) | "2289" | Required parameter value for this routing |
| redirectTarget | string | "https://..." | Target URL for redirection |

## Routing Logic

### Path-Based Routing

1. **URL Analysis**: Extract path and query parameters from incoming URL
2. **Group Matching**: Find routing group by path segment (e.g., `/Eheschliessung`)
3. **Group Validation**: Check if group's `dependsOnKey`/`dependsOnValue` conditions are met
4. **Route Selection**: Within valid group, find routing with matching parameter conditions
5. **Redirection**: Redirect to the matched routing's `redirectTarget`

### Fallback Behavior

- **No path/parameters**: Redirect to `/status.html`
- **Unknown path**: Show error dialog
- **Group found but no matching route**: Show error dialog
- **No groups match**: Show error dialog

### Example URL Processing

```
URL: /Eheschliessung?leika=99059001104000&oeid=2289

1. Extract path: "Eheschliessung"
2. Find group: {name: "Eheschliessung", dependsOnKey: "leika", dependsOnValue: "99059001104000"}
3. Validate group: Check if leika=99059001104000 ✓
4. Find routing: {dependsOnKey: "oeid", dependsOnValue: "2289", redirectTarget: "https://..."}
5. Validate routing: Check if oeid=2289 ✓
6. Redirect to: redirectTarget URL
```

## Technology Stack

### Core Technologies

- **TypeScript 5.8.3**: Primary development language
- **Vite 7.0.5**: Build tool and development server
- **Vitest 3.2.4**: Testing framework
- **ESLint 9.31.0**: Code linting and style enforcement
- **Prettier 3.1.0**: Code formatting

### Frontend Dependencies

- **@kern-ux-annex/webc 2.20.8**: KERN UX Design System web components
- **Express 5.1.0**: Server framework (for API if needed)
- **Compression 1.7.4**: Response compression middleware
- **CORS 2.8.5**: Cross-origin resource sharing
- **Helmet 8.1.0**: Security headers
- **Morgan 1.10.0**: HTTP request logging

### Development Tools

- **@vitest/ui 3.2.4**: Testing interface
- **@vitest/coverage-v8 3.2.4**: Code coverage reporting
- **Auto-changelog 2.4.0**: Automated changelog generation
- **Terser 5.43.1**: JavaScript minification
- **JSDOM 26.1.0**: DOM testing environment

### Build Configuration

#### Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
    target: 'es2022',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        status: resolve(__dirname, 'status.html'),
      },
      output: {
        manualChunks: {
          'webc': ['@kern-ux-annex/webc'],
        },
      },
    },
  },
  // ... server configuration
});
```

#### TypeScript Configuration (`tsconfig.json`)

- Target: ES2022
- Module: ESNext
- Strict type checking enabled
- Path mapping for `@/*` to `src/*`

## Features Implementation

### 1. Redirect Interface (`/index.html`)

**Purpose**: Minimal interface for production URL redirection

**Features**:
- No visible UI elements (white background)
- Immediate redirect processing
- Error dialog only on failures
- Root path redirects to status page when no parameters

**Implementation**: `src/redirect.ts`
- Loads configuration service
- Processes URL parameters
- Executes redirect logic
- Shows error dialog on failures

### 2. Status Interface (`/status.html`)

**Purpose**: Administrative interface for monitoring and testing

**Features**:
- Service status dashboard
- Configuration information display
- Interactive URL testing
- Example URL templates
- KERN UX Design System components

**Status Information Displayed**:
- Service initialization status
- Configuration load status
- Number of routing groups
- Number of routing entries
- Configuration version
- Last modification date

**Interactive Testing**:
- URL input field for testing redirects
- Click-to-test example URLs
- Success/error result display
- Clear/reset functionality

**Implementation**: `src/app.ts`
- KERN web component integration
- Service status monitoring
- Interactive testing interface
- UI state management

### 3. Core Service (`src/main.ts`)

**AKAService Class**:
- Configuration initialization
- Redirect processing
- Status reporting
- Error handling

**Key Methods**:
- `initialize(configPath)`: Load configuration
- `processRedirect(url)`: Execute redirect logic
- `getStatus()`: Return service status

### 4. Configuration Service (`src/services/configuration.ts`)

**Features**:
- JSON configuration loading
- Schema validation
- Error handling
- File and object-based loading

### 5. Routing Service (`src/services/routing.ts`)

**Features**:
- URL pattern matching
- Parameter validation
- Route resolution
- Fallback handling

### 6. Utility Services

**Logger (`src/utils/logger.ts`)**:
- Structured logging
- Multiple log levels
- Context information
- Browser console integration

**URL Utils (`src/utils/url.ts`)**:
- URL parsing and validation
- Parameter extraction
- Path processing

## Testing Strategy

### Unit Tests

**Files**: `src/test/*.test.ts`

**Coverage Areas**:
- Routing logic validation
- URL processing functions
- Configuration loading
- Error handling scenarios

**Test Framework**: Vitest with JSDOM
**Coverage Tool**: V8 coverage reporting

### Test Scripts

```bash
npm run test          # Run all tests
npm run test:ui       # Interactive test UI
npm run test:coverage # Generate coverage report
```

## Development Workflow

### NPM Scripts

```json
{
  "dev": "vite",                              // Development server
  "build": "tsc && vite build",               // Production build
  "preview": "vite preview",                  // Preview build
  "test": "vitest",                           // Run tests
  "test:ui": "vitest --ui",                   // Test UI
  "test:coverage": "vitest --coverage",       // Coverage
  "lint": "eslint . --ext ts,tsx",            // Linting
  "lint:fix": "eslint . --ext ts,tsx --fix",  // Auto-fix linting
  "format": "prettier --write \"src/**/*\"",  // Format code
  "format:check": "prettier --check \"src/**/*\"", // Check formatting
  "type-check": "tsc --noEmit",               // Type checking
  "version:patch": "npm version patch && npm run changelog", // Patch version
  "version:minor": "npm version minor && npm run changelog", // Minor version
  "version:major": "npm version major && npm run changelog", // Major version
  "changelog": "auto-changelog -p && git add CHANGELOG.md", // Generate changelog
  "predeploy": "npm run build",               // Pre-deployment build
  "deploy": "npm run predeploy && azd up",    // Full deployment
  "deploy:provision": "azd provision",        // Provision infrastructure
  "deploy:only": "azd deploy"                 // Deploy only
}
```

### Version Control

- **Semantic Versioning**: Following semver principles
- **Automated Changelog**: Generated on version bumps
- **Git Integration**: Automatic changelog commits

## Deployment

### Azure Static Web Apps

**Infrastructure**: Defined in `/infra/main.bicep`

**Configuration Files**:
- `azure.yaml`: Azure Developer CLI configuration
- `public/staticwebapp.config.json`: SWA routing rules
- `swa-cli.config.json`: Static Web App CLI settings

**Routing Rules** (`public/staticwebapp.config.json`):
```json
{
  "routes": [
    {
      "route": "/config.json",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/assets/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "rewrite": "/index.html"
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html"
    }
  }
}
```

**Build Output**: `/build` directory
- `index.html`: Redirect interface
- `status.html`: Status interface
- `assets/`: Bundled JavaScript and CSS
- `config.json`: Configuration file
- `staticwebapp.config.json`: SWA routing

### Deployment Process

1. **Development**: `npm run dev`
2. **Testing**: `npm run test`
3. **Build**: `npm run build`
4. **Deploy**: `npm run deploy` (uses Azure Developer CLI)

### Azure Developer CLI Integration

- **Initialization**: `azd init`
- **Provisioning**: `azd provision`
- **Deployment**: `azd deploy`
- **Full Deployment**: `azd up`

## Configuration Examples

### Simple Redirect

```json
{
  "version": "1.0.0",
  "metadata": {
    "created": "2025-07-17T00:00:00.000Z",
    "lastModified": "2025-07-17T00:00:00.000Z",
    "author": "Admin"
  },
  "routingGroups": [
    {
      "name": "SimpleRedirect",
      "description": "Simple redirect without parameters",
      "routings": [
        {
          "name": "Default",
          "redirectTarget": "https://example.com"
        }
      ]
    }
  ]
}
```

### Complex Parameter-Based Routing

```json
{
  "routingGroups": [
    {
      "name": "Services",
      "description": "Multi-parameter routing",
      "dependsOnKey": "region",
      "dependsOnValue": "north",
      "routings": [
        {
          "name": "ServiceA",
          "dependsOnKey": "service",
          "dependsOnValue": "registration",
          "redirectTarget": "https://north.example.com/register"
        },
        {
          "name": "ServiceB",
          "dependsOnKey": "service", 
          "dependsOnValue": "inquiry",
          "redirectTarget": "https://north.example.com/inquiry"
        }
      ]
    }
  ]
}
```

## Error Handling

### Error Dialog Display

When redirects fail, users see a styled error dialog with:
- Error description
- Source URL that failed
- Link to return to status page
- Professional styling using inline CSS

### Logging Strategy

All actions are logged to browser console:
- Service initialization
- Configuration loading
- Redirect attempts (success/failure)
- Error conditions
- Performance metrics

## Security Considerations

- **CORS Configuration**: Controlled cross-origin access
- **Helmet Integration**: Security headers for HTTP responses
- **Input Validation**: URL and parameter sanitization
- **Static Configuration**: No dynamic configuration injection
- **No Sensitive Data**: All configuration is public
- **HTTPS Enforcement**: Secure connections required

## Performance Optimization

- **Minimal Bundle Size**: Lazy loading of KERN components
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Separate bundles for redirect and status
- **Compression**: Gzip compression for responses
- **Caching**: Appropriate cache headers
- **Fast Redirects**: Minimal processing for redirect interface

## Maintenance and Monitoring

### Status Monitoring

The status interface provides:
- Real-time service health
- Configuration validation
- Routing rule counts
- Last update timestamps

### Logging and Debugging

- Structured console logging
- Error context preservation
- Performance tracking
- User action tracking

### Configuration Management

- Version-controlled configuration
- Schema validation
- Rollback capabilities
- Change tracking

## Future Enhancements

Potential areas for expansion:
1. **Analytics**: Redirect usage tracking
2. **A/B Testing**: Multiple redirect targets
3. **Admin API**: Dynamic configuration updates
4. **Caching**: Improved performance optimization
5. **Authentication**: Protected admin interface
6. **Metrics Dashboard**: Usage statistics and reporting
