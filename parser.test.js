const assert = require('node:assert/strict');
const { parseTdmText } = require('./parser.js');

const sample = `
0001 CCGC_CPF_ST 1 50018242065
0002 CFLIAL_CGC_ST 1 0000
0003 CCTRL_CPF_CGC_ST 1 65
0004 CAG_BCRIA_CVIVE 1 2
0005 CCTA_BCRIA_CVIVE 1 167731
0006 CDIG_CTA_CVIVE 1 4
0007 CCGC_CPF_ST 2 50018242066
0008 CFLIAL_CGC_ST 2 0000
0009 CCTRL_CPF_CGC_ST 2 66
0010 CAG_BCRIA_CVIVE 2 2
0011 CCTA_BCRIA_CVIVE 2 167732
0012 CDIG_CTA_CVIVE 2 4
`;

const result = parseTdmText(sample);

assert.equal(result.length, 2);
assert.equal(result[0].cpfFinal, '5001824206565');
assert.equal(result[0].contaFinal, '167731-4');
assert.equal(result[1].row, '2');
assert.equal(result[1].controle, '66');

const singleDigitSample = `
0001 CCGC_CPF_ST 1 765269879
0002 CFLIAL_CGC_ST 1 0000
0003 CCTRL_CPF_CGC_ST 1 7
0004 CAG_BCRIA_CVIVE 1 2
0005 CCTA_BCRIA_CVIVE 1 167731
0006 CDIG_CTA_CVIVE 1 4
`;
const singleDigitResult = parseTdmText(singleDigitSample);
assert.equal(singleDigitResult.length, 1);
assert.equal(singleDigitResult[0].cpfFinal, '76526987907');
assert.equal(singleDigitResult[0].controle, '7');
assert.equal(singleDigitResult[0].controleFormatted, '07');
assert.equal(singleDigitResult[0].contaFinal, '167731-4');

const extraRowsSample = `
0001 CCGC_CPF_ST 1 50018242065
0002 CCTRL_CPF_CGC_ST 1 65
0003 CCGC_CPF_ST 6 12345678901
0004 CCTRL_CPF_CGC_ST 6 9
`;
const extraRowsResult = parseTdmText(extraRowsSample);
assert.equal(extraRowsResult.length, 0);

const completeOnlySample = `
0001 CCGC_CPF_ST 1 50018242065
0002 CFLIAL_CGC_ST 1 0000
0003 CCTRL_CPF_CGC_ST 1 65
0004 CAG_BCRIA_CVIVE 1 2
0005 CCTA_BCRIA_CVIVE 1 167731
0006 CDIG_CTA_CVIVE 1 4
0007 CCGC_CPF_ST 2 50018242066
0008 CFLIAL_CGC_ST 2 0000
0009 CCTRL_CPF_CGC_ST 2 66
0010 CAG_BCRIA_CVIVE 2 2
`;
const completeOnlyResult = parseTdmText(completeOnlySample);
assert.equal(completeOnlyResult.length, 1);
assert.equal(completeOnlyResult[0].row, '1');
assert.equal(completeOnlyResult[0].cpfFinal, '5001824206565');

console.log('Parser tests passed.');
