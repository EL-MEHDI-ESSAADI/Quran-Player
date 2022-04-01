
export const versesContentApi = `https://api.quran.com/api/v4/verses/by_chapter/$\{surah_id}?language=en&words=true&translations=$\{translationSrc_id}&translation_fields=resource_name&fields=text_imlaei,chapter_id&word_fields=v1_page,code_v1&page=$\{page_id}&per_page=10`;
export const verseContentApi = `https://api.quran.com/api/v4/verses/by_key/$\{verse_key}?language=en&words=true&translations=$\{translationSrc_id}&translation_fields=resource_name&fields=text_imlaei,chapter_id&word_fields=v1_page,code_v1`;
export const surahAudioApi = `https://api.qurancdn.com/api/qdc/audio/reciters/$\{reciter_id}/audio_files?chapter=$\{surah_id}&segments=true`;
export const availableTranslationsApi = `https://api.quran.com/api/v4/resources/translations?language=eg`;
export const translationOfSurahApi = `https://api.quran.com/api/v4/quran/translations/$\{translationSrc_id}?fields=verse_key&$\{query}`


// handel the data if we get it or no
export function handelData(map, successGetData) {
   fetchData(map)
      .then(successGetData)
      .catch((err) => {
         console.error(err);
         if (err instanceof RangeError) window.alert(err.message);
      });
}

// fetch data
async function fetchData(map) {
   for (let [key, value] of map) {
      let response = await fetch(value.url);
      // throw a range error because respinse.og is out of the range 200-299
      if (!response.ok)
         throw new RangeError(`${response.status} request error`);
      map.get(key).content = await response.json();
   }
   return map;
}


