import React from "react";

function ButtonIcon({ Icon, iconSize, tabIndexValue = 0, classValue, ariaLabl, handelClick, title }) {
   return (
      <button
         className={classValue}
         aria-label={ariaLabl}
         tabIndex={tabIndexValue}
         onClick={handelClick}
         title={title}
      >
         <Icon size={iconSize} aria-hidden="true" focusable="false" />
      </button>
   );
}

export default React.memo(ButtonIcon);
