import React from "react";
import useGlobalContext from "Hooks/useGlobalContext";
import { HistoryItem } from "Components";

function HistoryItems({ tabIndexValue }) {
   const { history } = useGlobalContext();

   const historyElements = history.map((surahId) => (
      <HistoryItem key={surahId} tabIndexValue={tabIndexValue} surahId={surahId} />
   ));

   return (
      <div className="history__items">
         {historyElements.length ? historyElements : "You Do Not Have Any History Yet"}
      </div>
   );
}

export default React.memo(HistoryItems);
