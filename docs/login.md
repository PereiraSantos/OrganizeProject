# Documentação — Fluxo de Login

> Sistema de autenticação do **Organize Project** (Angular 21, standalone components).
> Este documento descreve o funcionamento do login, suas camadas, os padrões de projeto aplicados e como estender/manter o código.

---

## 1. Visão geral

O login é responsável por autenticar o usuário via API, persistir o token de sessão e redirecioná-lo para o dashboard. O código foi estruturado seguindo **POO, SOLID e Design Patterns**, separando responsabilidades em camadas independentes e testáveis.

### Objetivos de design

- **Componente enxuto**: apenas estado de UI, sem regra de negócio.
- **Baixo acoplamento**: nenhum acesso direto a `sessionStorage`, `HttpClient` ou `Router` no componente.
- **Alta testabilidade**: dependências injetadas e substituíveis por mocks.
- **Extensível**: trocar a forma de autenticação (HTTP → OAuth) sem alterar quem consome.

---

## 2. Arquitetura em camadas

```
 ┌──────────────────────────────────────────────────────────────────┐
 │  UI (Login component)                                            │
 │  login.ts / login.html                                           │
 │  • estado de UI (isLoading)                                      │
 │  • valida o Value Object Credentials                             │
 │  • dispara o fluxo e trata sucesso/erro                          │
 └───────────────────────────────┬──────────────────────────────────┘
                                 │ AuthFacade.login(credentials)
                                 ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │  Application (AuthFacade) — Padrão: Facade                       │
 │  auth.facade.ts                                                  │
 │  • orquestra: chamar API → persistir token → navegar             │
 └───────────────────────────────┬──────────────────────────────────┘
                                 │ AuthService.login(email, password)
                                 ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │  Domain (AuthService) — SRP                                     │
 │  auth.service.ts                                                 │
 │  • delega a chamada concreta para a Strategy                     │
 │  • persiste o token no SessionService (tap)                       │
 └───────────────┬──────────────────────────────┬───────────────────┘
                 │ AuthStrategy.login()          │ SessionService.setToken()
                 ▼                               ▼
 ┌───────────────────────────────┐   ┌──────────────────────────────┐
 │  HttpAuthStrategy (Strategy)  │   │  SessionService (Adapter)     │
 │  http-auth.strategy.ts        │   │  session.service.ts           │
 │  • POST /api/user/auth        │   │  • encapsula sessionStorage   │
 └───────────────────────────────┘   └──────────────────────────────┘
```

---

## 3. Fluxo de execução (passo a passo)

1. **Preenchimento do formulário**
   O usuário digita e-mail e senha. O `[(ngModel)]` faz o two-way binding direto para o objeto `Credentials` (`loginData`) no componente.

2. **Submit (`onSubmit`)**
   Ao submeter o formulário, `Login.onSubmit()` é chamado. Antes de qualquer coisa:
   - Se `isLoading()` já for `true` → retorna (evita duplo submit).
   - Se `loginData.isValid()` for `false` → exibe toast `REQUIRED_FIELDS` e retorna.

3. **Ativa o loading**
   `isLoading.set(true)` → o botão é desabilitado e passa a exibir "Entrando...".

4. **AuthFacade.login(credentials)**
   O componente delega ao facade, que:
   - Chama `AuthService.login(email, password)`.
   - Em caso de sucesso: navega para `/dashboard` e completa o Observable.
   - Em caso de erro: propaga o erro para o componente.

5. **AuthService.login(email, password)**
   - Monta um `Credentials` e chama a `AuthStrategy` (`HttpAuthStrategy`).
   - No sucesso, usa `tap()` para persistir o token: `session.setToken(response.token)`.

6. **HttpAuthStrategy.login(credentials)**
   - Executa `POST {apiUrl}/api/user/auth` com `{ email, password }`.
   - Retorna `Observable<LoginResponse>` (tipado).

