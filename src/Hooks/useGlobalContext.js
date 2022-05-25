import React, { useContext } from 'react'
import appContext from "Context/globalContext";


function useGlobalContext() {
   return useContext(appContext)
}

export default useGlobalContext