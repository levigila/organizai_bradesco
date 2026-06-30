# Organizador TDM

Projeto local para organizar os dados de massa do TDM a partir de um arquivo TXT.

## Como usar

1. Abra o arquivo [tdm_organizer.html](tdm_organizer.html) no navegador.
2. Cole o conteúdo do TXT no campo de texto ou faça upload de um arquivo `.txt`.
3. Clique em "Processar arquivo".
4. O sistema monta uma tabela com CPF, filial, controle, agência, conta e código.

## Arquivos

- [tdm_organizer.html](tdm_organizer.html): página principal.
- [styles.css](styles.css): estilos da interface.
- [app.js](app.js): lógica da interface.
- [parser.js](parser.js): parser do texto.
- [parser.test.js](parser.test.js): testes do parser.

## Teste local

Execute:

```bash
npm test
```
