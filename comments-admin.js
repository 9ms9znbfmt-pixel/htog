(() => {
  "use strict";
  const api = window.HtoGCommentsAPI;
  const { element: el, request } = api;
  const login = document.getElementById("admin-login");
  const panel = document.getElementById("admin-panel");
  const status = document.getElementById("admin-status");
  const list = document.getElementById("admin-list");
  const filter = document.getElementById("admin-filter");
  const seriesFilter = document.getElementById("admin-series");
  const more = document.getElementById("admin-more");
  let session = null;
  let offset = 0;
  let generation = 0;
  let loading = false;
  const pageSize = 30;
  function clearSession(message = "로그아웃했어요.") {
    session = null;
    generation++;
    panel.hidden = true;
    login.hidden = false;
    list.replaceChildren();
    status.textContent = message;
  }
  async function authorized(path, options = {}) {
    if (!session || Date.now() >= session.expiresAt) {
      clearSession("로그인 시간이 만료되었어요. 다시 로그인해주세요.");
      throw new Error("다시 로그인해주세요.");
    }
    try { return await request(path, { ...options, token: session.access_token }); }
    catch (error) {
      if (error.status === 401) clearSession("다시 로그인해주세요.");
      throw error;
    }
  }
  function render(row) {
    const card = el("article", "comment-admin-card");
    const meta = el("div", "conversation-entry-meta");
    meta.append(el("strong", "", row.name), el("span", "", `${row.series === "classic-cars" ? "Classic Car Show" : "Japan, in passing"} · ${row.approved ? "공개 중" : "확인 대기"} · ${api.dateLabel(row.created_at)}`));
    const label = el("label", "", "작가 답글");
    const input = el("textarea");
    input.id = `reply-${row.id}`;
    input.value = row.reply || "";
    input.maxLength = 2000;
    input.rows = 4;
    label.htmlFor = input.id;
    const feedback = el("p", "comment-admin-feedback");
    feedback.setAttribute("role", "status");
    const actions = el("div", "comment-admin-actions");
    const save = el("button", "", "답글 저장");
    const approve = el("button", "", row.approved ? "비공개로 전환" : "공개하기");
    const remove = el("button", "danger", "삭제");
    for (const button of [save, approve, remove]) button.type = "button";
    async function change(patch, message, deleting = false) {
      for (const button of [save, approve, remove]) button.disabled = true;
      feedback.textContent = "저장하고 있어요…";
      try {
        const result = await authorized(`/rest/v1/htog_comments?id=eq.${encodeURIComponent(row.id)}`, {
          method: deleting ? "DELETE" : "PATCH", ...(deleting ? {} : { body: patch }), prefer: "return=representation"
        });
        if (!result?.length) throw new Error("글이 변경되었거나 삭제되었어요. 새로고침해주세요.");
        if (deleting) { card.remove(); status.textContent = message; }
        else {
          Object.assign(row, result[0]);
          approve.textContent = row.approved ? "비공개로 전환" : "공개하기";
          meta.lastChild.textContent = `${row.series === "classic-cars" ? "Classic Car Show" : "Japan, in passing"} · ${row.approved ? "공개 중" : "확인 대기"} · ${api.dateLabel(row.created_at)}`;
          feedback.textContent = message;
          // Keep the row until refresh: unsaved text and list offsets remain stable.
        }
      } catch (error) { feedback.textContent = error.message; }
      finally { for (const button of [save, approve, remove]) button.disabled = false; }
    }
    save.addEventListener("click", () => change({ reply: input.value.trim() || null }, row.approved ? "답글을 저장했어요. 공개 페이지에 표시됩니다." : "답글을 저장했어요. 공개하기를 누르면 함께 표시됩니다."));
    approve.addEventListener("click", () => change({ approved: !row.approved, reply: input.value.trim() || null }, row.approved ? "비공개로 전환했어요." : "이야기와 답글을 공개했어요."));
    remove.addEventListener("click", () => {
      if (window.confirm("이 이야기와 답글을 삭제할까요? 삭제 후에는 복구할 수 없어요.")) change(null, "이야기를 삭제했어요.", true);
    });
    actions.append(save, approve, remove);
    card.append(meta, el("p", "conversation-body", row.body), label, input, actions, feedback);
    list.append(card);
  }
  async function load(reset = true) {
    if (loading || !session) return;
    const current = ++generation;
    loading = true;
    more.disabled = true;
    filter.disabled = seriesFilter.disabled = true;
    document.getElementById("admin-refresh").disabled = true;
    if (reset) { offset = 0; list.replaceChildren(); }
    status.textContent = "이야기를 불러오고 있어요…";
    try {
      const query = new URLSearchParams({ select: "*", order: "created_at.desc,id.desc", limit: String(pageSize), offset: String(offset) });
      if (filter.value !== "all") query.set("approved", `eq.${filter.value === "approved"}`);
      if (seriesFilter.value !== "all") query.set("series", `eq.${seriesFilter.value}`);
      const rows = await authorized(`/rest/v1/htog_comments?${query}`);
      if (current !== generation || !session) return;
      rows.forEach(render);
      offset += rows.length;
      more.hidden = rows.length < pageSize;
      status.textContent = offset ? `${offset}개의 이야기를 불러왔어요.` : "이 조건에 해당하는 이야기가 없어요.";
    } catch (error) { status.textContent = error.message; }
    finally {
      loading = false;
      more.disabled = false;
      filter.disabled = seriesFilter.disabled = false;
      document.getElementById("admin-refresh").disabled = false;
    }
  }
  login.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = login.querySelector("button");
    button.disabled = true;
    status.textContent = "로그인하고 있어요…";
    try {
      const data = await request("/auth/v1/token?grant_type=password", {
        method: "POST", body: { email: document.getElementById("admin-email").value.trim(), password: document.getElementById("admin-password").value }
      });
      document.getElementById("admin-password").value = "";
      session = { access_token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
      const members = await authorized(`/rest/v1/htog_comment_admins?select=user_id&user_id=eq.${encodeURIComponent(data.user.id)}`);
      if (!members.length) {
        await request("/auth/v1/logout", { method: "POST", token: session.access_token }).catch(() => {});
        clearSession("이 계정에는 관리 권한이 없어요.");
        return;
      }
      login.hidden = true;
      panel.hidden = false;
      await load();
    } catch (error) { clearSession(error.message); }
    finally { button.disabled = false; }
  });
  document.getElementById("admin-logout").addEventListener("click", async () => {
    const token = session?.access_token;
    clearSession("로그아웃했어요.");
    if (token) await request("/auth/v1/logout", { method: "POST", token }).catch(() => {});
  });
  document.getElementById("admin-refresh").addEventListener("click", () => load());
  filter.addEventListener("change", () => load());
  seriesFilter.addEventListener("change", () => load());
  more.addEventListener("click", () => load(false));
  if (!api.ready) {
    login.querySelector("button").disabled = true;
    status.textContent = "comments-config.js에 Supabase 연결 정보를 먼저 입력해주세요.";
  }
})();
