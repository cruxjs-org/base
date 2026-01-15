<!-- ╔══════════════════════════════ BEG ══════════════════════════════╗ -->

<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="logo" style="" height="60" />
    </p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/v-0.1.2-black"/>
    <img src="https://img.shields.io/badge/🔥-@cruxjs-black"/>
    <br>
    <img src="https://img.shields.io/github/issues/cruxjs-org/base?style=flat" alt="Github Repo Issues" />
    <img src="https://img.shields.io/github/stars/cruxjs-org/base?style=social" alt="GitHub Repo stars" />
</div>
<br>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->

<br>

- ## Quick Start 🔥

    > **_Core types and utilities for building CruxJS applications and plugins. A shared foundation for @cruxjs/app and plugin packages._**

    - ### Overview

        > `@cruxjs/base` is the **shared foundation** for the entire CruxJS ecosystem. It provides:

        - **Type Definitions**: Core interfaces for plugins, app configuration, lifecycle management, and routing

        - **Logger**: Debug-aware logging for CruxJS operations and plugins

        - **PluginRegistry**: Plugin registration and lifecycle hook management

        - **ResourceMerger**: Smart merging of routes, schemas, and static configs with user priority

        > This package enables clean separation between **@cruxjs/app** (the framework) and **@cruxjs-plugins/** (domain-specific plugins), allowing plugins to be created independently without importing the entire app framework.

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - ### Setup

        > install [`hmm`](https://github.com/minejs-org/hmm) first.

        ```bash
        hmm i @cruxjs/base
        ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - ### Usage

        - ### 1. Type Definitions (Core Types)

            > Import shared types for building apps and plugins:

            ```typescript
            import {
                // App Configuration & Instance
                AppConfig,
                AppInstance,
                AppContext,
                AppMiddleware,

                // Plugin System
                CruxPlugin,
                MiddlewareExport,

                // Lifecycle
                LifecycleContext,
                LifecycleHooks,

                // Routing & Resources
                RouteDefinition,
                StaticConfig,
                TableSchema
            } from '@cruxjs/base'
            ```

            **Key Types:**

            ```typescript
            // Plugin Interface - what every plugin must implement
            export interface CruxPlugin {
                name            : string
                version         : string

                // Resources the plugin provides
                routes?         : RouteDefinition[]
                schemas?        : TableSchema[]
                middlewares?    : MiddlewareExport[]
                static?         : StaticConfig[]

                // Lifecycle hooks
                onRegister?     : (app: AppInstance)      => Promise<void>
                onAwake?        : (ctx: LifecycleContext) => Promise<void>
                onStart?        : (ctx: LifecycleContext) => Promise<void>
                onReady?        : (ctx: LifecycleContext) => Promise<void>
                onShutdown?     : (ctx: LifecycleContext) => Promise<void>
            }

            // App Configuration
            export interface AppConfig {
                // Server
                server? : {
                    port?           : number
                    host?           : string
                    logging?        : boolean | {
                    level?          : 'debug' | 'info' | 'warn' | 'error'
                    pretty?         : boolean
                    }
                }

                // Client (auto-build)
                client?: {
                    entry           : string
                    output          : string
                    minify?         : boolean
                    sourcemap?      : boolean
                    target?         : 'browser' | 'bun'
                    external?       : string[]
                }

                // UI Library (auto-install)
                ui?: {
                    package         : string
                    output          : string
                }

                // Style Build (auto-compile)
                style?: {
                    entry           : string
                    output          : string
                    minify?         : boolean
                    sourcemap?      : boolean | 'inline' | 'external' | 'none'
                }

                // Database
                database?: {
                    connection      : string
                    schema?         : string
                    name?           : string
                    timeout?        : number
                } | {
                    connection      : string
                    schema?         : string
                    name?           : string
                    timeout?        : number
                }[]

                // i18n
                i18n?: {
                    defaultLanguage     : string
                    supportedLanguages  : string[]
                    basePath            : string
                    fileExtension?      : string
                }

                // Static files
                static?: {
                    path            : string
                    directory       : string
                    maxAge?         : number
                    index?          : string[]
                } | {
                    path            : string
                    directory       : string
                    maxAge?         : number
                    index?          : string[]
                }[]

                // API routes
                api?: {
                    path            : string
                    directory       : string
                    autoLoad?       : boolean
                }

                // Security
                security?: {
                    cors?           : boolean | {
                    origin?         : string | string[]
                    credentials?    : boolean
                        maxAge?     : number
                    }
                    rateLimit?: boolean | {
                        windowMs?   : number
                        max?        : number
                    }
                }

                // User-defined routes
                routes?             : RouteDefinition[]

                // Middlewares
                middlewares?        : AppMiddleware[]

                // Plugins
                plugins?            : CruxPlugin[]

                // Debug
                debug?              : boolean
            }

            // Route Definition
            export interface RouteDefinition {
                method          : 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD'
                path            : string
                handler         : (c: AppContext) => any
                middlewares?    : AppMiddleware[]
            }

            // Life Cycle
            export interface LifecycleContext {
                config              : AppConfig
                databases           : Map<string, DB>
                plugins             : CruxPlugin[]
                server?             : any
                clientBuild?: {
                    success         : boolean
                    outputs         : string[]
                }
                uiBuild?: {
                    success         : boolean
                    output          : string
                } | null
                styleBuild?: {
                    success         : boolean
                    output          : string
                } | null
            }
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ### 2. Logger Utility

            Unified logging for CruxJS operations and plugins with debug mode support:

            ```typescript
            import { Logger } from '@cruxjs/base'

            // Initialize logger (second param: debug mode)
            const logger = new Logger(true)

            // Log lifecycle phases
            logger.phase('Database Setup')

            // General info logs (only shown in debug mode)
            logger.info('Loading configuration...')

            // Success logs (only shown in debug mode)
            logger.success('Server running on port 3000')

            // Error logs (always shown)
            logger.error('Failed to connect to database', err)

            // Plugin-specific logs
            logger.plugin('@cruxjs-plugins/auth', 'Initializing JWT strategy')
            ```

            **Output Example:**
            ```
            [CruxJS] ⚡ Phase: Database Setup
            [CruxJS] Loading configuration...
            [CruxJS] ✓ Server running on port 3000
            [CruxJS:@cruxjs-plugins/auth] Initializing JWT strategy
            [CruxJS] ✗ Failed to connect to database
            Error: Connection timeout
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ### 3. Plugin Registry

            Manage plugin registration and lifecycle hooks:

            ```typescript
            import { PluginRegistry, Logger } from '@cruxjs/base'
            import type { AppInstance, LifecycleContext } from '@cruxjs/base'

            const logger = new Logger(true)
            const registry = new PluginRegistry(logger)

            // Register a plugin
            const myPlugin = {
                name: '@cruxjs-plugins/auth',
                version: '1.0.0',
                routes: [{ method: 'POST', path: '/login', handler: (c) => c.json({}) }],
                async onRegister(app: AppInstance) {
                    console.log('Plugin registered!')
                }
            }

            await registry.register(myPlugin, appInstance)

            // Collect resources from all registered plugins
            const allRoutes = registry.collectRoutes()
            const allSchemas = registry.collectSchemas()
            const allMiddlewares = registry.collectMiddlewares()
            const allStatic = registry.collectStatic()

            // Call lifecycle hooks across all plugins
            await registry.callHook('onStart', lifecycleContext)
            await registry.callHook('onReady', lifecycleContext)
            ```

            **Registry Methods:**

            ```typescript
            // Register a plugin and call its onRegister hook
            register(plugin: CruxPlugin, app: AppInstance): Promise<void>

            // Get all registered plugins
            getAll(): CruxPlugin[]

            // Call a lifecycle hook on all plugins that have it
            callHook(hook: 'onAwake' | 'onStart' | 'onReady' | 'onShutdown', ctx: LifecycleContext): Promise<void>

            // Collect resources from all plugins
            collectRoutes(): RouteDefinition[]
            collectSchemas(): TableSchema[]
            collectMiddlewares(): Map<string, AppMiddleware>
            collectStatic(): StaticConfig[]
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ### 4. Resource Merger

            Intelligently merge routes, schemas, and static configs with user-defined resources taking priority:

            ```typescript
            import { ResourceMerger, Logger } from '@cruxjs/base'
            import type { RouteDefinition, TableSchema, StaticConfig } from '@cruxjs/base'

            const logger = new Logger(false)
            const merger = new ResourceMerger(logger)

            // User routes have priority over plugin routes
            const userRoutes: RouteDefinition[] = [
                { method: 'GET', path: '/api/users', handler: (c) => c.json([]) }
            ]
            const pluginRoutes: RouteDefinition[] = [
                { method: 'GET', path: '/api/users', handler: (c) => c.json({}) },
                { method: 'POST', path: '/api/users', handler: (c) => c.json({}) }
            ]

            const merged = merger.mergeRoutes(userRoutes, pluginRoutes)
            // Result: GET /api/users uses user handler, POST /api/users uses plugin handler

            // Same priority system for schemas
            const schemas = merger.mergeSchemas(userSchemas, pluginSchemas)

            // Static files are simply concatenated
            const statics = merger.mergeStatic(userStatic, pluginStatic)
            ```

            **Merge Behavior:**

            | Resource | Priority   | Behavior                                                |
            | -------- | ---------- | ------------------------------------------------------- |
            | Routes   | User first | Duplicate routes (method + path) override plugin routes |
            | Schemas  | User first | Duplicate schemas (by name) override plugin schemas     |
            | Static   | Both       | All configs are included (no deduplication)             |

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ### 5. Creating a Plugin

            Here's a complete example of creating a plugin using `@cruxjs/base`:

            ```typescript
            // plugins/auth/index.ts
            import type { CruxPlugin, AppInstance, LifecycleContext } from '@cruxjs/base'

            export function authPlugin(): CruxPlugin {
                return {
                    name: '@cruxjs-plugins/auth',
                    version: '1.0.0',

                    // Routes provided by this plugin
                    routes: [
                        {
                            method: 'POST',
                            path: '/api/auth/login',
                            handler: async (c) => {
                                const { email, password } = await c.req.json()
                                // Authentication logic
                                return c.json({ token: 'jwt-token' })
                            }
                        },
                        {
                            method: 'POST',
                            path: '/api/auth/logout',
                            handler: (c) => c.json({ success: true })
                        }
                    ],

                    // Database schemas
                    schemas: [
                        {
                            name: 'users',
                            columns: [
                                { name: 'id', type: 'INTEGER', primaryKey: true },
                                { name: 'email', type: 'TEXT', unique: true },
                                { name: 'password_hash', type: 'TEXT' }
                            ]
                        }
                    ],

                    // Middleware exports
                    middlewares: [
                        {
                            name: 'authRequired',
                            handler: async (c, next) => {
                                const token = c.req.header('Authorization')
                                if (!token) return c.json({ error: 'Unauthorized' }, 401)
                                await next()
                            }
                        }
                    ],

                    // Static files (e.g., docs)
                    static: [
                        { path: '/auth-docs', directory: './docs/auth' }
                    ],

                    // Lifecycle hooks
                    async onRegister(app: AppInstance) {
                        console.log('Auth plugin registered')
                    },

                    async onStart(ctx: LifecycleContext) {
                        console.log('Auth plugin started - creating tables...')
                        // Initialize database tables
                    },

                    async onReady(ctx: LifecycleContext) {
                        console.log('Auth plugin ready!')
                    }
                }
            }
            ```

            **Export from your plugin:**

            ```typescript
            // plugins/auth/package.json
            {
                "name": "@cruxjs-plugins/auth",
                "version": "1.0.0",
                "main": "./dist/index.js",
                "types": "./dist/index.d.ts",
                "exports": {
                    ".": {
                        "import": "./dist/index.js",
                        "types": "./dist/index.d.ts"
                    }
                }
            }
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

        - ### 6. Using Plugins in @cruxjs/app

            ```typescript
            import { createApp } from '@cruxjs/app'
            import { authPlugin } from '@cruxjs-plugins/auth'
            import { blogPlugin } from '@cruxjs-plugins/blog'

            const app = createApp({
                server: { port: 3000 },
                database: { connection: './app.db' },
                plugins: [
                    authPlugin(),
                    blogPlugin({ defaultLanguage: 'en' })
                ]
            })

            await app.start()
            ```

            All plugins are automatically:
            - ✅ Registered with their `onRegister` hooks called
            - ✅ Resources (routes, schemas, middlewares, static) merged intelligently
            - ✅ Lifecycle hooks called in correct sequence
            - ✅ Available in the app instance

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - ### Architecture

        **The Three-Layer CruxJS Architecture:**

        ```
        ┌───────────────────────────────────┐
        │     @cruxjs/app (Framework)       │
        │  - Creates HTTP server            │
        │  - Manages lifecycle              │
        │  - Orchestrates plugins           │
        └───────────────────────────────────┘
                         ↓
        ┌───────────────────────────────────┐
        │  @cruxjs-plugins/* (Logic Layer)  │
        │  - Business logic                 │
        │  - API routes & schemas           │
        │  - Independent plugins            │
        │  (Uses @cruxjs/base types only)   │
        └───────────────────────────────────┘
                         ↓
        ┌───────────────────────────────────┐
        │  @cruxjs-kit/* (UI Layer)         │
        │  - JSX components + @mineui style │
        │  - Client-side logic              │
        │  - No business logic              │
        └───────────────────────────────────┘
        ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - ### API Reference

        - #### Logger

            ```typescript
            class Logger {
                constructor(debug: boolean = false)

                phase(name: string): void
                info(msg: string): void
                success(msg: string): void
                error(msg: string, err?: Error): void
                plugin(name: string, msg: string): void
            }
            ```

        - #### PluginRegistry

            ```typescript
            class PluginRegistry {
                constructor(logger: Logger)

                register(plugin: CruxPlugin, app: AppInstance): Promise<void>
                getAll(): CruxPlugin[]
                callHook(hook: HookName, ctx: LifecycleContext): Promise<void>
                collectRoutes(): RouteDefinition[]
                collectSchemas(): TableSchema[]
                collectMiddlewares(): Map<string, AppMiddleware>
                collectStatic(): StaticConfig[]
            }
            ```

        - #### ResourceMerger

            ```typescript
            class ResourceMerger {
                constructor(logger: Logger)

                mergeRoutes(userRoutes?: RouteDefinition[], pluginRoutes?: RouteDefinition[]): RouteDefinition[]
                mergeSchemas(userSchemas?: TableSchema[], pluginSchemas?: TableSchema[]): TableSchema[]
                mergeStatic(userStatic?: StaticConfig[], pluginStatic?: StaticConfig[]): StaticConfig[]
            }
            ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - ### FAQ

        - #### Q: When should I use @cruxjs/base vs @cruxjs/app?

            - Use `@cruxjs/base` when:

                > Creating a plugin for the CruxJS ecosystem

                > You only need types and utilities, not the full framework

                > You want minimal dependencies in your plugin package

            - Use `@cruxjs/app` when:

              > Building a complete CruxJS application

              > You need to orchestrate plugins and start a server

        - #### Q: Can I use @cruxjs/base without @cruxjs/app?

            > Absolutely! `@cruxjs/base` is a standalone package with no dependency on `@cruxjs/app`. Plugins can use it independently.

        - #### Q: How does resource merging prioritize user-defined resources?

            > **Routes & Schemas**: User-defined resources override plugins. If both define the same route (method + path) or schema (by name), user wins.

            > **Static**: All configs are combined without deduplication.

        - #### Q: What if two plugins define the same route?

            > The first plugin to register wins. However, if the user defines the same route, the user's definition takes priority. Use the `debug` flag to see what's being merged.

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->

<!-- ╔══════════════════════════════ END ══════════════════════════════╗ -->

<br>

---

<div align="center">
    <a href="https://github.com/maysara-elshewehy"><img src="https://img.shields.io/badge/by-Maysara-black"/></a>
</div>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->