# AKA URL Shortener Service

A modern TypeScript-based URL shortener and redirect service built for Azure Static Web Apps. This service provides configurable URL routing and redirection based on URL parameters and patterns, featuring a dual-interface architecture for optimal user experience.

## 🚀 Features

- **Dual Interface Architecture**: Separate redirect and status interfaces for optimal performance
- **Instant Redirects**: Minimal overhead redirect interface with no visible UI
- **Administrative Dashboard**: Comprehensive status and testing interface
- **Flexible URL Routing**: Configure complex routing rules based on URL parameters
- **Parameter-based Redirection**: Support for conditional redirects based on query parameters
- **Configuration-driven**: JSON-based configuration for easy management
- **Modern TypeScript**: Built with latest TypeScript and modern web standards
- **KERN UX Components**: Professional UI components for status interface
- **Azure Native**: Optimized for Azure Static Web Apps deployment
- **Interactive Testing**: Built-in UI for testing redirects without navigation
- **Comprehensive Logging**: Detailed console logging for debugging and monitoring
- **CI/CD Ready**: Azure Developer CLI integration included

## 🏗️ Architecture

### Dual Interface System

The service provides two distinct user interfaces:

#### 1. Redirect Interface (`/index.html`)
- **Purpose**: Production URL redirection with minimal overhead
- **Features**: 
  - Pure white background, no visible UI elements
  - Immediate redirect processing
  - Error dialog only on redirect failures
  - Automatic redirect to status page when no parameters provided
- **Use Case**: End users accessing short URLs

#### 2. Status Interface (`/status.html`)  
- **Purpose**: Administrative dashboard and testing
- **Features**:
  - Real-time service status monitoring
  - Interactive URL redirect testing
  - Configuration information display
  - Example URL templates
  - Professional KERN UX component-based interface
- **Use Case**: Administrators and developers

### Core Components

- **Frontend**: Modern TypeScript application with Vite bundling
- **Configuration Service**: JSON-based routing configuration management  
- **Routing Engine**: Core logic for URL matching and redirection
- **Logging System**: Structured browser console logging
- **Azure Infrastructure**: Bicep templates for automated deployment

## 📋 Requirements

- Node.js 18 or higher
- Azure subscription (for deployment)
- GitHub account (for CI/CD)

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AxelWol/aka-service.git
   cd aka-service
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000`

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:ui
```

## 🔧 Configuration

The service uses a JSON configuration file (`public/config.json`) to define routing rules:

```json
{
  "version": "1.0.2",
  "metadata": {
    "created": "2025-07-12T00:00:00.000Z",
    "lastModified": "2025-07-17T11:20:00.000Z",
    "author": "AKA Service Team"
  },
  "routingGroups": [
    {
      "name": "Eheschliessung",
      "description": "Wedding appointment routing for Hamburg",
      "dependsOnKey": "leika", 
      "dependsOnValue": "99059001104000",
      "routings": [
        {
          "name": "BzMitte",
          "dependsOnKey": "oeid",
          "dependsOnValue": "2289", 
          "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung"
        },
        {
          "name": "BzNord",
          "dependsOnKey": "oeid",
          "dependsOnValue": "8455",
          "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000002&mode=cc&cc_key=AnmeldungEheschliessung"
        }
      ]
    },
    {
      "name": "SimpleRedirect",
      "description": "Simple redirect without parameters",
      "routings": [
        {
          "name": "Default",
          "redirectTarget": "https://example.com/simple"
        }
      ]
    }
  ]
}
```

### Configuration Schema

- **RoutingConfiguration** (Root Object):
  - `version`: Configuration version for tracking changes
  - `metadata`: Information about configuration creation and modification
  - `routingGroups`: Array of routing group definitions

- **RoutingGroup**: Top-level routing container
  - `name`: URL path component to match (e.g., `/Eheschliessung`)
  - `description`: Human-readable description for documentation
  - `dependsOnKey`/`dependsOnValue`: Optional parameter requirements for group activation
  - `routings`: Array of individual redirect rules

- **Routing**: Individual redirect rule within a group
  - `name`: Rule identifier for logging and debugging
  - `dependsOnKey`/`dependsOnValue`: Optional parameter conditions for this specific routing
  - `redirectTarget`: Target URL for redirection

### Routing Logic

1. **Path Extraction**: Extract path segment from URL (e.g., `/Eheschliessung`)
2. **Group Matching**: Find routing group with matching `name`
3. **Group Validation**: Check if group's parameter dependencies are satisfied
4. **Route Selection**: Within valid group, find routing with matching parameter conditions
5. **Redirection**: Redirect to the matched routing's `redirectTarget`
6. **Error Handling**: Show error dialog if no matches found

## 🌐 Usage Examples

### Instant Redirects (Production Interface)

Access any configured short URL and get redirected immediately:

```text
https://aka.mein-service.net/Eheschliessung?leika=99059001104000&oeid=2289
→ Instant redirect to target URL (no UI shown)
```

