import React from "react";
import { BsPauseFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { HeaderPlayPauseBtn } from "Components";
import useGlobalContext from "Hooks/useGlobalContext";
import { surahsOverviewData } from "data";

function SurahHeader({ surahId, tabIndexValue }) {
   const {
      selectedTranslation,
      dispatch,
      activeSurahOnAudio,
      isAudioPlaying,
      isAudioLoading,
   } = useGlobalContext();

   function playAudio() {
      if (isAudioLoading) return;
      if (activeSurahOnAudio != surahId)
         dispatch({ type: "makeSurahActiveOnAudio", id: surahId, verseKey: null, wordPosition: null });
      if (activeSurahOnAudio == surahId) {
         dispatch({ type: "changeAudioPlayingState", value: true });
      }
   }

   function pauseAudio() {
      dispatch({ type: "changeAudioPlayingState", value: false });
   }
   const playPauseBtn =
      isAudioPlaying && activeSurahOnAudio == surahId ? (
         <HeaderPlayPauseBtn
            Icon={BsPauseFill}
            size="1.3rem"
            Text="pause Audio"
            handelClick={pauseAudio}
            tabIndexValue={tabIndexValue}
         />
      ) : (
         <HeaderPlayPauseBtn
            Icon={FaPlay}
            size=".85rem"
            Text="play Audio"
            handelClick={playAudio}
            tabIndexValue={tabIndexValue}
         />
      );
   const { name, englishName } = surahsOverviewData[surahId - 1];

   // functions
   function openSettingsSidebar() {
      dispatch({ type: "moveSettingsSidebar", open: true });
   }

   return (
      <header className="surah-section__header fw-500">
         <div className="header__surah-names flex">
            <h2 className="header__eg-name">{englishName}</h2>
            <h2 className="ff-amiri header__ar-name">{name}</h2>
         </div>
         <div className="header__trn-and-btns flex">
            <div className="header__trn-container">
               <div>Translation By</div>
               <div className="header__trn-container__src">
                  <div className="header__translation-src">{selectedTranslation.name}</div>
                  <button
                     className="header__change-translation-btn"
                     tabIndex={tabIndexValue}
                     onClick={openSettingsSidebar}
                  >
                     &nbsp;(<span className="header__change-translation-btn__text">Change</span>)
                  </button>
               </div>
            </div>
            <div className="header__btns-container">{playPauseBtn}</div>
         </div>
      </header>
   );
}

export default React.memo(SurahHeader);
