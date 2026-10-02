const API_KEY = "c692180b43ef024076e6b6e748428b75";
/* ========================================
   PRVKY
======================================== */

const overlay =
  document.getElementById("overlay");

const closePicker =
  document.getElementById("closePicker");

const doneButton =
  document.getElementById("doneButton");

const slotNumber =
  document.getElementById("slotNumber");

const movieSearch =
  document.getElementById("movieSearch");

const movieResults =
  document.getElementById("movieResults");

const movieCount =
  document.getElementById("movieCount");

const posterCount =
  document.getElementById("posterCount");

const posterName =
  document.getElementById("posterName");

const createPosterButton =
  document.getElementById("createPosterButton");

const posterOverlay =
  document.getElementById("posterOverlay");

const closePoster =
  document.getElementById("closePoster");

const posterGrid =
  document.getElementById("posterGrid");

const posterPreview =
  document.getElementById("posterPreview");

const posterLabel =
  document.querySelector(".poster-label");

const posterTitle =
  document.querySelector(".poster-preview h2");

const downloadPosterButton =
  document.getElementById("downloadPosterButton");

const sharePosterButton =
  document.getElementById("sharePosterButton");

const storyButton =
  document.getElementById("storyButton");

const xButton =
  document.getElementById("xButton");

const copyLinkButton =
  document.getElementById("copyLinkButton");

const filmBoxes =
  document.querySelectorAll(".film-box");

const themeButtons =
  document.querySelectorAll(".theme-option");

const filmReel =
  document.querySelector(".film-reel");


/* ========================================
   DATA
======================================== */

let activeSlot = null;

let selectedTheme = "cinema";


const savedMovies =
  localStorage.getItem("mojeFilmy");


let selectedMovies =
  savedMovies
    ? JSON.parse(savedMovies)
    : new Array(9).fill(null);


/* ========================================
   ULOŽENÍ FILMŮ
======================================== */

function saveMovies() {

  localStorage.setItem(
    "mojeFilmy",
    JSON.stringify(selectedMovies)
  );

}


/* ========================================
   POČÍTADLO
======================================== */

function updateMovieCount() {

  const count =
    selectedMovies.filter(
      movie => movie !== null
    ).length;


  movieCount.textContent =
    `${count}/9`;


  posterCount.textContent =
    `${count} ${count === 1 ? "film" : "filmů"}`;

}


/* ========================================
   OTEVŘÍT PICKER
======================================== */

function openMoviePicker(index) {

  activeSlot = index;


  slotNumber.textContent =
    `POZICE ${String(index + 1).padStart(2, "0")} Z 09`;


  overlay.style.display =
    "block";


  movieSearch.value =
    "";


  movieResults.innerHTML =
    "";


  movieSearch.focus();

}


/* ========================================
   ZAVŘÍT PICKER
======================================== */

closePicker.addEventListener(
  "click",
  () => {

    overlay.style.display =
      "none";

  }
);


doneButton.addEventListener(
  "click",
  () => {

    overlay.style.display =
      "none";

  }
);


/* ========================================
   PROHOZENÍ FILMŮ
======================================== */

function swapMovies(
  fromIndex,
  toIndex
) {

  if (fromIndex === toIndex) {
    return;
  }


  const temp =
    selectedMovies[fromIndex];


  selectedMovies[fromIndex] =
    selectedMovies[toIndex];


  selectedMovies[toIndex] =
    temp;


  saveMovies();

  renderAllSlots();

}


/* ========================================
   VYKRESLENÍ SLOTU
======================================== */

