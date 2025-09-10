
import TutorialScene from './scenes/TutorialScene';
import StartScene from './scenes/StartScene';
import ModeScene from './scenes/ModeScene';
import PlayEasyScene from './scenes/PlayEasyScene';
import PlayNormalScene from './scenes/PlayNormalScene';
import EntranceScene from './scenes/EntranceScene';
import PlayHardScene from './scenes/PlayHardScene';
import PlayExtremeScene from './scenes/PlayExtremeScene';
import PlayAbnormalScene from './scenes/PlayAbnormalScene';
// import LoadingScene from "./scenes/LoadingScene";

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.Fit, // ⬅️ otomatis menyesuaikan ukuran layar
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 700,
    height: 1500,
  },
 scene: [ EntranceScene,StartScene,TutorialScene, ModeScene, PlayEasyScene, PlayNormalScene, PlayHardScene, PlayExtremeScene,PlayAbnormalScene],
};

new Phaser.Game(config);

