export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
    // Convert each byte to its hexadecimal representation and join them
    const hexString = Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
    // Prefix the result with '0x'
    return '0x' + hexString;
}