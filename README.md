# Repositório público — GitHub Pages + Cloudflare

Sistema para um administrador enviar e organizar documentos, mantendo os arquivos em um bucket R2 privado e liberando ao público somente os registros marcados como **Publicado**.

Não utiliza MinIO, servidor próprio, Docker nem banco externo.

## O que está incluído

- Catálogo público responsivo com busca e categorias.
- Painel administrativo protegido por login.
- Upload, edição, publicação, despublicação e exclusão.
- R2 privado: o visitante nunca recebe chave ou credencial.
- D1 para categorias, metadados e contador de downloads.
- PWA instalável, tema claro/escuro e catálogo disponível offline.
- Visualização no navegador para PDF e imagens.
- Relatório administrativo otimizado com `@media print`.
- Publicação automática da pasta `docs/` no GitHub Pages.
- Interface sem bibliotecas externas, adequada ao plano gratuito.

## Arquitetura

```text
Visitante/admin
      │
      ▼
GitHub Pages (docs/)
      │ chamadas HTTPS
      ▼
Cloudflare Worker (worker/index.ts)
      ├── D1: categorias, arquivos e downloads
      └── R2 privado: conteúdo binário dos arquivos
```

Um download público usa uma URL como:

```text
https://repositorio-api.SEU-SUBDOMINIO.workers.dev/api/public/files/ID/download
```

O Worker consulta o D1, confirma que `visibility = 'public'`, acessa o R2 pelo binding interno `FILES` e transmite o conteúdo. A senha, o token administrativo e as credenciais do Cloudflare não ficam no GitHub Pages.

## Formatos permitidos

| Grupo | Extensões |
|---|---|
| Documentos | `.pdf`, `.rtf`, `.txt`, `.csv` |
| Microsoft Office atual | `.docx`, `.xlsx`, `.pptx` |
| Microsoft Office legado | `.doc`, `.xls`, `.ppt` |
| OpenDocument | `.odt`, `.ods`, `.odp` |
| Compactado | `.zip` |
| Imagens | `.png`, `.jpg`, `.jpeg`, `.webp` |

O Worker confere a extensão e a assinatura inicial dos formatos binários. Executáveis e scripts não estão na lista permitida. ZIP é aceito, mas o administrador continua responsável pelo conteúdo compactado.

O limite padrão da aplicação é 50 MB por arquivo. Pode ser alterado pela variável `MAX_FILE_MB`, respeitando também os limites vigentes do plano Cloudflare.

## Implantação recomendada pelo terminal

### 1. Pré-requisitos

- Conta gratuita no Cloudflare.
- Node.js 20 ou mais recente.
- Repositório GitHub com estes arquivos.

Abra um terminal na raiz do projeto e instale as ferramentas:

```bash
npm install
npx wrangler login
```

### 2. Criar o banco D1

```bash
npx wrangler d1 create repositorio-db
```

O comando mostra um `database_id`. Abra `wrangler.jsonc` e substitua:

```json
"database_id": "COLE_AQUI_O_DATABASE_ID"
```

Crie as tabelas:

```bash
npx wrangler d1 migrations apply repositorio-db --remote
```

Confirme a aplicação da migration quando o Wrangler solicitar.

### 3. Criar o bucket R2 privado

```bash
npx wrangler r2 bucket create repositorio-arquivos
```

Não ative `r2.dev` nem acesso público no bucket. O binding `FILES` do `wrangler.jsonc` dá acesso interno ao Worker.

### 4. Configurar endereço do administrador e CORS

Em `wrangler.jsonc`, altere:

```jsonc
"vars": {
  "ADMIN_EMAIL": "seu-email@exemplo.com",
  "ALLOWED_ORIGINS": "https://SEU-USUARIO.github.io,http://localhost:8080,http://127.0.0.1:8080",
  "MAX_FILE_MB": "50"
}
```

`ALLOWED_ORIGINS` recebe origens separadas por vírgula, sem barra no final. Para um site em `https://usuario.github.io/nome-do-repo/`, a origem é apenas `https://usuario.github.io`.

Se usar domínio próprio, acrescente-o:

```text
https://SEU-USUARIO.github.io,https://repositorio.seudominio.com.br
```

