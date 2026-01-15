# 🐾 Dra. Stephany Rodrigues - Medicina Veterinária Domiciliar

Site profissional para a clínica de medicina veterinária domiciliar da Dra. Stephany Rodrigues (CRMV-RJ: 22404), especializada em atendimento de cães, gatos e pets exóticos no Rio de Janeiro.

## 🚀 Stack Tecnológica

- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript
- **Estilização:** Tailwind CSS
- **Banco de Dados:** MongoDB Atlas com Mongoose
- **Autenticação:** NextAuth.js v5 (Auth.js)
- **Calendário:** FullCalendar
- **PDF:** @react-pdf/renderer
- **Deploy:** Vercel

## 📋 Funcionalidades

### Área Pública
- ✅ Página inicial com hero, serviços e depoimentos
- ✅ Calculadoras veterinárias (doses, fluidos, IMC, anestesia, calorias)
- ✅ Botão flutuante do WhatsApp
- ✅ Design responsivo e moderno

### Autenticação
- ✅ Login/Registro de clientes
- ✅ Conta admin pré-criada
- ✅ Autenticação JWT com NextAuth.js
- ✅ Proteção de rotas (middleware)

### Área do Cliente
- ✅ Dashboard com visão geral
- ✅ Histórico de atendimentos
- ✅ Acesso a laudos e documentos

### Área da Administradora
- ✅ Dashboard com estatísticas
- ✅ Agenda com FullCalendar
- ✅ Gestão de pacientes (CRUD)
- ✅ Gestão de atendimentos
- ✅ Busca por nome do tutor/pet
- ✅ Geração de protocolos únicos (SHA-256)

### Segurança (OWASP Top 10)
- ✅ Cabeçalhos de segurança (CSP, X-Frame-Options, etc.)
- ✅ Validação de inputs com Zod
- ✅ Proteção contra CSRF/XSS
- ✅ Senhas hasheadas com bcrypt
- ✅ Rate limiting (configurável)

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- MongoDB Atlas (cluster configurado)
- npm ou yarn

### Passo a passo

1. **Clone o repositório:**
```bash
git clone <repo-url>
cd drapet-vet
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=sua-chave-secreta-de-32-caracteres-minimo
NEXTAUTH_URL=http://localhost:3000
```

4. **Execute o seed inicial (opcional):**
```bash
# Acesse http://localhost:3000/api/seed após iniciar o servidor
# Isso criará a conta admin e os serviços padrão
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

6. **Acesse:** http://localhost:3000

## 🔐 Conta Admin

Ao executar o seed (`/api/seed`), uma conta admin será criada:

- **Email:** `admin@drapet.com`
- **Senha:** (gerada automaticamente e exibida no console do servidor)

> ⚠️ **IMPORTANTE:** Anote a senha exibida no console! Ela não será mostrada novamente.

## 📁 Estrutura do Projeto

```
drapet-vet/
├── src/
│   ├── app/                    # App Router (páginas e APIs)
│   │   ├── (auth)/            # Rotas de autenticação
│   │   ├── admin/             # Área administrativa
│   │   ├── cliente/           # Área do cliente
│   │   ├── calculadoras/      # Calculadoras veterinárias
│   │   ├── api/               # API Routes
│   │   └── page.tsx           # Home
│   ├── components/
│   │   ├── ui/                # Componentes reutilizáveis
│   │   └── layout/            # Header, Footer, WhatsApp
│   ├── lib/
│   │   ├── auth.ts            # Configuração NextAuth
│   │   ├── db.ts              # Conexão MongoDB
│   │   ├── utils.ts           # Utilitários
│   │   └── validators.ts      # Schemas Zod
│   ├── models/                # Models Mongoose
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Proteção de rotas
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── vercel.json
└── package.json
```

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#06695C` | Botões, links, destaques |
| Dark | `#00231F` | Textos, headers |
| Light | `#0A8B7A` | Variantes claras |
| Beige | `#FAF8F5` | Backgrounds |
| White | `#FFFFFF` | Cards, modais |

## 🚀 Deploy na Vercel

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (URL da produção)
4. Deploy!

## 📞 Contato

**Dra. Stephany Rodrigues**
- CRMV-RJ: 22404
- WhatsApp: (21) 97578-7940
- Localização: Rio de Janeiro, RJ

---

Desenvolvido com 💚 para a Dra. Stephany Rodrigues.
