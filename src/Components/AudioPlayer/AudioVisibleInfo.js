import React from "react";
import { calculateTime } from "Helpers/utils";

function AudioVisibleInfo({currentTime, duration}) {

   return (
      <div className="audioPlayer__times">
         <span className="audioPlayer__current-time">{calculateTime(currentTime)}</span>
         <span className="audioPlayer__duration">{calculateTime(duration)}</span>
      </div>
   );
}

export default React.memo(AudioVisibleInfo);
