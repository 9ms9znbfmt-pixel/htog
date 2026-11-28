(() => {
  "use strict";
  const config = window.HTOG_COMMENTS || {};
  const url = String(config.url || "").replace(/\/+$/, "");
  const publicKey = String(config.publicKey || "").trim();
  let secret = publicKey.startsWith("sb_secret_");
  try {
    const part = publicKey.split(".")[1];
    if (part) secret ||= JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))).role === "service_role";
  } catch (_) { /* Publishable keys do not contain JWT payloads. */ }
  const ready = /^https:\/\/[^/]+$/.test(url) && Boolean(publicKey) && !secret;

  async function request(path, { method = "GET", body, token, prefer } = {}) {
    if (!ready) throw new Error("아직 연결을 준비하고 있어요.");
    const headers = { apikey: publicKey, "Content-Type": "application/json" };
    // Modern publishable keys belong in apikey, not in the Bearer JWT header.
    if (token) headers.Authorization = `Bearer ${token}`;
    if (prefer) headers.Prefer = prefer;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${url}${path}`, {
        method, headers, signal: controller.signal,
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      });
      const raw = await response.text();
      let data;
      try { data = raw ? JSON.parse(raw) : null; } catch (_) { data = null; }
      if (!response.ok) {
        const code = data?.message || data?.error_code || "";
        let message = "연결이 원활하지 않아요. 잠시 후 다시 시도해주세요.";
        if (code.includes("HTOG_WAIT")) message = "같은 별명으로는 1분 뒤에 다시 남길 수 있어요.";
        if (code.includes("HTOG_DUPLICATE")) message = "같은 이야기가 이미 접수되었어요.";
        if (code.includes("HTOG_INVALID")) message = "별명과 이야기의 길이를 확인해주세요.";
        if (response.status === 401) message = "로그인 정보를 확인하거나 다시 로그인해주세요.";
        if (response.status === 403) message = "이 작업을 할 권한이 없어요.";
        throw Object.assign(new Error(message), { status: response.status });
      }
      return data;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("응답이 늦어지고 있어요. 잠시 후 다시 시도해주세요.");
      throw error;
    } finally { clearTimeout(timeout); }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function dateLabel(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Seoul"
    });
  }
  window.HtoGCommentsAPI = Object.freeze({ ready, request, element, dateLabel });
})();
