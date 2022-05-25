import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import muslimFamilySrc from "Assets/muslimFamily.jpg";
import { SurahHeader, Verses, PreloadedVerses, BackToHome } from "Components";
import useGlobalContext from "Hooks/useGlobalContext";
import { decodeEntities, fetchData, replaceStr } from "Helpers/utils";
import { translationsApi, versesApi, numberOfSurahsOnQuran, surahsOverviewData } from "data";
import { ReactComponent as Basmala } from "Assets/Basmala.svg";

function Surah() {
   const surahId = +useParams().surahId;
   const {
      selectedTranslation,
      directContentTabIndex: tabIndexValue,
      dispatch,
      activeSurahOnAudio,
      activeVerseOnAudio,
      autoScroll,
   } = useGlobalContext();
   const [surahData, setSurahData] = useState(() => ({ verses: new Map(), tranlations: new Map(), nextPage: 1 }));
   const [observePreloadedVersesEl, setObservePreloadedVersesEl] = useState(false);

   useEffect(() => {
      if (isSurahDoesntExist()) return;
      getSurahData();
      dispatch({ type: "addSurahToHistory", id: surahId });
   }, []);

   useEffect(() => {
      document.title = isSurahDoesntExist()
         ? "Quran For You"
         : `Surah ${surahsOverviewData[surahId - 1].englishName} - Quran For You`;
   }, []);

   useEffect(() => {
      if (!surahData.verses.size) return;
      const api = replaceStr(translationsApi, [
         ["${surah_id}", surahId],
         ["${translationSrc_id}", selectedTranslation.id],
      ]);

      fetchData(api, handelTranslations);
   }, [selectedTranslation]);

   useEffect(() => {
      if (
         activeSurahOnAudio == surahId &&
         autoScroll &&
         activeVerseOnAudio &&
         surahData.verses.size &&
         !surahData.verses.has(activeVerseOnAudio)
      )
         getSurahData();
   }, [activeSurahOnAudio, activeVerseOnAudio, autoScroll, surahData]);

   // functions
   function handelSurahData(data) {
      const newSurahData = {
         verses: new Map(surahData.verses),
         tranlations: new Map(surahData.tranlations),
         nextPage: data.pagination.next_page,
      };

      data.verses.forEach((fetchedVerse) => {
         // for verses the key is the world id
         newSurahData.verses.set(fetchedVerse.verse_key, {
            arabText: fetchedVerse.text_imlaei,
            // for words the key is the world number
            words: fetchedVerse.words.reduce(
               (words, fetchedWord) =>
                  words.set(fetchedWord.position, {
                     qcfText: fetchedWord.code_v1,
                     egTranslation: decodeEntities(fetchedWord.translation.text),
                     qcfFontPage: fetchedWord.v1_page,
                  }),
               new Map()
            ),
         });
         // add verse translation
         newSurahData.tranlations.set(fetchedVerse.verse_key, decodeEntities(fetchedVerse.translations[0].text));
      });

      if (data.pagination.next_page) setObservePreloadedVersesEl(true);

      setSurahData(newSurahData);
   }

   const getSurahData = useCallback(() => {
      if (!surahData.nextPage) return;
      const api = replaceStr(versesApi, [
         ["${surah_id}", surahId],
         ["${translationSrc_id}", selectedTranslation.id],
         ["${page_number}", surahData.nextPage],
      ]);

      setObservePreloadedVersesEl(false);
      fetchData(api, handelSurahData);
   }, [selectedTranslation, surahData]);

   function handelTranslations({ translations: translationsData }) {
      const newTranslations = new Map(surahData.tranlations);

      // add translations
      translationsData.forEach((translationItem) => {
         if (newTranslations.has(translationItem.verse_key))
            newTranslations.set(translationItem.verse_key, decodeEntities(translationItem.text));
      });

      setSurahData((oldSurahData) => ({ ...oldSurahData, tranlations: newTranslations }));
   }

   const isSurahDoesntExist = () => isNaN(surahId) || surahId > numberOfSurahsOnQuran || surahId === 0;

   if (isSurahDoesntExist()) {
      return <BackToHome messege="Sorry, this surah doesn't exist" />;
   }

   return (
      <main id="main">
         <div className="surah-section">
            <img src={muslimFamilySrc} alt="family" className="surah-section__family-img" />
            <SurahHeader surahId={surahId} tabIndexValue={tabIndexValue} />
            {surahId > 1 && <Basmala />}
            {surahData.verses && (
               <Verses
                  versesData={surahData.verses}
                  tranlationsData={surahData.tranlations}
                  tabIndexValue={tabIndexValue}
               />
            )}
            {surahData.nextPage && (
               <PreloadedVerses observePreloadedVerses={observePreloadedVersesEl} getSurahData={getSurahData} />
            )}
         </div>
      </main>
   );
}

export default React.memo(Surah);
