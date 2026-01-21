import { TableSchema as TableSchema$1, DB } from '@minejs/db';
import { AppContext as AppContext$1 } from '@minejs/server';
import { I18nConfig } from '@minejs/i18n';
import { JSXElement } from '@minejs/jsx';
import { Logger } from '@minejs/logger';

type AppContext = AppContext$1;
type TableSchema = TableSchema$1;
interface CruxPlugin {
    name: string;
    version: string;
    routes?: RouteDefinition[];
    schemas?: TableSchema$1[];
    middlewares?: MiddlewareExport[];
    static?: StaticConfig[];
    onRegister?: (app: AppInstance) => void | Promise<void>;
    onAwake?: (ctx: LifecycleContext) => void | Promise<void>;
    onStart?: (ctx: LifecycleContext) => void | Promise<void>;
    onReady?: (ctx: LifecycleContext) => void | Promise<void>;
    onShutdown?: (ctx: LifecycleContext) => void | Promise<void>;
}
interface MiddlewareExport {
    name: string;
    handler: AppMiddleware;
}
type AppMiddleware = (c: AppContext$1, next: () => void | Promise<void>) => any;
interface AppConfig {
    server?: {
        port?: number;
        host?: string;
        logging?: boolean | {
            level?: 'debug' | 'info' | 'warn' | 'error';
            pretty?: boolean;
        };
    };
    client?: {
        entry: string;
        output: string;
        minify?: boolean;
        sourcemap?: boolean;
        target?: 'browser' | 'bun';
        external?: string[];
    };
    style?: {
        entry: string;
        output: string;
        minify?: boolean;
        sourcemap?: boolean | 'inline' | 'external' | 'none';
    };
    database?: {
        connection: string;
        schema?: string;
        name?: string;
        timeout?: number;
    } | {
        connection: string;
        schema?: string;
        name?: string;
        timeout?: number;
    }[];
    i18n?: {
        defaultLanguage: string;
        supportedLanguages: string[];
        basePath: string;
        fileExtension?: string;
    };
    static?: {
        path: string;
        directory: string;
        maxAge?: number;
        index?: string[];
    } | {
        path: string;
        directory: string;
        maxAge?: number;
        index?: string[];
    }[];
    api?: {
        path: string;
        directory: string;
        autoLoad?: boolean;
    };
    security?: {
        cors?: boolean | {
            origin?: string | string[];
            credentials?: boolean;
            maxAge?: number;
        };
        rateLimit?: boolean | {
            windowMs?: number;
            max?: number;
        };
    };
    routes?: RouteDefinition[];
    middlewares?: AppMiddleware[];
    plugins?: CruxPlugin[];
    debug?: boolean;
}
interface RouteDefinition {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD')[];
    path: string;
    handler: (c: AppContext$1) => any;
    middlewares?: AppMiddleware[];
}
interface StaticConfig {
    path: string;
    directory: string;
    maxAge?: number;
    index?: string[];
}
interface LifecycleContext {
    config: AppConfig;
    databases: Map<string, DB>;
    plugins: CruxPlugin[];
    server?: any;
    clientBuild?: {
        success: boolean;
        outputs: string[];
    };
    styleBuild?: {
        success: boolean;
        output: string;
    } | null;
}
interface LifecycleHooks {
    onConfig?: (config: AppConfig) => AppConfig | Promise<AppConfig>;
    onAwake?: (ctx: LifecycleContext) => void | Promise<void>;
    onStart?: (ctx: LifecycleContext) => void | Promise<void>;
    onReady?: (ctx: LifecycleContext) => void | Promise<void>;
    onFinish?: (ctx: LifecycleContext) => void | Promise<void>;
    onError?: (ctx: LifecycleContext, phase: string, error: Error) => void | Promise<void>;
}
interface AppInstance {
    config: AppConfig;
    server: any;
    databases: Map<string, DB>;
    plugins: CruxPlugin[];
    middlewares: Map<string, AppMiddleware>;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    getContext(): LifecycleContext;
    getMiddleware(name: string): AppMiddleware | undefined;
}
type RouteComponent = () => JSXElement | null;
interface ThemeConfig {
    default: string;
    available: string[];
}
type LangConfig = I18nConfig;
/**
 * Client-side extension system
 * Extensions can hook into lifecycle phases to extend functionality
 * (logging, analytics, error handling, etc.)
 */
interface ClientExtension {
    name: string;
    config?: Record<string, unknown>;
    onBoot?: (context: ExtensionContext) => void | Promise<void>;
    onReady?: (context: ExtensionContext) => void | Promise<void>;
    onDestroy?: (context: ExtensionContext) => void | Promise<void>;
}
/**
 * Context passed to extension lifecycle hooks
 */
interface ExtensionContext {
    debug: boolean;
    config: Record<string, unknown>;
    cconfig: ClientManagerConfig;
}
/**
 * Lifecycle hooks for the client application
 */
interface ClientManagerHooks {
    onBoot?: () => void | Promise<void>;
    onReady?: () => void | Promise<void>;
    onDestroy?: () => void | Promise<void>;
}
/**
 * Client Manager Configuration
 * Declarative configuration pattern mirroring @cruxjs/app AppConfig
 */
interface ClientManagerConfig {
    routes: Record<string, RouteComponent>;
    notFoundComponent?: RouteComponent;
    rootLayout?: () => JSXElement | null;
    debug?: boolean;
    lifecycle?: ClientManagerHooks;
    extensions?: ClientExtension[];
    allowedQueryParams?: (string | RegExp)[];
    i18n?: I18nConfig;
    theme?: ThemeConfig;
}

declare const logger: Logger;

declare class ResourceMerger {
    private logger;
    constructor(logger: Logger);
    mergeRoutes(userRoutes?: RouteDefinition[], pluginRoutes?: RouteDefinition[]): RouteDefinition[];
    mergeSchemas(userSchemas?: TableSchema[], pluginSchemas?: TableSchema[]): TableSchema[];
    mergeStatic(userStatic?: StaticConfig[], pluginStatic?: StaticConfig[]): StaticConfig[];
}

declare class PluginRegistry {
    private plugins;
    private logger;
    constructor(logger: Logger);
    register(plugin: CruxPlugin, app: AppInstance): Promise<void>;
    getAll(): CruxPlugin[];
    callHook(hook: keyof Pick<CruxPlugin, 'onAwake' | 'onStart' | 'onReady' | 'onShutdown'>, ctx: LifecycleContext): Promise<void>;
    collectRoutes(): RouteDefinition[];
    collectSchemas(): TableSchema[];
    collectMiddlewares(): Map<string, AppMiddleware>;
    collectStatic(): StaticConfig[];
}

export { type AppConfig, type AppContext, type AppInstance, type AppMiddleware, type ClientExtension, type ClientManagerConfig, type ClientManagerHooks, type CruxPlugin, type ExtensionContext, type LangConfig, type LifecycleContext, type LifecycleHooks, type MiddlewareExport, PluginRegistry, ResourceMerger, type RouteComponent, type RouteDefinition, type StaticConfig, type TableSchema, type ThemeConfig, logger };
