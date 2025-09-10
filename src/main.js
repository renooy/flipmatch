
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
  mode: Phaser.Scale.Fit,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 5000,
  height: 1080,
},

 scene: [ EntranceScene,StartScene,TutorialScene, ModeScene, PlayEasyScene, PlayNormalScene, PlayHardScene, PlayExtremeScene,PlayAbnormalScene],
};

new Phaser.Game(config);

