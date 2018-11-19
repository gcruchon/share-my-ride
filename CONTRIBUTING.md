# Thank you

First, thank you to help this application to live

# Dev environment

* VS Code: https://code.visualstudio.com/
    * Plugins installed:
        * Mandatory:
            * Azure Account
            * Azure App Service
            * Cucumber (Gherkin) Full Support
            * ESLint
            * markdownlint
        * If you don't like command-line:
            * Git Blame
            * Git History
            * Git Stash


* NVM
    * MacOS X: https://github.com/creationix/nvm
    * Windows: https://github.com/coreybutler/nvm-windows
* MongoDB: https://www.mongodb.com/ (v3.6.x)
* git: last version

# Setup

 * NVM: make sure you are running Node v8.12.0 | NPM v6.4.1
 * Clone git repo
 * Run `npm install`
 * Copy `/config/database.sample.js` to `/config/database.js` and change according to your current MongoDB config

# Running the application

Launch `npm run dev`

# Standards

## Git
* Commit messages should follow [AngularJS commit conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)
* Contributors should follow the [Git flow](https://nvie.com/posts/a-successful-git-branching-model/)
    * master: for production
    * develop: development branch
    * feature/xxxxx: developper should start a such branch for each new development
    * release/xxxxx
    * hotfix/xxxxx
* Pull request
    * Mandatory to merge from `feature/xxxxx` to `develop` (pushing directly to `develop` is not allowed)
    * Should have at least one reviewer
    * Prior to creating a pull request, a developer should:
        * Make sure `npm test` runs without errors
        * Make sure coverage is above 80%
        * Make sure the app is working properly (back-end and front-end)
    * Prior to aproving the PR, reviewer should also run tests and check coverage.

## React

This application uses [Next.js](https://nextjs.org/), a React Framework.

It allows to have server-side rendering, simplifies routing and many other good stuffs.

## Clean Architecture

This application is layered according to [Clean Architecture](https://www.youtube.com/watch?v=o_TH-Y78tt4) standards (or [in French](https://www.youtube.com/watch?v=ROxco3DGjKk))

```

├── components          # React components
│
├── config              # for both front-end and back-end
│
├── pages               # front-end pages
│
├── src
│   │
│   ├── app             # contains the application use-cases
│   │
│   ├── domain          # contains entities manipulated throughout the app
│   │
│   ├── infrastructure  # database, logger, repositories, mappers
│   │
│   └── interfaces      # http, routers, controllers, middlewares
│
└── test
    │
    ├── atdd            # end-to-end tests
    │
    ├── bdd             # scenarios
    │
    ├── support         # helpers for tests
    │
    └── unit            # to test boundary conditions, exceptions, ...
```

> NB: This architecture is right now only implemented on the back-end (API). It also has to be applied on the front-end.

## Dev Guidelines

Code should follow AXA Dev Guidelines. Especially naming conventions and SOLID principles.

## Tests

### API (back-end)

* ATDD (End-to-end)
    * For key features only
    * Excluded from coverage calculation
* BDD (Scenarios)
    * Only for scenarios which add value to the product
    * Cross only app use-cases & repositories
    * Should mock infrastructure
* Unit-tests
    * Infrastrucures
    * Database models (mongoose schema & static methods)
    * Unexpected errors in use-cases (these tests do not add any value, but are necessary)
    * Middlewares (error, authentication, ...)

# Cheatsheets

* Git commit messages: https://gist.github.com/stephenparish/9941e89d80e2bc58a153
* Git flow: https://danielkummer.github.io/git-flow-cheatsheet/
* Markdown: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet