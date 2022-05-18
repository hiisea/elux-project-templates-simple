import {createApp} from '<%= elux %>';
import {appConfig} from './Project';

createApp(appConfig)
  .render()
  .then(() => {
    const initLoading = document.getElementById('root-loading');
    if (initLoading) {
      initLoading.parentNode!.removeChild(initLoading);
    }
  });
