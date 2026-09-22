import { tokenise } from './assembler/lexer.js';
import { parse } from './assembler/parser.js';
import { compile } from './assembler/compiler.js';
import { createRegisters } from './hardware/register.js';
import { run, step } from './hardware/cpu.js';

import { getSourceCode, showError, clearError, setStatus, highlightCurrentLine } from './ui/editor-view.js';
import { initMemoryGrid, renderMemoryGrid } from './ui/memory-view.js';
import { renderRegisters, resetRegisterViewState } from './ui/cpu-view.js';
import { createMemory } from './hardware/memory.js';

const btnRun = document.getElementById('btn-run');
const btnPause = document.getElementById('btn-pause');
const btnStep = document.getElementById('btn-step');
const btnReset = document.getElementById('btn-reset');
const speedInput = document.getElementById('speed');
const traceEl = document.getElementById('trace');

const memoryCells = initMemoryGrid();
// const memory = null;

let memory = createMemory();    // THIS CAN CREATE AN ISSUE
let registers = null;
let runTimer = null;
let pcToInfo = null;   // PC address -> { isaKey, row, address }


function assemble() {
    clearError();
    try {
        const tokens = tokenise(getSourceCode());
        const parsedData = parse(tokens);

        pcToInfo = {};
        parsedData.instruction_Set.forEach(inst => {
            pcToInfo[inst.address] = inst;
        });

        return compile(parsedData);
    } catch (err) {
        showError(err.message);
        setStatus('error');
        return null;
    }
}

function load() {
    const newMemory = assemble();
    if (!newMemory) return false;

    memory = newMemory;
    registers = createRegisters();
    resetRegisterViewState();
    clearTrace();
    clearError();
    render();
    setStatus('idle');
    return true;
}

function render() {
    renderRegisters(registers);
    renderMemoryGrid(memoryCells, memory, registers.PC);
    highlightCurrentLine(pcToInfo && pcToInfo[registers.PC] ? pcToInfo[registers.PC].row : null);
}

const toHex = v => `0x${v.toString(16).padStart(2, '0').toUpperCase()}`;

function trace(pc, text) {
    const line = document.createElement('div');
    line.className = 'trace-line';

    const pcSpan = document.createElement('span');
    pcSpan.className = 'trace-pc';
    pcSpan.textContent = toHex(pc);
    line.appendChild(pcSpan);
    line.appendChild(document.createTextNode('  ' + text));

    traceEl.appendChild(line);
    if (traceEl.childElementCount > 500) traceEl.firstElementChild.remove(); // cap growth on big loops
    traceEl.scrollTop = traceEl.scrollHeight;
}

function clearTrace() {
    traceEl.innerHTML = '';
}

function runOneStep() {
    if (registers.PC >= memory.length) {
        showError(`PC (${registers.PC}) ran past end of memory — is there an HLT?`);
        setStatus('error');
        return true;
    }

    const inst = pcToInfo[registers.PC];
    const pcBefore = registers.PC;

    let halted;
    try {
        halted = step(memory, registers);
    } catch (err) {
        showError(err.message);
        setStatus('error');
        return true;
    }

    if (inst) {
        trace(
            pcBefore,
            `${inst.isaKey.padEnd(12)}  A=${toHex(registers.A)}  B=${toHex(registers.B)}  Z=${registers.flags.Z} C=${registers.flags.C}`
        );
    }
    render();

    if (halted) {
        setStatus('halted');
        btnRun.disabled = true;
        btnStep.disabled = true;
        btnPause.disabled = true;
    }
    return halted;
}


// Run: compile fresh from the editor, then step on a timer so every
// instruction is visible on screen, one at a time, at the chosen speed.
btnRun.addEventListener('click', () => {
    if (!load()) return;

    setStatus('running');
    btnRun.disabled = true;
    btnStep.disabled = true;
    btnPause.disabled = false;

    const delayMs = 550 - Number(speedInput.value) * 50;

    (function tick() {
        if (!runOneStep()) {
            runTimer = setTimeout(tick, delayMs);
        }
    })();
});

btnPause.addEventListener('click', () => {
    clearTimeout(runTimer);
    setStatus('idle');
    btnRun.disabled = false;
    btnStep.disabled = false;
    btnPause.disabled = true;
});

btnStep.addEventListener('click', () => {
    if (!memory && !load()) return;
    runOneStep();
});

btnReset.addEventListener('click', () => {
    clearTimeout(runTimer);
    memory = null;
    registers = null;
    btnRun.disabled = false;
    btnStep.disabled = false;
    btnPause.disabled = true;
    load();
});

load();


