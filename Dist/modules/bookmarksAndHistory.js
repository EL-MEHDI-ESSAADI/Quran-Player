import * as storage from "./storage.js";
import * as thirdParty from "./thirdParty.js";
import { settings } from "./header-preloader-settings.js";
import { preloader } from "./header-preloader-settings.js";
import * as surahsSec from "./surahsSec.js";
const mainContentEl = document.getElementById("main");
const templates = {
   sectionContainer: `<div class="bookmarks-history-section">
   <section class="history">
      <header class="history__header">
         <h3 class="history__section-name">History</h3>
      </header>
      <div class="history__items">

      </div>
   </section>
   <section class="bookmarks">
      <header class="bookmarks__header">
         <h3 class="bookmarks__section-name">Bookmarks</h3>
      </header>
      <div class="bookmarks__items">
         
      </div>
   </section>
</div>`,
   historyItemContent: `
   <div class="flex history__top-container">
      <p class="history__item__trn-name">$\{surah-trn-name}</p>
      <span class="history__item__id ff-roboto">$\{surah-id}</span>
   </div>
   <div class="history__item__eg-name">
      Surah <br />
      <span>$\{surah-eg-name}</span>
   </div>
   <div class="history__item__ar-name ff-amiri">$\{surah-ar-name}</div>
`,
   bookmarkItemContent: `<div class="bookmarks__surah-name">$\{surah-eg-name}</div>
   <div class="bookmarks__verse-key ff-roboto">$\{verse-key}</div>
   `,
};

export function build() {
   const historyStorage = localStorage.history ? JSON.parse(localStorage.history) : [];
   const bookmarksStorage = localStorage.bookmarks ? JSON.parse(localStorage.bookmarks) : [];

   mainContentEl.innerHTML = templates.sectionContainer;

   const historyItemsEl = mainContentEl.querySelector(".history__items");
   const bookmarksItemsEl = mainContentEl.querySelector(".bookmarks__items");

   mainContentEl.dataset.track = "0";

   historyStorage.forEach((surahId) => {
      const historyItemEl = document.createElement("div");
      const surahInfo = storage.surahsInfo[surahId - 1];

      // fill historyItemEl content
      historyItemEl.classList.add("history__item");
      historyItemEl.tabIndex = "0";
      historyItemEl.innerHTML = replaceStr(templates.historyItemContent, [
         ["${surah-trn-name}", surahInfo.englishNameTranslation],
         ["${surah-id}", surahInfo.number],
         ["${surah-eg-name}", surahInfo.englishName],
         ["${surah-ar-name}", surahInfo.name],
      ]);

      historyItemEl.addEventListener("click", (_) => {
         callSurahHistoryData(surahId);
         preloader.addPreloader();
         addToHistory(surahId);
      });
      historyItemEl.addEventListener("keydown", (e) => {
         if (e.key != " " && e.key != "Enter") return;
         callSurahHistoryData(surahId);
         preloader.addPreloader();
         addToHistory(surahId);
      });

      historyItemsEl.append(historyItemEl);
   });

   // in the case if the historyStorage is empty
   if (!historyStorage.length) historyItemsEl.textContent = "You do not have any history yet";

   bookmarksStorage.forEach((bookmarkInfo) => {
      const bookmarkItemEl = document.createElement("div");

      // fill bookmarkItemEl content
      bookmarkItemEl.classList.add("bookmarks__item");
      bookmarkItemEl.tabIndex = "0";
      bookmarkItemEl.innerHTML = replaceStr(templates.bookmarkItemContent, [
         ["${surah-eg-name}", storage.surahsInfo[bookmarkInfo.surahId - 1].englishName],
         ["${verse-key}", bookmarkInfo.verseKey],
      ]);

      bookmarkItemEl.addEventListener("click", (_) => {
         callBookmarkData(bookmarkInfo);
         preloader.addPreloader();
      });
      bookmarkItemEl.addEventListener("keydown", (e) => {
         if (e.key != " " && e.key != "Enter") return;
         callBookmarkData(bookmarkInfo);
         preloader.addPreloader();
      });

      bookmarksItemsEl.append(bookmarkItemEl);
   });

   // in the case if the bookmarksStorage is empty
   if (!bookmarksStorage.length) bookmarksItemsEl.textContent = "You do not have any bookmarks yet";
}

function callSurahHistoryData(surahId) {
   const url1 = replaceStr(thirdParty.versesContentApi, [
      ["${surah_id}", surahId],
      ["${translationSrc_id}", settings.translationSrc.id],
      ["${page_id}", 1],
   ]);
   const url2 = replaceStr(thirdParty.surahAudioApi, [
      ["${reciter_id}", settings.reciter.id],
      ["${surah_id}", surahId],
   ]);
   const map = new Map()
      .set("textData", { url: url1, content: null })
      .set("audioData", { url: url2, content: null, reciterId: settings.reciter.id });
   const track = new Date().getTime();

   mainContentEl.dataset.track = track;
   thirdParty.handelData(map, (map) => {
      surahsSec.build(map, track);
   });
}

function callBookmarkData(bookmarkInfo) {
   const url1 = replaceStr(thirdParty.verseContentApi, [
      ["${verse_key}", bookmarkInfo.verseKey],
      ["${translationSrc_id}", settings.translationSrc.id],
   ]);
   const url2 = replaceStr(thirdParty.surahAudioApi, [
      ["${reciter_id}", settings.reciter.id],
      ["${surah_id}", bookmarkInfo.surahId],
   ]);
   const map = new Map()
      .set("textData", { url: url1, content: null })
      .set("audioData", { url: url2, content: null, reciterId: settings.reciter.id });
   const track = new Date().getTime();

   mainContentEl.dataset.track = track;
   thirdParty.handelData(map, (map) => {
      surahsSec.build(map, track);
   });
}

function replaceStr(str, arr) {
   return arr.reduce((result, [target, newValue]) => result.replace(target, newValue), str);
}

export function addToHistory(surahId) {
   if (localStorage.history) {
      const historyStorage = JSON.parse(localStorage.history).filter((item) => item != surahId);
      historyStorage.unshift(surahId);
      localStorage.history = JSON.stringify(historyStorage);
   } else {
      localStorage.history = JSON.stringify([surahId]);
   }
}
