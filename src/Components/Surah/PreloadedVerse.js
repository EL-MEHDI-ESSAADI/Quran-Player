import React from "react";

function PreloadedVerse() {
   return (
      <div className="verse verse--preloaded" aria-label="prealoaded  verse">
         <div className="flex verse__header">
            <span className="verse__key ff-roboto fw-500" data-id={7} />
            <ul className="verse__features flex">
               <li>
                  <button className="verse__feature" tabIndex="-1" />
               </li>
               <li>
                  <button className="verse__feature" tabIndex="-1" />
               </li>
               <li>
                  <button className="verse__feature" tabIndex="-1" />
               </li>
            </ul>
         </div>
         <div className="verse__content flow">
            <div className="verse__ar-txt" />
            <div className="verse__eg-txt" />
         </div>
      </div>
   );
}

export default React.memo(PreloadedVerse);
