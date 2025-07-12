@description('The name of the application')
param appName string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The environment name (for AZD)')
param environmentName string

@description('The repository URL for the static web app')
param repositoryUrl string = ''

@description('The branch name for the static web app')
param branch string = 'main'

@description('Repository token for GitHub Actions')
@secure()
param repositoryToken string = ''

@description('The app location within the repository')
param appLocation string = '/'

@description('The API location within the repository')
param apiLocation string = ''

@description('The build output location')
param appArtifactLocation string = 'build'

@description('Enterprise grade CDN status')
@allowed(['Enabled', 'Disabled'])
param enterpriseGradeCdnStatus string = 'Enabled'

@description('SKU for the static web app')
@allowed(['Free', 'Standard'])
param skuName string = 'Standard'

@description('SKU tier for the static web app')
@allowed(['Free', 'Standard'])
param skuTier string = 'Standard'

// Generate unique resource names using the correct format
var resourceToken = uniqueString(subscription().id, resourceGroup().id, environmentName)
var staticWebAppName = '${appName}-${resourceToken}'

// Tags for all resources
var tags = {
  'azd-env-name': environmentName
  'azd-service-name': 'web'
  application: 'aka-service'
  environment: 'production'
}

// Create the static web app
resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: staticWebAppName
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuTier
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    repositoryToken: repositoryToken
    buildProperties: {
      appLocation: appLocation
      apiLocation: apiLocation
      outputLocation: appArtifactLocation
      skipGithubActionWorkflowGeneration: false
    }
    enterpriseGradeCdnStatus: enterpriseGradeCdnStatus
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    publicNetworkAccess: 'Enabled'
  }
}

// Required outputs for AZD
@description('The default hostname of the static web app')
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'

@description('The name of the static web app')
output staticWebAppName string = staticWebApp.name

@description('The resource ID of the static web app')
output staticWebAppId string = staticWebApp.id

@description('The resource group ID')
output RESOURCE_GROUP_ID string = resourceGroup().id

@description('The resource group name')
output resourceGroupName string = resourceGroup().name
