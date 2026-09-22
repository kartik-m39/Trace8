
function toHexByte(value) {
    return value.toString(16).padStart(2, '0').toUpperCase();
}

let lastRendered = { A: null, B: null, PC: null, SP: null };

export function renderRegisters(registers) {
    updateRegisterCell('A', registers.A);
    updateRegisterCell('B', registers.B);
    updateRegisterCell('PC', registers.PC);
    updateRegisterCell('SP', registers.SP);

    updateFlagCell('Z', registers.flags.Z);
    updateFlagCell('C', registers.flags.C);
}


function updateRegisterCell(name, value) {
    const valueEl = document.getElementById(`reg-${name}`);
    const cellEl = valueEl.closest('.register-cell');

    valueEl.textContent = toHexByte(value);

    const changed = lastRendered[name] !== null && lastRendered[name] !== value;
    cellEl.classList.toggle('changed', changed);
    lastRendered[name] = value;
}


function updateFlagCell(name, value) {
    const cellEl = document.getElementById(`flag-${name}`);
    const valueEl = cellEl.querySelector('.flag-value');

    valueEl.textContent = value;
    cellEl.classList.toggle('set', value === 1);
}


export function resetRegisterViewState() {
    lastRendered = { A: null, B: null, PC: null, SP: null };
}