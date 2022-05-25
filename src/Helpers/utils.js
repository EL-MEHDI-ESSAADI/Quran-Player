import React from "react";

const spanEl = document.createElement("span");

export function withErrorBoundary(WrappedComponent) {
   return class MyErrorBoundary extends React.Component {
      state = {
         errorMessage: "",
      };

      static getDerivedStateFromError(error) {
         return { errorMessage: error.message };
      }

      componentDidCatch(error) {
         console.error(error);
      }

      render() {
         if (this.state.errorMessage) {
            return <p>{this.state.errorMessage}</p>;
         }
         return <WrappedComponent {...this.props} />;
      }
   };
}

export function getPossibleSurahOverview(searchValue, surahsOverviewData) {
   let scores = [];
   for (let i = 0; i < 6; scores.push({ id: 1, score: ++i - i }));
   surahsOverviewData.forEach((surah) => {
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
      searchResult.unshift(surahsOverviewData[scoreData.id - 1]);
      return searchResult;
   }, []);
}

// fetch data
export async function fetchData(url, successFunc, failFunc, finallyFunc) {
   try {
      const response = await fetch(url);
      // throw a range error because response.ok is out of the range 200-299
      if (!response.ok) throw new RangeError(`${response.status} request error`);
      successFunc(await response.json());
   } catch (error) {
      if (failFunc) failFunc(error);
      if (!failFunc) alert(error.message);
   } finally {
      if (finallyFunc) finallyFunc();
   }
}

export function replaceStr(str, arr) {
   return arr.reduce((result, [target, newValue]) => result.replace(target, newValue), str);
}

export function decodeEntities(text) {
   spanEl.innerHTML = text;
   return spanEl.innerText;
}

export function millisecToSec(milliseconds) {
   return milliseconds / 1000;
}

export function calculateTime(duration) {
   let hours = Math.floor(duration / 3600);
   let minutes = Math.floor(duration / 60) % 60;
   let seconds = Math.floor(duration) % 60;
   let returnValue = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
   if (hours > 0) returnValue = `${hours < 10 ? "0" + hours : hours}:${returnValue}`;
   return returnValue;
}
