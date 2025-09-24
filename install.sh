#!/bin/bash


set -e  # Para execução em caso de erro

echo "🚀 Iniciando instalação do Outbank One..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

print_status "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado."
    print_status "Instalando Node.js via nvm..."
    
    if ! command -v nvm &> /dev/null; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    
    nvm install --lts
    nvm use --lts
else
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
    
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_warning "Node.js versão $NODE_VERSION detectada. Recomendado: >= 18.0.0"
        print_status "Atualizando para Node.js LTS..."
        nvm install --lts
        nvm use --lts
    fi
fi

print_status "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado."
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm encontrado: $NPM_VERSION"
fi

print_status "Verificando Git..."
if ! command -v git &> /dev/null; then
    print_error "Git não está instalado."
    print_status "Instalando Git..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y git
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install git
    else
        print_error "Sistema operacional não suportado para instalação automática do Git."
        print_status "Por favor, instale o Git manualmente: https://git-scm.com/"
        exit 1
    fi
else
    GIT_VERSION=$(git --version)
    print_success "Git encontrado: $GIT_VERSION"
fi

print_status "Limpando cache do npm..."
npm cache clean --force

print_status "Instalando dependências do projeto..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    print_success "Dependências instaladas com sucesso!"
else
    print_error "Falha na instalação das dependências."
    exit 1
fi

print_status "Configurando arquivo de ambiente..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_success "Arquivo .env.local criado a partir do .env.example"
        print_warning "IMPORTANTE: Edite o arquivo .env.local com suas credenciais reais!"
        print_status "Variáveis que precisam ser configuradas:"
        echo "  - DATABASE_URL (PostgreSQL)"
        echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
        echo "  - CLERK_SECRET_KEY"
        echo "  - DOCK_API_KEY"
        echo "  - RESEND_API_KEY"
        echo "  - AWS_ACCESS_KEY_ID"
        echo "  - AWS_SECRET_ACCESS_KEY"
    else
        print_warning ".env.example não encontrado. Você precisará criar .env.local manualmente."
    fi
else
    print_success "Arquivo .env.local já existe."
fi

print_status "Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    print_success "PostgreSQL encontrado: $PSQL_VERSION"
else
    print_warning "PostgreSQL não encontrado localmente."
    print_status "Você pode usar um banco PostgreSQL remoto (como Neon, Supabase, etc.)"
    print_status "Ou instalar PostgreSQL localmente:"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "  sudo apt-get install postgresql postgresql-contrib"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "  brew install postgresql"
    fi
fi

print_status "Testando build do projeto..."
if npm run build; then
    print_success "Build executado com sucesso!"
else
    print_warning "Build falhou. Verifique as configurações e dependências."
    print_status "Possíveis causas:"
    echo "  - Variáveis de ambiente não configuradas"
    echo "  - Banco de dados não acessível"
    echo "  - Dependências em conflito"
fi

print_status "Executando verificação de código..."
if npm run lint; then
    print_success "Linting passou sem erros!"
else
    print_warning "Linting encontrou problemas. Execute 'npm run lint' para detalhes."
fi

echo ""
print_success "🎉 Instalação concluída!"
echo ""
print_status "Próximos passos:"
echo "1. Edite o arquivo .env.local com suas credenciais"
echo "2. Configure seu banco de dados PostgreSQL"
echo "3. Execute 'npm run dev' para iniciar o desenvolvimento"
echo "4. Acesse http://localhost:3000"
echo ""
print_status "Comandos úteis:"
echo "  npm run dev      - Inicia servidor de desenvolvimento"
echo "  npm run build    - Gera build de produção"
echo "  npm run start    - Inicia servidor de produção"
echo "  npm run lint     - Executa verificação de código"
echo ""
print_status "Para mais informações, consulte o arquivo agents.md"
echo ""

read -p "Deseja iniciar o servidor de desenvolvimento agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Iniciando servidor de desenvolvimento..."
    print_status "Pressione Ctrl+C para parar o servidor"
    npm run dev
fi
