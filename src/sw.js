import { registerSW } from 'virtual:pwa-register';

export const updateSW = registerSW({
  onNeedRefresh() {
    // Cette fonction sera appelée quand une nouvelle version est disponible
    console.log('Nouvelle version disponible!');
  },
  onOfflineReady() {
    // Cette fonction sera appelée quand l'application est prête pour le mode hors ligne
    console.log('L\'application est prête à fonctionner hors ligne!');
  },
});
