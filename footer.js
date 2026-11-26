(() => {
  "use strict";

  const footerContact = {
    email: "hoon.to.graphy.4@gmail.com",
    instagram: "https://www.instagram.com/hoon.tography?jplx=MWlsZDlyamQ3MHVoNQ%3D%3D&utm_source=qr",
    blog: "https://blog.naver.com/nine_eighteen",
  };

  // Reuse addresses already entered in the earlier About contact file.
  if (typeof contact !== "undefined") {
    footerContact.email ||= contact.email || "";
    footerContact.instagram ||= contact.instagram || "";
  }

  const footer = document.querySelector(".footer");
  if (!footer || footer.querySelector(".footer-social")) return;

  document.querySelectorAll(".about-contact").forEach((section) => section.remove());

  if (!document.getElementById("htog-footer-style")) {
    const style = document.createElement("link");
    style.id = "htog-footer-style";
    style.rel = "stylesheet";
    style.href = new URL("footer.css?v=20261126-1", document.currentScript.src).href;
    document.head.append(style);
  }

  const links = document.createElement("nav");
  links.className = "footer-social";
  links.setAttribute("aria-label", "Contact and social links");

  const entries = [
    { label: "Email", value: footerContact.email.trim(), kind: "email" },
    { label: "Instagram", value: footerContact.instagram.trim(), kind: "instagram" },
    { label: "Blog", value: footerContact.blog.trim(), kind: "blog" },
  ];

  entries.forEach(({ label, value, kind }, index) => {
    if (index > 0) {
      const separator = document.createElement("span");
      separator.className = "footer-separator";
      separator.textContent = "·";
      separator.setAttribute("aria-hidden", "true");
      links.append(separator);
    }
    const item = document.createElement(value ? "a" : "span");
    item.textContent = label;
    if (value) {
      if (kind === "email") {
        item.href = `mailto:${value}`;
      } else {
        item.href = kind === "instagram"
          ? /^https:\/\//i.test(value)
            ? value
            : `https://www.instagram.com/${encodeURIComponent(value.replace(/^@/, ""))}/`
          : value;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      }
    } else {
      item.className = "footer-pending";
    }
    links.append(item);
  });

  const copyright = [...footer.children].find((item) => item.tagName === "SPAN");
  footer.insertBefore(links, copyright || null);
})();
