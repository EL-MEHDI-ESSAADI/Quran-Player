// global variables
import * as surahsOverviewSec from "./surahsOverviewSec.js";
import * as sidebar from "./sidebar.js";
import { surahsInfo } from "./storage.js";
import * as thirdParty from "./thirdParty.js";

const headerEl = document.querySelector(".page-header");
const headerInput = document.querySelector(".page-header__input");
const headerSubmitBtn = document.querySelector(".page-header__submit-btn");
const displaySearchBtn = document.querySelector(".page-header__display-search-btn");
const closeSearchBtn = document.querySelector(".page-header__close-search-btn");
const openSidebarBtn = document.querySelector(".page-header__open-sidebar-btn");
const pagePreloaderEl = document.querySelector(".preloader-big");
const overlayEl = document.querySelector(".page-sidebar-overlay");
export const settingsSectionEl = document.querySelector(".page-settings");
export const openSettingsSecBtn = document.querySelector(".page-header__settings-btn");
const closeSettingsSecBtns = document.querySelectorAll(".page-settings__close-settings-btn");
const trnLangsSectionsConEl = document.querySelector(".page-settings__languages-options-container");
const translationsSectionEl = document.querySelector(".page-settings__translations-options-container");
export const openTranslationsSectionBtn = document.querySelector(".page-settings__translations-btn");
const closeTranslationsSectionBtn = document.querySelector(
   ".page-settings__translations-options-container__back-btn"
);
const recitersSectionEl = document.querySelector(".page-settings__receters-options-container");
const openRecitersSectionBtn = document.querySelector(".page-settings__reciters-btn");
const closeRecitersSectionBtn = document.querySelector(".page-settings__receters-options-container__back-btn");
const scrollToggleInput = document.querySelector(".page-settings__part__toggle-scroll-input");
const headerLogoEl = document.querySelector(".page-header__logo");

const settings = localStorage.settings
   ? JSON.parse(localStorage.settings)
   : {
        reciter: {
           id: 7,
           name: "Mishari Rashid al-`Afasy",
        },
        translationSrc: {
           id: 131,
           name: "Dr. Mustafa Khattab",
        },
        autoScroll: true,
        repeatSurah: false,
     };

const templates = {
   trnLangSectionContent: `
   <h3 class="page-settings__language-name">$\{lang-name}</h3>
   <ul class="page-settings__options-container__list flow page-settings__language-options-container"></ul>
   `,
   trnLangOptionContent: `
   <label class="page-settings__options-container__label">
      <input type="radio" name="Translation" class="page-settings__options-container__input">
      $\{trn-author}
   </label>
   `,
};

// functions
function setupHeaderEventListeners() {
   // for setting section
   openSettingsSecBtn.addEventListener("click", (_) => {
      if (settingsSectionEl.dataset.state == "empty") {
         buildTranslationsOptions();
         setUprecitersOptoins();
         // update the selected translation
         settingsSectionEl.querySelector(".page-settings__translation-btn__selected-name").textContent =
            settings.translationSrc.name;
         // update the selected reciter
         settingsSectionEl.querySelector(".page-settings__reciters-btn__selected-name").textContent =
            settings.reciter.name;
         // update autoScroll
         scrollToggleInput.checked = settings.autoScroll;
      }

      moveSettingsSec(false)();
      settingsSectionEl.dataset.state = "full";
   });

   overlayEl.addEventListener("click", moveSettingsSec(true));

   closeSettingsSecBtns.forEach((element) => {
      element.addEventListener("click", _ => {
         closeRecitersSectionBtn.click();
         closeTranslationsSectionBtn.click();
         moveSettingsSec(true)();
      });
   });

   openTranslationsSectionBtn.addEventListener("click", (_) => {
      translationsSectionEl.style.display = "flex";
      settingsSectionEl.style.overflow = "hidden";
      improveFocusInSettings(false);
   });

   openTranslationsSectionBtn.addEventListener("keydown", (e) => {
      if (e.key != " " && e.key != "Enter") return;
      translationsSectionEl.style.display = "flex";
      settingsSectionEl.style.overflow = "hidden";
      improveFocusInSettings(false);
   });

   closeTranslationsSectionBtn.addEventListener("click", (_) => {
      translationsSectionEl.style.display = "none";
      settingsSectionEl.style.overflow = "auto";
      improveFocusInSettings(true);
   });

   openRecitersSectionBtn.addEventListener("click", (_) => {
      recitersSectionEl.style.display = "block";
      settingsSectionEl.style.overflow = "hidden";
      improveFocusInSettings(false);
   });

   openRecitersSectionBtn.addEventListener("keydown", (e) => {
      if (e.key != " " && e.key != "Enter") return;
      recitersSectionEl.style.display = "block";
      settingsSectionEl.style.overflow = "hidden";
      improveFocusInSettings(false);
   });

   closeRecitersSectionBtn.addEventListener("click", (_) => {
      recitersSectionEl.style.display = "none";
      settingsSectionEl.style.overflow = "auto";
      improveFocusInSettings(true);
   });

   scrollToggleInput.addEventListener("input", (_) => {
      settings.autoScroll = scrollToggleInput.checked ? true : false;
      localStorage.settings = JSON.stringify(settings);
   });

   // for header section
   headerInput.addEventListener("input", checkInputVal);

   headerInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") displaySearchResults();
   });

   headerSubmitBtn.addEventListener("click", displaySearchResults);

   displaySearchBtn.addEventListener("click", (_) => {
      headerEl.classList.add("page-header--mobile-search-mode");
      headerInput.focus();
   });

   closeSearchBtn.addEventListener("click", (_) => {
      headerEl.classList.remove("page-header--mobile-search-mode");
      headerInput.value = "";
   });
}

