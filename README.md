# Robot Template

Um template robusto para automação de robôs web usando Node.js, Puppeteer e SQLite.

## 📋 Descrição

Este projeto é um template para criação de robôs de automação web que processa dados de planilhas Excel, executa tarefas automatizadas no navegador e gera relatórios em CSV. O sistema utiliza arquitetura modular com tratamento de erros robusto e suporte a captcha.

## 🚀 Funcionalidades

### Core Features

-   **Processamento de Planilhas**: Leitura e processamento de arquivos Excel (.xlsx/.xls)
-   **Automação Web**: Navegação automatizada usando Puppeteer
-   **Banco de Dados**: Armazenamento SQLite para controle de processamento
-   **Geração de Relatórios**: Exportação de dados processados em CSV
-   **Sistema de Captcha**: Integração com serviços de resolução de captcha
-   **Tratamento de Erros**: Sistema robusto de tratamento e recuperação de erros
-   **Monitoramento de Progresso**: Acompanhamento em tempo real do processamento
-   **Compactação**: Geração automática de arquivos ZIP com resultados
-   **Controle de Horário**: Verificação e aguardo de horários específicos para execução

### Utilitários

-   **Validação de Dados**: Validação de CPF/CNPJ e emails
-   **Requisições HTTP**: Cliente HTTP para APIs externas
-   **Gestão de Arquivos**: Operações com arquivos ZIP e diretórios
-   **Configuração Flexível**: Sistema de variáveis de ambiente com validação
-   **Controle de Horário**: Funções para verificar e aguardar horários específicos

## 📁 Estrutura do Projeto

```
template/
├── src/
│   ├── adapters/
│   │   └── puppeteer/
│   │       └── PuppeteerAdapter.js    # Adaptador do Puppeteer
│   ├── database/
│   │   ├── connection.js              # Conexão com SQLite
│   │   └── reset.js                   # Reset do banco
│   ├── errors/
│   │   ├── browser/                   # Erros relacionados ao navegador
│   │   └── captcha/                   # Erros de captcha
│   ├── events/
│   │   └── workerEvents.js            # Eventos do worker
│   ├── factories/
│   │   ├── makeBrowser.js             # Factory do navegador
│   │   └── makePage.js                # Factory da página
│   ├── utils/
│   │   ├── captcha/                   # Utilitários de captcha
│   │   ├── excel/                     # Processamento de Excel
│   │   ├── files/                     # Operações com arquivos
│   │   ├── global/                    # Funções globais (incluindo controle de horário)
│   │   ├── path/                      # Utilitários de caminhos
│   │   ├── request/                   # Cliente HTTP
│   │   ├── string/                    # Utilitários de string
│   │   └── validators/                # Validadores
│   ├── app.js                         # Lógica principal da aplicação
│   ├── default.js                     # Configurações padrão
│   ├── env.js                         # Validação de variáveis de ambiente
│   └── index.js                       # Ponto de entrada
├── knexfile.js                        # Configuração do Knex
├── package.json                       # Dependências do projeto
└── selectors.json                     # Seletores CSS para automação
```

## 🛠️ Tecnologias Utilizadas

-   **Node.js** (>=16)
-   **Puppeteer** - Automação de navegador
-   **SQLite** - Banco de dados
-   **Knex.js** - Query builder
-   **XLSX** - Processamento de planilhas Excel
-   **Axios** - Cliente HTTP
-   **Zod** - Validação de schemas
-   **Adm-zip** - Manipulação de arquivos ZIP

## ⚙️ Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd template
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Puppeteer
EXECUTABLE_PATH=/usr/bin/google-chrome
HEADLESS=new
USER_DATA_DIR=/tmp/chrome-user-data
SLOW_MO=100
ARGS=--no-sandbox,--disable-setuid-sandbox
IGNORE_DEFAULT_ARGS=--enable-automation
IGNORE_HTTP_ERRORS=true
DEFAULT_VIEW_PORT={"width":1920,"height":1080}
SET_DEFAULT_TIMEOUT=30000
SET_DEFAULT_NAVIGATION_TIMEOUT=30000

