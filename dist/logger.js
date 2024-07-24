"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.GREEN = exports.RESET = exports.RED = void 0;
exports.RED = '\x1b[31m'; // ANSI escape code for red
exports.RESET = '\x1b[0m'; // ANSI escape code to reset color
exports.GREEN = '\x1b[32m';
exports.logger = {
    debug: (...args) => { }, // Empty function, no output
    info: (...args) => console.log(exports.GREEN, "INFO:", ...args, exports.RESET),
    warn: (...args) => { }, // Empty function, no output
    error: (...args) => console.log(exports.RED, "ERROR:", ...args, exports.RESET),
    trace: (...args) => { }, // Empty function, no output
    child: (opts) => {
        // Extend or modify the current LOGGER configuration based on opts
        const childLogger = Object.assign(Object.assign({}, exports.logger), { error: (...args) => console.log(exports.RED, "ERROR:", opts, ...args, exports.RESET) // Only errors are logged in red
         });
        return childLogger;
    }
};