### Administrative Access (Status Interface)

Access the status dashboard directly:

```text
https://aka.mein-service.net/status.html
→ Shows comprehensive service status and testing interface
```

### Root Path Behavior

```text
https://aka.mein-service.net/
→ Automatically redirects to status interface (no parameters)

https://aka.mein-service.net/?service=example&param=value  
→ Processes as redirect (parameters provided)
```

### Example Redirect Flows

#### Simple Redirect
```text
https://aka.mein-service.net/SimpleRedirect
→ https://example.com/simple
```

#### Parameter-based Redirect
```text
https://aka.mein-service.net/Eheschliessung?leika=99059001104000&oeid=2289
→ https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung
```

#### Conditional Routing
```text
https://aka.mein-service.net/Services?region=north&service=registration
→ https://north.example.com/register

https://aka.mein-service.net/Services?region=north&service=inquiry  
→ https://north.example.com/inquiry
```

## 🚀 Deployment

### Quick Deploy with Azure Developer CLI

The recommended deployment method uses Azure Developer CLI for streamlined infrastructure and application deployment:

```bash
# Full deployment (infrastructure + application)
npm run deploy

# Alternative: Use azd directly
azd up
```

**Available deployment commands:**

```bash
npm run deploy              # Full deployment (build + provision + deploy)
npm run deploy:provision    # Provision Azure infrastructure only
npm run deploy:only         # Deploy application to existing infrastructure
npm run predeploy          # Build application for deployment
```

### Prerequisites

1. **Azure Developer CLI (azd)**: [Install azd](https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd)
2. **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
3. **Azure Subscription**: Active Azure subscription with appropriate permissions
4. **Node.js 18+**: Required for building the application

### Deployment Process

1. **Initialize Azure Developer CLI** (first time only):
   ```bash
   azd auth login
   azd init
   ```

2. **Configure Environment** (optional):
   ```bash
   azd env set AZURE_LOCATION "East US 2"
   azd env set AZURE_SUBSCRIPTION_ID "your-subscription-id"
   ```

3. **Deploy Everything**:
   ```bash
   npm run deploy
   ```

This will:
- Build the TypeScript application
- Create Azure Static Web App resource
- Configure routing rules
- Deploy both redirect and status interfaces
- Set up custom domain (if configured)

### Infrastructure as Code

The deployment uses Bicep templates located in `/infra/`:

- **`main.bicep`**: Defines Azure Static Web App and related resources
- **`main.parameters.json`**: Environment-specific configuration
- **`azure.yaml`**: Azure Developer CLI project configuration

### Manual Deployment (Alternative)

For manual deployment or CI/CD integration:

```bash
# Build the application
npm run build

# Deploy using Azure CLI
az staticwebapp deploy \
  --name your-app-name \
  --resource-group your-resource-group \
  --source ./build
```

### Environment Configuration

Configure deployment environments using Azure Developer CLI:

```bash
# Create new environment
azd env new production

# Set environment variables
azd env set AZURE_LOCATION "West Europe"
azd env set AZURE_RESOURCE_GROUP_NAME "aka-service-prod"

# Deploy to specific environment
azd up --environment production
```

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
npm run deploy       # Deploy to Azure (build + provision + deploy)
npm run deploy:provision # Provision Azure infrastructure only
npm run deploy:only  # Deploy app to existing infrastructure only
```

## 🔄 Versioning

The project follows semantic versioning:

```bash
npm run version:patch  # Patch version (1.0.0 → 1.0.1)
npm run version:minor  # Minor version (1.0.0 → 1.1.0)
npm run version:major  # Major version (1.0.0 → 2.0.0)
```

## 🏗️ Project Structure

```text
aka-service/
├── index.html                    # Minimal redirect-only interface
├── status.html                   # Full administrative interface  
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── vitest.config.ts             # Testing configuration
├── eslint.config.mjs            # ESLint configuration
├── azure.yaml                   # Azure Developer CLI config
├── swa-cli.config.json          # Static Web App CLI config
├── .github/workflows/           # GitHub Actions CI/CD
├── infra/                       # Azure Bicep templates
│   ├── main.bicep              # Infrastructure definition
│   └── main.parameters.json    # Deployment parameters
├── public/                      # Static assets and configuration
│   ├── config.json             # Routing configuration
│   └── staticwebapp.config.json # Azure SWA routing rules
├── src/                         # Source code
│   ├── app.ts                  # Status interface application logic
│   ├── redirect.ts             # Redirect interface application logic
│   ├── main.ts                 # Core AKA service class
│   ├── services/               # Core business logic
│   │   ├── configuration.ts    # Configuration loading service
│   │   └── routing.ts         # URL routing logic
│   ├── types/                  # TypeScript definitions
│   │   ├── index.ts           # Main type definitions
│   │   └── webc.d.ts          # Web component declarations
│   ├── utils/                  # Utility functions
│   │   ├── logger.ts          # Structured logging
│   │   └── url.ts             # URL processing utilities
│   ├── styles/                 # Stylesheets
│   │   └── kern-components.css # KERN UX component styles
│   └── test/                   # Test files
│       ├── routing.test.ts     # Routing logic tests
│       └── url.test.ts        # URL utility tests
├── build/                       # Production build output
├── docs/                        # Documentation
│   ├── requirements.md         # Software requirements specification
│   ├── instructions.md         # Setup and deployment instructions
│   └── prompt.md              # Development guidance
└── deployment/                  # Legacy deployment files
    ├── parameters.json         
    ├── template.json           
    └── template.zip            
