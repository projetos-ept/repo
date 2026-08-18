interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  ALLOWED_ORIGINS: string;
  MAX_FILE_MB: string;
}

type Visibility = "draft" | "public" | "private";

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  zip: "application/zip",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odp: "application/vnd.oasis.opendocument.presentation",
  rtf: "application/rtf",
  csv: "text/csv; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp"
};

const encoder = new TextEncoder();

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

  if (origin && !isOriginAllowed(origin, env)) {
    return json({ error: "Origem não autorizada." }, 403, cors);
  }
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "GET" && path === "/api/health") {
      return json({ ok: true, service: "repositorio-api", time: new Date().toISOString() }, 200, cors);
    }
    if (request.method === "POST" && path === "/api/admin/login") {
      return login(request, env, cors);
    }

    if (request.method === "GET" && path === "/api/public/categories") {
      return listPublicCategories(env, cors);
    }
    if (request.method === "GET" && path === "/api/public/files") {
      return listPublicFiles(url, env, cors);
    }

    const publicDownload = path.match(/^\/api\/public\/files\/([^/]+)\/(download|preview)$/);
    if (request.method === "GET" && publicDownload) {
      return deliverFile(publicDownload[1], publicDownload[2] === "preview", false, env, ctx, cors);
    }

    const auth = await authenticate(request, env);
    if (!auth) return json({ error: "Sessão ausente ou expirada." }, 401, cors);

    if (request.method === "GET" && path === "/api/admin/session") {
      return json({ authenticated: true, email: auth.email, expires_at: auth.exp }, 200, cors);
    }
    if (request.method === "GET" && path === "/api/admin/dashboard") {
      return dashboard(env, cors);
    }
    if (path === "/api/admin/categories" && request.method === "GET") {
      return listAdminCategories(env, cors);
    }
    if (path === "/api/admin/categories" && request.method === "POST") {
      return createCategory(request, env, cors);
    }

    const categoryMatch = path.match(/^\/api\/admin\/categories\/([^/]+)$/);
    if (categoryMatch && request.method === "PUT") {
      return updateCategory(categoryMatch[1], request, env, cors);
    }
    if (categoryMatch && request.method === "DELETE") {
      return deleteCategory(categoryMatch[1], env, cors);
    }

    if (path === "/api/admin/files" && request.method === "GET") {
      return listAdminFiles(url, env, cors);
    }
    if (path === "/api/admin/files" && request.method === "POST") {
      return uploadFile(request, env, cors);
    }

    const adminDownload = path.match(/^\/api\/admin\/files\/([^/]+)\/download$/);
    if (adminDownload && request.method === "GET") {
      return deliverFile(adminDownload[1], false, true, env, ctx, cors);
    }

    const fileMatch = path.match(/^\/api\/admin\/files\/([^/]+)$/);
    if (fileMatch && request.method === "PUT") {
      return updateFile(fileMatch[1], request, env, cors);
    }
    if (fileMatch && request.method === "DELETE") {
      return deleteFile(fileMatch[1], env, cors);
    }

    return json({ error: "Rota não encontrada." }, 404, cors);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Erro interno.";
    return json({ error: message }, 500, cors);
  }
  }
} satisfies ExportedHandler<Env>;

async function login(request: Request, env: Env, cors: HeadersInit): Promise<Response> {
  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const validEmail = constantTimeEqual(email, env.ADMIN_EMAIL.trim().toLowerCase());
  const validPassword = constantTimeEqual(password, env.ADMIN_PASSWORD);
  if (!validEmail || !validPassword) {
    return json({ error: "E-mail ou senha inválidos." }, 401, cors);
  }
  const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const token = await createToken({ email, exp }, env.SESSION_SECRET);
  return json({ token, email, expires_at: exp }, 200, cors);
}

