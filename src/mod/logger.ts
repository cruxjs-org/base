// src/mod/logger.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗


// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    export class Logger {
        constructor(private debug: boolean = false) {}

        phase(name: string) {
            if (!this.debug) return;
            console.log(`\n[CruxJS] ⚡ Phase: ${name}`);
        }

        info(msg: string) {
            if (!this.debug) return;
            console.log(`[CruxJS] ${msg}`);
        }

        success(msg: string) {
            if (!this.debug) return;
            console.log(`[CruxJS] ✓ ${msg}`);
        }

        error(msg: string, err?: Error) {
            console.error(`[CruxJS] ✗ ${msg}`);
            if (err) console.error(err);
        }

        plugin(name: string, msg: string) {
            if (!this.debug) return;
            console.log(`[CruxJS:${name}] ${msg}`);
        }
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