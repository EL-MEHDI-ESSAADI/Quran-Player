import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { ReactComponent as RepeatSvg } from "Assets/Repeat.svg";
import { ReactComponent as PreviousSvg } from "Assets/Previous.svg";
import { ReactComponent as NextSvg } from "Assets/Next.svg";
import { ReactComponent as AudioLoading } from "Assets/AudioLoading.svg";
import { FaPlay, FaEllipsisH } from "react-icons/fa";
import { ButtonIcon, AudioSlider, MoreFeaturesMenu, AudioVisibleInfo } from "Components";
import { IoMdPause } from "react-icons/io";
import useGlobalContext from "Hooks/useGlobalContext";
import { fetchData, millisecToSec, replaceStr } from "Helpers/utils";
import { audioApi } from "data";

const initialAudioData = {
   src: "",
   segments: [],
   duration: 0,
   currentTime: 0,
   repeatSurah: false,
};

const reducer = (state, action) => {
   switch (action.type) {
      case "gettingDataUpdate":
         return {
            ...state,
            segments: action.segments,
            src: action.src,
            currentTime: action.currentTime,
            duration: 0,
         };
      case "loadedmetadata":
         return { ...state, duration: action.duration };
      case "updateCurrentTime":
         return { ...state, currentTime: action.currentTime };
      case "toggleRepeatSurah":
         return { ...state, repeatSurah: !state.repeatSurah };
      default:
         throw new Error("none of action type is valid");
   }
};