function renderMovieSlot(index) {

  const movie =
    selectedMovies[index];


  const box =
    filmBoxes[index];


  if (!movie) {

    box.innerHTML = `
      <span>
        ${String(index + 1).padStart(2, "0")}
      </span>

      <button>
        +
      </button>

      <p>
        Vybrat film
      </p>
    `;


    box
      .querySelector("button")
      .addEventListener(
        "click",
        () => {

          openMoviePicker(index);

        }
      );


    return;

  }


  box.innerHTML = `
    ${
      movie.poster

        ? `
          <img
            src="${movie.poster}"
            alt="${movie.title}"
            draggable="false"
          >
        `

        : `
          <div class="no-poster">
            Bez plakátu
          </div>
        `
    }

    <div class="selected-movie-controls">

      <strong>
        ${movie.title}
      </strong>

      <div>

        <button class="change-movie">
          Změnit
        </button>

        <button class="remove-movie">
          Odebrat
        </button>

      </div>

    </div>
  `;


  box
    .querySelector(".change-movie")
    .addEventListener(
      "click",
      () => {

        openMoviePicker(index);

      }
    );


  box
    .querySelector(".remove-movie")
    .addEventListener(
      "click",
      () => {

        selectedMovies[index] =
          null;


        saveMovies();

        renderAllSlots();

      }
    );

}


/* ========================================
   VŠECHNY SLOTY
======================================== */

function renderAllSlots() {

  filmBoxes.forEach(
    (box, index) => {

      renderMovieSlot(index);

    }
  );


  updateMovieCount();

}


/* ========================================
   DRAG & DROP FILMŮ
======================================== */

let draggedIndex = null;

let dragClone = null;

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;

let isDragging = false;

const DRAG_DISTANCE = 8;


filmBoxes.forEach(
  (box, index) => {

    box.addEventListener(
      "pointerdown",
      event => {

        if (!selectedMovies[index]) {
          return;
        }


        if (
          event.target.closest("button")
        ) {
          return;
        }


        draggedIndex =
          index;


        startX =
          event.clientX;

        startY =
          event.clientY;


        currentX =
          event.clientX;

        currentY =
          event.clientY;


        isDragging =
          false;

      }
    );

  }
);


document.addEventListener(
  "pointermove",
  event => {

    if (
      draggedIndex === null
    ) {
      return;
    }


    currentX =
      event.clientX;

    currentY =
      event.clientY;


    const distanceX =
      Math.abs(
        currentX - startX
      );


    const distanceY =
      Math.abs(
        currentY - startY
      );


    if (
      !isDragging &&
      distanceX < DRAG_DISTANCE &&
      distanceY < DRAG_DISTANCE
    ) {
      return;
    }


    if (!isDragging) {

      isDragging =
        true;


      const originalBox =
        filmBoxes[draggedIndex];


      dragClone =
        originalBox.cloneNode(true);


      const rect =
        originalBox.getBoundingClientRect();


      dragClone.style.position =
        "fixed";

      dragClone.style.left =
        "0";

      dragClone.style.top =
        "0";

      dragClone.style.width =
        `${rect.width}px`;

      dragClone.style.height =
        `${rect.height}px`;

      dragClone.style.margin =
        "0";

      dragClone.style.zIndex =
        "9999";

      dragClone.style.pointerEvents =
        "none";

      dragClone.style.opacity =
        "0.9";

      dragClone.style.transform =
        "scale(1.04)";

      dragClone.style.boxShadow =
        "0 18px 40px rgba(0,0,0,0.25)";


      document.body.appendChild(
        dragClone
      );


      originalBox.style.opacity =
        "0.3";

    }


    event.preventDefault();


    if (dragClone) {

      const rect =
        dragClone.getBoundingClientRect();


      dragClone.style.left =
        `${currentX - rect.width / 2}px`;


      dragClone.style.top =
        `${currentY - rect.height / 2}px`;

    }


    filmBoxes.forEach(
      box => {

        box.style.outline =
          "";

      }
    );


    const elementUnderPointer =
      document.elementFromPoint(
        currentX,
        currentY
      );


    const targetBox =
      elementUnderPointer?.closest(
        ".film-box"
      );


    if (targetBox) {

      targetBox.style.outline =
        "3px solid #1c1b19";


      targetBox.style.outlineOffset =
        "3px";

    }

  },
  {
    passive: false
  }
);


