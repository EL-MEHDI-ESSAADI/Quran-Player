// variables
import { preloader } from "./header-preloader-settings.js";
import * as surahsSec from "./surahsSec.js";
import * as thirdParty from "./thirdParty.js";
import { settings } from "./header-preloader-settings.js";
import * as bookmarksAndHistory from "./bookmarksAndHistory.js";
const mainContentEl = document.getElementById("main");
const templates = {
   img: `<img class="surahs-overview-section__kid-img" src="./assets/surahsPageKid.png" alt="kid">`,
   surah: `<div class="surah flex" data-id="$\{surah-id}" tabindex="0">
      <div class="flex">
      <div class="surah__id-container bg-secondary">
               <span class="surah__id-body ff-roboto fw-600">$\{surah-id}</span>
            </div>
            <div class="surah__eg-name fw-600 flow">
               <p>$\{surah-eg-name}</p>
               <p class="fs-200">$\{surah-eg-name-trn}</p>
            </div>
         </div>
         <div class="surah__ar-name fw-700 flow">
            <p class="ff-amiri">$\{surah-ar-name}</p>
            <p class="fs-200">
               <span class="ff-roboto">$\{surah-ayahas-number}</span> Ayahs
            </p>
         </div>
      </div>`,
};

// functions
export function build(surahsInfo) {
   let surahsSecEl = document.createElement("div");
   let surahsConEl = document.createElement("div");
   let surahsConElContent = surahsInfo.reduce((surahsContent, surahInfo) => {
      let surahContent = replaceStr(templates.surah, [
         [/\$\{surah-id\}/g, surahInfo.number],
         ["${surah-eg-name}", surahInfo.englishName],
         ["${surah-eg-name-trn}", surahInfo.englishNameTranslation],
         ["${surah-ar-name}", surahInfo.name],
         ["${surah-ayahas-number}", surahInfo.numberOfAyahs],
      ]);
      return surahsContent + surahContent;
   }, "");
   
   mainContentEl.dataset.track = "0";
   surahsSecEl.classList.add("surahs-overview-section");
   surahsSecEl.innerHTML = templates.img;
   surahsConEl.classList.add("surahs-overview-section__surahs-container");
   surahsConEl.innerHTML = surahsConElContent;

   surahsConEl.querySelectorAll(".surah").forEach((surahEl) => {
      surahEl.addEventListener("click", function (_) {
         callData(surahEl);
         preloader.addPreloader();
         // add surah id to history storage
         bookmarksAndHistory.addToHistory(+surahEl.dataset.id);
      });
      surahEl.addEventListener("keydown", function (e) {
         if (e.key != " " && e.key != "Enter") return;
         callData(surahEl);
         preloader.addPreloader();
         // add surah id to history storage
         bookmarksAndHistory.addToHistory(+surahEl.dataset.id);
      });
   });

   mainContentEl.innerHTML = "";
   surahsSecEl.append(surahsConEl);
   mainContentEl.append(surahsSecEl);
}

function callData(surahEl) {
   const url1 = replaceStr(thirdParty.versesContentApi, [
      ["${surah_id}", surahEl.dataset.id],
      ["${translationSrc_id}", settings.translationSrc.id],
      ["${page_id}", 1],
   ]);

   const url2 = replaceStr(thirdParty.surahAudioApi, [
      ["${reciter_id}", settings.reciter.id],
      ["${surah_id}", surahEl.dataset.id],
   ]);
   const map = new Map()
      .set("textData", { url: url1, content: null })
      .set("audioData", { url: url2, content: null, reciterId: settings.reciter.id});
   const track = new Date().getTime();

   mainContentEl.dataset.track = track;
   thirdParty.handelData(map, (map) => {
      surahsSec.build(map, track);
   });
}

function replaceStr(str, arr) {
   return arr.reduce((result, [target, newValue]) => result.replace(target, newValue), str);
}
