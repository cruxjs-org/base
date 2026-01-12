// src/mod/resource_merger.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { RouteDefinition, TableSchema, StaticConfig } from '../types';
    import { logger } from './logger';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    export class ResourceMerger {

        constructor() {
        }

        mergeRoutes(
            userRoutes: RouteDefinition[] = [],
            pluginRoutes: RouteDefinition[] = []
        ): RouteDefinition[] {
            // User routes have priority
            const merged = [...userRoutes];
            const userPaths = new Set(userRoutes.map(r => `${r.method}:${r.path}`));

            for (const route of pluginRoutes) {
                const key = `${route.method}:${route.path}`;

                if (!userPaths.has(key)) {
                    merged.push(route);
                } else {
                    logger.debug(`Skipping plugin route ${key} (overridden by user)`);
                }
            }

            return merged;
        }

        mergeSchemas(
            userSchemas: TableSchema[] = [],
            pluginSchemas: TableSchema[] = []
        ): TableSchema[] {
            // User schemas have priority
            const merged = [...userSchemas];
            const userTables = new Set(userSchemas.map(s => s.name));

            for (const schema of pluginSchemas) {
                if (!userTables.has(schema.name)) {
                    merged.push(schema);
                } else {
                    logger.debug(`Skipping plugin schema ${schema.name} (overridden by user)`);
                }
            }

            return merged;
        }

        mergeStatic(
            userStatic: StaticConfig[] = [],
            pluginStatic: StaticConfig[] = []
        ): StaticConfig[] {
            return [...userStatic, ...pluginStatic];
        }
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