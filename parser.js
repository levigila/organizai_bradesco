(function (root, factory) {
  const api = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  root.parseTdmText = api.parseTdmText;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const FIELD_MAP = {
    CCGC_CPF_ST: 'cpf',
    CFLIAL_CGC_ST: 'filial',
    CCTRL_CPF_CGC_ST: 'controle',
    CAG_BCRIA_CVIVE: 'agencia',
    CCTA_BCRIA_CVIVE: 'conta',
    CDIG_CTA_CVIVE: 'codigo'
  };

  const FIELD_NAMES = Object.keys(FIELD_MAP);

  function normalizeField(field) {
    return String(field).toUpperCase();
  }

  function parseLine(line) {
    const cleanedLine = line.trim();

    if (!cleanedLine) {
      return null;
    }

    const parts = cleanedLine.split(/\s+/).filter(Boolean);

    for (let index = 0; index < parts.length; index += 1) {
      const candidateField = normalizeField(parts[index]);

      if (!FIELD_MAP[candidateField]) {
        continue;
      }

      const row = parts[index + 1];
      const value = parts[index + 2];

      if (!row || !value) {
        continue;
      }

      return {
        field: candidateField,
        row,
        value
      };
    }

    return null;
  }

  function parseTdmText(text) {
    const grouped = {};
    const lines = String(text || '').split(/\r?\n/);

    lines.forEach((rawLine) => {
      const parsed = parseLine(rawLine);

      if (!parsed) {
        return;
      }

      const rowKey = parsed.row;

      if (!grouped[rowKey]) {
        grouped[rowKey] = {
          row: rowKey,
          cpf: '',
          filial: '',
          controle: '',
          agencia: '',
          conta: '',
          codigo: ''
        };
      }

      grouped[rowKey][FIELD_MAP[parsed.field]] = parsed.value;
    });

    const formatControle = (controle) => {
      const normalized = String(controle || '').trim();

      if (!normalized) {
        return '';
      }

      return normalized.length === 1 ? `0${normalized}` : normalized;
    };

    const isCompleteRow = (item) => {
      return (
        item.cpf &&
        item.filial &&
        item.controle &&
        item.agencia &&
        item.conta &&
        item.codigo
      );
    };

    return Object.values(grouped)
      .filter((item) => {
        const rowNumber = Number(item.row);
        return (
          Number.isInteger(rowNumber) &&
          rowNumber >= 1 &&
          rowNumber <= 5 &&
          isCompleteRow(item)
        );
      })
      .sort((a, b) => Number(a.row) - Number(b.row))
      .map((item) => ({
        ...item,
        controleFormatted: formatControle(item.controle),
        cpfFinal: `${item.cpf}${formatControle(item.controle)}`.trim(),
        contaFinal: `${item.conta}${item.codigo ? `-${item.codigo}` : ''}`.trim()
      }));
  }

  return { parseTdmText };
});