# Configurações de Debug
CREATE_BROWSER_BY_WS_ENDPOINT=false
CHROME_REMOTE_DEBUGGING_URL=http://localhost:9222

# Configurações de Captcha (opcional)
URL_SUBMIT_CAPTCHA=https://api.captcha-service.com/submit
URL_SOLUTION_CAPTCHA=https://api.captcha-service.com/get
API_KEY_CAPTCHA=sua-chave-api
TIMEOUT_NORMAL_CAPTCHA=5000

# Configurações de Download
FILE_NAME_DOWNLOAD=arquivo.pdf
PATH_DOWNLOAD=/tmp/downloads

# Configurações de Log
CREATE_CONSOLE_FILE=true
```

4. **Prepare os dados**

-   Coloque sua planilha Excel na pasta `entrada/`
-   A planilha deve ter as colunas: `RAZAO` e `CNPJ`

## 🚀 Como Usar

1. **Preparar dados de entrada**

```bash
# Coloque sua planilha Excel na pasta entrada/
# O arquivo deve ter as colunas RAZAO e CNPJ
```

2. **Executar o robô**

```bash
npm start
```

3. **Verificar resultados**

-   Os resultados serão salvos na pasta `saida/`
-   Um arquivo ZIP será gerado automaticamente
-   Logs serão salvos em `saida/console.txt`

## ⏰ Controle de Horário

O sistema inclui funcionalidades para controlar quando o robô deve executar, baseado em horários específicos.

### Características Especiais

✅ **Suporte a horários que passam pela meia-noite** (ex: 22:00 às 06:00)
✅ **Verificação automática** a cada minuto (ou intervalo personalizado)
✅ **Fácil integração** com código existente
✅ **Documentação completa** com JSDoc

### Casos de Uso

-   **Horário comercial**: Executar apenas durante o horário de trabalho
-   **Horário noturno**: Processar dados durante a madrugada
-   **Janelas específicas**: Executar em horários de menor tráfego
-   **Controle de custos**: Evitar execução em horários de pico

## 📊 Estrutura de Dados

### Planilha de Entrada

A planilha Excel deve conter as seguintes colunas:

-   `RAZAO`: Nome da empresa
-   `CNPJ`: CNPJ da empresa (será formatado automaticamente)

### Banco de Dados

O sistema cria automaticamente uma tabela `processing` com:

-   `id`: Identificador único
-   `razao`: Nome da empresa
-   `cnpj`: CNPJ formatado
-   `processed`: Status de processamento
-   `dados`: Dados coletados (JSON)

## 🔧 Configuração Avançada

### Seletores CSS

Edite o arquivo `selectors.json` para configurar os seletores CSS usados na automação:

```json
{
    "site_url": "https://exemplo.com",
    "campo_cnpj": "#cnpj",
    "botao_pesquisar": "#pesquisar",
    "resultado": ".resultado"
}
```

### Personalização do Processamento

Modifique o arquivo `src/app.js` para implementar sua lógica de processamento específica.

## 📁 Diretórios do Sistema

-   **`entrada/`**: Planilhas Excel para processamento
-   **`saida/`**: Resultados e relatórios gerados
-   **`temp/`**: Arquivos temporários
-   **`processando/`**: Banco de dados SQLite e arquivos de controle

## 🐛 Tratamento de Erros

O sistema possui tratamento robusto para diferentes tipos de erro:

-   **Erros de Navegador**: Timeout, conexão, download
-   **Erros de Captcha**: Chave inválida, saldo zero
-   **Erros de Página**: Elementos não encontrados
-   **Erros de Sistema**: Arquivos não encontrados, permissões

## 📈 Monitoramento

O sistema fornece:

-   Progresso em tempo real
-   Logs detalhados
-   Contagem de tentativas
-   Relatórios de erro

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique os logs em `saida/console.txt`
2. Consulte a documentação das dependências
