import React, { useEffect, useRef } from "react";
import { PreloadedVerse } from "Components";

function PreloadedVerses({ numberOfVerses = 10, observePreloadedVerses, getSurahData }) {
   const elements = [...new Array(numberOfVerses)].map((_, index) => <PreloadedVerse key={index} />);
   const preloadedVersesRef = useRef();

   useEffect(() => {
      if (!observePreloadedVerses) return;
      const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && getSurahData(), {
         threshold: 0,
      });

      if (preloadedVersesRef.current) observer.observe(preloadedVersesRef.current);
      return () => {
         if (preloadedVersesRef.current) observer.unobserve(preloadedVersesRef.current);
      };
   }, [observePreloadedVerses, getSurahData]);

   return (
      <div className="surah-section__preloaded-verses" ref={preloadedVersesRef}>
         {elements}
      </div>
   );
}

export default React.memo(PreloadedVerses);
