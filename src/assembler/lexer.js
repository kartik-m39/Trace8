
// const TOKEN_TYPE = {
//     MNEMONIC: 'MNEMONIC',
//     REGISTER: 'REGISTER',
//     NUMBER: 'NUMBER',
//     COMMA: 'COMMA',
//     LABEL_DEF: 'LABEL_DEF',
//     IDENTIFIER: 'IDENTIFIER',
//     NEWLINE: 'NEWLINE',
//     EOF: 'EOF'
// }

const MNEMONICS = ['NOP','MOV', 'LDA', 'STA', 'LDB', 'STB','ADD', 'SUB', 'INC', 'DEC', 'AND', 'OR', 'XOR', 'CMP','JP', 'JZ','JNZ', 'JC', 'JNC','CALL', 'RET', 'PUSH', 'POP','HLT']

const REGISTERS = ['A','B'];

const MNEMONICS_SET = new Set(MNEMONICS);

// There are 2 registers in CPU => A,B
const REGISTERS_SET = new Set(REGISTERS);

// Example assembly code: => 
// MOV A, 3
// LOOP:
//     DEC A
//     JNZ LOOP
//     HLT

// "MOV A, 5"  →  lexer  →  { type: 'MNEMONIC', value: 'MOV' },
                        //   { type: 'REGISTER', value: 'A' },
                        //   { type: 'COMMA' },
                        //   { type: 'NUMBER', value: 5 },
//                               ↓ parser groups these into one instruction
//                           { mnemonic: 'MOV', operands: [reg A, imm 5] }
//                               ↓ compiler needs: what opcode byte is THIS?
//                           "MOV A, imm" → lookup → 0x01

function tokenise(sourceString){
    
    row = 1;
    col = 1;
    n = sourceString.length;

    tokenised_Code = [];
    instruction_Array = [];
    token = '';

    for(i = 0; i < n; i++){

        ch = sourceString[i];

        if(ch === ' ' || ch === '\t'){
            flush(token, instruction_Array);
            token = '';
            continue;
        }

        if(ch === ','){
            flush(token, instruction_Array)     // flush whatever was building up
            instruction_Array.push({ type: "COMMA", value: null, row, col });
            token = '';
            continue;
        }

        if (ch === ':') {
            instruction_Array.push({ type: "LABEL_DEF", value: token, row, col });
            token = '';
            continue;
        }

        if(ch === '\n'){
            flush(token, instruction_Array);
            tokenised_Code.push(instruction_Array);

            // clear up the trash
            instruction_Array = []; 
            token = '';
            col = 1;
            row++;
            continue;
        }

        token += ch;
        col++;
    }

    flush(token, instruction_Array);
    if (instruction_Array.length > 0) {
        tokenised_Code.push(instruction_Array);
    }
    console.log(tokenised_Code)
}

function flush(token, instruction_Array){
    if(token == '') return;

    if (MNEMONICS_SET.has(token)) {
        instruction_Array.push({ type: "MNEMONIC", value: token, row, col });
        return;
    }

    if (REGISTERS_SET.has(token)) {
        instruction_Array.push({ type: "REGISTER", value: token, row, col });
        return;
    }

    // if token is a number
    if(!isNaN(token)){
        instruction_Array.push({type: "NUMBER", value: Number(token), row, col});
        return;
    }

    // Anything left such as LOOP, END etc.....
    instruction_Array.push({ type: "IDENTIFIER", value: token, row, col });
}


const test_string = 'MOV A, 5\nLOOP:\n\tDEC A\n\tJNZ LOOP\n\tHLT'
tokenise(test_string)