"use strict";

const photographs = [
  {
    src: "media/17.JPG",
    title: "01 / Classic Car Show",
    alt: "media/17.JPG",
    layout: "opening",
  },
  {
    src: "media/18.JPG",
    title: "02 / Classic Car Show",
    alt: "media/18.JPG",
    layout: "detail",
  },
  {
    src: "media/19.JPG",
    title: "03 / Classic Car Show",
    alt: "media/19.JPG",
    layout: "detail",
  },
  {
    src: "",
    title: "04 / Classic Car Show",
    alt: "",
    layout: "closing",
  },
];

const sequence = document.getElementById("car-sequence");

photographs.forEach((photo, index) => {
  const figure = document.createElement("figure");
  figure.className = `car-work car-work--${photo.layout}`;
  const stage = document.createElement("div");
  stage.className = "car-stage";

  const empty = () => {
    stage.replaceChildren();
    stage.classList.add("is-empty");
    const number = document.createElement("span");
    number.className = "slot-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("span");
    label.className = "slot-label";
    label.textContent = "Photograph";
    stage.append(number, label);
    stage.setAttribute("aria-label", `Photograph ${index + 1}: awaiting selection`);
  };

  if (photo.src.trim()) {
    const link = document.createElement("a");
    link.className = "picture";
    link.href = photo.src;
    link.setAttribute("data-viewer", "");
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || photo.title;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", empty, { once: true });
    link.append(img);
    stage.append(link);
  } else {
    empty();
  }

  const caption = document.createElement("figcaption");
  caption.textContent = photo.title;
  figure.append(stage, caption);
  sequence.append(figure);
});
