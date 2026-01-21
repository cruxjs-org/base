/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { DB, type TableSchema as __TableSchema } from '@minejs/db';
    import {     type AppContext  as __AppContext  } from '@minejs/server';

    import { I18nConfig } from '@minejs/i18n';
    import { JSXElement } from '@minejs/jsx';

    export type AppContext  = __AppContext;
    export type TableSchema = __TableSchema;

// ╚══════════════════════════════════════════════════════════════════════════════════════╝




// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    // ─────────────────────────────────────────────────────────────
    // Plugin Types
    // ─────────────────────────────────────────────────────────────

    export interface CruxPlugin {
        // Metadata
        name                : string
        version             : string

        // Resources provided by plugin
        routes?             : RouteDefinition[]
        schemas?            : __TableSchema[]
        middlewares?        : MiddlewareExport[]
        static?             : StaticConfig[]

        // Lifecycle hooks
        onRegister?         : (app: AppInstance) => void | Promise<void>
        onAwake?            : (ctx: LifecycleContext) => void | Promise<void>
        onStart?            : (ctx: LifecycleContext) => void | Promise<void>
        onReady?            : (ctx: LifecycleContext) => void | Promise<void>
        onShutdown?         : (ctx: LifecycleContext) => void | Promise<void>
    }

    export interface MiddlewareExport {
        name                : string
        handler             : AppMiddleware
    }

    export type AppMiddleware = (
        c                   : __AppContext,
        next                : () => void | Promise<void>
    ) => any;

    // ─────────────────────────────────────────────────────────────
    // App Configuration Types
    // ─────────────────────────────────────────────────────────────

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

    export interface RouteDefinition {
        method              : 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD')[]
        path                : string
        handler             : (c: __AppContext) => any
        middlewares?        : AppMiddleware[]
    }

    export interface StaticConfig {
        path                : string
        directory           : string
        maxAge?             : number
        index?              : string[]
    }

    // ─────────────────────────────────────────────────────────────
    // Lifecycle Types
    // ─────────────────────────────────────────────────────────────

    export interface LifecycleContext {
        config              : AppConfig
        databases           : Map<string, DB>
        plugins             : CruxPlugin[]
        server?             : any
        clientBuild?: {
            success         : boolean
            outputs         : string[]
        }
        styleBuild?: {
            success         : boolean
            output          : string
        } | null
    }

    export interface LifecycleHooks {
        onConfig?           : (config: AppConfig)     => AppConfig | Promise<AppConfig>
        onAwake?            : (ctx: LifecycleContext) => void      | Promise<void>
        onStart?            : (ctx: LifecycleContext) => void      | Promise<void>
        onReady?            : (ctx: LifecycleContext) => void      | Promise<void>
        onFinish?           : (ctx: LifecycleContext) => void      | Promise<void>
        onError?            : (ctx: LifecycleContext, phase: string, error: Error) => void | Promise<void>
    }

    // ─────────────────────────────────────────────────────────────
    // App Instance Type
    // ─────────────────────────────────────────────────────────────

    export interface AppInstance {
        config              : AppConfig
        server              : any
        databases           : Map<string, DB>
        plugins             : CruxPlugin[]
        middlewares         : Map<string, AppMiddleware>

        start()                     : Promise<void>
        stop()                      : Promise<void>
        restart()                   : Promise<void>
        getContext()                : LifecycleContext
        getMiddleware(name: string) : AppMiddleware | undefined
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    export type RouteComponent = () => JSXElement | null;

    // Theme configuration
    export interface ThemeConfig {
        default             : string;        // Default theme name
        available           : string[];      // Array of available theme names
    }

    // Language configuration
    export type LangConfig  = I18nConfig;

    /**
     * Client-side extension system
     * Extensions can hook into lifecycle phases to extend functionality
     * (logging, analytics, error handling, etc.)
     */
    export interface ClientExtension {
        name                : string;
        config?             : Record<string, unknown>;
        onBoot?             : (context: ExtensionContext) => void | Promise<void>;
        onReady?            : (context: ExtensionContext) => void | Promise<void>;
        onDestroy?          : (context: ExtensionContext) => void | Promise<void>;
    }

    /**
     * Context passed to extension lifecycle hooks
     */
    export interface ExtensionContext {
        debug               : boolean;
        config              : Record<string, unknown>;
        cconfig             : ClientManagerConfig;
    }

    /**
     * Lifecycle hooks for the client application
     */
    export interface ClientManagerHooks {
        onBoot?             : () => void | Promise<void>;
        onReady?            : () => void | Promise<void>;
        onDestroy?          : () => void | Promise<void>;
    }

    /**
     * Client Manager Configuration
     * Declarative configuration pattern mirroring @cruxjs/app AppConfig
     */
    export interface ClientManagerConfig {
        // User-provided route components (REQUIRED)
        routes              : Record<string, RouteComponent>;

        // Optional fallback for 404 (if not in routes, must provide here)
        notFoundComponent?  : RouteComponent;

        // Root layout - App wraps all pages
        // App creates the structure: loader, modal, and page slot
        rootLayout?         : () => JSXElement | null;
        // Debug mode
        debug?              : boolean;

        // Lifecycle hooks - called at specific phases
        lifecycle?          : ClientManagerHooks;

        // Client-side extensions for extending functionality
        extensions?         : ClientExtension[];

        // List of allowed query parameters (string or regex)
        allowedQueryParams?: (string | RegExp)[];

        // i18n configuration (AUTO-INJECTED)
        i18n?               : I18nConfig;

        // Theme configuration
        theme?              : ThemeConfig;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