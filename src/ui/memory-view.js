const GRID_SIZE = 256;


export function initMemoryGrid() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    const cells = [];
    for (let addr = 0; addr < GRID_SIZE; addr++) {
        const cell = document.createElement('div');
        cell.className = 'memory-cell';
        cell.dataset.address = addr;
        cell.title = `0x${addr.toString(16).padStart(2, '0').toUpperCase()}`;
        grid.appendChild(cell);
        cells.push(cell);
    }
    return cells;
}


export function renderMemoryGrid(cells, memory, currentPC) {
        
    for (let addr = 0; addr < GRID_SIZE; addr++) {
        const value = memory[addr];
        const cell = cells[addr];

        cell.textContent =`0x${value.toString(16).padStart(2, '0').toUpperCase()}`;
        cell.classList.toggle('nonzero', value !== 0);
        cell.classList.toggle('current-pc', addr === currentPC);
    }
}