function buildTranslationsOptions() {
   const map = new Map().set("data", { url: thirdParty.availableTranslationsApi, content: null });

   trnLangsSectionsConEl.querySelector(".preloader-small").remove();

   // get the data of available translations
   thirdParty.handelData(map, (map) => {
      const translationsSources = map.get("data").content.translations ? map.get("data").content.translations : [];

      translationsSources.forEach((translationSource) => {
         const trnLangOptionEl = document.createElement("li");
         let trnLangSectionConEl = document.querySelector(
            `.page-settings [data-lang-name="${translationSource.language_name}"]`
         );

         // if the lang section of the current translation's lang exist we will create it and append ot to trnLangsSectionsConEl
         if (!trnLangSectionConEl) {
            trnLangSectionConEl = document.createElement("li");
            trnLangSectionConEl.dataset.langName = translationSource.language_name;
            trnLangSectionConEl.innerHTML = templates.trnLangSectionContent.replace(
               "${lang-name}",
               translationSource.language_name
            );
         }

         // fill trnLangOptionEl content and append the element to the container of all options of the current lang
         trnLangOptionEl.innerHTML = replaceStr(templates.trnLangOptionContent, [
            ["${trn-author}", translationSource.translated_name.name],
         ]);

         const trnLangOptionInput = trnLangOptionEl.querySelector(".page-settings__options-container__input");
         // add eventlistenr of trnLangOptionEl's input
         trnLangOptionInput.addEventListener("input", function () {
            // if the the radio input became unchecked we won't do nothing
            if (!this.checked) return;
            // else, first we will update the setting object and localStorage settings
            settings.translationSrc.id = translationSource.id;
            settings.translationSrc.name = translationSource.translated_name.name;
            localStorage.settings = JSON.stringify(settings);
            // update the selected translation
            settingsSectionEl.querySelector(".page-settings__translation-btn__selected-name").textContent =
               translationSource.translated_name.name;
            /* 
               if the user is on a surah page (surahSecEl not null) we should update the translations for his verses, 
               if not, we finish the work
            */
            const surahSecEl = document.querySelector(".surah-section");
            if (!surahSecEl) return;

            const versesContainerEl = surahSecEl.querySelector(".surah-section__verses");
            const versesCount = versesContainerEl.querySelectorAll(".verse").length;
            // request the translation of a single verse if we have only one verse, else the translation of the whole surah's verses
            const url = replaceStr(thirdParty.translationOfSurahApi, [
               ["${translationSrc_id}", settings.translationSrc.id],
               [
                  "${query}",
                  versesCount === 1
                     ? `verse_key=${versesContainerEl.querySelector(".verse").dataset.key}`
                     : `chapter_number=${surahSecEl.dataset.id}`,
               ],
            ]);
            const map = new Map().set("data", { url: url, content: null });

            thirdParty.handelData(map, (map) => {
               const versesTranslations = map.get("data").content;
               const translationSourceEl = surahSecEl.querySelector(`.header__translation-src`);

               // may be the user change the page while the data still not arrive, so when the data arrive we shouldn't do with it anything
               if (!document.body.contains(surahSecEl)) return;
               // else, we tranlat the verses
               versesTranslations.translations.some((verseTranslation) => {
                  const verseTargetEl = versesContainerEl.querySelector(
                     `.verse[data-key="${verseTranslation.verse_key}"]`
                  );
                  /* 
                     because the data of verses translations is ordered ascendingly and also the surah verses on our page are ordered 
                     ascendingly, so once target element is null, all surah verses's translations are updated and we should end the
                     call of this function 
                  */
                  if (!verseTargetEl) return true;
                  // update the target verse's translation
                  verseTargetEl.querySelector(".verse__eg-txt").innerHTML = verseTranslation.text;
               });

               // update translation source in surah header
               translationSourceEl.textContent = translationSource.translated_name.name;
            });
         });

         // add elements to dom
         if (translationSource.id == settings.translationSrc.id) {
            trnLangOptionInput.checked = true;
            trnLangsSectionsConEl.prepend(trnLangSectionConEl);
            trnLangSectionConEl
               .querySelector(".page-settings__language-options-container")
               .prepend(trnLangOptionEl);
         } else {
            if (!trnLangsSectionsConEl.contains(trnLangSectionConEl))
               trnLangsSectionsConEl.append(trnLangSectionConEl);
            trnLangSectionConEl
               .querySelector(".page-settings__language-options-container")
               .append(trnLangOptionEl);
         }
      });
   });
}

