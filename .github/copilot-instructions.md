# ALD Transportes App - Guia para Agentes de IA

Este documento fornece orientações essenciais para agentes de IA trabalharem efetivamente nesta base de código.

## Arquitetura Geral

O ALD Transportes é um aplicativo React/TypeScript que gerencia solicitações de transporte com três tipos principais de usuários:

- **Empresas**: Podem criar e gerenciar solicitações de transporte
- **Motoristas**: Podem aceitar e gerenciar chamados de transporte
- **Administradores**: Supervisionam todo o sistema

### Estrutura de Componentes

- `src/pages/`: Páginas principais organizadas por função/perfil
- `src/components/`: Componentes reutilizáveis
  - `common/`: Componentes compartilhados (Card, Header)
  - `ui/`: Componentes de interface (ThemeToggle)

## Padrões Importantes

### Autenticação e Autorização

O sistema usa Supabase para autenticação. O fluxo típico inclui:

1. Verificação de usuário em `checkUser()`
2. Determinação do tipo de usuário via perfil
3. Redirecionamento para dashboard específico

```typescript
// Exemplo de verificação de usuário em Dashboard.tsx
async function checkUser() {
  const {
    data: { user: userData }
  } = await supabase.auth.getUser()
  // ... lógica de verificação de perfil
}
```

### Gerenciamento de Estado

- Autenticação: Gerenciada via Supabase
- Dados locais: React useState para estado local
- Queries: Chamadas diretas ao Supabase para dados dinâmicos

### Convenções de Estilo

- Estilos inline com TypeScript para componentes específicos
- Variáveis CSS para temas (--background-box, --text-main)
- Gradientes para botões principais: `linear-gradient(90deg, #3fa1ff 10%, #358aff 90%)`

## Workflows Comuns

### Configuração do Ambiente

1. Instalar dependências:

```bash
npm install
```

2. Iniciar servidor de desenvolvimento:

```bash
npm run dev
```

### Integração com Supabase

- Cliente Supabase configurado em `src/lib/supabaseClient.ts`
- Tabelas principais:
  - profiles: Informações de usuário e função
  - chamados: Solicitações de transporte

## Boas Práticas

1. **Tratamento de Tipos**:

   - Use tipos específicos em vez de `any`
   - Defina interfaces em `src/types/database.types.ts`

2. **Componentes**:

   - Separe por responsabilidade (empresa/motorista/admin)
   - Use JSX.Element como tipo de retorno

3. **Estado**:
   - Mantenha estado próximo ao uso
   - Use useEffect para carregamento inicial de dados

## Arquivos Chave

- `src/pages/Dashboard/Dashboard.tsx`: Exemplo de roteamento baseado em perfil
- `src/lib/supabaseClient.ts`: Configuração do cliente Supabase
- `src/types/database.types.ts`: Tipos do banco de dados