function AudioPlayer() {
   const [audioData, dispatchAudioData] = useReducer(reducer, initialAudioData);
   const [isMoreMenuShowing, setIsMoreMenuShowing] = useState(false);
   const { current: audio } = useRef(new Audio());
   const {
      activeSurahOnAudio,
      activeVerseOnAudio,
      activeWordOnAudio,
      isAudioPlayerAppears,
      isAudioPlaying,
      isAudioLoading,
      forcePlayingVerse,
      selectedReciter,
      dispatch,
      directContentTabIndex: tabIndexValue,
   } = useGlobalContext();
   const isPrevBtnDisabled =
      isAudioLoading || (audioData.segments.length && activeVerseOnAudio === audioData.segments[0].key);
   const isNextBtnDisabled =
      isAudioLoading ||
      (audioData.segments.length && activeVerseOnAudio === audioData.segments[audioData.segments.length - 1].key);

   const animationRef = useRef();

   // get audio data
   useEffect(() => {
      if (!activeSurahOnAudio) return;
      const api = replaceStr(audioApi, [
         ["${reciter_id}", selectedReciter.id],
         ["${surah_id}", activeSurahOnAudio],
      ]);

      // pause audio
      if (isAudioPlaying) dispatch({ type: "changeAudioPlayingState", value: false });

      // start loading
      dispatch({ type: "changeAudioLoading", value: true });
      // fetch data
      fetchData(api, handelAudioData);
   }, [activeSurahOnAudio, selectedReciter]);

   // start listen to loadedmetadata
   useEffect(() => {
      if (!audioData.src) return;

      audio.addEventListener("loadedmetadata", audioInit);
      audio.src = audioData.src;

      return () => audio.removeEventListener("loadedmetadata", audioInit);
   }, [audioData.src]);

   // play and pause audio
   useEffect(() => {
      cancelAnimationFrame(animationRef.current);

      if (!isAudioPlaying) audio.pause();

      if (isAudioPlaying) {
         audio.play();
         requestAnimationFrame(whilePlaying);
      }

      if (isAudioPlaying && !isAudioPlayerAppears) dispatch({ type: "changeAudioAppearance", value: true });
   }, [isAudioPlaying, activeVerseOnAudio, activeWordOnAudio, isAudioPlayerAppears]);

   // listen to audio end
   useEffect(() => {
      audio.addEventListener("ended", handelAudioEndEvent);

      return () => audio.removeEventListener("ended", handelAudioEndEvent);
   }, [audioData.repeatSurah, isAudioPlaying]);

   // force playing a verse
   useEffect(() => {
      if (!forcePlayingVerse) return;

      audioData.segments.some((verseSegment) => {
         if (verseSegment.key !== forcePlayingVerse) return;

         dispatch({
            type: "changeActiveVerseAndWord",
            newActiveVerseOnAudio: verseSegment.key,
            newActiveWordOnAudio: 1,
         });

         fullyUpdateCurrentTime(verseSegment.startOn);
         return true;
      });

      if (!isAudioPlaying) dispatch({ type: "changeAudioPlayingState", value: true });

      dispatch({ type: "changeForcePlayingVerse", value: null });
   }, [forcePlayingVerse]);

   // controle the player with keyboard
   useEffect(() => {
      window.addEventListener("keydown", keyboardControle);

      return () => window.removeEventListener("keydown", keyboardControle);
   }, [
      isAudioLoading,
      isAudioPlayerAppears,
      isAudioPlaying,
      activeVerseOnAudio,
      isPrevBtnDisabled,
      tabIndexValue,
   ]);

   // functions

   function handelAudioData({ audio_files: [fetchedAudioData] }) {
      let newCurrentTime = 0;

      // build segments array
      const newAudioSegments = fetchedAudioData.verse_timings.reduce((allVerseSegments, verseSegment) => {
         const newVerseSegment = {
            key: verseSegment.verse_key,
            startOn: millisecToSec(verseSegment.timestamp_from),
            endOn: millisecToSec(verseSegment.timestamp_to),
            wordsSegments: verseSegment.segments.reduce((allWordsSegments, wordSegment) => {
               const newWordSegment = {
                  position: wordSegment[0],
                  startOn: millisecToSec(wordSegment[1]),
                  endOn: millisecToSec(wordSegment[2]),
               };

               /* 
                  update newCurrentTime 
                  (to make possible to back to active word on changing reciter while audio playing)
               */
               if (activeVerseOnAudio == verseSegment.verse_key && activeWordOnAudio == newWordSegment.position)
                  newCurrentTime = newWordSegment.startOn;

               allWordsSegments.push(newWordSegment);
               return allWordsSegments;
            }, []),
         };

         allVerseSegments.push(newVerseSegment);

         return allVerseSegments;
      }, []);

      // update our audioData
      dispatchAudioData({
         type: "gettingDataUpdate",
         segments: newAudioSegments,
         src: fetchedAudioData.audio_url,
         currentTime: newCurrentTime,
      });
   }

   function whilePlaying() {
      // update audioData currentTime
      dispatchAudioData({ type: "updateCurrentTime", currentTime: audio.currentTime });

      // undate activeWordOnAudio and activeVerseOnAudio
      updateActiveWordAndVerse(audio.currentTime);

      animationRef.current = requestAnimationFrame(whilePlaying);
   }

   function audioInit() {
      // end loading
      dispatch({ type: "changeAudioLoading", value: false });

      // update audio data
      dispatchAudioData({
         type: "loadedmetadata",
         duration: audio.duration,
      });

      // play audio
      dispatch({ type: "changeAudioPlayingState", value: true });
      updateAudioCurrentTime(audioData.currentTime);
   }

   function updateAudioCurrentTime(newValue) {
      audio.currentTime = newValue;
   }

   function handelSliderChange({ target: { value: newCurrentTime } }) {
      if (isAudioLoading) return;

      if (!isAudioPlaying) {
         // update activeWordOnAudio and activeVerseOnAudio
         updateActiveWordAndVerse(newCurrentTime);
         // update currentTime
         fullyUpdateCurrentTime(newCurrentTime);
      } else {
         updateAudioCurrentTime(newCurrentTime);
      }
   }

   const handelRepeatBtnClick = useCallback(() => dispatchAudioData({ type: "toggleRepeatSurah" }), []);

   const handelMoreOptionsBtnClick = useCallback(() => setIsMoreMenuShowing(true), []);

   const handelPlayBtnClick = useCallback(() => dispatch({ type: "changeAudioPlayingState", value: true }), []);

   const handelPauseBtnClick = useCallback(() => dispatch({ type: "changeAudioPlayingState", value: false }), []);

   const handelPrevBtnClick = useCallback(() => {
      if (isPrevBtnDisabled) return;

      dispatch({
         type: "changeForcePlayingVerse",
         value: `${activeSurahOnAudio}:${activeVerseOnAudio.split(":")[1] - 1}`,
      });
   }, [activeVerseOnAudio, isPrevBtnDisabled]);

   const handelNextBtnClick = useCallback(() => {
      if (isNextBtnDisabled) return;

      dispatch({
         type: "changeForcePlayingVerse",
         value: `${activeSurahOnAudio}:${+activeVerseOnAudio.split(":")[1] + 1}`,
      });
   }, [activeVerseOnAudio, isPrevBtnDisabled]);

   const handelMoreOptionsContainerBlur = useCallback((e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
         setIsMoreMenuShowing(false);
      }
   }, []);

   function handelAudioEndEvent() {
      if (audioData.repeatSurah) {
         // update currentTime
         fullyUpdateCurrentTime(0);
         // play audio
         if (isAudioPlaying) audio.play();
         if (!isAudioPlaying) dispatch({ type: "changeAudioPlayingState", value: true });
      } else {
         // pause audio
         dispatch({ type: "changeAudioPlayingState", value: false });
         // reset active verse and word
         dispatch({
            type: "changeActiveVerseAndWord",
            newActiveVerseOnAudio: null,
            newActiveWordOnAudio: null,
         });
      }
   }

   function fullyUpdateCurrentTime(newValue) {
      dispatchAudioData({ type: "updateCurrentTime", currentTime: newValue });
      // update audio currentTime
      updateAudioCurrentTime(newValue);
   }

   function updateActiveWordAndVerse(compareValue) {
      audioData.segments.some((verseSegment) => {
         if (verseSegment.startOn > compareValue || verseSegment.endOn < compareValue) return;

         verseSegment.wordsSegments.some((wordSegment) => {
            if (wordSegment.startOn > compareValue || wordSegment.endOn < compareValue) return;

            if (activeVerseOnAudio !== verseSegment.key || activeWordOnAudio !== wordSegment.position)
               dispatch({
                  type: "changeActiveVerseAndWord",
                  newActiveVerseOnAudio: verseSegment.key,
                  newActiveWordOnAudio: wordSegment.position,
               });

            return true;
         });

         return true;
      });
   }

   function keyboardControle(e) {
      if (
         document.activeElement !== document.body ||
         tabIndexValue != 0 ||
         isAudioLoading ||
         !isAudioPlayerAppears
      )
         return;

      if ([" ", "ArrowRight", "ArrowLeft"].some((value) => value === e.key)) e.preventDefault();

      if (e.key === " ") isAudioPlaying ? handelPauseBtnClick() : handelPlayBtnClick();

      if (e.key === "ArrowRight") handelNextBtnClick();

      if (e.key === "ArrowLeft") handelPrevBtnClick();
   }

   return (
      <div className="audioPlayer" style={{ display: isAudioPlayerAppears ? "block" : "none" }}>
         <AudioSlider
            tabIndexValue={tabIndexValue}
            value={audioData.currentTime}
            max={audioData.duration}
            handelChange={handelSliderChange}
         />
         <AudioVisibleInfo currentTime={audioData.currentTime} duration={audioData.duration} />
         <div className="audioPlayer__controller">
            <ButtonIcon
               classValue={`audioPlayer__repeat-btn audioPlayer__control-btn ${
                  audioData.repeatSurah ? "audioPlayer__repeat-btn--repeating" : ""
               }`}
               ariaLabl="repeat surah"
               title="repeat surah"
               tabIndexValue={tabIndexValue}
               Icon={RepeatSvg}
               handelClick={handelRepeatBtnClick}
            />
            <ButtonIcon
               classValue={`audioPlayer__control-btn ${
                  isPrevBtnDisabled ? "audioPlayer__control-btn--disabled" : ""
               }`}
               ariaLabl="play previous verse"
               title="previous verse"
               tabIndexValue={tabIndexValue}
               Icon={PreviousSvg}
               handelClick={handelPrevBtnClick}
            />
            {!isAudioPlaying && !isAudioLoading && (
               <ButtonIcon
                  classValue="audioPlayer__control-btn audioPlayer__play-state-btn"
                  ariaLabl="play verse"
                  title="play"
                  tabIndexValue={tabIndexValue}
                  Icon={FaPlay}
                  iconSize="16px"
                  handelClick={handelPlayBtnClick}
               />
            )}
            {isAudioPlaying && (
               <ButtonIcon
                  classValue="audioPlayer__control-btn audioPlayer__play-state-btn"
                  ariaLabl="pause verse"
                  title="pause"
                  tabIndexValue={tabIndexValue}
                  Icon={IoMdPause}
                  iconSize="18px"
                  handelClick={handelPauseBtnClick}
               />
            )}
            {isAudioLoading && (
               <ButtonIcon
                  classValue="audioPlayer__control-btn audioPlayer__play-state-btn"
                  ariaLabl="loading"
                  title="loading"
                  tabIndexValue={tabIndexValue}
                  Icon={AudioLoading}
               />
            )}
            <ButtonIcon
               classValue={`audioPlayer__control-btn ${
                  isNextBtnDisabled ? "audioPlayer__control-btn--disabled" : ""
               }`}
               ariaLabl="play next verse"
               title="next verse"
               tabIndexValue={tabIndexValue}
               Icon={NextSvg}
               handelClick={handelNextBtnClick}
            />
            <div onBlur={handelMoreOptionsContainerBlur}>
               <ButtonIcon
                  classValue="audioPlayer__control-btn"
                  ariaLabl="display more options"
                  title="more"
                  tabIndexValue={tabIndexValue}
                  Icon={FaEllipsisH}
                  iconSize="16px"
                  handelClick={handelMoreOptionsBtnClick}
               />
               <MoreFeaturesMenu tabIndexValue={tabIndexValue} isMoreMenuShowing={isMoreMenuShowing} />
            </div>
         </div>
      </div>
   );
}

export default React.memo(AudioPlayer);
