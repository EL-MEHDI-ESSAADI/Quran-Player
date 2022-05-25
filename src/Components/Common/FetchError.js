import React from "react";

function FetchError({ error, reloadFunc}) {
   return (
      <div className="fetchError">
         <h3>
            {error + ". "}
            <button className="fetchError__reload-btn" onClick={reloadFunc} >
               <span>Reload</span>
            </button>
         </h3>
      </div>
   );
}

export default FetchError;
