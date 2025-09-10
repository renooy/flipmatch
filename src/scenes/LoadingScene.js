// export default class LoadingScene extends Phaser.Scene {
//   constructor() {
//     super("LoadingScene");
//   }

//   preload() {
//     this.load.image("loading_bg", "assets/loading_bg.png");
//   }

//   create(data) {
//     // Gunakan ukuran penuh layar
//     const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, "loading_bg")
//       .setOrigin(0.5)
//       .setDisplaySize(this.scale.width, this.scale.height);

//     // Animasi supaya tidak kaku
//     this.tweens.add({
//       targets: bg,
//       scale: { from: 1, to: 1.05 },
//       duration: 1000,
//       yoyo: true,
//       repeat: -1,
//       ease: "Sine.easeInOut",
//     });

//     // Setelah delay sebentar, masuk ke scene yang dituju
//     this.time.delayedCall(1200, () => {
//       if (data.targetScene) {
//         this.scene.start(data.targetScene);
//       }
//     });
//   }
// }