7. **SessionService**
   - `setToken()` grava o token em `sessionStorage` na chave `auth_token`.
   - `isAuthenticated()` é usado pelos guards de rota.

8. **Resultado no componente**
   - Sucesso: `isLoading.set(false)`.
   - Erro: `isLoading.set(false)` + toast `INVALID_CREDENTIALS`.

---

## 4. Diagrama de sequência

```
Usuário    Login(UI)    AuthFacade    AuthService    HttpAuthStrategy    SessionService
   │           │            │             │                 │                  │
   │ onSubmit()│            │             │                 │                  │
   ├──────────>│            │             │                 │                  │
   │           │ valida +   │             │                 │                  │
   │           │ isLoading  │             │                 │                  │
   │           │ login(cred)│             │                 │                  │
   │           ├───────────>│  login()    │                 │                  │
   │           │            ├────────────>│   login(cred)   │                  │
   │           │            │             ├────────────────>│  POST /auth      │
   │           │            │             │                 ├─────────────────>│(API)
   │           │            │             │                 │<─────────────────┤
   │           │            │             │<────────────────┤  LoginResponse   │
   │           │            │             │ setToken(token) │                  │
   │           │            │             ├────────────────────────────────────>│
   │           │            │<────────────┤                 │                  │
   │           │            │ navigate    │                 │                  │
   │           │            │ /dashboard  │                 │                  │
   │           │<───────────┤             │                 │                  │
   │           │ isLoading  │             │                 │                  │
   │<──────────┤ false      │             │                 │                  │
```

---

## 5. Arquivos envolvidos

| Arquivo | Camada | Responsabilidade |
|---------|--------|------------------|
| `src/app/login/login.ts` | UI | Estado de UI, validação, submit |
| `src/app/login/login.html` | UI | Formulário e binding |
| `src/app/login/auth.facade.ts` | Application | Orquestra login + token + navegação |
| `src/app/login/login.messages.ts` | UI | Mensagens centralizadas |
| `src/app/login/login.spec.ts` | Testes | Testes unitários (Vitest) |
| `src/app/services/auth.service.ts` | Domain | Auth + persistência do token |
| `src/app/services/auth.strategy.ts` | Domain | Contrato da estratégia de auth |
| `src/app/services/http-auth.strategy.ts` | Infra | Estratégia HTTP concreta |
| `src/app/services/session.service.ts` | Infra | Adaptador do `sessionStorage` |
| `src/app/models/credentials.model.ts` | Model | Value Object + validação |
| `src/app/models/login-response.model.ts` | Model | Contrato de resposta tipado |
| `src/app/middlewares/auth.guard.ts` | Rotas | Proteção de rotas via sessão |

---

## 6. Responsabilidades detalhadas

### `Login` (componente)
- Mantém `isLoading` (signal) e `loginData` (`Credentials`).
- Valida antes de chamar o facade.
- Trata sucesso/erro e desliga o estado de loading.
- **Não conhece** HttpClient, Router, sessionStorage ou a URL da API.

### `AuthFacade` (Facade)
- Esconde a orquestração (API + token + navegação) do componente.
- Navega para `/dashboard` em caso de sucesso.
- Retorna `Observable<void>` para o componente reagir a loading/erro.

### `AuthService` (Domain)
- Responsabilidade única de autenticar e persistir a sessão.
- Delega a chamada concreta para a `AuthStrategy` (DIP).
- Expõe `logout()` e `isAuthenticated()`.

### `AuthStrategy` / `HttpAuthStrategy` (Strategy)
- Interface `AuthStrategy` define o contrato.
- `HttpAuthStrategy` é a implementação via `POST /api/user/auth`.

### `SessionService` (Adapter)
- Único ponto de acesso ao `sessionStorage` no app.
- Centraliza a chave `auth_token`.

### `Credentials` (Value Object)
- Encapsula dados + regra de validação (`isValid()`).
- Regra atual: e-mail deve conter `@` e senha deve ter ≥ 6 caracteres.