function setUprecitersOptoins() {
   const recitersInputs = recitersSectionEl.querySelectorAll(".page-settings__options-container__input");

   recitersInputs.forEach((reciterInput) => {
      if (reciterInput.dataset.id == settings.reciter.id) reciterInput.checked = true;

      reciterInput.addEventListener("input", (_) => {
         if (!reciterInput.checked) return;
         // update settings
         settings.reciter.id = reciterInput.dataset.id;
         settings.reciter.name = reciterInput.parentElement.innerText;
         localStorage.settings = JSON.stringify(settings);
         // update selected reciter
         settingsSectionEl.querySelector(".page-settings__reciters-btn__selected-name").textContent =
            settings.reciter.name;
      });
   });
}

function moveSettingsSec(IsOpen) {
   // the logic is if the settingsSection is open we will close it and if isn't we will open it
   return (_) => {
      if (IsOpen) {
         settingsSectionEl.classList.remove("page-settings--show");
      } else {
         settingsSectionEl.classList.add("page-settings--show");
      }
      document.body.style.overflow = IsOpen ? "initial" : "hidden";
      overlayEl.style.display = IsOpen ? "none" : "block";
      settingsSectionEl.ariaHidden = IsOpen ? "true" : "false";
      // improve keyboard traversing
      document.body.querySelectorAll("a, button, [tabindex], input").forEach((element) => {
         if (settingsSectionEl.contains(element)) {
            element.setAttribute("tabindex", IsOpen ? "-1" : "0");
         } else if (!sidebar.sidebarEl.contains(element)) {
            element.setAttribute("tabindex", IsOpen ? "0" : "-1");
         }
      });
   };
}

function improveFocusInSettings(focus) {
   document
      .querySelector(".page-settings__header .page-settings__close-settings-btn")
      .setAttribute("tabindex", focus ? "0" : "-1");
   openTranslationsSectionBtn.setAttribute("tabindex", focus ? "0" : "-1");
   openRecitersSectionBtn.setAttribute("tabindex", focus ? "0" : "-1");
   scrollToggleInput.setAttribute("tabindex", focus ? "0" : "-1");
}

// function to display search results according to best six matched surahs
function displaySearchResults() {
   let searchValue = headerInput.value
      .trim()
      .toLowerCase()
      .replace(/\b\s+?\b/, "-");
   // validation
   if (!searchValue) return;
   // find the six closet surahs to the target surah and then build surahs overview section upon of them
   surahsOverviewSec.build(findTarget(searchValue));
   // make the selected btn in the sidebar unselected
   if (sidebar.sidebarEl.querySelector(`[aria-selected="true"]`))
      sidebar.sidebarEl.querySelector(`[aria-selected="true"]`).ariaSelected = "false";
   if (window.innerWidth < 576) closeSearchBtn.click();
   headerInput.value = "";
   removePreloader();
   function findTarget(searchValue) {
      let scores = [];
      for (let i = 0; i < 6; scores.push({ id: 1, score: ++i - i }));
      surahsInfo.forEach((surah) => {
         let surahScore = 0,
            surahName = surah.englishName.toLocaleLowerCase();

         searchValue.split("").forEach((char, index) => {
            let regex = new RegExp(char, "g");
            // if char is in surahName
            if (surahName.includes(char)) surahScore++;
            while (regex.test(surahName)) {
               // if char is in surahName with same index
               if (regex.lastIndex - 1 === index) surahScore++;
            }
         });
         if (surahName.at(-1) === searchValue.at(-1)) surahScore++;
         scores.sort((score1, score2) => (score1.score > score2.score ? 1 : score2.score > score1.score ? -1 : 0));

         scores.some((el) => {
            if (surahScore <= el.score) return;
            // if surah score big than el score update el id and score with surah number and score
            [el.id, el.score] = [surah.number, surahScore];
            return true;
         });
      });

      return scores.reduce((searchResult, scoreData) => {
         searchResult.unshift(surahsInfo[scoreData.id - 1]);
         return searchResult;
      }, []);
   }
}

// search validation
function checkInputVal() {
   let searchValue = headerInput.value;
   // validation
   if (!searchValue) return;
   if (searchValue.at(-1).codePointAt(0) > 127) {
      window.alert("Please write with english characters, ex: Al Fatiha ");
      headerInput.value = "";
   }
}

function addPreloader() {
   pagePreloaderEl.style.display = "flex";
   document.body.style.overflow = "hidden";
}
function removePreloader() {
   pagePreloaderEl.style.display = "none";
   document.body.style.overflow = "initial";
}
function replaceStr(str, arr) {
   return arr.reduce((result, [target, newValue]) => result.replace(target, newValue), str);
}

export const preloader = { preloaderEl: pagePreloaderEl, addPreloader, removePreloader };
export const header = {
   openSidebarBtn,
   setupHeaderEventListeners,
   headerLogoEl,
   headerInput,
};
export { settings };
