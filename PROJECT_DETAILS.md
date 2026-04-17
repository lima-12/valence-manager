# 🏰 Valence Manager - Documentação Técnica

Este documento descreve a arquitetura, stack e o esqueleto do projeto **Valence Manager**, um e-commerce de curadoria exclusiva (boutique/luxury style).

## 🛠️ Stack Tecnológica

| Tecnologia | Finalidade |
| :--- | :--- |
| **Next.js 15/16** | Framework React com App Router e Server Actions. |
| **React 19** | Biblioteca base (Experimental versions). |
| **Supabase** | Backend as a Service (PostgreSQL, Auth, Storage, SSR). |
| **Tailwind CSS 4** | Estilização utilitária de última geração. |
| **Framer Motion** | Animações fluidas e micro-interações. |
| **Lucide React** | Conjunto de ícones consistentes. |
| **SweetAlert2** | Modais e notificações elegantes. |
| **TypeScript** | Tipagem estática para robustez do código. |

---

## 🏗️ Esqueleto do Projeto

A estrutura segue as convenções modernas do Next.js, separando responsabilidades de forma clara:

### 📂 Diretórios Principais
- `/app`: Roteamento e layouts.
  - `(admin)`: Rotas protegidas para gerenciamento (produtos, estoque).
  - `(auth)`: Fluxos de autenticação (Login).
  - `(shop)`: Loja pública (Home, Produto, Carrinho).
- `/actions`: **Server Actions**. Lógica de mutação (ex: `createProduct`, `deleteProduct`).
- `/services`: Camada de dados. Funções agregadoras de consultas ao Supabase.
- `/components`: UI Atoms e Organisms (Header, ProductCard, Buttons).
- `/lib`: Configurações de terceiros (Clientes Supabase Client/Server).
- `/context`: Estados globais (Ex: `CartContext`).
- `/types`: Definições de interfaces TypeScript.

---

## 🔎 Análise de Engenharia Atual

- **Navegação**: Uso de `Route Groups` para separar lógica de Admin e Shop.
- **Middleware**: Proteção de rotas `/admin` baseada em sessão do Supabase.
- **Mutação**: Uso de Server Actions com processamento de `FormData` e `revalidatePath`.
- **Estética**: Design "Luxury" com tipografia serifada, espaçamentos generosos e animações de fade.

---

## 🚀 Sugestões de Melhoria (Top 5)

Para elevar o projeto a um nível de engenharia profissional, recomendações focadas em **Segurança, Consistência, Performance e UX**:

### 1. Validação de Esquema com Zod
**Problema:** Atualmente, as Server Actions validam campos manualmente com `if (!name)`. 
**Melhoria:** Implementar **Zod**. Ele garante que os dados que chegam ao servidor estão no formato correto (tipagem forte em tempo de execução) e facilita o retorno de erros específicos para o formulário.
- *Benefício:* Segurança e Consistência.

### 2. Supabase RLS (Row Level Security)
**Problema:** A segurança hoje foca muito no Middleware (camada de aplicação).
**Melhoria:** Ativar e configurar **RLS Policies** no Postgres via Supabase. Isso garante que, mesmo que alguém tente acessar o banco diretamente ou via API, apenas usuários autenticados (ou com a role 'admin') possam deletar ou criar produtos.
- *Benefício:* Segurança Máxima.

### 3. Loading Skeletons & Suspense
**Problema:** O carregamento de dados pode gerar saltos visuais (layout shift) enquanto o servidor busca os produtos.
**Melhoria:** Implementar arquivos `loading.tsx` com **Skeleton Screens** em Tailwind. Isso mantém a estrutura da página fixa enquanto os dados carregam, mantendo a sensação de fluidez luxuosa.
- *Benefício:* UX Premium e Consistência Visual.

### 4. Updates Otimistas (useOptimistic)
**Problema:** Ações como deletar um produto ou adicionar ao carrinho esperam a resposta do servidor para atualizar a tela.
**Melhoria:** Utilizar o hook `useOptimistic` do React 19. A interface reflete a mudança instantaneamente, e caso o servidor falhe, ela reverte sozinha.
- *Benefício:* Responsividade (Sensação de velocidade).

### 5. Camada de Abstração de Componentes UI
**Problema:** Uso direto de classes Tailwind complexas em componentes de página.
**Melhoria:** Criar uma pasta `/components/ui` com componentes base (ex: `Button.tsx`, `Input.tsx`, `Badge.tsx`) seguindo o padrão **shadcn/ui** (mesmo que customizado). Isso centraliza o design system.
- *Benefício:* Manutenibilidade e Consistência de Design.
