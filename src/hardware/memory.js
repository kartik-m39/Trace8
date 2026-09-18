// RAM: 256 sized array (8-bit architecture) 
// all slots are zero-initialized, addresses 0x00–0xFF

export function createMemory() {
    return new Uint8Array(256); 
}