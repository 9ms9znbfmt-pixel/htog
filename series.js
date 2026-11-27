(() => {
  "use strict";
  const main = document.querySelector("[data-series]");
  const collection = collections.find((item) => item.id === main?.dataset.series);
  if (!main || !collection) return;
  document.getElementById("series-description").textContent = collection.description;
  const sequence = document.getElementById("series-photographs");
  collection.photos.filter((photo) => photo.src.trim()).forEach((photo, index) => {
    const figure = document.createElement("figure");
    const link = document.createElement("a");
    link.className = "picture";
    link.href = photo.src;
    link.setAttribute("data-viewer", "");
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || photo.title;
    img.loading = index === 0 ? "eager" : "lazy";
    img.decoding = "async";
    img.addEventListener("load", () => {
      figure.classList.toggle("is-portrait", img.naturalHeight > img.naturalWidth);
    });
    link.append(img);
    const caption = document.createElement("figcaption");
    caption.textContent = photo.title;
    figure.append(link, caption);
    sequence.append(figure);
  });
  const navigation = document.getElementById("series-navigation");
  const home = document.createElement("a");
  home.className = "text-link";
  home.href = `index.html#${collection.id}`;
  home.textContent = "← 홈으로";
  home.lang = "ko";
  const other = collections.find((item) => item.id !== collection.id);
  navigation.append(home);
  if (other) {
    const next = document.createElement("a");
    next.className = "text-link";
    next.href = other.page;
    next.textContent = `${other.title} →`;
    navigation.append(next);
  }
})();
