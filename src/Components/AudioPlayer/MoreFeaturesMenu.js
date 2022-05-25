import React from "react";
import { IoMdClose } from "react-icons/io";
import useGlobalContext from "Hooks/useGlobalContext";

function MoreFeaturesMenu({ isMoreMenuShowing, tabIndexValue }) {
   const { dispatch, isAudioLoading } = useGlobalContext();

   function handelCloseBtnClick() {
      if (isAudioLoading) return;
      dispatch({ type: "changeAudioPlayingState", value: false });
      dispatch({ type: "changeAudioAppearance", value: false });
   }

   return (
      <div className={`audioPlayer__more-menu ${isMoreMenuShowing ? "audioPlayer__more-menu--show" : ""}`}>
         <ul role="menu">
            <li role="none">
               <button
                  role="menuitem"
                  className="audioPlayer__close-btn audioPlayer__additional-feature-btn"
                  tabIndex={tabIndexValue}
                  aria-label="close the player"
                  onClick={handelCloseBtnClick}
               >
                  <IoMdClose size="1.1rem" aria-hidden="true" focusable="false" />
                  <span>close audio player</span>
               </button>
            </li>
         </ul>
      </div>
   );
}

export default React.memo(MoreFeaturesMenu);
