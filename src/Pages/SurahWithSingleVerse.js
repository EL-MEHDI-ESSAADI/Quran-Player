import React, { useEffect, useState } from "react";
import muslimFamilySrc from "Assets/muslimFamily.jpg";
import { SurahHeader, Verse, PreloadedVerse, BackToHome } from "Components";
import useGlobalContext from "Hooks/useGlobalContext";
import { useParams } from "react-router-dom";
import { fetchData, replaceStr, decodeEntities } from "Helpers/utils";
import { verseApi, surahsOverviewData, singleTranslationApi, numberOfSurahsOnQuran } from "data";
import { ReactComponent as Basmala } from "Assets/Basmala.svg";

function SurahWithSingleVerse() {
   const {
      selectedTranslation,
      directContentTabIndex: tabIndexValue,
      bookmarks,
      isAudioPlaying,
      activeVerseOnAudio,
   } = useGlobalContext();
   const { surahId, verseNumber } = useParams();
   const [verseData, setVerseData] = useState();
   const verseKey = `${surahId}:${verseNumber}`;

   useEffect(getVerseData, []);

   useEffect(() => {
      document.title = isSurahOrVerseDoesntExist()
         ? "Quran For You"
         : `Surah ${surahsOverviewData[surahId - 1].englishName} - ${verseNumber} - Quran For You`;
   }, []);

   useEffect(() => {
      if (!verseData) return;
      const api = replaceStr(singleTranslationApi, [
         ["${VerseKey}", verseKey],
         ["${translationSrc_id}", selectedTranslation.id],
      ]);

      fetchData(api, handelTranslation);
   }, [selectedTranslation]);

   // functions
   function handelVerseData({ verse: fetchedData }) {
      const newVerseData = {
         verseKey,
         translation: decodeEntities(fetchedData.translations[0].text),
         arabText: fetchedData.text_imlaei,
         // for words the key is the world number
         words: fetchedData.words.reduce(
            (words, fetchedWord) =>
               words.set(fetchedWord.position, {
                  qcfText: fetchedWord.code_v1,
                  egTranslation: decodeEntities(fetchedWord.translation.text),
                  qcfFontPage: fetchedWord.v1_page,
               }),
            new Map()
         ),
      };

      setVerseData(newVerseData);
   }

   function getVerseData() {
      if (isSurahOrVerseDoesntExist()) return;

      const api = replaceStr(verseApi, [
         ["${verseKey}", verseKey],
         ["${translationSrc_id}", selectedTranslation.id],
      ]);

      fetchData(api, handelVerseData);
   }

   function handelTranslation(fetchedData) {
      setVerseData((oldVerseData) => ({
         ...oldVerseData,
         translation: decodeEntities(fetchedData.translations[0].text),
      }));
   }

   // is the route path is invalid
   const isSurahOrVerseDoesntExist = () =>
      isNaN(surahId) ||
      surahId > numberOfSurahsOnQuran ||
      surahId == 0 ||
      isNaN(verseNumber) ||
      verseNumber > surahsOverviewData[surahId - 1].numberOfAyahs ||
      verseNumber == 0;

   if (isSurahOrVerseDoesntExist()) return <BackToHome messege="Sorry, something went wrong" />;

   return (
      <main id="main">
         <div className="surah-section">
            <img src={muslimFamilySrc} alt="family" className="surah-section__family-img" />
            <SurahHeader surahId={surahId} tabIndexValue={tabIndexValue} />
            {surahId > 1 && <Basmala />}
            <div className="surah-section__verses">
               {verseData ? (
                  <Verse
                     {...verseData}
                     tabIndexValue={tabIndexValue}
                     isVerseBookmarked={bookmarks.has(verseData.verseKey)}
                     isVersePlaying={isAudioPlaying && activeVerseOnAudio === verseKey}
                  />
               ) : (
                  <PreloadedVerse />
               )}
            </div>
         </div>
      </main>
   );
}

export default React.memo(SurahWithSingleVerse);
