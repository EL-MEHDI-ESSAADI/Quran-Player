import React from "react";
import { calculateTime } from "Helpers/utils";

function AudioSlider({ value, max, handelChange, tabIndexValue }) {
   [value, max] = [Math.floor(value), Math.floor(max)];

   return (
      <div className="audioPlayer__seek-section">
         <input
            className="audioPlayer__seek"
            tabIndex={tabIndexValue}
            type="range"
            aria-label="seek"
            value={value}
            max={max}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={`${calculateTime(value)} of ${calculateTime(max)}`}
            onChange={handelChange}
         />
         <span className="audioPlayer__seek-row" />
         <span className="audioPlayer__seek-before" style={{ width: `${max === 0 ? 0 : (value / max) * 100}%` }} />
      </div>
   );
}

export default React.memo(AudioSlider);
