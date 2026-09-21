import { INSTRUCTION_TABLE } from "../hardware/isa.js";
import { createMemory } from "../hardware/memory.js";

export function compile(parsed_Code){
    const memory = createMemory();

    parsed_Code.instruction_Set.forEach(instruction => {
        
        const loopkup_Val = instruction.isaKey;
        const instructionInfo = INSTRUCTION_TABLE[loopkup_Val];

        if(!loopkup_Val){
            throw new Error("Unknown instruction");
        }

        const slot = instruction.address;

        memory[slot] = instructionInfo.opcode;

        let byteOffSet = 1;
        instruction.operands.forEach(operand => {
            if(operand.kind !== 'reg'){
                memory[slot + byteOffSet] = operand.value;
                byteOffSet++;
            }
        })

    });
    
    return memory;
}