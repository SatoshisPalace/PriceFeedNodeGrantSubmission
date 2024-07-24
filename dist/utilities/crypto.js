"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToHexString = void 0;
function uint8ArrayToHexString(uint8Array) {
    // Convert each byte to its hexadecimal representation and join them
    const hexString = Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
    // Prefix the result with '0x'
    return '0x' + hexString;
}
exports.uint8ArrayToHexString = uint8ArrayToHexString;
