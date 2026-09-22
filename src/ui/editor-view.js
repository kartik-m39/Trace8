
const editorEl = document.getElementById('editor');
const lineNumbersEl = document.getElementById('line-numbers');
const errorEl = document.getElementById('editor-error');
const statusEl = document.getElementById('editor-status');

export function getSourceCode() {
    return editorEl.value;
}

export function setSourceCode(code) {
    editorEl.value = code;
    updateLineNumbers();
}

function updateLineNumbers() {
    const lineCount = editorEl.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lineCount; i++) numbers += i + '\n';
    lineNumbersEl.textContent = numbers.trimEnd();
}

editorEl.addEventListener('input', updateLineNumbers);
editorEl.addEventListener('scroll', () => {
    lineNumbersEl.scrollTop = editorEl.scrollTop;
});

export function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    setStatus('error');
}

export function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = '';
}

// status: 'idle' | 'running' | 'halted' | 'error'
export function setStatus(status) {
    statusEl.textContent = status;
    statusEl.className = `status-chip status-chip--${status}`;
}

export function highlightCurrentLine(row) {
    document.querySelectorAll('.line-number.current')
        .forEach(el => el.classList.remove('current'));
    if (row == null) return;
    const el = document.querySelector(`.line-number[data-row="${row}"]`);
    if (el) el.classList.add('current');
}

updateLineNumbers();