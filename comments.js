(() => {
  "use strict";
  const main = document.querySelector("[data-series]");
  const api = window.HtoGCommentsAPI;
  if (!main || !api || document.getElementById("series-conversation")) return;
  const { element: el, request } = api;
  const series = main.dataset.series;
  const section = el("section", "conversation");
  section.id = "series-conversation";
  section.lang = "ko";
  section.setAttribute("aria-labelledby", "conversation-title");
  const intro = el("div", "conversation-intro");
  const eyebrow = el("p", "conversation-eyebrow", "A conversation, after looking");
  eyebrow.lang = "en";
  const title = el("h2", "", "어떤 장면이 오래 남았나요?");
  title.id = "conversation-title";
  intro.append(eyebrow, title, el("p", "conversation-lead", "사진을 보며 떠오른 생각이나 궁금한 이야기를 남겨주세요."));
  const layout = el("div", "conversation-layout");
  const form = el("form", "conversation-form");
  const fields = el("fieldset", "conversation-fields");
  fields.append(el("legend", "sr-only", "감상 남기기"));
  const nameLabel = el("label", "", "이름 또는 별명");
  nameLabel.htmlFor = "conversation-name";
  const name = el("input");
  Object.assign(name, { id: "conversation-name", name: "name", required: true, maxLength: 30, autoComplete: "nickname", placeholder: "어떤 이름으로 남길까요?" });
  const bodyLabel = el("label", "", "남기고 싶은 이야기");
  bodyLabel.htmlFor = "conversation-body";
  const body = el("textarea");
  Object.assign(body, { id: "conversation-body", name: "body", required: true, minLength: 2, maxLength: 1000, rows: 5, placeholder: "마음에 남은 장면, 떠오른 기억, 궁금한 것들." });
  const counter = el("span", "conversation-counter", "0 / 1,000");
  counter.setAttribute("aria-hidden", "true");
  body.addEventListener("input", () => { counter.textContent = `${body.value.length.toLocaleString()} / 1,000`; });
  const trap = el("div", "conversation-trap");
  trap.setAttribute("aria-hidden", "true");
  const trapLabel = el("label", "", "Website — leave empty");
  const website = el("input");
  Object.assign(website, { name: "website", tabIndex: -1, autoComplete: "off" });
  trapLabel.append(website);
  trap.append(trapLabel);
  const note = el("p", "conversation-note", "이야기는 작가가 확인한 뒤 공개됩니다. 별명과 내용은 공개되니 연락처 등 개인정보는 적지 말아주세요.");
  note.id = "conversation-note";
  form.setAttribute("aria-describedby", note.id);
  const submit = el("button", "conversation-submit", "이야기 남기기 ↗");
  submit.type = "submit";
  fields.append(nameLabel, name, bodyLabel, body, counter, trap, note, submit);
  const status = el("p", "conversation-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  form.append(fields, status);
  const responses = el("div", "conversation-responses");
  const listTitle = el("h3", "conversation-list-title", "남겨진 이야기");
  const list = el("div", "conversation-list");
  const loadStatus = el("p", "conversation-empty", "이야기를 불러오고 있어요.");
  const more = el("button", "conversation-more", "이전 이야기 더 보기 ↓");
  more.type = "button";
  more.hidden = true;
  responses.append(listTitle, list, loadStatus, more);
  layout.append(form, responses);
  section.append(intro, layout);
  const navigation = document.getElementById("series-navigation");
  main.insertBefore(section, navigation || null);

  let offset = 0;
  let loading = false;
  const limit = 20;
  async function load() {
    if (loading) return;
    loading = true;
    more.disabled = true;
    try {
      const query = new URLSearchParams({
        select: "id,name,body,reply,created_at", series: `eq.${series}`,
        approved: "eq.true", order: "created_at.desc,id.desc", limit: String(limit), offset: String(offset)
      });
      const rows = await request(`/rest/v1/htog_comments?${query}`);
      for (const row of rows) {
        const article = el("article", "conversation-entry");
        const meta = el("div", "conversation-entry-meta");
        const time = el("time", "", api.dateLabel(row.created_at));
        time.dateTime = row.created_at;
        meta.append(el("span", "conversation-author", row.name), time);
        article.append(meta, el("p", "conversation-body", row.body));
        if (row.reply) {
          const reply = el("div", "conversation-reply");
          reply.append(el("span", "conversation-reply-author", "동훈 · 작가"), el("p", "conversation-body", row.reply));
          article.append(reply);
        }
        list.append(article);
      }
      offset += rows.length;
      more.textContent = "이전 이야기 더 보기 ↓";
      loadStatus.textContent = offset ? "" : "아직 남겨진 이야기가 없어요. 첫 이야기를 들려주세요.";
      more.hidden = rows.length < limit;
    } catch (_) {
      loadStatus.textContent = "이야기를 불러오지 못했어요. 다시 시도해주세요.";
      more.hidden = false;
      more.textContent = "다시 불러오기 ↻";
    } finally { loading = false; more.disabled = false; }
  }
  more.addEventListener("click", load);
  let submitting = false;
  let lastSent = 0;
  const openedAt = Date.now();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !api.ready) return;
    if (!form.reportValidity()) return;
    if (website.value || Date.now() - openedAt < 2000) {
      status.textContent = "잠시 후 다시 시도해주세요.";
      return;
    }
    if (lastSent && Date.now() - lastSent < 60000) {
      status.textContent = "이야기가 접수되었어요. 잠시 기다린 뒤 다시 남겨주세요.";
      return;
    }
    const trimmedName = name.value.trim();
    const trimmedBody = body.value.trim();
    if (!trimmedName || trimmedBody.length < 2) {
      status.textContent = "별명과 두 글자 이상의 이야기를 적어주세요.";
      return;
    }
    submitting = true;
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.textContent = "이야기를 보내고 있어요…";
    try {
      await request("/rest/v1/rpc/htog_submit_comment", {
        method: "POST", body: { p_series: series, p_name: trimmedName, p_body: trimmedBody }
      });
      lastSent = Date.now();
      body.value = "";
      counter.textContent = "0 / 1,000";
      status.textContent = "이야기를 잘 받았어요. 작가가 확인한 뒤 이곳에 공개됩니다.";
    } catch (error) {
      status.textContent = error.message || "전송하지 못했어요. 입력한 글은 그대로 남아 있어요.";
    } finally {
      submitting = false;
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
  if (api.ready) load();
  else {
    fields.disabled = true;
    status.textContent = "이야기를 나눌 공간을 준비하고 있어요.";
    loadStatus.textContent = "곧 이곳에서 이야기를 나눌 수 있어요.";
  }
})();
