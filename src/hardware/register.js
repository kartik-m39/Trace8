// Store CPU's current State, resetting and reading mechanism


// SP starts at the top of memory and grows downward, which is the
// usual convention: PUSH decrements SP first, then writes; POP reads,
// then increments SP. 0xFF is the last valid address in a 256-byte RAM.
const INITIAL_SP = 0xFF;

export function createRegisters(){
    return {
        A: 0x00,    
        B: 0x00,
        PC: 0x00,
        SP: INITIAL_SP,
        flags: {
            Z: 0,   // Zero flag
            C: 0,   // Carry flag
        }
    };
}

export function resetRegisters(registers) {
    registers.A = 0x00;
    registers.B = 0x00;
    registers.PC = 0x00;
    registers.SP = INITIAL_SP;
    registers.flags.Z = 0;
    registers.flags.C = 0;
    return registers;
}