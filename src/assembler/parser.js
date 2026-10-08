import { INSTRUCTION_TABLE } from "../hardware/isa.js";

const ADDR_MNEMONICS = new Set([
    'LDA', 'STA', 'LDB', 'STB',
    'JP', 'JZ', 'JNZ', 'JC', 'JNC',
    'CALL'
]);

export function parse(tokenised_Code){

    let parsed_Code = {
        instruction_Set: [],
        symbol_Table: {}
    };

    first_pass(parsed_Code, tokenised_Code);
    second_pass(parsed_Code);

   
    return parsed_Code;
}

function second_pass(parsed_Code){

    parsed_Code.instruction_Set.forEach(instruction => {
        instruction.operands.forEach(operand => {

            if (operand.kind === 'addr' && typeof operand.value === 'string') {
                const resolved = parsed_Code.symbol_Table[operand.value];
                if (resolved === undefined) {
                    throw new Error(`Unknown label "${operand.value}"`);
                }
                operand.value = resolved;
            }
        })
    })
}

function first_pass(parsed_Code, tokenised_Code){
    let currentAddress = 0x00;

    tokenised_Code.forEach(elements => {

        // label doesn't occupy any memory so
        if(elements[0].type === 'LABEL_DEF'){
            parsed_Code.symbol_Table[elements[0].value] = currentAddress;
            if (elements.length === 1) return;
            elements = elements.slice(1);
        }
        
        let instruction = {
            mnemonic: '',
            operands: [],
            isaKey: '',
            address: 0,
            row: 0
        }

        let isa_lookup_val = '';

        elements.forEach(token => {
            isa_lookup_val += instruction_Flush(token, instruction);
        });

        // Give each instruction its required space and then increment in memory
        const instructionInfo = INSTRUCTION_TABLE[isa_lookup_val];

        if (!instructionInfo) {
            throw new Error(`Unknown instruction "${isa_lookup_val}" on line ${elements[0].row}`);
        }

        instruction.address = currentAddress;
        currentAddress += instructionInfo.bytes;

        instruction.isaKey += isa_lookup_val;
        instruction.row = elements[0].row;

        parsed_Code.instruction_Set.push(instruction);
    });
}

function instruction_Flush(token, instruction){
    let isa_lookup_val = '';

    if (token.type === 'MNEMONIC') {
        instruction.mnemonic = token.value;
        isa_lookup_val += token.value;
    }

    if (token.type === 'REGISTER') {
        instruction.operands.push({ kind: 'reg', value: token.value });
        isa_lookup_val += ' ' + token.value;
    }

    if (token.type === 'COMMA') {
        isa_lookup_val += ',';
    }

    if (token.type === 'NUMBER') {
        const isAddr = ADDR_MNEMONICS.has(instruction.mnemonic);
        instruction.operands.push({
            kind: isAddr ? 'addr' : 'imm',
            value: token.value
        });
        isa_lookup_val += ' ' + (isAddr ? 'addr' : 'imm');
    }

    if (token.type === 'IDENTIFIER') {
        instruction.operands.push({ kind: 'addr', value: token.value });
        isa_lookup_val += ' addr';
    }

    return isa_lookup_val;
}
