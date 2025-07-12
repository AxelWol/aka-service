# AKA-URL Shortener Service

Project Requirements and Specification

## Vision

Build a static web app which can redirect to configured URLs based on parameters provided when called. This is a classic URL shortener service.

### Example

The web app is called with

```url
https://aka.mein-service.net/Eheschliessung?oeid=2289&gks=12345&leika=99059001000000
```

Then the app looks up a static configuration file (schema provided in next section) and redirects to a configured destination (found in the configuration file):

```url
https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung
```

## Use Cases

| # | As a          | I want                                                                      | To                                                                                                                                                  |
| - | ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | User          | to open a complex URL via a simple URL (shortened URL) which I can remember | be able to use a simple URL.                                                                                                                        |
| 2 | Administrator | to change the destination URLs at any time                                 | change a URL without affecting a USER who can still use the simple URL (shortened URL).                                                            |
| 3 | Administrator | to configure flexible routing with and without additional URL parameters   | provide simple URL shortenings or more complex shortenings which come with additional parameters (e.g. ?oeid=2289&gks=12345&leika=99059001000000). |

## Data Schema

The Data Schema should be able to store these entities. The data is stored in a single .json configuration file.

### RoutingGroup

| Name           | Type | Example Value                                                      | Description                                                                                                                                                                                                                                                                                                             |
| -------------- | ---- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name           | Text | 'Eheschliessung'                                                   | The name for the RoutingGroup. It is the relative part of the URL used to call this service. It is possible to omit "DependsOnKey" and "DependsOnValue". Then this name is extracted from the relative URL and used as the only selector for activating this RoutingGroup and checking the Routing(s) inside it. |
| Description    | Text | 'Routing for Leika 99059001000000 - Anmeldung zur Eheschließung' | Only for information. Not used in any rules. It can be used for logging to the console.                                                                                                                                                                                                                                 |
| DependsOnKey   | Text | 'leika'                                                            | This field defines the name of the URL parameter given on call to test for a value, specified by "DependsOnValue".                                                                                                                                                                                                     |
| DependsOnValue | Text | '99059001000000'                                                   | This field defines the value of the URL parameter (the name is specified by "DependsOnKey"). If the value is found then this routing group is activated and the routing entities inside this group are examined.                                                                                                 |

### Routing

A Routing entity is always inside a RoutingGroup. There can be more than one Routing per RoutingGroup.

| Name           | Type | Example Value                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name           | Text | 'BzMitte'                                                                                                                     | The Name of the Routing entity. Only for information. Not used in any rules. It can be used for logging to the console.                                                                                                                                                                                                                                                                                              |
| DependsOnKey   | Text | 'oeid'                                                                                                                        | A name of a URL parameter provided on call. It can be empty, then no dependency is recognized. Optional.                                                                                                                                                                                                                                                                                                             |
| DependsOnValue | Text | '2289'                                                                                                                        | A value to test for. The following URL target is only redirected to, when this value is found. Can be empty. Optional.                                                                                                                                                                                                                                                                                               |
| RedirectTarget | Text | `https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung` | The target for the redirection. If "DependsOnKey" and "DependsOnValue" are provided inside this routing, then the routing is only done when the two values are found. Otherwise ignored. If the routing is the only one inside a routing group and "DependsOnKey" and "DependsOnValue" are empty or not included, then the redirect target is the only one and each call to it is directly followed. |

## Examples for calling the shortener service

- Simple: `https://aka.mein-service.net/Eheschliessung`
- More Complex: `https://aka.mein-service.net/Eheschliessung?oeid=2289`
- Complex: `https://aka.mein-service.net/AllServices?leika=99059001000000&oeid=2289`

## Technology

- Create a pure JavaScript app
- Use TypeScript
- Use Vite for bundling and as a dev server
- Create a backend API for storing the configuration in a single .json file. No database.
- Create a frontend web service to provide the endpoint for the shortener service (HTTP GET for redirects).
- Vite should create a complete app build and store it in the `/build` directory.
- Create unit tests for the backend and the frontend
- Create NPM scripts for dev, build, test and deployment
- Use Prettier and ESLint to ensure good code style and coding conventions.
- Include complete version control with change-log creation following the guidance of semantic versioning. Create NPM scripts for version control.
- Run the version control on every build and deployment.
- Log any actions (backend and frontend) to the browser console

## Deployment

There is already an empty static web application created in Azure for this new service. Please use the information provided by:

- `/deployment/parameters.json`
- `/deployment/template.json`

to create a simple Azure deployment for static web apps based on the contents found in the `/build` directory.
