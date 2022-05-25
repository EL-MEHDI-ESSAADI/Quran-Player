import React, { useEffect, useRef, useState } from "react";
import { FiPlay, FiPause, FiBookmark, FiCopy } from "react-icons/fi";
import { VerseWord } from "Components";
import useGlobalContext from "Hooks/useGlobalContext";
import { useParams } from "react-router-dom";

function Verse({ verseKey, translation, arabText, words, tabIndexValue, isVersePlaying, isVerseBookmarked }) {
   const surahId = +useParams().surahId;
   const verseRef = useRef();
   const [alertTextCopied, setAlertTextCopied] = useState(false);
   const { dispatch, isAudioLoading, activeWordOnAudio, activeSurahOnAudio, activeVerseOnAudio, autoScroll } =
      useGlobalContext();
   const wordsElements = [...words].map(([wordPosition, wordData]) => {
      return (
         <VerseWord
            key={wordPosition}
            {...wordData}
            isWordPlaying={isVersePlaying && activeWordOnAudio === wordPosition}
         />
      );
   });

   useEffect(() => {
      if (isVersePlaying && autoScroll && verseRef)
         window.scrollTo(
            0,
            verseRef.current.offsetTop - window.innerHeight / 2 + verseRef.current.offsetHeight / 2
         );
   }, [isVersePlaying, autoScroll]);

   // functions
   function handelBookmarkBtnClick() {
      if (!isVerseBookmarked) dispatch({ type: "addToBookmarks", surahId, verseKey });
      if (isVerseBookmarked) dispatch({ type: "removeFromBookmarks", verseKey });
   }

   function playVerse() {
      if (isAudioLoading) return;

      if (activeSurahOnAudio != surahId)
         dispatch({ type: "makeSurahActiveOnAudio", id: surahId, verseKey, wordPosition: 1 });
      if (activeSurahOnAudio == surahId) {
         // if the verse was playing
         if (activeVerseOnAudio == verseKey) {
            dispatch({ type: "changeAudioPlayingState", value: true });
         } else {
            // if not
            dispatch({ type: "changeForcePlayingVerse", value: verseKey });
         }
      }
   }
   function pauseVerse() {
      dispatch({ type: "changeAudioPlayingState", value: false });
   }

   function handelCopyBtnClick() {
      if (navigator.clipboard) {
         navigator.clipboard
            .writeText(arabText)
            .then(() => {
               setAlertTextCopied(true);
               setTimeout(() => setAlertTextCopied(false), 1000);
            })
            .catch(() => alert("Please allow Clipboard permission"));
      } else {
         alert("Sorry your browser doesn't support copying to clipboard 😔");
      }
   }

   return (
      <div
         ref={verseRef}
         className={`verse ${isVerseBookmarked ? "verse--bookmarked" : ""} ${
            isVersePlaying ? "verse--active" : ""
         }`}
      >
         <div className="flex verse__header">
            <span className="verse__key ff-roboto">{verseKey}</span>
            <ul className="verse__features flex">
               <li>
                  <button
                     className="verse__audio-btn verse__feature"
                     aria-label={`${isVersePlaying ? "pause" : "play"} verse audio`}
                     title={isVersePlaying ? "pause" : "play"}
                     tabIndex={tabIndexValue}
                     onClick={isVersePlaying ? pauseVerse : playVerse}
                  >
                     {isVersePlaying ? <FiPause /> : <FiPlay />}
                  </button>
               </li>
               <li>
                  <button
                     className="verse__bookmark-btn verse__feature"
                     aria-label="bookmark"
                     tabIndex={tabIndexValue}
                     title="bookmark"
                     onClick={handelBookmarkBtnClick}
                  >
                     <FiBookmark />
                  </button>
               </li>
               <li>
                  <button
                     className="verse__copy-btn verse__feature"
                     aria-label="copy"
                     tabIndex={tabIndexValue}
                     title="copy"
                     onClick={handelCopyBtnClick}
                  >
                     <FiCopy />
                     {alertTextCopied && <span className="verse__copy-btn__copiedText">copied!</span>}
                  </button>
               </li>
            </ul>
         </div>
         <div className="verse__content flow">
            <div className="verse__ar-txt">
               {wordsElements}
               <p className="sr-only verse-sr-txt">{arabText}</p>
            </div>
            <div className="verse__eg-txt">{translation}</div>
         </div>
      </div>
   );
}

export default React.memo(Verse);
