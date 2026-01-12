// src/mod/plugin_registry.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as types from '../types';
    import { Logger } from '@minejs/logger';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    export class PluginRegistry {
        private plugins: types.CruxPlugin[] = [];
        private logger: Logger;

        constructor(logger: Logger) {
            this.logger = logger;
        }

        async register(plugin: types.CruxPlugin, app: types.AppInstance) {
            this.logger.info(`Registering plugin: ${plugin.name}`);

            this.plugins.push(plugin);

            // Call plugin's onRegister hook
            if (plugin.onRegister) {
                await plugin.onRegister(app);
            }

            this.logger.debug(`Plugin registered: ${plugin.name} v${plugin.version}`);
        }

        getAll(): types.CruxPlugin[] {
            return this.plugins;
        }

        async callHook(
            hook: keyof Pick<types.CruxPlugin, 'onAwake' | 'onStart' | 'onReady' | 'onShutdown'>,
            ctx: types.LifecycleContext
        ) {
            for (const plugin of this.plugins) {
                if (plugin[hook]) {
                    this.logger.debug(plugin.name, `Calling ${hook}`);
                    await plugin[hook]!(ctx);
                }
            }
        }

        collectRoutes(): types.RouteDefinition[] {
            const routes: types.RouteDefinition[] = [];

            for (const plugin of this.plugins) {
                if (plugin.routes) {
                    routes.push(...plugin.routes);
                    this.logger.debug(plugin.name, `Provided ${plugin.routes.length} routes`);
                }
            }

            return routes;
        }

        collectSchemas(): types.TableSchema[] {
            const schemas: types.TableSchema[] = [];

            for (const plugin of this.plugins) {
                if (plugin.schemas) {
                    schemas.push(...plugin.schemas);
                    this.logger.debug(plugin.name, `Provided ${plugin.schemas.length} schemas`);
                }
            }

            return schemas;
        }

        collectMiddlewares(): Map<string, types.AppMiddleware> {
            const middlewares = new Map<string, types.AppMiddleware>();

            for (const plugin of this.plugins) {
            if (plugin.middlewares) {
                for (const mw of plugin.middlewares) {
                    middlewares.set(`${plugin.name}:${mw.name}`, mw.handler);
                    this.logger.debug(plugin.name, `Provided middleware: ${mw.name}`);
                }
            }
            }

            return middlewares;
        }

        collectStatic(): types.StaticConfig[] {
            const statics: types.StaticConfig[] = [];

            for (const plugin of this.plugins) {
                if (plugin.static) {
                    statics.push(...plugin.static);
                    this.logger.debug(plugin.name, `Provided ${plugin.static.length} static configs`);
                }
            }

            return statics;
        }
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