document.addEventListener(
  "pointerup",
  event => {

    if (
      draggedIndex === null
    ) {
      return;
    }


    const oldIndex =
      draggedIndex;


    if (isDragging) {

      const elementUnderPointer =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );


      const targetBox =
        elementUnderPointer?.closest(
          ".film-box"
        );


      if (targetBox) {

        const targetIndex =
          Array
            .from(filmBoxes)
            .indexOf(targetBox);


        if (
          targetIndex !== -1
        ) {

          swapMovies(
            oldIndex,
            targetIndex
          );

        }

      }

    }


    if (dragClone) {

      dragClone.remove();

      dragClone =
        null;

    }


    filmBoxes.forEach(
      box => {

        box.style.opacity =
          "";

        box.style.outline =
          "";

        box.style.outlineOffset =
          "";

      }
    );


    draggedIndex =
      null;


    isDragging =
      false;

  }
);


document.addEventListener(
  "pointercancel",
  () => {

    if (dragClone) {

      dragClone.remove();

      dragClone =
        null;

    }


    filmBoxes.forEach(
      box => {

        box.style.opacity =
          "";

        box.style.outline =
          "";

        box.style.outlineOffset =
          "";

      }
    );


    draggedIndex =
      null;


    isDragging =
      false;

  }
);


/* ========================================
   TMDB SEARCH
======================================== */

movieSearch.addEventListener(
  "input",
  async () => {

    const query =
      movieSearch.value.trim();


    if (
      query.length < 2
    ) {

      movieResults.innerHTML =
        "";

      return;

    }


    try {

      const response =
        await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=cs-CZ`
        );


      const data =
        await response.json();


      movieResults.innerHTML =
        "";


      data.results
        .slice(0, 5)
        .forEach(
          movie => {

            const result =
              document.createElement(
                "div"
              );


            result.className =
              "movie-result";


            const poster =
              movie.poster_path

                ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`

                : "";


            const year =
              movie.release_date

                ? movie.release_date.slice(
                    0,
                    4
                  )

                : "";


            result.innerHTML = `
              <div class="movie-result-info">

                ${
                  poster

                    ? `
                      <img
                        src="${poster}"
                        alt="${movie.title}"
                      >
                    `

                    : `
                      <div class="no-poster">
                        Bez plakátu
                      </div>
                    `
                }

                <div>

                  <strong>
                    ${movie.title}
                  </strong>

                  <span>
                    ${year}
                  </span>

                </div>

              </div>


              <button class="add-movie">
                🤤
              </button>
            `;


            movieResults.appendChild(
              result
            );


            result
              .querySelector(
                ".add-movie"
              )
              .addEventListener(
                "click",
                () => {

                  if (
                    activeSlot === null
                  ) {
                    return;
                  }


                  selectedMovies[
                    activeSlot
                  ] = {

                    title:
                      movie.title,

                    poster:
                      poster,

                    year:
                      year

                  };


                  saveMovies();

                  renderAllSlots();


                  overlay.style.display =
                    "none";

                }
              );

          }
        );

    }

    catch (error) {

      console.error(
        "Chyba při hledání filmu:",
        error
      );

    }

  }
);


/* ========================================
   VÝBĚR MOTIVU
======================================== */

themeButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        themeButtons.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        selectedTheme =
          button.dataset.theme;

      }
    );

  }
);


/* ========================================
   NADPIS PLAKÁTU
======================================== */

function updatePosterHeading() {

  posterLabel.textContent =
    "MOJEDEVITKA";


  const name =
    posterName.value.trim();


  posterTitle.textContent =
    name
      ? `Filmy podle ${name}`
      : "Tvoje filmová devítka.";

}


/* ========================================
   MOTIV
======================================== */

function applySelectedTheme() {

  posterPreview.className =
    `poster-preview poster-theme-${selectedTheme}`;


  updatePosterHeading();

}


/* ========================================
   VYKRESLENÍ PLAKÁTU
======================================== */

