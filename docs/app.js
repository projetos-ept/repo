(() => {
    "use strict";
    const ICONS = {
        pdf: { cls: "ico-pdf", path: '<path d="M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"/><path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"/>' },
        word: { cls: "ico-word", path: '<path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M5.485 6.879l1.036 4.144.997-3.655a.5.5 0 0 1 .964 0l.997 3.655 1.036-4.144a.5.5 0 0 1 .97.242l-1.5 6a.5.5 0 0 1-.967.01L8 9.402l-1.018 3.73a.5.5 0 0 1-.967-.01l-1.5-6a.5.5 0 1 1 .97-.242z"/>' },
        excel: { cls: "ico-excel", path: '<path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M5.884 6.68 8 9.219l2.116-2.54a.5.5 0 1 1 .768.641L8.651 10l2.233 2.68a.5.5 0 0 1-.768.64L8 10.781l-2.116 2.54a.5.5 0 0 1-.768-.641L7.349 10 5.116 7.32a.5.5 0 1 1 .768-.64"/>' },
        sheet: { cls: "ico-excel", path: '<path d="M6 12v-2h3v2z"/><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3z"/>' },
        ppt: { cls: "ico-ppt", path: '<path d="M8.188 10H7V6.5h1.188a1.75 1.75 0 1 1 0 3.5"/><path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM7 5.5a1 1 0 0 0-1 1V13a.5.5 0 0 0 1 0v-2h1.188a2.75 2.75 0 0 0 0-5.5z"/>' },
        zip: { cls: "ico-zip", path: '<path d="M5.5 9.438V8.5h1v.938a1 1 0 0 0 .03.243l.4 1.598-.93.62-.93-.62.4-1.598a1 1 0 0 0 .03-.243"/><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m-4-.5V2h-1V1H6v1h1v1H6v1h1v1H6v1h1v1H5.5V6h-1V5h1V4h-1V3zm0 4.5h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.109 0l-.93-.62a1 1 0 0 1-.415-1.074l.4-1.599V8.5a1 1 0 0 1 1-1"/>' },
        image: { cls: "ico-image", path: '<path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/><path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z"/>' },
        text: { cls: "ico-text", path: '<path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/>' },
        generic: { cls: "ico-generic", path: '<path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>' }
    };
    const EXT_ICON = {
        pdf: "pdf", doc: "word", docx: "word", odt: "word",
        xls: "excel", xlsx: "excel", ods: "excel", csv: "sheet",
        ppt: "ppt", pptx: "ppt", odp: "ppt", zip: "zip",
        png: "image", jpg: "image", jpeg: "image", webp: "image",
        txt: "text", rtf: "text"
    };
    function fileIconSvg(extension) {
        const ext = String(extension || "").toLowerCase().replace(/^\./, "");
        const icon = ICONS[EXT_ICON[ext]] || ICONS.generic;
        return `<svg class="file-icon-svg ${icon.cls}" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">${icon.path}</svg>`;
    }
    function humanizeTitle(file) {
        const raw = String(file.title || "").trim();
        const original = String(file.original_name || "");
        const dotIndex = original.lastIndexOf(".");
        const baseName = dotIndex > 0 ? original.slice(0, dotIndex) : original;
        if (raw && raw !== baseName && raw !== original) return raw;
        const source = raw || baseName || original;
        return source
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim() || source;
    }
    const config = window.REPO_CONFIG || {};
    const API = String(config.API_URL || "").replace(/\/+$/, "");
    const siteName = config.SITE_NAME || "Repositório de Arquivos";
    function whatsappShareButton(id, displayTitle, categoryName, extraClass) {
        const deepLink = `${location.origin}${location.pathname}#/arquivo/${encodeURIComponent(id)}`;
        const shareMessage = `📄 *${displayTitle}*\n${categoryName ? `Categoria: ${categoryName}\n` : ""}Disponível para consulta e download no ${siteName}:\n${deepLink}`;
        const shareText = encodeURIComponent(shareMessage);
        return `<a class="button button-ghost button-whatsapp${extraClass ? ` ${extraClass}` : ""}" href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener" aria-label="Compartilhar ${esc(displayTitle)} no WhatsApp" title="Compartilhar no WhatsApp"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="whatsapp-icon"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg></a>`;
    }
    const state = { categories: [], files: [], adminFiles: [], token: sessionStorage.getItem("repo-admin-token") || "", selectedCategory: "", query: "", sort: "recent", highlightFile: "" };
    const $ = selector => document.querySelector(selector);
    const els = {
        publicView: $("#public-view"), adminView: $("#admin-view"), categories: $("#categories"), grid: $("#file-grid"), empty: $("#empty-state"),
        resultCount: $("#result-count"), catalogTitle: $("#catalog-title"), search: $("#search-input"), offlineNote: $("#offline-note"), sortSelect: $("#sort-select"),
        loginCard: $("#login-card"), adminContent: $("#admin-content"), stats: $("#stats"), adminCategories: $("#admin-categories"),
        uploadCategory: $("#upload-category"), adminFiles: $("#admin-files"), adminFileCards: $("#admin-files-cards"), editDialog: $("#edit-dialog"), toast: $("#toast"),
        imagePreviewDialog: $("#image-preview-dialog"), imagePreviewImg: $("#image-preview-img"), imagePreviewTitle: $("#image-preview-title"),
        categoriesToggle: $("#categories-toggle"), categoriesToggleLabel: $("#categories-toggle-label"), categoriesPanel: $(".categories-panel"),
        adminCategoryFilter: $("#admin-category-filter"), adminFileSearch: $("#admin-file-search")
    };
    init();
    function init() {
        const subtitle = config.SITE_SUBTITLE || "Documentos e materiais para download";
        document.title = siteName;
        $("#site-name").textContent = siteName;
        $("#site-subtitle").textContent = subtitle;
        $("#footer-name").textContent = siteName;
        bindEvents();
        updateNetwork();
        route();
        if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(console.warn);
        if (!/^https?:\/\//.test(API) || API.includes("SEU-SUBDOMINIO")) {
            toast("Configure a URL do Worker no arquivo docs/config.js.", true, 8000);
        }
    }

 function bindEvents() {
     addEventListener("hashchange", route);
     addEventListener("online", updateNetwork);
     addEventListener("offline", updateNetwork);
     $("#theme-button").addEventListener("click", toggleTheme);
     $("#search-form").addEventListener("submit", event => { event.preventDefault(); state.query = els.search.value.trim(); loadPublicFiles(); });
     let timer;
     els.search.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { state.query = els.search.value.trim(); loadPublicFiles(); }, 350); });
     $("#clear-filters").addEventListener("click", () => { state.selectedCategory = ""; state.query = ""; els.search.value = ""; renderCategories(); loadPublicFiles(); collapseCategories(); });
     els.sortSelect.addEventListener("change", () => { state.sort = els.sortSelect.value; renderFiles(); });
     els.categories.addEventListener("click", event => {
         const button = event.target.closest("button[data-category]");
         if (!button) return;
         state.selectedCategory = button.dataset.category;
         renderCategories(); loadPublicFiles(); collapseCategories();
     });
     els.categoriesToggle.addEventListener("click", () => {
         const open = els.categoriesPanel.classList.toggle("open");
         els.categoriesToggle.setAttribute("aria-expanded", String(open));
     });
     els.grid.addEventListener("click", event => {
         const button = event.target.closest("button[data-preview-image]");
         if (!button) return;
         openImagePreview(button.dataset.previewImage, button.dataset.previewTitle);
     });
     $("#image-preview-close").addEventListener("click", () => els.imagePreviewDialog.close());
     els.imagePreviewDialog.addEventListener("click", event => { if (event.target === els.imagePreviewDialog) els.imagePreviewDialog.close(); });
     els.imagePreviewDialog.addEventListener("close", () => { els.imagePreviewImg.src = ""; });
     $("#login-form").addEventListener("submit", login);
     $("#logout-button").addEventListener("click", logout);
     $("#upload-form").addEventListener("submit", upload);
     $("#category-form").addEventListener("submit", createCategory);
     $("#admin-file-filter").addEventListener("change", loadAdminFiles);
     els.adminCategoryFilter.addEventListener("change", renderAdminFiles);
     let adminSearchTimer;
     els.adminFileSearch.addEventListener("input", () => { clearTimeout(adminSearchTimer); adminSearchTimer = setTimeout(renderAdminFiles, 250); });
     $("#print-report").addEventListener("click", () => print());
     $("#file-input").addEventListener("change", showSelectedFile);
     setupDropZone();
     els.adminFiles.addEventListener("click", adminFileAction);
     els.adminFileCards.addEventListener("click", adminFileAction);
     els.adminCategories.addEventListener("click", categoryAction);
     $("#edit-form").addEventListener("submit", saveEdit);
 }

 async function route() {
     const admin = location.hash.startsWith("#/admin");
     els.publicView.hidden = admin;
     els.adminView.hidden = !admin;
     $("#admin-link").hidden = admin;
     if (admin) { await openAdmin(); return; }
     const fileMatch = location.hash.match(/^#\/arquivo\/([^/]+)/);
     state.highlightFile = fileMatch ? decodeURIComponent(fileMatch[1]) : "";
     if (fileMatch) { state.selectedCategory = ""; state.query = ""; els.search.value = ""; }
     await loadPublic();
     if (state.highlightFile) {
         const found = state.files.some(file => file.id === state.highlightFile);
         if (found) highlightFile(state.highlightFile);
         else openSharedFile(state.highlightFile);
     }
 }

 function openSharedFile(id) {
     toast("Abrindo arquivo compartilhado…");
     location.href = `${API}/api/public/files/${encodeURIComponent(id)}/download`;
 }

 async function loadPublic() {
     await Promise.all([loadCategories(), loadPublicFiles()]);
 }

 function highlightFile(id) {
     let card = null;
     try { card = els.grid.querySelector(`[data-file-id="${CSS.escape(id)}"]`); } catch { card = null; }
     if (!card) return;
     card.scrollIntoView({ behavior: "smooth", block: "center" });
     card.classList.add("file-card-highlight");
     setTimeout(() => card.classList.remove("file-card-highlight"), 2600);
 }

 function openImagePreview(url, title) {
     els.imagePreviewImg.src = url;
     els.imagePreviewImg.alt = title || "Pré-visualização da imagem";
     els.imagePreviewTitle.textContent = title || "";
     els.imagePreviewDialog.showModal();
 }

 async function loadCategories() {
     try {
         const data = await api("/api/public/categories");
         state.categories = data.categories || [];
         localStorage.setItem("repo-categories-cache", JSON.stringify(state.categories));
         els.offlineNote.hidden = true;
     } catch (error) {
         state.categories = readCache("repo-categories-cache", []);
         els.offlineNote.hidden = navigator.onLine;
         if (navigator.onLine) toast(error.message, true);
     }
     renderCategories();
 }

 function renderCategories() {
     const total = state.categories.reduce((sum, category) => sum + Number(category.file_count || 0), 0);
     els.categories.innerHTML = `
     <button class="category-button ${state.selectedCategory ? "" : "active"}" data-category=""><span>Todos os arquivos</span><b>${total}</b></button>
     ${state.categories.map(category => `<button class="category-button ${state.selectedCategory === category.id ? "active" : ""}" data-category="${esc(category.id)}"><span>${esc(category.name)}</span><b>${Number(category.file_count || 0)}</b></button>`).join("")}`;
     const selected = state.categories.find(category => category.id === state.selectedCategory);
     els.categoriesToggleLabel.textContent = selected ? selected.name : "Todos os arquivos";
 }

 function collapseCategories() {
     els.categoriesPanel.classList.remove("open");
     els.categoriesToggle.setAttribute("aria-expanded", "false");
 }

 async function loadPublicFiles() {
     const params = new URLSearchParams();
     if (state.selectedCategory) params.set("category", state.selectedCategory);
     if (state.query) params.set("q", state.query);
     try {
         const data = await api(`/api/public/files?${params}`);
         state.files = data.files || [];
         localStorage.setItem("repo-files-cache", JSON.stringify(state.files));
         els.offlineNote.hidden = true;
     } catch (error) {
         state.files = readCache("repo-files-cache", []);
         els.offlineNote.hidden = false;
         if (navigator.onLine) toast(error.message, true);
     }
     renderFiles();
 }

 function sortedFiles() {
     const files = state.files.slice();
     if (state.sort === "downloads") files.sort((a, b) => Number(b.download_count || 0) - Number(a.download_count || 0));
     else if (state.sort === "az") files.sort((a, b) => humanizeTitle(a).localeCompare(humanizeTitle(b), "pt-BR", { sensitivity: "base" }));
     else files.sort((a, b) => new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0));
     return files;
 }

 function renderFiles() {
     const selected = state.categories.find(category => category.id === state.selectedCategory);
     els.catalogTitle.textContent = selected ? selected.name : state.query ? `Resultados para “${state.query}”` : "Todos os arquivos";
     els.resultCount.textContent = `${state.files.length} ${state.files.length === 1 ? "arquivo" : "arquivos"}`;
     els.empty.hidden = state.files.length > 0;
     els.grid.hidden = state.files.length === 0;
     els.grid.innerHTML = sortedFiles().map(file => {
         const isImage = String(file.mime_type).startsWith("image/");
         const preview = isImage || file.mime_type === "application/pdf";
         const displayTitle = humanizeTitle(file);
         const fullTitle = String(file.title || file.original_name || "");
         const downloadUrl = `${API}/api/public/files/${encodeURIComponent(file.id)}/download`;
         const previewUrl = `${API}/api/public/files/${encodeURIComponent(file.id)}/preview`;
         return `<article class="file-card" data-file-id="${esc(file.id)}">
         ${isImage ? `<button type="button" class="file-thumb" data-preview-image="${esc(previewUrl)}" data-preview-title="${esc(displayTitle)}" aria-label="Ampliar ${esc(displayTitle)}"><img src="${esc(previewUrl)}" alt="" loading="lazy" decoding="async"></button>` : ""}
         <div class="file-top"><span class="file-icon" title="${esc(String(file.extension).toUpperCase())}">${fileIconSvg(file.extension)}<b>${esc(String(file.extension).toUpperCase())}</b></span><span class="file-tag" title="${esc(file.category_name)}">${esc(file.category_name)}</span></div>
         <h3 title="${esc(fullTitle)}" aria-label="${esc(fullTitle)}">${esc(displayTitle)}</h3><p class="file-description">${esc(file.description || "Material disponível para download.")}</p>
         <div class="file-meta"><span>${formatBytes(file.size_bytes)}</span><span>${formatDate(file.published_at || file.created_at)}</span></div>
         <div class="file-actions">${isImage
             ? `<button type="button" class="button button-ghost" data-preview-image="${esc(previewUrl)}" data-preview-title="${esc(displayTitle)}">Visualizar</button>`
             : preview ? `<a class="button button-ghost" href="${previewUrl}" target="_blank" rel="noopener">Visualizar</a>` : ""}<a class="button button-primary" href="${downloadUrl}">↓ Baixar</a>${whatsappShareButton(file.id, displayTitle, file.category_name)}</div>
         </article>`;
     }).join("");
 }

 async function openAdmin() {
     if (!state.token) return showLogin();
     try {
         await api("/api/admin/session", { auth: true });
         els.loginCard.hidden = true; els.adminContent.hidden = false;
         await Promise.all([loadDashboard(), loadAdminCategories(), loadAdminFiles()]);
     } catch {
         logout(false); showLogin();
     }
 }

 function showLogin() { els.loginCard.hidden = false; els.adminContent.hidden = true; }

 async function login(event) {
     event.preventDefault();
     const form = event.currentTarget;
     const button = form.querySelector("button");
     setBusy(button, true, "Entrando…");
     try {
         const values = Object.fromEntries(new FormData(form));
         const data = await api("/api/admin/login", { method: "POST", body: values });
         state.token = data.token; sessionStorage.setItem("repo-admin-token", state.token); form.reset();
         toast("Login realizado."); await openAdmin();
     } catch (error) { toast(error.message, true); }
     finally { setBusy(button, false, "Entrar"); }
 }

 function logout(notify = true) {
     state.token = ""; sessionStorage.removeItem("repo-admin-token"); showLogin();
     if (notify) toast("Sessão encerrada.");
 }

 async function loadDashboard() {
     const data = await api("/api/admin/dashboard", { auth: true });
     const cards = [
         ["Categorias", data.stats.categories], ["Arquivos", data.stats.files], ["Publicados", data.stats.public_files],
         ["Rascunhos", data.stats.drafts], ["Downloads", data.stats.downloads], ["Armazenamento", formatBytes(data.stats.size_bytes)]
         ];
     els.stats.innerHTML = cards.map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`).join("");
 }

 async function loadAdminCategories() {
     const data = await api("/api/admin/categories", { auth: true });
     state.categories = data.categories || [];
     els.adminCategories.innerHTML = state.categories.map(category => `<div class="admin-category"><span><strong>${esc(category.name)}</strong><br><small>${Number(category.file_count || 0)} arquivo(s)</small></span><button class="icon-button" data-delete-category="${esc(category.id)}" title="Excluir categoria" aria-label="Excluir ${esc(category.name)}">×</button></div>`).join("");
     const options = state.categories.map(category => `<option value="${esc(category.id)}">${esc(category.name)}</option>`).join("");
     els.uploadCategory.innerHTML = options;
     $("#edit-form select[name=category_id]").innerHTML = options;
     const currentCategoryFilter = els.adminCategoryFilter.value;
     els.adminCategoryFilter.innerHTML = `<option value="">Todas as categorias</option>${options}`;
     els.adminCategoryFilter.value = currentCategoryFilter;
 }

 async function loadAdminFiles() {
     const filter = $("#admin-file-filter").value;
     const data = await api(`/api/admin/files${filter ? `?visibility=${filter}` : ""}`, { auth: true });
     state.adminFiles = data.files || [];
     renderAdminFiles();
 }

 function renderAdminFiles() {
     const categoryFilter = els.adminCategoryFilter.value;
     const query = els.adminFileSearch.value.trim().toLowerCase();
     const files = state.adminFiles.filter(file => {
         if (categoryFilter && file.category_id !== categoryFilter) return false;
         if (query) {
             const haystack = `${file.title} ${file.original_name} ${humanizeTitle(file)}`.toLowerCase();
             if (!haystack.includes(query)) return false;
         }
         return true;
     });
     const statusNames = { public: "Publicado", draft: "Rascunho", private: "Não listado" };
     els.adminFiles.innerHTML = files.length ? files.map(file => `<tr>
     <td><div class="table-file"><span class="mini-icon" title="${esc(String(file.extension).toUpperCase())}">${fileIconSvg(file.extension)}</span><span><strong title="${esc(file.title)}">${esc(humanizeTitle(file))}</strong><small title="${esc(file.original_name)}">${esc(file.original_name)}</small></span></div></td>
     <td>${esc(file.category_name)}</td><td><span class="status status-${esc(file.visibility)}">${statusNames[file.visibility]}</span></td>
     <td>${formatBytes(file.size_bytes)}</td><td>${Number(file.download_count || 0)}</td>
     <td><div class="row-actions"><button class="button button-ghost button-small" data-download-file="${esc(file.id)}" title="Baixar arquivo original" aria-label="Baixar ${esc(file.original_name)}">↓ Baixar</button>${whatsappShareButton(file.id, humanizeTitle(file), file.category_name, "button-small")}<button class="button button-ghost button-small" data-edit-file="${esc(file.id)}">Editar</button><button class="button button-danger button-small" data-delete-file="${esc(file.id)}">Excluir</button></div></td>
     </tr>`).join("") : `<tr><td colspan="6">Nenhum arquivo encontrado.</td></tr>`;
     els.adminFileCards.innerHTML = files.length ? files.map(file => `<article class="file-row-card">
     <div class="file-row-top"><span class="mini-icon" title="${esc(String(file.extension).toUpperCase())}">${fileIconSvg(file.extension)}</span>
     <div class="file-row-info"><strong title="${esc(file.title)}">${esc(humanizeTitle(file))}</strong><small title="${esc(file.original_name)}">${esc(file.original_name)}</small></div>
     <span class="status status-${esc(file.visibility)}">${statusNames[file.visibility]}</span></div>
     <div class="file-row-meta"><span>${esc(file.category_name)}</span><span>${formatBytes(file.size_bytes)}</span><span>↓ ${Number(file.download_count || 0)}</span></div>
     <div class="row-actions"><button class="button button-ghost button-small" data-download-file="${esc(file.id)}" title="Baixar arquivo original" aria-label="Baixar ${esc(file.original_name)}">↓ Baixar</button>${whatsappShareButton(file.id, humanizeTitle(file), file.category_name, "button-small")}<button class="button button-ghost button-small" data-edit-file="${esc(file.id)}">Editar</button><button class="button button-danger button-small" data-delete-file="${esc(file.id)}">Excluir</button></div>
     </article>`).join("") : `<p class="empty-hint">Nenhum arquivo encontrado.</p>`;
 }

 async function upload(event) {
     event.preventDefault(); const form = event.currentTarget; const button = form.querySelector("button[type=submit]");
     const data = new FormData(form); const file = data.get("file");
     if (!(file instanceof File) || !file.size) return toast("Selecione um arquivo.", true);
     setBusy(button, true, "Enviando…"); $("#upload-progress").hidden = false;
     try {
         await uploadWithProgress(data); form.reset(); showSelectedFile(); toast("Arquivo enviado com sucesso.");
         await Promise.all([loadDashboard(), loadAdminFiles(), loadAdminCategories()]);
     } catch (error) { toast(error.message, true); }
     finally { setBusy(button, false, "Enviar arquivo"); $("#upload-progress").hidden = true; }
 }

 function uploadWithProgress(formData) {
     return new Promise((resolve, reject) => {
         const xhr = new XMLHttpRequest(); xhr.open("POST", `${API}/api/admin/files`); xhr.setRequestHeader("Authorization", `Bearer ${state.token}`);
         xhr.onload = () => { const data = parseJson(xhr.responseText); if (xhr.status >= 200 && xhr.status < 300) resolve(data); else reject(new Error(data.error || `Erro ${xhr.status}`)); };
         xhr.onerror = () => reject(new Error("Falha de conexão durante o upload.")); xhr.send(formData);
     });
 }

 async function downloadAdminFile(file) {
     const response = await fetch(`${API}/api/admin/files/${encodeURIComponent(file.id)}/download`, { headers: { Authorization: `Bearer ${state.token}` } });
     if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || `Erro ${response.status}`); }
     const blob = await response.blob();
     const url = URL.createObjectURL(blob);
     const link = document.createElement("a");
     link.href = url; link.download = file.original_name || file.title;
     document.body.appendChild(link); link.click(); link.remove();
     URL.revokeObjectURL(url);
 }

 async function createCategory(event) {
     event.preventDefault(); const form = event.currentTarget; const button = form.querySelector("button");
     setBusy(button, true, "Salvando…");
     try { await api("/api/admin/categories", { method: "POST", body: Object.fromEntries(new FormData(form)), auth: true }); form.reset(); toast("Categoria adicionada."); await Promise.all([loadAdminCategories(), loadDashboard()]); }
     catch (error) { toast(error.message, true); } finally { setBusy(button, false, "Adicionar"); }
 }

 async function categoryAction(event) {
     const button = event.target.closest("button[data-delete-category]"); if (!button) return;
     if (!confirm("Excluir esta categoria? A operação só será aceita se ela estiver vazia.")) return;
     try { await api(`/api/admin/categories/${encodeURIComponent(button.dataset.deleteCategory)}`, { method: "DELETE", auth: true }); toast("Categoria excluída."); await Promise.all([loadAdminCategories(), loadDashboard()]); }
     catch (error) { toast(error.message, true); }
 }

 async function adminFileAction(event) {
     const edit = event.target.closest("button[data-edit-file]"); const remove = event.target.closest("button[data-delete-file]");
     const download = event.target.closest("button[data-download-file]");
     if (download) {
         const file = state.adminFiles.find(item => item.id === download.dataset.downloadFile); if (!file) return;
         setDownloadBusy(download, true);
         try { await downloadAdminFile(file); }
         catch (error) { toast(error.message, true); }
         finally { setDownloadBusy(download, false); }
     }
     if (edit) {
         const file = state.adminFiles.find(item => item.id === edit.dataset.editFile); if (!file) return;
         const form = $("#edit-form"); form.elements.id.value = file.id; form.elements.title.value = file.title; form.elements.description.value = file.description || "";
         form.elements.category_id.value = file.category_id; form.elements.visibility.value = file.visibility; els.editDialog.showModal();
     }
     if (remove) {
         const file = state.adminFiles.find(item => item.id === remove.dataset.deleteFile); if (!file || !confirm(`Excluir definitivamente “${file.title}”? O arquivo também será apagado do R2.`)) return;
         try { await api(`/api/admin/files/${encodeURIComponent(file.id)}`, { method: "DELETE", auth: true }); toast("Arquivo excluído."); await Promise.all([loadDashboard(), loadAdminFiles(), loadAdminCategories()]); }
         catch (error) { toast(error.message, true); }
     }
 }

 async function saveEdit(event) {
     event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form));
     try { await api(`/api/admin/files/${encodeURIComponent(values.id)}`, { method: "PUT", body: values, auth: true }); els.editDialog.close(); toast("Arquivo atualizado."); await Promise.all([loadDashboard(), loadAdminFiles()]); }
     catch (error) { toast(error.message, true); }
 }

 async function api(path, options = {}) {
     if (!API) throw new Error("URL da API não configurada.");
     const headers = new Headers(options.headers || {}); let body = options.body;
     if (body && !(body instanceof FormData)) { headers.set("Content-Type", "application/json"); body = JSON.stringify(body); }
     if (options.auth) headers.set("Authorization", `Bearer ${state.token}`);
     const response = await fetch(`${API}${path}`, { method: options.method || "GET", headers, body });
     const data = await response.json().catch(() => ({}));
     if (response.status === 401 && options.auth) logout(false);
     if (!response.ok) throw new Error(data.error || `Erro ${response.status}`);
     return data;
 }

 function setupDropZone() {
     const zone = $("#drop-zone");
     ["dragenter", "dragover"].forEach(type => zone.addEventListener(type, event => { event.preventDefault(); zone.classList.add("drag"); }));
     ["dragleave", "drop"].forEach(type => zone.addEventListener(type, event => { event.preventDefault(); zone.classList.remove("drag"); }));
     zone.addEventListener("drop", event => { if (event.dataTransfer.files.length) { $("#file-input").files = event.dataTransfer.files; showSelectedFile(); } });
 }

 function showSelectedFile() { const file = $("#file-input").files[0]; $("#selected-file").textContent = file ? `${file.name} — ${formatBytes(file.size)}` : "Nenhum arquivo selecionado"; }
    function toggleTheme() { const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = theme; localStorage.setItem("repo-theme", theme); $("#theme-button").textContent = theme === "dark" ? "☀" : "☾"; }
    function updateNetwork() { const online = navigator.onLine; const el = $("#network-status"); el.classList.toggle("offline", !online); el.querySelector("span").textContent = online ? "Online" : "Offline"; }
    function toast(message, error = false, duration = 4000) { clearTimeout(toast.timer); els.toast.textContent = message; els.toast.classList.toggle("error", error); els.toast.hidden = false; toast.timer = setTimeout(() => els.toast.hidden = true, duration); }
    function setBusy(button, busy, label) { button.disabled = busy; button.textContent = label; }
    function setDownloadBusy(button, busy) {
        button.disabled = busy;
        button.innerHTML = busy ? '<span class="spinner" aria-hidden="true"></span><span>Baixando…</span>' : "↓ Baixar";
    }
    function formatBytes(value) { const bytes = Number(value || 0); if (bytes < 1024) return `${bytes} B`; const units = ["KB", "MB", "GB"]; let size = bytes / 1024, unit = 0; while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++; } return `${size.toFixed(size >= 10 ? 1 : 2)} ${units[unit]}`; }
    function formatDate(value) { if (!value) return ""; const date = new Date(String(value).includes("T") ? value : `${String(value).replace(" ", "T")}Z`); return Number.isNaN(date.valueOf()) ? "" : date.toLocaleDateString("pt-BR"); }
    function readCache(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
    function parseJson(value) { try { return JSON.parse(value); } catch { return {}; } }
    function esc(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
})();
