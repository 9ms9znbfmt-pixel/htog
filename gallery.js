"use strict";

const collections = [
  {
    id: "classic-cars",
    title: "Classic Car Show",
    description: "오래된 차를 바라보는 시선.",
    photos: [
      { src: "media/17.JPG", title: "Classic Car Show / 01", alt: "클래식카쇼에서 촬영한 사진 1" },
      { src: "media/18.JPG", title: "Classic Car Show / 02", alt: "클래식카쇼에서 촬영한 사진 2" },
      { src: "media/19.JPG", title: "Classic Car Show / 03", alt: "클래식카쇼에서 촬영한 사진 3" },
      { src: "media/20.JPG", title: "Classic Car Show / 04", alt: "" },
    ],
  },
  {
    id: "japan",
    title: "Japan, in passing",
    description: "일본에서, 걸으며 마주한 장면들.",
    photos: [
      { src: "media/21.JPG", title: "Japan / 01", alt: "" },
      { src: "media/22.JPG", title: "Japan / 02", alt: "" },
      { src: "media/23.JPG", title: "Japan / 03", alt: "" },
      { src: "media/24.JPG", title: "Japan / 04", alt: "" },
    ],
  },
];

const container = document.getElementById("collections");

collections.forEach((collection, collectionIndex) => {
  const section = document.createElement("section");
  section.className = "photo-collection";
  section.id = collection.id;
  section.setAttribute("aria-labelledby", `${collection.id}-title`);

  const head = document.createElement("div");
  head.className = "collection-head";
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = `Selected series / ${String(collectionIndex + 1).padStart(2, "0")}`;
  const heading = document.createElement("h2");
  heading.id = `${collection.id}-title`;
  heading.textContent = collection.title;
  const description = document.createElement("p");
  description.className = "collection-description";
  description.lang = "ko";
  description.textContent = collection.description;
  head.append(eyebrow, heading, description);

  const track = document.createElement("div");
  track.className = "photo-track";
  track.id = `${collection.id}-track`;
  track.tabIndex = 0;
  track.setAttribute("role", "region");
  track.setAttribute("aria-label", `${collection.title} photographs`);

  collection.photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "slide";
    const stage = document.createElement("div");
    stage.className = "slide-stage";
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
    track.append(figure);
  });

  const controls = document.createElement("div");
  controls.className = "collection-controls";
  const status = document.createElement("span");
  status.className = "slide-count";
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  const buttons = document.createElement("div");
  buttons.className = "slide-buttons";
  const previous = document.createElement("button");
  const next = document.createElement("button");
  previous.textContent = "←";
  next.textContent = "→";
  for (const [button, label] of [[previous, "Previous photograph"], [next, "Next photograph"]]) {
    button.type = "button";
    button.setAttribute("aria-label", `${collection.title}: ${label}`);
    button.setAttribute("aria-controls", track.id);
    buttons.append(button);
  }
  controls.append(status, buttons);
  section.append(head, track, controls);
  container.append(section);

  let activeIndex = 0;
  const slides = [...track.children];
  const update = () => {
    const origin = track.getBoundingClientRect().left;
    const closest = slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - origin);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    activeIndex = closest.index;
    status.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === slides.length - 1;
  };
  const move = (direction) => {
    const target = slides[Math.max(0, Math.min(slides.length - 1, activeIndex + direction))];
    track.scrollBy({
      left: target.getBoundingClientRect().left - track.getBoundingClientRect().left,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("keydown", (event) => {
    if (event.target !== track) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  let frame;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
});
