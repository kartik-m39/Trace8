// Fetch -> decode -> execute until HLT is hit -> advance PC

// return False => execution of instruction not halted
// return true => execution halted

import { INSTRUCTION_MAP } from "./isa.js"



// calls step() again and again until HLT or PC runs off the end of memory.
// onStep is a hook for UI updates
export function run(memory, registers){
    let halted = false;

    while(!halted && registers.PC < memory.length){
        halted = step(memory, registers);

        // if(onStep) onStep(registers, halted);
    }
}

export function step(memory, registers){

    if (registers.PC >= memory.length) {
        throw new Error(`PC (${registers.PC}) ran off the end of memory — no HLT executed`);
    }

    const opcode = memory[registers.PC]
    const info = INSTRUCTION_MAP[opcode];

    if (!info) {
        throw new Error(`Unknown opcode 0x${opcode.toString(16).toUpperCase()} at PC=${registers.PC}`);
    }

    if(info.shape === 'HLT'){
        return true;
    }

    // 2 bytes instruction have operand after opcode, so access the next memory slot too
    const operand = info.bytes > 1 ? memory[registers.PC + 1] : undefined;


    const jumped = execute(info.shape, info.bytes, operand, registers, memory);

    if(!jumped){
        registers.PC += info.bytes;
    }

    return false; 
}

function execute(shape, bytes, operand, registers, memory){

    if(operand === undefined) operand = 0;

    switch(shape) {

        case 'NOP':
            return false;

        
        // Data Movement
        case 'MOV A, imm':
            registers.A = operand;
            return false;
        
        case 'MOV B, imm':
            registers.B = operand;
            return false;
        
        case 'MOV A, B':
            registers.A = registers.B;
            return false;

        case 'MOV B, A':
            registers.B = registers.A;
            return false;

        
        // Memory Access
        case 'LDA addr':
            registers.A = memory[operand];
            return false;
        
        case 'STA addr':
            memory[operand] = registers.A;
            return false;
        
        case 'LDB addr':
            registers.B = memory[operand];
            return false;
        
        case 'STB addr':
            memory[operand] = registers.B;
            return false;


        // ALU
        case 'ADD A, B': {
            const result = registers.A + registers.B;
            registers.A = result & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            registers.flags.C = (result > 0xFF) ? 1 : 0;
            return false;
        }
        
        case 'ADD A, imm':{
            const result = registers.A + operand;
            registers.A = result & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            registers.flags.C = (result > 0xFF) ? 1 : 0;
            return false;
        }
        
        case 'SUB A, B':{
            const result = registers.A - registers.B;
            registers.A = result & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            registers.flags.C = (result < 0) ? 1 : 0; 
            return false;
        }
        
        case 'SUB A, imm':{
            const result = registers.A - operand;
            registers.A = result & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            registers.flags.C = (result < 0) ? 1 : 0; 
            return false;
        }
        
        case 'INC A':{
            let result = registers.A + 1;
            registers.A = result & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            registers.flags.C = (result > 0xFF) ? 1 : 0; // overflow
            return false;
        }
            
        
        case 'DEC A':{
            const result = registers.A - 1;
            registers.A = result & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0; 
            registers.flags.C = (result < 0) ? 1 : 0; // check underflow
            return false;
        }
        
        case 'AND A, B':{
            registers.A = (registers.A & registers.B) & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            return false;
        }
        
        case 'OR A, B':{
            registers.A = (registers.A | registers.B) & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            return false;
        }
        
        case 'XOR A, B':{
            registers.A = (registers.A ^ registers.B) & 0xFF;
            registers.flags.Z = (registers.A === 0) ? 1 : 0;
            return false;
        }
        
        case 'CMP A, B':{
            let result = registers.A - registers.B;
            registers.flags.Z = ((result & 0xFF) === 0) ? 1 : 0;
            registers.flags.C = (result < 0) ? 1 : 0;
            return false;
        }

        
        // Control Flow
        case 'JP addr':
            registers.PC = operand;
            return true;
        
        case 'JZ addr':
            if(registers.flags.Z){
                registers.PC = operand;
                return true;
            } 
            return false;

        case 'JNZ addr':
            if(!registers.flags.Z){     
                registers.PC = operand;
                return true;
             }
            return false;
        
        case 'JC addr':
            if(registers.flags.C){
                registers.PC = operand;
                return true;
            }
            return false;

        case 'JNC addr':
            if(!registers.flags.C){
                registers.PC = operand;
                return true;
            }
            return false;
        
        
        // Stack
        case 'CALL addr': {
            const returnAddress = registers.PC + bytes;
            registers.SP--;
            memory[registers.SP] = returnAddress;
            registers.PC = operand;
            return true;
        }
    
        case 'RET': {
            registers.PC = memory[registers.SP];
            registers.SP++;
            return true;
        }
        
        case 'PUSH A':
            registers.SP--;
            memory[registers.SP] = registers.A;
            return false;
        
        case 'POP A':
            registers.A = memory[registers.SP];
            registers.SP++;
            return false;  
        
        case 'HLT':
            return true;
    }
}

