import { readFile, writeFile } from "node:fs/promises";

const outputFiles = [
  "dist/stardust-contribution-trail.svg",
  "dist/stardust-contribution-trail-dark.svg",
];

const starPath = "M6 0.55l1.43 3.73 4.02.16-3.14 2.52 1.1 3.82L6 8.62l-3.41 2.16 1.1-3.82L.55 4.44l4.02-.16L6 .55z";

const cloud = `<g class="s s0" aria-label="A cloud collecting stardust"><g transform="translate(-9 -9)"><path d="M10 21.5h14.7a5.3 5.3 0 0 0 .3-10.6 7.3 7.3 0 0 0-13.9 1.7A4.7 4.7 0 0 0 10 21.5z" fill="#fff8fc" stroke="#e879a9" stroke-width="1.15"/><circle cx="15.2" cy="16.2" r=".9" fill="#9b3f70"/><circle cx="20.2" cy="16.2" r=".9" fill="#9b3f70"/><path d="M16.7 18.2q.95.85 1.9 0" stroke="#9b3f70" stroke-width=".8" stroke-linecap="round" fill="none"/><path d="M25.7 14.8c2.1-1.5 3.25-.45 3 1.35" stroke="#fff8fc" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M28.25 13.3l.52.88 1.02.12-.75.7.18 1-.97-.43-.9.48.12-1-.8-.64 1.02-.18.56-.85z" fill="#f9a8d4"/></g></g>`;

for (const file of outputFiles) {
  let svg = await readFile(file, "utf8");

  // Contribution cells with a colour class are active. Turn only those cells
  // into stars; empty dates stay as the familiar contribution-grid squares.
  svg = svg.replace(
    /<rect class="c (c[0-9a-z]+)" x="([^"]+)" y="([^"]+)" rx="2" ry="2"\/>/g,
    (_, contributionClass, x, y) =>
      `<path class="c ${contributionClass} stardust-star" transform="translate(${x} ${y})" d="${starPath}"/>`,
  );

  // Replace the four snake segments with one cloud. It keeps the generator's
  // original movement animation, so it still follows genuine contribution data.
  svg = svg.replace(/<rect class="s s0"[^>]*\/>/, cloud);
  svg = svg.replace(/<rect class="s s[1-3]"[^>]*\/>/g, "");
  svg = svg.replace(
    "</style>",
    ".stardust-star{transform-box:fill-box;transform-origin:center;filter:drop-shadow(0 0 1.7px #f9a8d4)} </style>",
  );

  await writeFile(file, svg);
}