---

## 7. Fluxo de proteção de rotas (guards)

O `SessionService` também alimenta os route guards:

| Guard | Comportamento |
|-------|---------------|
| `loginGuard` | Se **já autenticado** e acessar fora de `/dashboard`, redireciona para `/dashboard` e bloqueia. |
| `routeGuard` | Se **não autenticado**, redireciona para `/login` e bloqueia. |

Ambos usam `session.isAuthenticated()` (checa se existe token), nunca `sessionStorage` direto.

---

## 8. Padrões de projeto e princípios aplicados

| Documento | Aplicação |
|-----------|-----------|
| **SRP** | Cada classe tem uma responsabilidade (UI, orquestração, auth, storage, model). |
| **OCP** | Novas implementações de auth sem alterar consumidores (via `AuthStrategy`). |
| **LSP** | `LoginResponse` tipado evita quebras silenciosas. |
| **ISP** | Interface `AuthStrategy` pequena e específica. |
| **DIP** | Componente/auth dependem de abstrações (`SessionService`, `AuthStrategy`), não de `sessionStorage`/HTTP diretos. |
| **Facade** | `AuthFacade` simplifica o fluxo para o componente. |
| **Strategy** | `AuthStrategy` permite trocar HTTP por OAuth/mock. |
| **Adapter** | `SessionService` adapta o `sessionStorage`. |
| **Value Object** | `Credentials` encapsula dados + validação. |

---

## 9. Tratamento de erros e mensagens

| Situação | Mensagem | Tipo de toast |
|----------|----------|---------------|
| Campos inválidos / vazios | `Preencha e-mail e senha válidos` | `info` |
| Falha na autenticação (API) | `Usuário ou senha inválidos!` | `error` |

As mensagens ficam centralizadas em `LoginMessages` (`login.messages.ts`), evitando duplicação.

---

## 10. API

**Endpoint:** `POST {apiUrl}/api/user/auth`
**Payload:**
```json
{ "email": "usuario@email.com", "password": "123456" }
```
**Resposta** (`LoginResponse`):
```json
{
  "token": "jwt-token",
  "user": { "id": 1, "name": "Usuário", "email": "usuario@email.com" }
}
```
> `user` é opcional. `apiUrl` vem de `environment.apiUrl`.

---

## 11. Como estender

### Adicionar uma nova forma de autenticação (ex.: OAuth)
1. Crie uma classe que implemente `AuthStrategy` (ex.: `OAuthStrategy`).
2. Ajuste a injeção em `AuthService` para usar a nova strategy (ou use injeção por token).
3. Nenhum outro arquivo precisa mudar.

### Alterar a persistência do token (ex.: cookie / localStorage)
1. Altere apenas `SessionService`.
2. Guards e serviços continuam funcionando, pois dependem da abstração.

### Alterar mensagens
1. Edite `LoginMessages`. O componente não precisa ser tocado.

---

## 12. Testes

Arquivo: `src/app/login/login.spec.ts` (Vitest + `TestBed`).

Cobertura atual:
- Criação do componente e estado inicial.
- Bloqueio de submit com credenciais inválidas.
- Bloqueio de duplo submit quando `isLoading`.
- Chamada ao facade com credenciais válidas.
- Finalização de loading no sucesso.
- Toast de erro + fim do loading em falha.
- Regras de validação do Value Object `Credentials`.

Executar:
```bash
npm test          # ou: ng test --watch=false
```

---

## 13. Boas práticas de segurança (notas)

- O token é guardado em `sessionStorage`, que é acessível via JavaScript (risco de XSS). Para ambientes de produção com maior exigência de segurança, considere cookies `HttpOnly` + `Secure`.
- A validação atual (`isValid()`) é mínima (client-side); a validação real ocorre no backend.
- O `HttpAuthStrategy` não usa headers adicionais; o token só é anexado nas requisições autenticadas pelos demais serviços (via `SessionService`).
```
