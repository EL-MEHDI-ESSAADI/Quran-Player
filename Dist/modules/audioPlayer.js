import { segments } from "./surahsSec.js";
import { header, settings } from "./header-preloader-settings.js";
import * as thirdParty from "./thirdParty.js";

export const audioPlayerElement = document.querySelector(".audioPlayer");
export const playAudioBtn = document.body.querySelector(".audioPlayer__play-btn");
export const durationEl = document.body.querySelector(".audioPlayer__duration");
export const currentTimeEl = document.body.querySelector(".audioPlayer__current-time");
export const seekSliderEl = document.body.querySelector(".audioPlayer__seek");
export const audio = new Audio();
export let audioStates = {
   isAudioLoading: false,
   isAudioAppears: false,
};

const playPrevVerseBtn = document.querySelector(".audioPlayer__prev-verse-btn");
const playNextVerseBtn = document.querySelector(".audioPlayer__next-verse-btn ");
const repeatSurahBtn = document.querySelector(".audioPlayer__repeat-btn ");
const moreFeaturesBtn = document.querySelector(".audioPlayer__more-btn ");
const moreMenuEl = document.querySelector(".audioPlayer__more-menu");
const closeAudioBtn = document.querySelector(".audioPlayer__close-btn");
let isThumbMovingByUser = false;

// functions

export function setupPlayerEventListeners() {
   audio.addEventListener("loadedmetadata", initialPlayerContent);

   playAudioBtn.addEventListener("click", function (_) {
      const pauseMode = "audioPlayer__play-btn--pause";
      const isPlaying = !audio.paused;

      const surahHeaderAudioBtn = document.querySelector(
         `.surah-section[data-id="${audioPlayerElement.dataset.surahId}"] .header__audio-btn`
      );
      const activeVerseAudioBtn = document.querySelector(
         `.surah-section[data-id="${audioPlayerElement.dataset.surahId}"] .verse--active .verse__audio-btn`
      );
      // if audio is loading
      if (audioStates.isAudioLoading) return;

      if (isPlaying) {
         pauseAudio(pauseMode, surahHeaderAudioBtn, activeVerseAudioBtn);
      } else {
         playAudio(pauseMode, surahHeaderAudioBtn, activeVerseAudioBtn);
      }
   });

   seekSliderEl.addEventListener("change", (_) => {
      if (audioStates.isAudioLoading) return;
      audio.currentTime = seekSliderEl.value;
      isThumbMovingByUser = false;
   });

   seekSliderEl.addEventListener("input", (e) => {
      if (audioStates.isAudioLoading) {
         seekSliderEl.value = 0;
         return;
      }
      isThumbMovingByUser = true;
      updatePlayer();
   });

   audio.addEventListener("ended", (e) => {
      const pauseMode = "audioPlayer__play-btn--pause";
      const surahHeaderAudioBtn = document.querySelector(
         `.surah-section[data-id="${audioPlayerElement.dataset.surahId}"] .header__audio-btn`
      );
      const activeVerseAudioBtn = document.querySelector(
         `.surah-section[data-id="${audioPlayerElement.dataset.surahId}"] .verse--active .verse__audio-btn`
      );
      const isSurahRepeating = repeatSurahBtn.classList.contains("audioPlayer__repeat-btn--repeating");
      if (isSurahRepeating) {
         playAudio(pauseMode, surahHeaderAudioBtn, activeVerseAudioBtn);
      } else {
         pauseAudio(pauseMode, surahHeaderAudioBtn, activeVerseAudioBtn);
      }
   });

   audio.addEventListener("timeupdate", (_) => {
      if (!audio.paused) {
         // check if the audio is playing a wrong reciter, if it is we should update the audio to the right reciter
         if (audioPlayerElement.dataset.reciterId != settings.reciter.id) {
            const url = replaceStr(thirdParty.surahAudioApi, [
               ["${reciter_id}", settings.reciter.id],
               ["${surah_id}", audioPlayerElement.dataset.surahId],
            ]);
            const map = new Map().set("data", { url: url, content: null });

            // reset player
            audio.pause();
            seekSliderEl.value = 0;
            seekSliderEl.parentElement.style.setProperty("--seek-before-width", 0);
            currentTimeEl.textContent = durationEl.textContent = "";
            playAudioBtn.classList.add("audioPlayer__play-btn--loading");
            audioPlayerElement.dataset.reciterId = settings.reciter.id;

            thirdParty.handelData(map, (map) => {
               const audioData = map.get("data").content.audio_files[0];
               let startTime = 0;
               let currentPlayingVerseKey;

               // get currentPlayingVerseKey
               segments.playerVerses.data.some((verseSegment) => {
                  if (
                     audio.currentTime >= verseSegment.timestamp_from &&
                     audio.currentTime < verseSegment.timestamp_to
                  ) {
                     currentPlayingVerseKey = verseSegment.key;
                     return true;
                  }
               });

               // reset segment
               segments.playerVerses.data = [];
               segments.lastVisitedSurahWords.data = [];

               // add verses segments of the current surah  to segments.playerVerses.data array
               audioData.verse_timings.forEach((verseAudio) => {
                  if (currentPlayingVerseKey && currentPlayingVerseKey == verseAudio.verse_key)
                     startTime = verseAudio.timestamp_from / 1000;
                  segments.playerVerses.data.push({
                     key: verseAudio.verse_key,
                     timestamp_from: verseAudio.timestamp_from / 1000,
                     timestamp_to: verseAudio.timestamp_to / 1000,
                  });
               });

               // add words segments of the current surah page (if there is)  to words segments array
               document
                  .querySelectorAll(
                     `.surah-section[data-id="${audioPlayerElement.dataset.surahId}"] .surah-section__verses .verse`
                  )
                  .forEach((verseEl) => {
                     const verseNumber = verseEl.dataset.key.split(":")[1];
                     const verseWordsElements = verseEl.querySelectorAll(".verse__ar-txt__word-btn");
                     const verseAudio = audioData.verse_timings[verseNumber - 1];

                     // add words segments of the current verse  to words segments array
                     verseAudio.segments.forEach((wordTiming) => {
                        // verseWordsElements[wordTiming[0] - 1].dataset.id : is word id for the current word timing
                        segments.lastVisitedSurahWords.data.push({
                           id: verseWordsElements[wordTiming[0] - 1].dataset.id,
                           timestamp_from: wordTiming[1] / 1000,
                           timestamp_to: wordTiming[2] / 1000,
                        });
                     });
                  });

               audio.src = audioData.audio_url;
               audio.currentTime = startTime;
            });
         } else {
            whilePlaying();
         }
      }
   });

   playPrevVerseBtn.addEventListener("click", changeVerse(playPrevVerseBtn, -1));

   playNextVerseBtn.addEventListener("click", changeVerse(playNextVerseBtn, 1));

   repeatSurahBtn.addEventListener("click", (_) =>
      repeatSurahBtn.classList.toggle("audioPlayer__repeat-btn--repeating")
   );

   moreFeaturesBtn.addEventListener("click", (_) => moreMenuEl.classList.toggle("audioPlayer__more-menu--show"));

   moreFeaturesBtn.addEventListener("focusout", (_) => {
      if (document.querySelector(".audioPlayer__more-menu:hover")) return;
      moreMenuEl.classList.remove("audioPlayer__more-menu--show");
   });

   closeAudioBtn.addEventListener("click", (_) => {
      const pauseMode = "audioPlayer__play-btn--pause";
      const surahHeaderAudioBtn = document.querySelector(
         `.surah-section[data-id="${audioPlayerElement.dataset.surahId}"] .header__audio-btn`
      );
      const activeVerseAudioBtn = document.querySelector(
         `.surah-section[data-id="${audioPlayerElement.dataset.surahId}"] .verse--active .verse__audio-btn`
      );

      if (audioStates.isAudioLoading) {
         alert("Soryy you can't close the player while the audio is loading");
         return;
      }

      pauseAudio(pauseMode, surahHeaderAudioBtn, activeVerseAudioBtn);
      moreMenuEl.classList.remove("audioPlayer__more-menu--show");
      audioPlayerElement.style.display = "none";
      audioStates.isAudioAppears = false;
   });

   window.addEventListener("keydown", (e) => {
      const isHeaderInputFocused = document.activeElement === header.headerInput ? true : false;

      if (!audioStates.isAudioAppears || audioStates.isAudioLoading || isHeaderInputFocused) return;

      if (e.key == "ArrowRight") playNextVerseBtn.click();
      if (e.key == "ArrowLeft") playPrevVerseBtn.click();
      if (e.key == " ") {
         playAudioBtn.click();
         e.preventDefault();
      }
   });
}