function renderPoster() {

  posterGrid.innerHTML =
    "";


  selectedMovies.forEach(
    (movie, index) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "poster-movie";


      if (
        movie &&
        movie.poster
      ) {

        item.innerHTML = `
          <img
            src="${movie.poster}"
            alt="${movie.title}"
          >

          <div class="poster-movie-info">

            <strong>
              ${movie.title}
            </strong>

            <span>
              ${movie.year || ""}
            </span>

          </div>
        `;

      }

      else {

        item.innerHTML = `
          <div class="poster-empty">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <div class="poster-movie-info">

            <strong>
              Prázdné místo
            </strong>

            <span>
              —
            </span>

          </div>
        `;

      }


      posterGrid.appendChild(
        item
      );

    }
  );


  applySelectedTheme();

}


/* ========================================
   ZMENŠENÍ NÁHLEDU
======================================== */

function fitPosterToScreen() {

  posterPreview.style.transform =
    "scale(1)";


  posterPreview.style.marginTop =
    "0";


  posterPreview.style.marginBottom =
    "0";


  const posterWidth =
    posterPreview.offsetWidth;


  const posterHeight =
    posterPreview.offsetHeight;


  const availableWidth =
    Math.min(
      window.innerWidth - 100,
      500
    );


  const availableHeight =
    window.innerHeight - 300;


  const scaleX =
    availableWidth / posterWidth;


  const scaleY =
    availableHeight / posterHeight;


  const scale =
    Math.min(
      1,
      scaleX,
      scaleY
    );


  posterPreview.style.transform =
    `scale(${scale})`;


  posterPreview.style.marginTop =
    `${-(posterHeight * (1 - scale)) / 2}px`;


  posterPreview.style.marginBottom =
    `${-(posterHeight * (1 - scale)) / 2}px`;

}


/* ========================================
   OTEVŘÍT PLAKÁT
======================================== */

createPosterButton.addEventListener(
  "click",
  () => {

    renderPoster();


    posterOverlay.style.display =
      "block";


    requestAnimationFrame(
      () => {

        fitPosterToScreen();

      }
    );

  }
);


/* ========================================
   ZAVŘÍT PLAKÁT
======================================== */

closePoster.addEventListener(
  "click",
  () => {

    posterOverlay.style.display =
      "none";

  }
);


/* ========================================
   RESIZE
======================================== */

window.addEventListener(
  "resize",
  () => {

    if (
      posterOverlay.style.display ===
      "block"
    ) {

      fitPosterToScreen();

    }

  }
);


/* ========================================
   POČKÁNÍ NA OBRÁZKY
======================================== */

async function waitForImages(element) {

  const images =
    element.querySelectorAll("img");


  await Promise.all(
    Array.from(images).map(
      image => {

        /*
          OPRAVA:
          Pokud už obrázek skončil načítání,
          pokračujeme dál i v případě chyby.
        */

        if (image.complete) {

          return Promise.resolve();

        }


        return new Promise(
          resolve => {

            let finished =
              false;


            let timeout;


            const finish =
              () => {

                if (finished) {
                  return;
                }


                finished =
                  true;


                clearTimeout(
                  timeout
                );


                resolve();

              };


            image.addEventListener(
              "load",
              finish,
              {
                once: true
              }
            );


            image.addEventListener(
              "error",
              finish,
              {
                once: true
              }
            );


            /*
              Ani jeden problematický obrázek
              nesmí export zablokovat navždy.
            */

            timeout =
              setTimeout(
                finish,
                5000
              );

          }
        );

      }
    )
  );

}


/* ========================================
   SKRYTÁ KOPIE PLAKÁTU PRO EXPORT
======================================== */

function createExportPoster() {

  const exportPoster =
    posterPreview.cloneNode(true);


  exportPoster.removeAttribute(
    "id"
  );


  exportPoster.style.position =
    "fixed";


  exportPoster.style.left =
    "-10000px";


  exportPoster.style.top =
    "0";


  exportPoster.style.width =
    "500px";


  exportPoster.style.transform =
    "none";


  exportPoster.style.margin =
    "0";


  exportPoster.style.zIndex =
    "-9999";


  exportPoster.style.pointerEvents =
    "none";


  document.body.appendChild(
    exportPoster
  );


  return exportPoster;

}


