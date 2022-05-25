import React from "react";

function HeaderPlayPauseBtn({ Icon, size, Text, handelClick, tabIndexValue }) {
   return (
      <button
         className="header__audio-btn"
         tabIndex={tabIndexValue}
         aria-label="play pause audio"
         onClick={handelClick}
      >
         {<Icon size={size} display="inline-block" />}
         {Text}
      </button>
   );
}

export default React.memo(HeaderPlayPauseBtn);
