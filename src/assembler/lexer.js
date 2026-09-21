const MNEMONICS = ['NOP','MOV', 'LDA', 'STA', 'LDB', 'STB','ADD', 'SUB', 'INC', 'DEC', 'AND', 'OR', 'XOR', 'CMP','JP', 'JZ','JNZ', 'JC', 'JNC','CALL', 'RET', 'PUSH', 'POP','HLT']

const REGISTERS = ['A','B'];

const MNEMONICS_SET = new Set(MNEMONICS);

const REGISTERS_SET = new Set(REGISTERS);


export function tokenise(sourceString){
    
    let row = 1;
    let col = 1;
    let n = sourceString.length;

    let tokenised_Code = [];
    let instruction_Array = [];
    let token = '';

    for(let i = 0; i < n; i++){

        let ch = sourceString[i];

        if(ch === ' ' || ch === '\t'){
            flush(token, instruction_Array, row, col);
            token = '';
            continue;
        }

        if(ch === ','){
            flush(token, instruction_Array, row, col)     // flush whatever was building up
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
            flush(token, instruction_Array, row, col);
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

    flush(token, instruction_Array, row, col);
    if (instruction_Array.length > 0) {
        tokenised_Code.push(instruction_Array);
    }
    console.log(tokenised_Code)
    return tokenised_Code;
}

function flush(token, instruction_Array, row, col){
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