### 5. Criar os segredos

Defina a senha administrativa:

```bash
npx wrangler secret put ADMIN_PASSWORD
```

Gere um segredo aleatório para assinar sessões. Em PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48)) | npx wrangler secret put SESSION_SECRET
```

Em Linux/macOS:

```bash
openssl rand -base64 48 | npx wrangler secret put SESSION_SECRET
```

Esses valores ficam criptografados no Cloudflare. Nunca os coloque em `config.js`, `wrangler.jsonc` ou em um commit.

### 6. Publicar o Worker

```bash
npm run deploy
```

Ao final, copie o endereço apresentado, semelhante a:

```text
https://repositorio-api.nome-da-conta.workers.dev
```

Teste:

```text
https://repositorio-api.nome-da-conta.workers.dev/api/health
```

Deve retornar JSON com `"ok": true`.

### 7. Ligar o frontend à API

Abra `docs/config.js` e informe o endereço real:

```js
window.REPO_CONFIG = {
  API_URL: "https://repositorio-api.nome-da-conta.workers.dev",
  SITE_NAME: "Repositório CETEP/LNAB",
  SITE_SUBTITLE: "Documentos e materiais para download"
};
```

Não coloque `/api` nem barra no fim da URL.

### 8. Publicar no GitHub Pages

1. Envie todos os arquivos deste projeto a um repositório GitHub.
2. Confirme que a branch principal se chama `main`.
3. No GitHub, entre em **Settings → Pages**.
4. Em **Build and deployment → Source**, escolha **GitHub Actions**.
5. Abra a aba **Actions** e aguarde o fluxo "Publicar GitHub Pages".
6. O endereço será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Se o Pages mostrar erro de permissão, confira em **Settings → Actions → General → Workflow permissions** se os workflows podem executar. O arquivo `.github/workflows/pages.yml` já contém as permissões específicas necessárias.

## Implantação usando a interface web do Cloudflare

O terminal é o caminho mais simples e reproduzível. Ainda assim, os recursos podem ser configurados no painel:

1. Em **R2 Object Storage**, crie `repositorio-arquivos` e mantenha o acesso público desativado.
2. Em **D1**, crie `repositorio-db`.
3. No console do D1, execute todo o conteúdo de `migrations/0001_initial.sql`.
4. Em **Workers & Pages**, crie o Worker `repositorio-api`.
5. Publique o conteúdo de `worker/index.ts` ou conecte o repositório ao fluxo de build do Worker.
6. Nas configurações do Worker, adicione o binding D1 com nome `DB` apontando para `repositorio-db`.
7. Adicione o binding R2 com nome `FILES` apontando para `repositorio-arquivos`.
8. Em **Variables and Secrets**, crie as variáveis de texto `ADMIN_EMAIL`, `ALLOWED_ORIGINS` e `MAX_FILE_MB`.
9. No mesmo local, crie como **Secret** `ADMIN_PASSWORD` e `SESSION_SECRET`.
10. Faça um novo deploy e teste `/api/health`.

Os nomes dos bindings são obrigatórios: o código espera exatamente `DB` e `FILES`.

## Uso do sistema

### Administração

Abra o site e clique em **Administração**. Use:

- E-mail: valor de `ADMIN_EMAIL`.
- Senha: valor definido em `ADMIN_PASSWORD`.

O token de sessão dura 8 horas e fica somente em `sessionStorage`; ele é eliminado ao fechar a aba ou clicar em **Sair**.

Estados disponíveis:

- **Rascunho:** apenas o administrador visualiza no painel.
- **Privado:** reservado para uma futura política de usuários; atualmente somente o administrador acessa.
- **Publicado:** aparece no catálogo e pode ser baixado sem login.

### Relatório

No painel, clique em **Relatório**. A impressão oculta formulários e botões e mostra os indicadores e a tabela de arquivos. O usuário pode imprimir ou escolher "Salvar como PDF".

### Offline/PWA

O service worker guarda a interface e o navegador conserva a última lista pública carregada. Assim, o catálogo pode ser consultado offline. Os arquivos do R2 não são armazenados automaticamente, porque documentos grandes poderiam ocupar o dispositivo sem autorização.

## Desenvolvimento local

Copie o arquivo de exemplo de segredos:

```bash
cp .dev.vars.example .dev.vars
```

No Windows PowerShell:

```powershell
Copy-Item .dev.vars.example .dev.vars
```

Edite `.dev.vars`, aplique o banco local e inicie a API:

```bash
npm run db:local
npm run dev
```

Em outro terminal, sirva o frontend:

```bash
npx serve docs -l 8080
```

Durante o desenvolvimento, altere temporariamente `docs/config.js` para:

```js
API_URL: "http://localhost:8787"
```

Antes do commit de produção, restaure a URL pública do Worker.

## Rotas da API

### Públicas

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/health` | Verificar a API |
| `GET` | `/api/public/categories` | Categorias com arquivos publicados |
| `GET` | `/api/public/files?q=&category=` | Pesquisar catálogo |
| `GET` | `/api/public/files/:id/download` | Baixar e contabilizar |
| `GET` | `/api/public/files/:id/preview` | Visualizar PDF/imagens |

