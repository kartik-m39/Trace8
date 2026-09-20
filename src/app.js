import { tokenize } from './assembler/lexer.js';
import { parse } from './assembler/parser.js';
import { compile } from './assembler/compiler.js';
import { createRegisters } from './hardware/registers.js';
import { run, step } from './hardware/cpu.js';

export function assembleAndLoad(sourceCode) {
    const tokens = tokenize(sourceCode);
    const parsed = parse(tokens);
    const memory = compile(parsed);
    const registers = createRegisters();
    return { memory, registers };
}

export function runProgram(memory, registers, onStep) {
    run(memory, registers, onStep);
}

export function stepProgram(memory, registers) {
    return step(memory, registers);
}