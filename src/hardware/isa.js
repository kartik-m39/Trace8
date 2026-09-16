export const OPCODES = {

    NOP: 0x00,

    // Data Movement
    MOV_A_IMM: 0x01,
    MOV_B_IMM: 0x02,
    MOV_A_B: 0x03,
    MOV_B_A: 0x04,


    // Memory Access
    LDA: 0x05, 
    STA: 0x06, 
    LDB: 0x07, 
    STB: 0x08, 


    // ALU
    ADD_A_B: 0x10,
    ADD_A_IMM: 0x11,
    SUB_A_B: 0x12,
    SUB_A_IMM: 0x13,
    INC_A: 0x14, 
    DEC_A: 0x15,
    AND_A_B: 0x16,
    OR_A_B: 0x17,
    XOR_A_B: 0x18, 
    CMP_A_B: 0x19,


    //Control Flow
    JP: 0x20,
    JZ: 0x21,
    JNZ: 0x22,
    JC: 0x23,
    JNC: 0x24,

    // Stack Operations
    CALL: 0x25,
    RET:  0x26,
    PUSH_A: 0x30,
    POP_A: 0x31,

    //Halt Execution
    HLT: 0xFF
}


export const INSTRUCTION_TABLE = {
    
    'NOP': { opcode: OPCODES.NOP, bytes: 1 },
 
    // Data Movement
    'MOV A, imm': { opcode: OPCODES.MOV_A_IMM, bytes: 2 },
    'MOV B, imm': { opcode: OPCODES.MOV_B_IMM, bytes: 2 },
    'MOV A, B': { opcode: OPCODES.MOV_A_B, bytes: 1 },
    'MOV B, A': { opcode: OPCODES.MOV_B_A, bytes: 1 },
 
    // Memory Access
    'LDA addr': { opcode: OPCODES.LDA, bytes: 2 },
    'STA addr': { opcode: OPCODES.STA, bytes: 2 },
    'LDB addr': { opcode: OPCODES.LDB, bytes: 2 },
    'STB addr': { opcode: OPCODES.STB, bytes: 2 },
 
    // ALU
    'ADD A, B': { opcode: OPCODES.ADD_A_B, bytes: 1 },
    'ADD A, imm': { opcode: OPCODES.ADD_A_IMM, bytes: 2 },
    'SUB A, B': { opcode: OPCODES.SUB_A_B, bytes: 1 },
    'SUB A, imm': { opcode: OPCODES.SUB_A_IMM, bytes: 2 },
    'INC A': { opcode: OPCODES.INC_A, bytes: 1 },
    'DEC A': { opcode: OPCODES.DEC_A, bytes: 1 },
    'AND A, B': { opcode: OPCODES.AND_A_B, bytes: 1 },
    'OR A, B': { opcode: OPCODES.OR_A_B, bytes: 1 },
    'XOR A, B': { opcode: OPCODES.XOR_A_B, bytes: 1 },
    'CMP A, B': { opcode: OPCODES.CMP_A_B, bytes: 1 },
    // Control Flow
    'JP addr': { opcode: OPCODES.JP, bytes: 2 },
    'JZ addr': { opcode: OPCODES.JZ, bytes: 2 },
    'JNZ addr': { opcode: OPCODES.JNZ, bytes: 2 },
    'JC addr': { opcode: OPCODES.JC, bytes: 2 },
    'JNC addr': { opcode: OPCODES.JNC, bytes: 2 },
 
    // Stack / Subroutines
    'CALL addr': { opcode: OPCODES.CALL, bytes: 2 },
    'RET': { opcode: OPCODES.RET, bytes: 1 },
    'PUSH A': { opcode: OPCODES.PUSH_A, bytes: 1 },
    'POP A': { opcode: OPCODES.POP_A, bytes: 1 },
 
    'HLT': { opcode: OPCODES.HLT, bytes: 1 }
};