function playAudio(pauseMode, surahHeaderAudioBtn, activeVerseAudioBtn) {
   audio.play();
   playAudioBtn.classList.add(pauseMode);
   surahHeaderAudioBtn && surahHeaderAudioBtn.classList.add("header__audio-btn--pause");
   activeVerseAudioBtn && activeVerseAudioBtn.classList.add("verse__audio-btn--pause");
}

function pauseAudio(pauseMode, surahHeaderAudioBtn, activeVerseAudioBtn) {
   audio.pause();
   playAudioBtn.classList.remove(pauseMode);
   surahHeaderAudioBtn && surahHeaderAudioBtn.classList.remove("header__audio-btn--pause");
   activeVerseAudioBtn && activeVerseAudioBtn.classList.remove("verse__audio-btn--pause");
}

function changeVerse(targetBtn, value) {
   return (_) => {
      const isTargetBtnDisabled = targetBtn.classList.contains("audioPlayer__control-btn--disabled");
      if (isTargetBtnDisabled) return;
      segments.playerVerses.data.some((verse, index) => {
         if (!(audio.currentTime >= verse.timestamp_from && audio.currentTime < verse.timestamp_to)) return;
         if (segments.playerVerses.data[index + value])
            audio.currentTime = segments.playerVerses.data[index + value].timestamp_from;
         return true;
      });
      if (audio.paused) playAudioBtn.click();
   };
}