### Administrativas

| Método | Rota | Finalidade |
|---|---|---|
| `POST` | `/api/admin/login` | Obter token temporário |
| `GET` | `/api/admin/dashboard` | Indicadores do painel |
| `GET/POST` | `/api/admin/categories` | Listar/criar categorias |
| `PUT/DELETE` | `/api/admin/categories/:id` | Editar/excluir categoria |
| `GET/POST` | `/api/admin/files` | Listar/enviar arquivos |
| `PUT/DELETE` | `/api/admin/files/:id` | Editar/excluir arquivo |

Rotas administrativas usam:

```http
Authorization: Bearer TOKEN_DA_SESSAO
```

## Backup e migração

Os metadados podem ser exportados pelo Wrangler:

```bash
npx wrangler d1 export repositorio-db --remote --output backup-d1.sql
```

Os objetos do R2 devem ser copiados com uma ferramenta compatível com S3 ou pela API do R2. Faça backup do D1 e do R2; somente um deles não recompõe o sistema inteiro.

Para migrar do MinIO:

1. Exporte os objetos preservando os nomes originais.
2. Reenvie-os pelo painel deste sistema ou por uma ferramenta S3 compatível com R2.
3. Cadastre no D1 um registro para cada objeto, relacionando categoria e `r2_key`.
4. Compare a quantidade de arquivos e o tamanho total antes de desligar o MinIO.

## Segurança

- O bucket R2 deve permanecer privado.
- Não versione `.dev.vars` nem `.env`.
- Use senha longa e `SESSION_SECRET` aleatório.
- Mantenha `ALLOWED_ORIGINS` restrito aos seus endereços.
- O nome original é sanitizado e o objeto recebe uma chave UUID.
- Arquivos baixáveis recebem `Content-Disposition: attachment` e `X-Content-Type-Options: nosniff`.
- A visualização aplica uma política `sandbox` e é limitada a PDF/imagens.
- Para ambientes com muitos administradores, auditoria ou dados sensíveis, substitua o login único por Cloudflare Access ou um provedor de identidade.

## Solução de problemas

### "Origem não autorizada"

Inclua a origem exata do GitHub Pages ou domínio próprio em `ALLOWED_ORIGINS` e publique o Worker novamente.

### "Sessão ausente ou expirada"

Entre novamente. Se ocorrer imediatamente, confirme que `SESSION_SECRET` foi criado como Secret e que o relógio do dispositivo está correto.

### A categoria não pode ser excluída

Ela ainda possui arquivos. Mova os arquivos para outra categoria ou exclua-os primeiro.

### Upload rejeitado

Confira extensão, assinatura real do arquivo e tamanho. Renomear um executável para `.pdf` não o transforma em PDF e deve continuar sendo rejeitado.

### O site abre, mas não encontra a API

Revise `docs/config.js`, teste `/api/health` diretamente e confirme o CORS. Uma página HTTPS não pode chamar uma API HTTP, exceto durante testes em localhost.

## Documentação oficial

- [Workers e bindings R2](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
- [Buckets públicos e privados](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [D1 e migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [Segredos do Worker](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Configuração do Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [GitHub Pages com Actions](https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Licença

MIT. Consulte `LICENSE`.
