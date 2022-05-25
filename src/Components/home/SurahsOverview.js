import React from "react";
import { SurahOverview } from "Components";
import useGlobalContext from "Hooks/useGlobalContext";

function SurahsOverview({ data }) {
   const { directContentTabIndex } = useGlobalContext();
   return (
      <div className="surahs-overview-section__surahs-container">
         {data.map((item) => (
            <SurahOverview key={item.number} {...item} tabIndexValue={directContentTabIndex} />
         ))}
      </div>
   );
}

export default SurahsOverview;
