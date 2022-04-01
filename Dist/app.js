// global variables 
import * as storage from "./modules/storage.js";
import * as sidebar from "./modules/sidebar.js";
import { header } from "./modules/header-preloader-settings.js";
import * as audioPlayer from "./modules/audioPlayer.js";
import * as surahsOverviewSec from  "./modules/surahsOverviewSec.js";
// initial
surahsOverviewSec.build(storage.surahsInfo);
window.scrollTo(0, 0);
// setup eventListeners 

header.setupHeaderEventListeners();
sidebar.setupSidebarEventListeners();
audioPlayer.setupPlayerEventListeners();
