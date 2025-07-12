# AKA URL Shortener Service

A modern TypeScript-based URL shortener and redirect service built for Azure Static Web Apps. This service provides configurable URL routing and redirection based on URL parameters and patterns.

## 🚀 Features

- **Flexible URL Routing**: Configure complex routing rules based on URL parameters
- **Parameter-based Redirection**: Support for conditional redirects based on query parameters
- **Configuration-driven**: JSON-based configuration for easy management
- **Modern TypeScript**: Built with latest TypeScript and modern web standards
- **Azure Native**: Optimized for Azure Static Web Apps
- **Testing Interface**: Built-in UI for testing redirects
- **Comprehensive Logging**: Detailed console logging for debugging and monitoring
- **CI/CD Ready**: GitHub Actions workflow included

## 🏗️ Architecture

The service consists of:

- **Frontend**: Modern TypeScript application with Vite bundling
- **Configuration Service**: JSON-based routing configuration management
- **Routing Engine**: Core logic for URL matching and redirection
- **Testing Interface**: Web UI for testing and validation
- **Azure Infrastructure**: Bicep templates for Azure deployment

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
  "version": "1.0.0",
  "routingGroups": [
    {
      "name": "Eheschliessung",
      "description": "Wedding appointment routing",
      "dependsOnKey": "leika",
      "dependsOnValue": "99059001000000",
      "routings": [
        {
          "name": "BzMitte",
          "dependsOnKey": "oeid",
          "dependsOnValue": "2289",
          "redirectTarget": "https://example.com/wedding/middle"
        }
      ]
    }
  ]
}
```

### Configuration Schema

- **RoutingGroup**: Top-level routing container
  - `name`: URL path component to match
  - `description`: Human-readable description
  - `dependsOnKey`/`dependsOnValue`: Optional parameter requirements
  - `routings`: Array of redirect rules

- **Routing**: Individual redirect rule
  - `name`: Rule identifier
  - `dependsOnKey`/`dependsOnValue`: Optional parameter conditions
  - `redirectTarget`: Target URL for redirection

## 🌐 Usage Examples

### Simple Redirect

```text
https://aka.mein-service.net/SimpleRedirect
→ https://example.com/simple
```

### Parameter-based Redirect

```text
https://aka.mein-service.net/Eheschliessung?leika=99059001000000&oeid=2289
→ https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung
```

### Fallback Redirect

```text
https://aka.mein-service.net/Eheschliessung?leika=99059001000000
→ https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.DEFAULT&mode=cc&cc_key=AnmeldungEheschliessung
```

## 🚀 Deployment

### Quick Deploy with NPM

The easiest way to deploy is using the included npm script:

```bash
npm run deploy
```

This command will:

1. Build the application
2. Provision Azure infrastructure (if needed)
3. Deploy the app to Azure Static Web Apps

**Alternative deployment commands:**

- `npm run deploy:provision` - Only provision infrastructure
- `npm run deploy:only` - Only deploy code (infrastructure must exist)

### Prerequisites

1. **Azure CLI**: Install and configure
2. **Azure Developer CLI (azd)**: Install azd
3. **GitHub Token**: Generate a personal access token

### Deploy to Azure

1. **Initialize azd**:

   ```bash
   azd init
   ```

2. **Set environment variables**:

   ```bash
   azd env set GITHUB_TOKEN your_github_token
   ```

3. **Deploy**:

   ```bash
   azd up
   ```

### Manual Deployment

You can also deploy using Azure CLI:

```bash
# Deploy infrastructure
az deployment group create \
  --resource-group your-resource-group \
  --template-file infra/main.bicep \
  --parameters @infra/main.parameters.json

# Build and deploy app
npm run build
# Upload build folder to Azure Static Web Apps
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
├── .github/workflows/     # GitHub Actions CI/CD
├── infra/                 # Azure Bicep templates
├── public/               # Static assets and config
├── src/                  # Source code
│   ├── api/             # API utilities (future)
│   ├── services/        # Core business logic
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utility functions
│   └── test/            # Test files
├── build/               # Production build output
├── docs/                # Documentation
└── package.json         # Dependencies and scripts
```

## 🧪 Testing Interface

The service includes a built-in testing interface accessible at the root URL. Features:

- **Service Status**: Real-time configuration status
- **URL Testing**: Test redirects without actual navigation
- **Example URLs**: Pre-configured test cases
- **Live Logging**: Real-time console output

## 🔧 Technology Stack

- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Vitest**: Modern testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Azure Static Web Apps**: Hosting platform
- **GitHub Actions**: CI/CD pipeline
- **Bicep**: Infrastructure as Code

## 📊 Monitoring and Logging

All actions are logged to the browser console with structured information:

```typescript
// Example log output
[AKA-Service] 2025-07-12T10:30:00.000Z - INFO: Processing redirect request {"path":"Eheschliessung","urlParams":{"leika":"99059001000000","oeid":"2289"}}
[AKA-Service] 2025-07-12T10:30:00.001Z - INFO: Redirect target found {"targetUrl":"https://example.com/target","matchedGroup":"Eheschliessung","matchedRouting":"BzMitte"}
```

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

- Check the [documentation](docs/instructions.md)
- Review [test examples](src/test/)
- Open an [issue](https://github.com/AxelWol/aka-service/issues)

## 🔗 Links

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/guide/)
