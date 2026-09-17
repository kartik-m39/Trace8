import { INSTRUCTION_TABLE } from "../hardware/isa.js";

let tokenised_Code = [
    [
      { type: 'MNEMONIC', value: 'MOV', row: 1, col: 4 },
      { type: 'REGISTER', value: 'A', row: 1, col: 5 },
      { type: 'COMMA', value: null, row: 1, col: 5 },
      { type: 'NUMBER', value: 5, row: 1, col: 6 }
    ],
    [ { type: 'LABEL_DEF', value: 'LOOP', row: 2, col: 5 } ],
    [
      { type: 'MNEMONIC', value: 'DEC', row: 3, col: 4 },
      { type: 'REGISTER', value: 'A', row: 3, col: 5 }
    ],
    [
      { type: 'MNEMONIC', value: 'JNZ', row: 4, col: 4 },
      { type: 'IDENTIFIER', value: 'LOOP', row: 4, col: 8 }
    ],
    [ { type: 'MNEMONIC', value: 'HLT', row: 5, col: 4 } ]
  ]

function parse(tokenised_Code){

    let parsed_Code = {
        instruction_Set: [],
        symbol_Table: {}
    };

    first_pass(parsed_Code, tokenised_Code);
    second_pass(parsed_Code);

    console.log(parsed_Code);
}

function second_pass(parsed_Code){

    parsed_Code.instruction_Set.forEach(instruction => {
        instruction.operands.forEach(operand => {

            if(operand.kind === 'addr'){
                operand.value = parsed_Code.symbol_Table[operand.value];
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
            return;
        }
        
        let instruction = {
            mnemonic: '',
            operands: [],
            address: 0,
            row: 0
        }

        let isa_lookup_val = '';

        elements.forEach(token => {
            isa_lookup_val += instruction_Flush(token, instruction);
        });

        // Give each instruction its required space and then increment in memory
        const instructionInfo = INSTRUCTION_TABLE[isa_lookup_val];
        instruction.address = currentAddress;
        currentAddress += instructionInfo.bytes;


        instruction.row = elements[0].row;

        parsed_Code.instruction_Set.push(instruction);
    });
}

function instruction_Flush(token, instruction){
    let isa_lookup_val = '';

    if(token.type === 'MNEMONIC'){
        
        // Exceptional case for halt
        if(token.value === 'HLT'){
            instruction.mnemonic = token.value;
            isa_lookup_val += token.value ;
            return isa_lookup_val;
        }

        instruction.mnemonic = token.value;
        isa_lookup_val += token.value + ' ';
    }

    if(token.type === 'REGISTER'){
        let operand = {
            kind: 'reg',
            value: token.value
        }
        instruction.operands.push(operand);
        isa_lookup_val += token.value;
    }

    if(token.type === 'COMMA'){
        isa_lookup_val += ', ';
    }

    if(token.type === 'NUMBER'){

        let operand = {
            kind: 'imm',
            value: token.value
        }
        instruction.operands.push(operand);
        isa_lookup_val += 'imm';
    }

    if(token.type === 'IDENTIFIER'){
        let operand = {
            kind: 'addr',
            value: token.value
        }
        instruction.operands.push(operand);
        isa_lookup_val += 'addr';
    }
    return isa_lookup_val;
}

parse(tokenised_Code);