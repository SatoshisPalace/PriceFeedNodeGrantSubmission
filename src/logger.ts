export const RED = '\x1b[31m'; // ANSI escape code for red
export const RESET = '\x1b[0m'; // ANSI escape code to reset color
export const GREEN = '\x1b[32m'


export var logger = {
    debug: (...args: any[]) => { }, // Empty function, no output
    info: (...args: any[]) => console.log(GREEN, "INFO:", ...args, RESET),
    warn: (...args: any[]) => { }, // Empty function, no output
    error: (...args: any[]) => console.log(RED, "ERROR:", ...args, RESET),
    trace: (...args: any[]) => { }, // Empty function, no output
    child: (opts: { [key: string]: any }) => {
        // Extend or modify the current LOGGER configuration based on opts
        const childLogger = {
            ...logger,
            error: (...args: any[]) => console.log(RED, "ERROR:", opts, ...args, RESET) // Only errors are logged in red
        };
        return childLogger;
    }
};