function whilePlaying() {
   const currentTime = audio.currentTime;
   const activeWordBtn = document.body.querySelector(`.verse__ar-txt__word-btn--active`);
   const activeVerseEl = document.body.querySelector(`.verse--active`);
   const preloadedVersesConEl = document.querySelector(`.surah-section__preloaded-verses`);
   const versesSegmentsLength = segments.playerVerses.data.length;
   let targetWordBtn;
   let targetVerseEl;

   if (!isThumbMovingByUser) updatePlayer();

   // disable playPrevVerseBtn when there is no previous verse to play, and playNextVerseBtn when there is no next verse to play
   if (audio.currentTime < segments.playerVerses.data[0].timestamp_to) {
      playPrevVerseBtn.classList.add("audioPlayer__control-btn--disabled");
   } else {
      playPrevVerseBtn.classList.remove("audioPlayer__control-btn--disabled");
   }
   if (audio.currentTime > segments.playerVerses.data[versesSegmentsLength - 1].timestamp_from) {
      playNextVerseBtn.classList.add("audioPlayer__control-btn--disabled");
   } else {
      playNextVerseBtn.classList.remove("audioPlayer__control-btn--disabled");
   }

   // if the there is no audio's surah
   if (!document.querySelector(`.surah-section[data-id="${audioPlayerElement.dataset.surahId}"]`)) return;

   // setup a functionality to make the audio congruent with surah's verses text

   // find the word that the audio reach to it (targetBtn)
   segments.lastVisitedSurahWords.data.some((word) => {
      if (!(currentTime >= word.timestamp_from && currentTime < word.timestamp_to)) return;
      targetWordBtn = document.querySelector(`.verse__ar-txt__word-btn[data-id="${word.id}"]`);
      return true;
   });

   // find the verse that the audio reach to it (targetVerseEl)
   segments.playerVerses.data.some((verse) => {
      if (!(currentTime >= verse.timestamp_from && currentTime < verse.timestamp_to)) return;
      targetVerseEl = document.querySelector(`.verse[data-key="${verse.key}"]`);
      return true;
   });

   // if both activeBtn and targetBtn are null or same button we don't need to anything to them, else we need to modify them
   if (activeWordBtn !== targetWordBtn) {
      // make the active btn not active and his parent too
      if (activeWordBtn) activeWordBtn.classList.remove("verse__ar-txt__word-btn--active");

      // make the the word that the audio reach to it active and his parent too
      if (targetWordBtn) targetWordBtn.classList.add("verse__ar-txt__word-btn--active");
   }

   if (activeVerseEl !== targetVerseEl) {
      if (activeVerseEl) {
         activeVerseEl.classList.remove("verse--active");
         activeVerseEl.querySelector(".verse__audio-btn").classList.remove("verse__audio-btn--pause");
      }

      if (targetVerseEl) {
         targetVerseEl.classList.add("verse--active");
         targetVerseEl.querySelector(".verse__audio-btn").classList.add("verse__audio-btn--pause");
         if (settings.autoScroll) {
            window.scrollTo(0, targetVerseEl.offsetTop - window.innerHeight / 2 + targetVerseEl.offsetHeight / 2);
         }
      }
   }

   if (!targetVerseEl && settings.autoScroll && preloadedVersesConEl) {
      window.scrollTo(0, preloadedVersesConEl.offsetTop);
   }
}

function updatePlayer() {
   //  if the thumb is moving by user it is updating automatically so we shouldn't update it
   if (!isThumbMovingByUser) seekSliderEl.value = Math.floor(audio.currentTime);
   seekSliderEl.parentElement.style.setProperty(
      "--seek-before-width",
      (seekSliderEl.value / seekSliderEl.max) * 100 + "%"
   );
   currentTimeEl.textContent = calculateTime(seekSliderEl.value);
   seekSliderEl.ariaValueNow = seekSliderEl.value;
   seekSliderEl.ariaValueText = `${currentTimeEl.textContent} of ${durationEl.textContent}`;
}
function calculateTime(duration) {
   let hours = Math.floor(duration / 3600);
   let minutes = Math.floor(duration / 60) % 60;
   let seconds = Math.floor(duration) % 60;
   let returnValue = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
   if (hours > 0) returnValue = `${hours < 10 ? "0" + hours : hours}:${returnValue}`;
   return returnValue;
}
function initialPlayerContent() {
   currentTimeEl.textContent = "00:00";
   durationEl.textContent = calculateTime(audio.duration);
   seekSliderEl.ariaValueMax = Math.floor(audio.duration);
   seekSliderEl.ariaValueText = `00:00 of ${durationEl.textContent}`;
   seekSliderEl.setAttribute("max", Math.floor(audio.duration));
   playAudioBtn.classList.remove("audioPlayer__play-btn--loading");
   playAudioBtn.classList.add("audioPlayer__play-btn--pause");
   audio.play();
   audioStates.isAudioLoading = false;
}

function replaceStr(str, arr) {
   return arr.reduce((result, [target, newValue]) => result.replace(target, newValue), str);
}