async function authenticate(request: Request, env: Env): Promise<{ email: string; exp: number } | null> {
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const expected = await sign(parts[0], env.SESSION_SECRET);
  if (!constantTimeEqual(parts[1], expected)) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[0]));
    if (!payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function createToken(payload: object, secret: string): Promise<string> {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${await sign(encoded, secret)}`;
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function listPublicCategories(env: Env, cors: HeadersInit): Promise<Response> {
  const result = await env.DB.prepare(`
  SELECT c.id, c.name, c.slug, c.description, COUNT(f.id) AS file_count
  FROM categories c
  LEFT JOIN files f ON f.category_id = c.id AND f.visibility = 'public'
  GROUP BY c.id
  HAVING file_count > 0
  ORDER BY c.sort_order, c.name COLLATE NOCASE
  `).all();
  return json({ categories: result.results }, 200, cors, "public, max-age=60");
}

async function listPublicFiles(url: URL, env: Env, cors: HeadersInit): Promise<Response> {
  const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const category = (url.searchParams.get("category") || "").trim();
  const limit = clamp(Number(url.searchParams.get("limit") || 100), 1, 200);
  let sql = `
  SELECT f.id, f.title, f.description, f.original_name, f.extension, f.mime_type,
  f.size_bytes, f.download_count, f.created_at, f.published_at,
  c.id AS category_id, c.name AS category_name, c.slug AS category_slug
  FROM files f JOIN categories c ON c.id = f.category_id
  WHERE f.visibility = 'public'`;
  const params: unknown[] = [];
  if (category) {
    sql += " AND (c.id = ? OR c.slug = ?)";
    params.push(category, category);
  }
  if (q) {
    sql += " AND (f.title LIKE ? OR f.description LIKE ? OR f.original_name LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  sql += " ORDER BY COALESCE(f.published_at, f.created_at) DESC LIMIT ?";
  params.push(limit);
  const result = await env.DB.prepare(sql).bind(...params).all();
  return json({ files: result.results }, 200, cors, "public, max-age=30");
}

async function listAdminCategories(env: Env, cors: HeadersInit): Promise<Response> {
  const result = await env.DB.prepare(`
  SELECT c.*, COUNT(f.id) AS file_count
  FROM categories c LEFT JOIN files f ON f.category_id = c.id
  GROUP BY c.id ORDER BY c.sort_order, c.name COLLATE NOCASE
  `).all();
  return json({ categories: result.results }, 200, cors);
}

async function createCategory(request: Request, env: Env, cors: HeadersInit): Promise<Response> {
  const body = await readJson(request);
  const name = cleanText(body.name, 80);
  if (!name) return json({ error: "Informe o nome da categoria." }, 400, cors);
  const id = crypto.randomUUID();
  const slug = await uniqueSlug(slugify(String(body.slug || name)), env);
  const description = cleanText(body.description, 300);
  await env.DB.prepare(`INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)`)
  .bind(id, name, slug, description).run();
  return json({ ok: true, id, slug }, 201, cors);
}

async function updateCategory(id: string, request: Request, env: Env, cors: HeadersInit): Promise<Response> {
  const body = await readJson(request);
  const current = await env.DB.prepare("SELECT * FROM categories WHERE id = ?").bind(id).first<Record<string, unknown>>();
  if (!current) return json({ error: "Categoria não encontrada." }, 404, cors);
  const name = cleanText(body.name ?? current.name, 80);
  const description = cleanText(body.description ?? current.description, 300);
  const sortOrder = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : current.sort_order;
  await env.DB.prepare(`UPDATE categories SET name = ?, description = ?, sort_order = ?, updated_at = datetime('now') WHERE id = ?`)
  .bind(name, description, sortOrder, id).run();
  return json({ ok: true }, 200, cors);
}

async function deleteCategory(id: string, env: Env, cors: HeadersInit): Promise<Response> {
  const used = await env.DB.prepare("SELECT COUNT(*) AS total FROM files WHERE category_id = ?").bind(id).first<{ total: number }>();
  if (Number(used?.total || 0) > 0) {
    return json({ error: "Mova ou exclua os arquivos desta categoria primeiro." }, 409, cors);
  }
  await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
  return json({ ok: true }, 200, cors);
}

async function listAdminFiles(url: URL, env: Env, cors: HeadersInit): Promise<Response> {
  const visibility = url.searchParams.get("visibility");
  let sql = `SELECT f.*, c.name AS category_name FROM files f JOIN categories c ON c.id=f.category_id`;
  const params: unknown[] = [];
  if (visibility && ["draft", "public", "private"].includes(visibility)) {
    sql += " WHERE f.visibility = ?";
    params.push(visibility);
  }
  sql += " ORDER BY f.created_at DESC LIMIT 500";
  const result = await env.DB.prepare(sql).bind(...params).all();
  return json({ files: result.results }, 200, cors);
}

async function uploadFile(request: Request, env: Env, cors: HeadersInit): Promise<Response> {
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  const maxBytes = clamp(Number(env.MAX_FILE_MB || 50), 1, 100) * 1024 * 1024;
  if (contentLength && contentLength > maxBytes + 1024 * 1024) {
    return json({ error: `O arquivo excede o limite de ${env.MAX_FILE_MB || 50} MB.` }, 413, cors);
  }
  const form = await request.formData();
  const uploaded = form.get("file");
  if (!(uploaded instanceof File)) return json({ error: "Selecione um arquivo." }, 400, cors);
  if (uploaded.size === 0 || uploaded.size > maxBytes) {
    return json({ error: `Arquivo vazio ou maior que ${env.MAX_FILE_MB || 50} MB.` }, 413, cors);
  }
  const originalName = sanitizeFilename(uploaded.name);
  const extension = extensionOf(originalName);
  const mimeType = MIME_BY_EXTENSION[extension];
  if (!mimeType) return json({ error: `Formato .${extension || "?"} não permitido.` }, 415, cors);
  if (!(await signatureMatches(uploaded, extension))) {
    return json({ error: "O conteúdo do arquivo não corresponde à extensão informada." }, 415, cors);
  }

const categoryId = String(form.get("category_id") || "");
  const category = await env.DB.prepare("SELECT id FROM categories WHERE id = ?").bind(categoryId).first();
  if (!category) return json({ error: "Categoria inválida." }, 400, cors);
  const title = cleanText(form.get("title") || originalName.replace(/\.[^.]+$/, ""), 160);
  const description = cleanText(form.get("description"), 1000);
  const visibility = parseVisibility(form.get("visibility"));
  const id = crypto.randomUUID();
  const key = `files/${new Date().toISOString().slice(0, 10)}/${id}.${extension}`;

await env.FILES.put(key, uploaded.stream(), {
  httpMetadata: {
    contentType: mimeType,
    contentDisposition: contentDisposition(originalName),
    cacheControl: visibility === "public" ? "public, max-age=3600" : "private, no-store"
  },
  customMetadata: { originalName, fileId: id }
});

try {
  await env.DB.prepare(`
  INSERT INTO files
  (id, category_id, title, description, original_name, r2_key, extension, mime_type, size_bytes, visibility, published_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'public' THEN datetime('now') ELSE NULL END)
  `).bind(id, categoryId, title, description, originalName, key, extension, mimeType, uploaded.size, visibility, visibility).run();
} catch (error) {
  await env.FILES.delete(key);
  throw error;
}
  return json({ ok: true, id }, 201, cors);
}

async function updateFile(id: string, request: Request, env: Env, cors: HeadersInit): Promise<Response> {
  const current = await env.DB.prepare("SELECT * FROM files WHERE id = ?").bind(id).first<Record<string, unknown>>();
  if (!current) return json({ error: "Arquivo não encontrado." }, 404, cors);
  const body = await readJson(request);
  const title = cleanText(body.title ?? current.title, 160);
  const description = cleanText(body.description ?? current.description, 1000);
  const categoryId = String(body.category_id ?? current.category_id);
  const visibility = parseVisibility(body.visibility ?? current.visibility);
  const category = await env.DB.prepare("SELECT id FROM categories WHERE id = ?").bind(categoryId).first();
  if (!category) return json({ error: "Categoria inválida." }, 400, cors);
  const publishedAt = visibility === "public" ? (current.published_at || new Date().toISOString()) : null;
  await env.DB.prepare(`
  UPDATE files SET title=?, description=?, category_id=?, visibility=?, published_at=?, updated_at=datetime('now') WHERE id=?
  `).bind(title, description, categoryId, visibility, publishedAt, id).run();
  return json({ ok: true }, 200, cors);
}

async function deleteFile(id: string, env: Env, cors: HeadersInit): Promise<Response> {
  const file = await env.DB.prepare("SELECT r2_key FROM files WHERE id = ?").bind(id).first<{ r2_key: string }>();
  if (!file) return json({ error: "Arquivo não encontrado." }, 404, cors);
  await env.FILES.delete(file.r2_key);
  await env.DB.prepare("DELETE FROM files WHERE id = ?").bind(id).run();
  return json({ ok: true }, 200, cors);
}

async function deliverFile(id: string, preview: boolean, admin: boolean, env: Env, ctx: ExecutionContext, cors: HeadersInit): Promise<Response> {
  const sql = admin
  ? "SELECT * FROM files WHERE id = ?"
    : "SELECT * FROM files WHERE id = ? AND visibility = 'public'";
  const file = await env.DB.prepare(sql).bind(id).first<Record<string, unknown>>();
  if (!file) return json({ error: "Arquivo não encontrado." }, 404, cors);
  const canPreview = String(file.mime_type) === "application/pdf" || String(file.mime_type).startsWith("image/");
  if (preview && !canPreview) return json({ error: "Este formato deve ser baixado." }, 400, cors);
  const object = await env.FILES.get(String(file.r2_key));
  if (!object) return json({ error: "Objeto ausente no armazenamento." }, 404, cors);
  if (!admin && !preview) {
    ctx.waitUntil(env.DB.prepare("UPDATE files SET download_count = download_count + 1 WHERE id = ?").bind(id).run());
  }
  const headers = new Headers(cors);
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", String(file.mime_type));
  headers.set("Content-Length", String(file.size_bytes));
  headers.set("Content-Disposition", preview ? `inline; filename*=UTF-8''${encodeURIComponent(String(file.original_name))}` : contentDisposition(String(file.original_name)));
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Security-Policy", "sandbox");
  headers.set("Cache-Control", admin ? "private, no-store" : "public, max-age=3600");
  if (object.httpEtag) headers.set("ETag", object.httpEtag);
  return new Response(object.body, { headers });
}

async function dashboard(env: Env, cors: HeadersInit): Promise<Response> {
  const [categories, files, publicFiles, drafts, downloads, bytes, recent] = await env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) AS value FROM categories"),
    env.DB.prepare("SELECT COUNT(*) AS value FROM files"),
    env.DB.prepare("SELECT COUNT(*) AS value FROM files WHERE visibility='public'"),
    env.DB.prepare("SELECT COUNT(*) AS value FROM files WHERE visibility='draft'"),
    env.DB.prepare("SELECT COALESCE(SUM(download_count),0) AS value FROM files"),
    env.DB.prepare("SELECT COALESCE(SUM(size_bytes),0) AS value FROM files"),
    env.DB.prepare("SELECT f.id,f.title,f.original_name,f.visibility,f.created_at,c.name AS category_name FROM files f JOIN categories c ON c.id=f.category_id ORDER BY f.created_at DESC LIMIT 8")
    ]);
  const value = (result: D1Result) => Number((result.results[0] as { value?: number })?.value || 0);
  return json({
    stats: {
      categories: value(categories), files: value(files), public_files: value(publicFiles),
      drafts: value(drafts), downloads: value(downloads), size_bytes: value(bytes)
    },
    recent: recent.results
  }, 200, cors);
}

async function uniqueSlug(base: string, env: Env): Promise<string> {
  const root = base || "categoria";
  let candidate = root;
  for (let n = 2; n < 1000; n++) {
    const exists = await env.DB.prepare("SELECT 1 FROM categories WHERE slug = ?").bind(candidate).first();
    if (!exists) return candidate;
    candidate = `${root}-${n}`;
  }
  return `${root}-${crypto.randomUUID().slice(0, 8)}`;
}

async function signatureMatches(file: File, extension: string): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const starts = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  if (extension === "pdf") return starts(0x25, 0x50, 0x44, 0x46, 0x2d);
  if (["zip", "docx", "xlsx", "pptx", "odt", "ods", "odp"].includes(extension)) {
    return starts(0x50, 0x4b, 0x03, 0x04) || starts(0x50, 0x4b, 0x05, 0x06) || starts(0x50, 0x4b, 0x07, 0x08);
  }
  if (["doc", "xls", "ppt"].includes(extension)) return starts(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
  if (extension === "png") return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (["jpg", "jpeg"].includes(extension)) return starts(0xff, 0xd8, 0xff);
  if (extension === "webp") return starts(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (extension === "rtf") return starts(0x7b, 0x5c, 0x72, 0x74, 0x66);
  return true;
}

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
  if (origin && isOriginAllowed(origin, env)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function isOriginAllowed(origin: string, env: Env): boolean {
  return (env.ALLOWED_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean).includes(origin);
}

function json(data: unknown, status = 200, extra: HeadersInit = {}, cacheControl = "no-store"): Response {
  const headers = new Headers(extra);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", cacheControl);
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { status, headers });
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) throw new Error("Envie dados em JSON.");
  return await request.json<Record<string, unknown>>();
}

function cleanText(value: unknown, max: number): string {
  return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[/\\]/g, "_").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 180);
  return cleaned || "arquivo";
}

function extensionOf(name: string): string {
  const index = name.lastIndexOf(".");
  return index > 0 ? name.slice(index + 1).toLowerCase() : "";
}

function slugify(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function parseVisibility(value: unknown): Visibility {
  const parsed = String(value || "draft");
  return parsed === "public" || parsed === "private" ? parsed : "draft";
}

function contentDisposition(filename: string): string {
  const ascii = filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function constantTimeEqual(a: string, b: string): boolean {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) diff |= (left[i % (left.length || 1)] || 0) ^ (right[i % (right.length || 1)] || 0);
  return diff === 0;
}

function base64UrlEncode(value: string): string {
  return bytesToBase64Url(encoder.encode(value));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}