/* ========================================
   VYTVOŘENÍ PNG
======================================== */

async function createPosterBlob() {

  if (
    typeof html2canvas ===
    "undefined"
  ) {

    throw new Error(
      "html2canvas není načtený."
    );

  }


  const exportPoster =
    createExportPoster();


  try {

    await waitForImages(
      exportPoster
    );


    await new Promise(
      resolve => {

        requestAnimationFrame(
          () => {

            requestAnimationFrame(
              resolve
            );

          }
        );

      }
    );


    const canvas =
      await html2canvas(
        exportPoster,
        {

          scale: 3,

          useCORS: true,

          allowTaint: false,

          backgroundColor: null,

          logging: false

        }
      );


    const blob =
      await new Promise(
        (resolve, reject) => {

          canvas.toBlob(
            result => {

              if (result) {

                resolve(
                  result
                );

              }

              else {

                reject(
                  new Error(
                    "PNG se nepodařilo vytvořit."
                  )
                );

              }

            },
            "image/png"
          );

        }
      );


    return blob;

  }

  finally {

    exportPoster.remove();

  }

}


/* ========================================
   STAŽENÍ SOUBORU
======================================== */

function downloadBlob(
  blob,
  filename
) {

  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    filename;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  setTimeout(
    () => {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}


/* ========================================
   STÁHNOUT PLAKÁT
======================================== */

downloadPosterButton.addEventListener(
  "click",
  async () => {

    const text =
      downloadPosterButton
        .querySelector("strong");


    const originalText =
      text.textContent;


    downloadPosterButton.disabled =
      true;


    text.textContent =
      "Připravuji...";


    try {

      const blob =
        await createPosterBlob();


      downloadBlob(
        blob,
        `mojedevitka-${selectedTheme}.png`
      );

    }

    catch (error) {

      console.error(
        error
      );


      alert(
        "Plakát se nepodařilo stáhnout."
      );

    }

    finally {

      downloadPosterButton.disabled =
        false;


      text.textContent =
        originalText;

    }

  }
);


/* ========================================
   SDÍLET
======================================== */

sharePosterButton.addEventListener(
  "click",
  async () => {

    try {

      const blob =
        await createPosterBlob();


      const file =
        new File(
          [blob],
          "mojedevitka.png",
          {
            type:
              "image/png"
          }
        );


      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file]
        })
      ) {

        await navigator.share({

          title:
            "Moje filmová devítka",

          text:
            "Moje filmová devítka 🎬",

          files:
            [file]

        });


        return;

      }


      if (
        navigator.share
      ) {

        await navigator.share({

          title:
            "Moje filmová devítka",

          text:
            "Moje filmová devítka 🎬"

        });


        return;

      }


      downloadBlob(
        blob,
        "mojedevitka.png"
      );


      alert(
        "Tvůj prohlížeč nepodporuje systémové sdílení, takže jsem plakát stáhla jako PNG."
      );

    }

    catch (error) {

      if (
        error.name !==
        "AbortError"
      ) {

        console.error(
          error
        );


        alert(
          "Sdílení se nepodařilo."
        );

      }

    }

  }
);


/* ========================================
   STORY 9:16
======================================== */

