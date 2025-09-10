// src/scenes/StartScene.js
import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("titleFlip", "assets/flip and match.png");
    this.load.image("startButton", "assets/start.png");
    this.load.image("tutorialButton", "assets/tutorial.png");
    this.load.image("creditButton", "assets/kredit.png");
    this.load.image("backButton", "assets/topp.png"); // Tombol back internal
    
    // Credit overlay assets
    this.load.image("creditBoard", "assets/board credit.png");
    this.load.image("creditTitle", "assets/CREDIT.png");
    this.load.image("creditPaper", "assets/papper.png");
    this.load.image("creditChain", "assets/Group 10.png");
    this.load.image("creditChainleft", "assets/Group 9.png");
    
    // Load sound assets
    this.load.audio("buttonClick", "assets/sounds/clickdog.mp3");
    // Add background music - ganti dengan nama file asset Anda
    this.load.audio("backgroundMusic", "assets/sounds/jeobgm.mp3"); // Sesuaikan dengan nama file Anda
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Setup audio
    this.setupAudio();

    // Background dengan fade in dari EntranceScene
    const background = this.add.image(centerX, centerY, "bg")
      .setDisplaySize(width, height)
      .setAlpha(0);

    this.tweens.add({
      targets: background,
      alpha: 1,
      duration: 500,
      ease: 'Power2.easeOut'
    });

    // Title dengan entrance animation yang lebih subtle
    const titleFlip = this.add.image(centerX, centerY - 150, "titleFlip")
      .setScale(0.8)
      .setAlpha(0);

    this.tweens.add({
      targets: titleFlip,
      y: centerY - 100,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 1,
      duration: 800,
      delay: 300,
      ease: 'Back.easeOut'
    });

    // Start button dengan entrance animation
    const startButton = this.add.image(centerX, centerY + 200, "startButton")
      .setScale(0.4)
      .setAlpha(0)
      .setInteractive();

    this.tweens.add({
      targets: startButton,
      y: centerY + 200,
      scaleX: 0.6,
      scaleY: 0.6,
      alpha: 1,
      duration: 600,
      delay: 800,
      ease: 'Back.easeOut'
    });

    // Tutorial button dengan entrance animation (sama seperti start button)
    const tutorialButton = this.add.image(centerX, centerY + 280, "tutorialButton")
      .setScale(0.4)
      .setAlpha(0)
      .setInteractive();

    this.tweens.add({
      targets: tutorialButton,
      y: centerY + 290,
      scaleX: 0.6,
      scaleY: 0.6,
      alpha: 1,
      duration: 600,
      delay: 900,
      ease: 'Back.easeOut'
    });

    // Credit button di kiri bawah - SAMA seperti tombol lain
    const creditButton = this.add.image(80, height - 80, "creditButton")
      .setScale(1)  // Start dengan scale yang sama
      .setAlpha(0)
      .setInteractive();

    this.tweens.add({
      targets: creditButton,
      scaleX: 1.5,  // Target scale yang sama
      scaleY: 1.5,
      alpha: 1,
      duration: 600,
      delay: 1000,  // Delay sedikit lebih lama
      ease: 'Back.easeOut'  // Easing yang sama
    });

    // Hover effect untuk start button
    startButton.on('pointerover', () => {
      this.tweens.add({
        targets: startButton,
        scaleX: 0.7,
        scaleY: 0.7,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      startButton.setTint(0xdddddd);
    });

    startButton.on('pointerout', () => {
      this.tweens.add({
        targets: startButton,
        scaleX: 0.6,
        scaleY: 0.6,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      startButton.clearTint();
    });

    // Hover effect untuk tutorial button
    tutorialButton.on('pointerover', () => {
      this.tweens.add({
        targets: tutorialButton,
        scaleX: 0.7,
        scaleY: 0.7,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      tutorialButton.setTint(0xdddddd);
    });

    tutorialButton.on('pointerout', () => {
      this.tweens.add({
        targets: tutorialButton,
        scaleX: 0.6,
        scaleY: 0.6,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      tutorialButton.clearTint();
    });

    // Hover effect untuk credit button - SAMA seperti tombol lain
    creditButton.on('pointerover', () => {
      this.tweens.add({
        targets: creditButton,
        scaleX: 1.7,  // Hover scale yang sama
        scaleY: 1.7,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      creditButton.setTint(0xdddddd);
    });

    creditButton.on('pointerout', () => {
      this.tweens.add({
        targets: creditButton,
        scaleX: 1.5 ,  // Back to normal scale
        scaleY: 1.5,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      creditButton.clearTint();
    });

    // Click handler untuk start button dengan animasi
    startButton.on("pointerdown", () => {
      // Play click sound
      if (this.buttonClickSound) {
        this.buttonClickSound.play();
      }
      
      // Disable buttons
      startButton.disableInteractive();
      tutorialButton.disableInteractive();
      creditButton.disableInteractive();
      
      // Animasi click
      this.tweens.add({
        targets: startButton,
        scaleX: 0.55,
        scaleY: 0.55,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Fade out everything
          this.tweens.add({
            targets: [background, titleFlip, startButton, tutorialButton, creditButton],
            alpha: 0,
            duration: 400,
            ease: 'Power2.easeIn',
            onComplete: () => {
              // Stop background music dengan fade out
              this.fadeOutBackgroundMusic(() => {
                this.scene.start("ModeScene");
              });
            }
          });
        }
      });
    });

    // Click handler untuk tutorial button dengan animasi yang sama
    tutorialButton.on("pointerdown", () => {
      // Play click sound
      if (this.buttonClickSound) {
        this.buttonClickSound.play();
      }
      
      // Disable buttons
      startButton.disableInteractive();
      tutorialButton.disableInteractive();
      creditButton.disableInteractive();
      
      // Animasi click
      this.tweens.add({
        targets: tutorialButton,
        scaleX: 0.55,
        scaleY: 0.55,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Fade out everything
          this.tweens.add({
            targets: [background, titleFlip, startButton, tutorialButton, creditButton],
            alpha: 0,
            duration: 400,
            ease: 'Power2.easeIn',
            onComplete: () => {
              // Stop background music dengan fade out
              this.fadeOutBackgroundMusic(() => {
                this.scene.start("TutorialScene");
              });
            }
          });
        }
      });
    });

    // Click handler untuk credit button - dengan camera movement effect
    creditButton.on("pointerdown", () => {
      // Play click sound
      if (this.buttonClickSound) {
        this.buttonClickSound.play();
      }
      
      // Disable buttons
      startButton.disableInteractive();
      tutorialButton.disableInteractive();
      creditButton.disableInteractive();
      
      // Animasi click
      this.tweens.add({
        targets: creditButton,
        scaleX: 0.55,  // Click scale yang sama
        scaleY: 0.55,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Show credit with camera movement effect (background music tetap berjalan)
          this.showCreditWithCameraMovement(background, titleFlip, startButton, tutorialButton, creditButton);
        }
      });
    });
  }

  showCreditWithCameraMovement(background, titleFlip, startButton, tutorialButton, creditButton) {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Buat credit elements di posisi bawah (off-screen) dengan nama asset yang benar dan tata letak PERSIS SAMA
    const creditBoard = this.add.image(centerX, centerY + height + 60, "creditBoard")
      .setScale(0.9);

    const creditTitle = this.add.image(centerX, centerY + height - 340, "creditTitle")
      .setScale(0.9);

    const creditPaper = this.add.image(centerX, centerY + height + 100, "creditPaper")
      .setScale(0.85);

    const leftChain = this.add.image(centerX - 675, centerY + height - 295, "creditChainleft")
      .setScale(0.9);

    const rightChain = this.add.image(centerX + 685, centerY + height - 292, "creditChain")
      .setScale(0.9);

    const creditText = this.add.text(centerX, centerY + height + 20, 
      'Created by :\nReno, Sudais, Taufik\n\n Assets :\nFreepik.com\n\nSound :\nmyinstants', 
      {
        fontSize: '32px',
        fill: '#000000',
        align: 'center',
        fontFamily: 'Irish gover'
      })
      .setOrigin(0.5);

    // Tombol back di kanan bawah layar credit dengan entrance animation
    const backButton = this.add.image(width - 1600, height + 80, "backButton")
      .setScale(0.000000000000000000000000000000001)
      .setAlpha(0)
      .setInteractive();

    // Variable untuk menyimpan apakah back button sudah aktif
    let backButtonActive = false;

    // Fase 1: Fade out menu elements (tanpa bergerak), BACKGROUND TETAP
    this.tweens.add({
      targets: [titleFlip, startButton, tutorialButton, creditButton],
      alpha: 0,
      duration: 400,
      ease: 'Power2.easeInOut',
      onComplete: () => {
        // Fase 2: Gerakkan credit elements ke posisi normal dari bawah (sesuai tata letak asli PERSIS)
        this.tweens.add({
          targets: creditBoard,
          y: centerY + 60,
          duration: 800,
          delay: 400,
          ease: 'Power2.easeOut'
        });

        this.tweens.add({
          targets: creditTitle,
          y: centerY - 340,
          duration: 800,
          delay: 400,
          ease: 'Power2.easeOut'
        });

        this.tweens.add({
          targets: creditPaper,
          y: centerY + 100,
          duration: 800,
          delay: 400,
          ease: 'Power2.easeOut'
        });

        this.tweens.add({
          targets: leftChain,
          y: centerY - 295,
          duration: 800,
          delay: 400,
          ease: 'Power2.easeOut'
        });

        this.tweens.add({
          targets: rightChain,
          y: centerY - 292,
          duration: 800,
          delay: 400,
          ease: 'Power2.easeOut'
        });

        this.tweens.add({
          targets: creditText,
          y: centerY + 20,
          duration: 800,
          delay: 400,
          ease: 'Power2.easeOut'
        });

        // Animasi back button masuk dari bawah
        this.tweens.add({
          targets: backButton,
          y: height - 80,
          scaleX: 1.5,
          scaleY: 1.5,
          alpha: 1,
          duration: 600,
          delay: 800,
          ease: 'Back.easeOut',
          onComplete: () => {
            // Aktifkan back button setelah semua animasi selesai
            backButtonActive = true;
            console.log('Back button activated!');
          }
        });
      }
    });

    // Hover effect untuk back button
    backButton.on('pointerover', () => {
      if (!backButtonActive) return;
      this.tweens.add({
        targets: backButton,
        scaleX: 1.7,
        scaleY: 1.7,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      backButton.setTint(0xdddddd);
    });

    backButton.on('pointerout', () => {
      if (!backButtonActive) return;
      this.tweens.add({
        targets: backButton,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      backButton.clearTint();
    });

    // Click handler untuk back button dengan animasi kamera yang sama
    backButton.on("pointerdown", () => {
      if (!backButtonActive) return;
      
      console.log('Back button clicked!');
      backButtonActive = false; // Disable untuk mencegah multiple clicks
      
      // Play click sound
      if (this.buttonClickSound) {
        this.buttonClickSound.play();
      }
      
      // Animasi click
      this.tweens.add({
        targets: backButton,
        scaleX: 1.35,
        scaleY: 1.35,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Return to main menu dengan animasi kamera yang sama
          this.returnToMainMenuWithCamera(background, titleFlip, startButton, tutorialButton, creditButton, 
            [creditBoard, creditTitle, creditPaper, leftChain, rightChain, creditText, backButton]);
        }
      });
    });
  }

returnToMainMenuWithCamera(background, titleFlip, startButton, tutorialButton, creditButton, creditElements) {
    const { height } = this.scale;

    // Disable back button untuk mencegah multiple clicks
    creditElements.forEach(element => {
      if (element.input) {
        element.disableInteractive();
      }
    });

    // Fase 1: Gerakkan credit elements ke bawah (keluar layar) dengan staggered animation dan kecepatan berbeda
    creditElements.forEach((element, index) => {
      // Kecepatan dan durasi yang berbeda untuk setiap element
      let duration, velocity, easing;
      
      switch(index) {
        case 0: // creditBoard - paling lambat
          duration = 400;
          velocity = height + 300;
          easing = 'Power2.easeIn';
          break;
        case 1: // creditTitle - cepat
          duration = 400;
          velocity = height + 300;
          easing = 'Power3.easeIn';
          break;
        case 2: // creditPaper - sedang
          duration = 400;
          velocity = height + 300;
          easing = 'Power2.easeInOut';
          break;
        case 3: // leftChain - cepat dengan bouncing
          duration = 400;
          velocity = height + 300;
          easing = 'Back.easeIn';
          break;
        case 4: // rightChain - cepat dengan bouncing
          duration = 400;
          velocity = height + 300;
          easing = 'Back.easeIn';
          break;
        case 5: // creditText - sedang-cepat
          duration = 400;
          velocity = height + 300;
          easing = 'Power2.easeIn';
          break;
        case 6: // backButton - paling cepat
          duration = 400;
          velocity = height + 300;
          easing = 'Power3.easeIn';
          break;
        default:
          duration = 400;
          velocity = height + 300;
          easing = 'Power2.easeInOut';
      }

      this.tweens.add({
        targets: element,
        y: '+=' + velocity,
        alpha: 0,
        scaleX: element.scaleX * 0.8, // Mengecilkan saat menghilang
        scaleY: element.scaleY * 0.8,
        duration: duration,
        delay: index * 60, // Staggered delay untuk smooth effect
        ease: easing,
        onComplete: () => {
          // Destroy element setelah animasi selesai
          element.destroy();
          
          // Jika ini adalah element terakhir, mulai fade in menu
          if (index === creditElements.length - 1) {
            this.fadeInMainMenu(titleFlip, startButton, tutorialButton, creditButton);
          }
        }
      });

      // Tambahan rotasi untuk chain elements agar lebih dinamis
      if (index === 3 || index === 4) { // leftChain dan rightChain
        this.tweens.add({
          targets: element,
          rotation: index === 3 ? -0.3 : 0.3, // Rotasi berlawanan
          duration: duration,
          delay: index * 60,
          ease: 'Power2.easeIn'
        });
      }
    });
  }

  fadeInMainMenu(titleFlip, startButton, tutorialButton, creditButton) {
    // Fase 2: Fade in menu elements kembali dengan staggered animation
    this.tweens.add({
      targets: titleFlip,
      alpha: 1,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 400,
      delay: 100,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: titleFlip,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 400,
          ease: 'Power2.easeOut'
        });
      }
    });

    this.tweens.add({
      targets: startButton,
      alpha: 1,
      scaleX: 0.65,
      scaleY: 0.65,
      duration: 400,
      delay: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: startButton,
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 400,
          ease: 'Power2.easeOut'
        });
      }
    });

    this.tweens.add({
      targets: tutorialButton,
      alpha: 1,
      scaleX: 0.65,
      scaleY: 0.65,
      duration: 400,
      delay: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: tutorialButton,
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 400,
          ease: 'Power2.easeOut'
        });
      }
    });

    this.tweens.add({
      targets: creditButton,
      alpha: 1,
      scaleX: 1.6,
      scaleY: 1.6,
      duration: 400,
      delay: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: creditButton,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 400,
          ease: 'Power2.easeOut',
          onComplete: () => {
            // Re-enable semua buttons setelah semua animasi selesai
            startButton.setInteractive();
            tutorialButton.setInteractive();
            creditButton.setInteractive();
          }
        });
      }
    });
  }

  setupAudio() {
    try {
      // Stop semua sound yang mungkin masih berjalan
      this.sound.stopAll();

      // Sound Effects
      this.buttonClickSound = this.sound.add("buttonClick", {
        volume: 1
      });

      // Background Music - loop dan volume yang bisa diatur
      this.backgroundMusic = this.sound.add("backgroundMusic", {
        volume: 0.5,  // Volume 50%, sesuaikan sesuai kebutuhan
        loop: true    // Loop terus menerus
      });

      // Play background music dengan fade in
      this.fadeInBackgroundMusic();

    } catch (error) {
      console.warn('Audio setup failed:', error);
      // Continue without audio if there's an error
    }
  }

  // Method untuk fade in background music
  fadeInBackgroundMusic() {
    if (this.backgroundMusic) {
      // Mulai dengan volume 0
      this.backgroundMusic.setVolume(0);
      this.backgroundMusic.play();
      
      // Fade in selama 2 detik
      this.tweens.add({
        targets: this.backgroundMusic,
        volume: 0.5, // Volume target
        duration: 2000,
        ease: 'Power2.easeOut'
      });
    }
  }

  // Method untuk fade out background music
  fadeOutBackgroundMusic(callback) {
    if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
      this.tweens.add({
        targets: this.backgroundMusic,
        volume: 0,
        duration: 800,
        ease: 'Power2.easeIn',
        onComplete: () => {
          this.backgroundMusic.stop();
          if (callback) callback();
        }
      });
    } else {
      if (callback) callback();
    }
  }

  // Clean up audio saat scene berakhir
  shutdown() {
    // Kill all tweens first
    this.tweens.killAll();
    
    // Stop all sounds
    this.sound.stopAll();
    
    // Clean up references
    this.buttonClickSound = null;
    this.backgroundMusic = null;
  }

  // Method yang dipanggil saat scene di-destroy
  destroy() {
    this.shutdown();
  }
}