```

## 🧪 Testing Interface

The service includes two distinct interfaces for different use cases:

### Redirect Interface (`/index.html`)
- **Pure Redirect Experience**: No visible UI, immediate redirection
- **Error Handling**: Professional error dialog when redirects fail
- **Root Fallback**: Redirects to status page when no parameters provided
- **Performance Optimized**: Minimal JavaScript bundle for fastest redirects

### Status Interface (`/status.html`)
- **Service Dashboard**: Real-time configuration and service status
- **Interactive Testing**: Test redirects without actual navigation
- **Example URLs**: Pre-configured test cases with click-to-test functionality
- **Live Monitoring**: Real-time console output and status updates
- **KERN UX Components**: Professional UI with modern design system

#### Status Dashboard Features:
- Service initialization status
- Configuration load status  
- Number of routing groups and entries
- Configuration version and last modified date
- Interactive URL testing with success/error feedback
- Example URL templates for common use cases

## 🔧 Technology Stack

### Core Technologies
- **TypeScript 5.8.3**: Type-safe JavaScript with modern language features
- **Vite 7.0.5**: Fast build tool and development server
- **Vitest 3.2.4**: Modern testing framework with TypeScript support
- **ESLint 9.31.0**: Code linting and style enforcement
- **Prettier 3.1.0**: Automated code formatting

### Frontend Dependencies
- **@kern-ux-annex/webc 2.20.8**: KERN UX Design System web components
- **Express 5.1.0**: Server framework for development and API
- **Compression 1.7.4**: Response compression middleware
- **CORS 2.8.5**: Cross-origin resource sharing support
- **Helmet 8.1.0**: Security headers and protection
- **Morgan 1.10.0**: HTTP request logging middleware

### Development & Build Tools
- **@vitest/ui 3.2.4**: Interactive testing interface
- **@vitest/coverage-v8 3.2.4**: Code coverage reporting
- **Auto-changelog 2.4.0**: Automated changelog generation
- **Terser 5.43.1**: JavaScript minification and optimization
- **JSDOM 26.1.0**: DOM testing environment for Node.js

### Azure & Deployment
- **Azure Static Web Apps**: Hosting and deployment platform
- **Azure Developer CLI (azd)**: Infrastructure and deployment automation
- **GitHub Actions**: CI/CD pipeline integration
- **Bicep**: Infrastructure as Code for Azure resources

## 📊 Monitoring and Logging

The service provides comprehensive logging and monitoring capabilities:

### Structured Logging

All actions are logged to the browser console with structured information:

```typescript
// Example log output
[2025-07-17T10:30:00.000Z] INFO: Initializing AKA Service redirect application
[2025-07-17T10:30:00.001Z] INFO: Processing direct redirect request {"path":"/Eheschliessung","search":"?leika=99059001104000&oeid=2289"}
[2025-07-17T10:30:00.002Z] INFO: Redirecting to target URL {"sourceUrl":"/Eheschliessung?leika=99059001104000&oeid=2289","targetUrl":"https://portal-civ-efa.ekom21.de/..."}
```

### Log Categories

- **Service Initialization**: Application startup and configuration loading
- **Redirect Processing**: URL parsing, route matching, and redirect execution
- **Error Handling**: Failed redirects, configuration errors, and system issues
- **User Interactions**: Testing interface usage and status page activities
- **Performance Metrics**: Component loading times and redirect processing duration

### Status Monitoring (Status Interface)

The status interface provides real-time monitoring:

- **Service Health**: Shows if the service is initialized and running
- **Configuration Status**: Displays if configuration is loaded successfully
- **Routing Statistics**: Number of configured routing groups and entries
- **Version Information**: Current configuration version and last modified date
- **Interactive Testing**: Test redirects and view results in real-time

### Error Tracking

- **Redirect Failures**: Detailed error messages for failed redirects
- **Configuration Issues**: Schema validation and loading errors
- **Component Loading**: Web component initialization problems
- **User-Friendly Display**: Professional error dialogs for end users

### Development Monitoring

During development, additional logging includes:
- **Component Loading**: KERN UX web component initialization status
- **Route Matching**: Detailed route resolution process
- **Configuration Parsing**: JSON schema validation and processing
- **Build Process**: Vite compilation and bundling information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the [documentation](docs/requirements.md)
- Review [test examples](src/test/)
- Open an [issue](https://github.com/AxelWol/aka-service/issues)

## 🔗 Links

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/guide/)
