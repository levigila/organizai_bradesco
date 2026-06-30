const inputTxt = document.getElementById('inputTxt');
const resultContainer = document.getElementById('resultado');
const summaryContainer = document.getElementById('summary');
const processButton = document.getElementById('processButton');
const copyButton = document.getElementById('copyButton');
const clearButton = document.getElementById('clearButton');
const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderResults(rows) {
  if (!rows.length) {
    resultContainer.innerHTML = '<p class="empty-state">Nenhum dado encontrado. Verifique o texto e tente novamente.</p>';
    summaryContainer.innerHTML = '';
    return;
  }

  const rowsHtml = rows.map((item) => `
    <tr>
      <td>${escapeHtml(item.row)}</td>
      <td class="cpf">${escapeHtml(item.cpfFinal)}</td>
      <td>${escapeHtml(item.filial)}</td>
      <td>${escapeHtml(item.controleFormatted || item.controle)}</td>
      <td>${escapeHtml(item.agencia)}</td>
      <td class="conta">${escapeHtml(item.contaFinal)}</td>
      <td>${escapeHtml(item.codigo)}</td>
    </tr>
  `).join('');

  resultContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ROW</th>
          <th>CPF</th>
          <th>FILIAL</th>
          <th>CONTROLE</th>
          <th>AGENCIA</th>
          <th>CONTA</th>
          <th>CÓDIGO</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  `;

  summaryContainer.innerHTML = `<strong>${rows.length}</strong> row(s) processado(s) com sucesso.`;
}

function processarTXT() {
  const text = inputTxt.value;
  const rows = window.parseTdmText(text);
  renderResults(rows);
}

async function copyResults() {
  const text = resultContainer.innerText;

  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    summaryContainer.innerHTML = 'Resultado copiado para a área de transferência.';
  } catch {
    summaryContainer.innerHTML = 'Não foi possível copiar automaticamente. Selecione o conteúdo da tabela manualmente.';
  }
}

processButton.addEventListener('click', processarTXT);
copyButton.addEventListener('click', copyResults);
clearButton.addEventListener('click', () => {
  inputTxt.value = '';
  resultContainer.innerHTML = '';
  summaryContainer.innerHTML = '';
});

const preventDefaults = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

const highlight = () => dropzone.classList.add('dragover');
const unhighlight = () => dropzone.classList.remove('dragover');

const readFile = async (file) => {
  if (!file) {
    return;
  }

  const text = await file.text();
  inputTxt.value = text;
  processarTXT();
};

const handleDrop = async (event) => {
  preventDefaults(event);
  unhighlight();

  const [file] = event.dataTransfer.files || [];
  await readFile(file);
};

fileInput.addEventListener('change', async (event) => {
  const [file] = event.target.files || [];
  await readFile(file);
});

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragenter', preventDefaults);
dropzone.addEventListener('dragover', (event) => {
  preventDefaults(event);
  highlight();
});
dropzone.addEventListener('dragleave', (event) => {
  preventDefaults(event);
  unhighlight();
});
dropzone.addEventListener('drop', handleDrop);
