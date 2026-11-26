"use strict";

const contact = {
  email: "",
  instagram: "",
};

for (const node of document.querySelectorAll("[data-contact]")) {
  const kind = node.dataset.contact;
  const value = contact[kind].trim();
  if (!value) continue;
  const link = document.createElement("a");
  if (kind === "email") {
    link.href = `mailto:${value}`;
    link.textContent = value;
  } else {
    const username = value.replace(/^@/, "");
    link.href = `https://www.instagram.com/${encodeURIComponent(username)}/`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const label = document.createElement("span");
    label.textContent = "Instagram";
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    link.append(label, arrow);
  }
  node.replaceWith(link);
}