function createStoryElement() {

  const story =
    document.createElement("div");


  story.className =
    `story-export poster-theme-${selectedTheme}`;


  const name =
    posterName.value.trim();


  const title =
    name
      ? `Filmy podle ${name}`
      : "Tvoje filmová devítka.";


  story.innerHTML = `
    <p class="story-label">
      MOJEDEVITKA
    </p>

    <h2 class="story-title">
      ${title}
    </h2>

    <div class="story-grid"></div>

    <div class="story-footer">

      <span>
        mojedevitka
      </span>

      <span>
        01—09 · by bikinka
      </span>

    </div>
  `;


  const grid =
    story.querySelector(
      ".story-grid"
    );


  selectedMovies.forEach(
    (movie, index) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "story-movie";


      if (
        movie &&
        movie.poster
      ) {

        item.innerHTML = `
          <img
            src="${movie.poster}"
            alt="${movie.title}"
          >

          <div class="story-movie-info">

            <strong>
              ${movie.title}
            </strong>

            <span>
              ${movie.year || ""}
            </span>

          </div>
        `;

      }

      else {

        item.innerHTML = `
          <div class="story-empty">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <div class="story-movie-info">

            <strong>
              Prázdné místo
            </strong>

            <span>
              —
            </span>

          </div>
        `;

      }


      grid.appendChild(
        item
      );

    }
  );


  document.body.appendChild(
    story
  );


  return story;

}


/* ========================================
   VYTVOŘENÍ STORY PNG
======================================== */

async function createStoryBlob() {

  if (
    typeof html2canvas ===
    "undefined"
  ) {

    throw new Error(
      "html2canvas není načtený."
    );

  }


  const story =
    createStoryElement();


  try {

    await waitForImages(
      story
    );


    await new Promise(
      resolve => {

        requestAnimationFrame(
          () => {

            requestAnimationFrame(
              resolve
            );

          }
        );

      }
    );


    const canvas =
      await html2canvas(
        story,
        {

          scale: 1,

          width: 1080,

          height: 1920,

          useCORS: true,

          allowTaint: false,

          backgroundColor: null,

          logging: false

        }
      );


    const blob =
      await new Promise(
        (resolve, reject) => {

          canvas.toBlob(
            result => {

              if (result) {

                resolve(
                  result
                );

              }

              else {

                reject(
                  new Error(
                    "Story PNG se nepodařilo vytvořit."
                  )
                );

              }

            },

            "image/png"

          );

        }
      );


    return blob;

  }

  finally {

    story.remove();

  }

}


/* ========================================
   STORY TLAČÍTKO
======================================== */

storyButton.addEventListener(
  "click",
  async () => {

    const originalHTML =
      storyButton.innerHTML;


    storyButton.disabled =
      true;


    storyButton.innerHTML =
      "<span>▯</span> Připravuji...";


    try {

      const blob =
        await createStoryBlob();


      const file =
        new File(
          [blob],
          "mojedevitka-story.png",
          {
            type:
              "image/png"
          }
        );


      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file]
        })
      ) {

        await navigator.share({

          title:
            "Moje filmová devítka",

          files:
            [file]

        });


        return;

      }


      downloadBlob(
        blob,
        "mojedevitka-story.png"
      );

    }

    catch (error) {

      if (
        error.name !==
        "AbortError"
      ) {

        console.error(
          error
        );


        alert(
          "Story obrázek se nepodařilo připravit."
        );

      }

    }

    finally {

      storyButton.disabled =
        false;


      storyButton.innerHTML =
        originalHTML;

    }

  }
);


/* ========================================
   SDÍLET NA X
======================================== */

xButton.addEventListener(
  "click",
  () => {

    const text =
      "Moje filmová devítka 🎬";


    const shareUrl =
      "https://twitter.com/intent/tweet" +
      `?text=${encodeURIComponent(text)}`;


    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer"
    );

  }
);


/* ========================================
   KOPÍROVAT ODKAZ
======================================== */

copyLinkButton.addEventListener(
  "click",
  async () => {

    const url =
      window.location.href;


    const originalHTML =
      copyLinkButton.innerHTML;


    try {

      await navigator.clipboard.writeText(
        url
      );


      copyLinkButton.innerHTML =
        "<span>✓</span> Zkopírováno";


      setTimeout(
        () => {

          copyLinkButton.innerHTML =
            originalHTML;

        },
        1800
      );

    }

    catch (error) {

      const textarea =
        document.createElement(
          "textarea"
        );


      textarea.value =
        url;


      textarea.style.position =
        "fixed";


      textarea.style.opacity =
        "0";


      document.body.appendChild(
        textarea
      );


      textarea.select();


      document.execCommand(
        "copy"
      );


      textarea.remove();


      copyLinkButton.innerHTML =
        "<span>✓</span> Zkopírováno";


      setTimeout(
        () => {

          copyLinkButton.innerHTML =
            originalHTML;

        },
        1800
      );

    }

  }
);


