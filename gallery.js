"use strict";

const collections = [
  {
    id: "classic-cars",
    title: "Classic Car Show",
    description: "오래된 차의 선과 색, 그 표면에 머무는 빛을 바라봅니다.\n시간이 지나도 눈길을 붙잡는 장면들을 모았습니다.",
    page: "classic-cars.html",
    photos: [
      { src: "media/CCS/CCS-1.JPG", title: "Classic Car Show / 01", alt: "" },
      { src: "media/CCS/CCS-2.JPG", title: "Classic Car Show / 02", alt: "" },
      { src: "media/CCS/CCS-3.JPG", title: "Classic Car Show / 03", alt: "" },
      { src: "media/CCS/CCS-4.JPG", title: "Classic Car Show / 04", alt: "" },
      { src: "media/CCS/CCS-5.JPG", title: "Classic Car Show / 05", alt: "" },
      { src: "media/CCS/CCS-6.JPG", title: "Classic Car Show / 06", alt: "" },
      { src: "media/CCS/CCS-7.JPG", title: "Classic Car Show / 07", alt: "" },
      { src: "media/CCS/CCS-8.JPG", title: "Classic Car Show / 08", alt: "" },
      { src: "media/CCS/CCS-9.JPG", title: "Classic Car Show / 09", alt: "" },
      { src: "media/CCS/CCS-10.JPG", title: "Classic Car Show / 10", alt: "" },
      { src: "media/CCS/CCS-11.JPG", title: "Classic Car Show / 11", alt: "" },
      { src: "media/CCS/CCS-12.JPG", title: "Classic Car Show / 12", alt: "" },
      { src: "media/CCS/CCS-13.JPG", title: "Classic Car Show / 13", alt: "" },
      { src: "media/CCS/CCS-14.JPG", title: "Classic Car Show / 14", alt: "" },
      { src: "media/CCS/CCS-15.JPG", title: "Classic Car Show / 15", alt: "" },
    ],
  },
  {
    id: "japan",
    title: "Japan, In Passing",
    description: "낯선 거리를 걸으며 빛과 사람 사이에 잠시 머물렀습니다.\n스쳐 간 장면들 가운데 오래 남은 순간들을 모았습니다.",
    page: "japan.html",
    photos: [
      { src: "media/ZIP/ZIP-1.JPG", title: "Japan / 01", alt: "" },
      { src: "media/ZIP/ZIP-2.JPG", title: "Japan / 02", alt: "" },
      { src: "media/ZIP/ZIP-3.JPG", title: "Japan / 03", alt: "" },
      { src: "media/ZIP/ZIP-4.JPG", title: "Japan / 04", alt: "" },
      { src: "media/ZIP/ZIP-5.JPG", title: "Japan / 05", alt: "" },
      { src: "media/ZIP/ZIP-6.JPG", title: "Japan / 06", alt: "" },
      { src: "media/ZIP/ZIP-7.JPG", title: "Japan / 07", alt: "" },
      { src: "media/ZIP/ZIP-8.JPG", title: "Japan / 08", alt: "" },
      { src: "media/ZIP/ZIP-9.JPG", title: "Japan / 09", alt: "" },
      { src: "media/ZIP/ZIP-10.JPG", title: "Japan / 10", alt: "" },
      { src: "media/ZIP/ZIP-11.JPG", title: "Japan / 11", alt: "" },
      { src: "media/ZIP/ZIP-12.JPG", title: "Japan / 12", alt: "" },
      { src: "media/ZIP/ZIP-13.JPG", title: "Japan / 13", alt: "" },
      { src: "media/ZIP/ZIP-14.JPG", title: "Japan / 14", alt: "" },
      { src: "media/ZIP/ZIP-15.JPG", title: "Japan / 15", alt: "" },
      { src: "media/ZIP/ZIP-16.JPG", title: "Japan / 16", alt: "" },
      { src: "media/ZIP/ZIP-17.JPG", title: "Japan / 17", alt: "" },
      { src: "media/ZIP/ZIP-18.JPG", title: "Japan / 18", alt: "" },
      { src: "media/ZIP/ZIP-19.JPG", title: "Japan / 19", alt: "" },
      { src: "media/ZIP/ZIP-20.JPG", title: "Japan / 20", alt: "" },
      { src: "media/ZIP/ZIP-21.JPG", title: "Japan / 21", alt: "" },
      { src: "media/ZIP/ZIP-22.JPG", title: "Japan / 22", alt: "" },
      { src: "media/ZIP/ZIP-23.JPG", title: "Japan / 23", alt: "" },
    ],
  },
];

if (!document.querySelector('link[data-series-style]')) {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "series.css?v=20261128-1";
  stylesheet.dataset.seriesStyle = "";
  document.head.append(stylesheet);
}

const container = document.getElementById("collections");

if (container) collections.forEach((collection, collectionIndex) => {
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

  collection.photos.filter((photo) => photo.src.trim()).slice(0, 4).forEach((photo, index) => {
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
  const fullSeries = document.createElement("a");
  fullSeries.className = "text-link full-series-link";
  fullSeries.href = collection.page;
  fullSeries.textContent = "전체 작업 보기 ↗";
  fullSeries.lang = "ko";
  controls.append(status, fullSeries, buttons);
  section.append(head, track, controls);
  container.append(section);

  let activeIndex = 0;
  const slides = [...track.children];
  const update = () => {
    const trackRect = track.getBoundingClientRect();
    const origin = trackRect.left + trackRect.width / 2;
    const closest = slides.reduce((best, slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const distance = Math.abs(
        slideRect.left + slideRect.width / 2 - origin
      );
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
        left:
          target.getBoundingClientRect().left +
          target.getBoundingClientRect().width / 2 -
          (track.getBoundingClientRect().left +
            track.getBoundingClientRect().width / 2),
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
