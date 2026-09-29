# Trace8

An 8-bit CPU and assembly language emulator

---

## Project Proposal

### 1. Project Description

Trace8 is a browser-based simulator of a simple 8-bit computer. It takes assembly source code written by the user, runs it through a hand-built pipeline — lexer, parser, and compiler — into raw machine code, loads that machine code into a simulated 256-byte memory space, and then executes it on a simulated CPU with its own registers, flags, and instruction cycle.

The project's purpose is to make the normally invisible steps of how source code becomes running machine behavior fully visible, one instruction at a time, so a viewer can watch a program actually execute rather than just read about how a CPU works in the abstract.

### 2. Goals

- Build a complete, working pipeline from raw assembly text to executed machine behavior, with no shortcuts — every stage (tokenizing, parsing, compiling, executing) is implemented from scratch.
- Make CPU execution genuinely observable: registers, flags, and memory should visibly update after every single instruction, not just show a final result.
- Support enough of an instruction set to be Turing-complete (data movement, arithmetic/logic, conditional branching, and a call stack) without attempting to implement all 256 possible opcode slots.
- Keep the entire project dependency-free with no external libraries or frameworks.

### 3. Specifications

#### Hardware Architecture

| Component       | Specification                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| Architecture    | 8-bit, Von Neumann (shared memory for instructions and data)                                                      |
| RAM             | 256 bytes (`Uint8Array(256)`), addressable `0x00`–`0xFF`                                                          |
| Registers       | `A` (accumulator), `B` (general-purpose), `PC` (program counter), `SP` (stack pointer)                            |
| Flags           | `Z` (zero), `C` (carry)                                                                                           |
| Instruction set | ~30 opcodes across four categories, Turing complete                                                               |

#### Instruction Set Architecture (ISA)

1. **Data Transfer** — `MOV A, <imm>` · `MOV B, <imm>` · `MOV A, B` · `MOV B, A` · `LDA/STA/LDB/STB <addr>`
2. **ALU / Arithmetic** — `ADD` · `SUB` · `INC` · `DEC` · `AND` · `OR` · `XOR` · `CMP`
3. **Control Flow** — `JP` · `JZ` · `JNZ` · `JC` · `JNC <addr>` · `CALL <addr>` · `RET`
4. **Stack Operations** — `PUSH A` · `POP A`

#### Pipeline

```
Assembly source (text)
        │
        ▼
   Lexer          →  tokenizes source into a typed token stream
        │
        ▼
   Parser         →  two-pass: builds a symbol table (labels → addresses),
        │             then resolves every label reference to a concrete address
        ▼
   Compiler       →  looks up each instruction's opcode + operand bytes,
        │             writes them into a flat byte array at the correct address
        ▼
   Memory         →  the compiled bytes are loaded into a Uint8Array(256)
        │
        ▼
   CPU            →  fetch → decode → execute loop, driven by user-controlled
        │             Run / Step / Pause, one instruction at a time
        ▼
   UI             →  registers, flags, and the full memory grid re-render
                      after every instruction
```

### 4. Design

#### Folder structure

```
cpu-emulator/
├── index.html
├── styles.css
└── src/
    ├── app.js                (orchestrator: wires assembler + hardware + UI, button handlers)
    ├── assembler/
    │   ├── lexer.js           (tokenizes assembly text)
    │   ├── parser.js          (two-pass parser: symbol table + address resolution)
    │   └── compiler.js        (emits raw opcode/operand bytes)
    ├── hardware/
    │   ├── isa.js              (opcode map, instruction shapes, byte lengths)
    │   ├── registers.js        (register/flag state container)
    │   ├── memory.js           (256-byte RAM slots)
    │   └── cpu.js               (fetch-decode-execute loop and ALU logic)
    └── ui/
        ├── editor-view.js      (assembly textarea, line numbers, error display)
        ├── memory-view.js      (16×16 memory grid renderer)
        └── cpu-view.js          (register and flag display)
```

---

## Getting Started

1. Clone the repository and open `index.html`.
2. Write or paste assembly into the editor.
3. Click **Step** to execute one instruction at a time, or **Run** to execute continuously at the selected speed.
4. Watch registers, flags, and memory update live as the program runs.