/* ========================================
   INTERAKTIVNÍ FILMOVÁ CÍVKA
======================================== */

if (filmReel) {

  let reelRotation =
    -9;


  let reelVelocity =
    0.12;


  let reelDragging =
    false;


  let previousPointerAngle =
    0;


  let previousMoveTime =
    performance.now();


  let lastInteractionTime =
    performance.now();


  function getPointerAngle(
    event
  ) {

    const rect =
      filmReel.getBoundingClientRect();


    const centerX =
      rect.left +
      rect.width / 2;


    const centerY =
      rect.top +
      rect.height / 2;


    return Math.atan2(
      event.clientY - centerY,
      event.clientX - centerX
    ) * 180 / Math.PI;

  }


  filmReel.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();


      reelDragging =
        true;


      previousPointerAngle =
        getPointerAngle(
          event
        );


      previousMoveTime =
        performance.now();


      reelVelocity =
        0;


      lastInteractionTime =
        performance.now();


      filmReel.setPointerCapture(
        event.pointerId
      );

    }
  );


  filmReel.addEventListener(
    "pointermove",
    event => {

      if (
        !reelDragging
      ) {
        return;
      }


      event.preventDefault();


      const currentAngle =
        getPointerAngle(
          event
        );


      let difference =
        currentAngle -
        previousPointerAngle;


      if (
        difference > 180
      ) {

        difference -=
          360;

      }


      if (
        difference < -180
      ) {

        difference +=
          360;

      }


      reelRotation +=
        difference;


      const now =
        performance.now();


      const elapsed =
        Math.max(
          now -
          previousMoveTime,
          1
        );


      reelVelocity =
        Math.max(
          -3.5,
          Math.min(
            3.5,
            difference *
            16 /
            elapsed
          )
        );


      previousPointerAngle =
        currentAngle;


      previousMoveTime =
        now;


      lastInteractionTime =
        now;


      filmReel.style.transform =
        `rotate(${reelRotation}deg)`;

    }
  );


  function releaseReel(
    event
  ) {

    if (
      !reelDragging
    ) {
      return;
    }


    reelDragging =
      false;


    lastInteractionTime =
      performance.now();


    if (
      event &&
      filmReel.hasPointerCapture(
        event.pointerId
      )
    ) {

      filmReel.releasePointerCapture(
        event.pointerId
      );

    }

  }


  filmReel.addEventListener(
    "pointerup",
    releaseReel
  );


  filmReel.addEventListener(
    "pointercancel",
    releaseReel
  );


  let previousFrameTime =
    performance.now();


  function animateReel(time) {

    const deltaTime =
      Math.min(
        time -
        previousFrameTime,
        40
      );


    previousFrameTime =
      time;


    if (
      !reelDragging
    ) {

      reelRotation +=
        reelVelocity *
        deltaTime *
        0.06;


      reelVelocity *=
        Math.pow(
          0.985,
          deltaTime / 16
        );


      const idleTime =
        time -
        lastInteractionTime;


      if (
        Math.abs(
          reelVelocity
        ) < 0.13 &&
        idleTime > 1200
      ) {

        reelVelocity +=
          (
            0.12 -
            reelVelocity
          ) * 0.02;

      }


      filmReel.style.transform =
        `rotate(${reelRotation}deg)`;

    }


    requestAnimationFrame(
      animateReel
    );

  }


  requestAnimationFrame(
    animateReel
  );

}


/* ========================================
   START
======================================== */

renderAllSlots();