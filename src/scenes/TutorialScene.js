// src/scenes/TutorialScene.js
import Phaser from "phaser";

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");
  }

  init() {
    // Reset state setiap kali scene dimulai
    this.currentStep = 0;
    this.totalSteps = 4;
    this.tutorialImages = [];
    this.isTransitioning = false;
  }

  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("tutorial1", "assets/Tutorial 1.png");
    this.load.image("tutorial2", "assets/Tutorial 2.png");
    this.load.image("tutorial3", "assets/Tutorial 3.png");
    this.load.image("tutorial4", "assets/Tutorial 4.png");
    this.load.image("backButtonn", "assets/back.png");
    
    // Load background music (sama seperti StartScene)
    this.load.audio("backgroundMusic", "assets/sounds/jeobgm.mp3");
    // Load sound effects
    this.load.audio("buttonClick", "assets/sounds/clickdog.mp3");
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Setup audio - cek apakah music sudah berjalan dari scene sebelumnya
    this.setupAudio();

    // Background
    const background = this.add.image(centerX, centerY, "bg")
      .setDisplaySize(width, height);

    // Setup tutorial images
    this.setupTutorialImages(centerX, centerY, width, height);

    // Setup keyboard input
    this.setupKeyboardInput();

    // Back button
    const backButton = this.add.image(80, 80, "backButtonn")
      .setScale(0.6)
      .setInteractive()
      .setAlpha(0.8);

    backButton.on('pointerover', () => {
      backButton.setScale(0.8);
      backButton.setAlpha(1);
    });

    backButton.on('pointerout', () => {
      backButton.setScale(0.6);
      backButton.setAlpha(0.8);
    });

    backButton.on('pointerdown', () => {
      // Play click sound
      if (this.buttonClickSound) {
        this.buttonClickSound.play();
      }
      this.backToStart();
    });

    // Show first tutorial
    this.showTutorialStep(0);
  }

  setupTutorialImages(centerX, centerY, screenWidth, screenHeight) {
    // Create all tutorial images but hide them initially
    for (let i = 1; i <= this.totalSteps; i++) {
      const tutorialImage = this.add.image(centerX, centerY, `tutorial${i}`)
        .setAlpha(0);
      
      // Scale gambar agar sesuai dengan ukuran layar laptop
      // Menggunakan 80% dari ukuran layar dengan mempertahankan aspect ratio
      const scaleX = (screenWidth * 0.8) / tutorialImage.width;
      const scaleY = (screenHeight * 0.8) / tutorialImage.height;
      const finalScale = Math.min(scaleX, scaleY); // Ambil scale terkecil agar gambar tidak terpotong
      
      tutorialImage.setScale(finalScale);
      
      this.tutorialImages.push(tutorialImage);
    }
  }

  setupKeyboardInput() {
    // Remove existing listeners to prevent duplicates
    this.input.keyboard.removeAllListeners();
    
    // Add keyboard event listeners
    this.input.keyboard.on('keydown-LEFT', () => this.previousStep());
    this.input.keyboard.on('keydown-RIGHT', () => this.nextStep());
    this.input.keyboard.on('keydown-A', () => this.previousStep());
    this.input.keyboard.on('keydown-D', () => this.nextStep());
    this.input.keyboard.on('keydown-ESC', () => this.backToStart());
  }

  setupAudio() {
    try {
      // Jangan stop semua sound - biarkan background music terus berjalan
      // this.sound.stopAll(); // HAPUS INI!

      // Sound Effects
      this.buttonClickSound = this.sound.add("buttonClick", {
        volume: 1
      });

      // Cek apakah background music sudah ada dan berjalan dari scene sebelumnya
      let existingMusic = null;
      
      // Cari background music yang mungkin sudah berjalan
      this.sound.sounds.forEach(sound => {
        if (sound.key === "backgroundMusic" && sound.isPlaying) {
          existingMusic = sound;
        }
      });

      if (existingMusic) {
        // Jika musik sudah berjalan, gunakan yang sudah ada
        this.backgroundMusic = existingMusic;
        console.log('Background music continues from previous scene');
      } else {
        // Jika tidak ada musik yang berjalan, buat yang baru
        this.backgroundMusic = this.sound.add("backgroundMusic", {
          volume: 0.5,
          loop: true
        });
        
        // Play dengan fade in
        this.fadeInBackgroundMusic();
        console.log('Started new background music');
      }

    } catch (error) {
      console.warn('Audio setup failed:', error);
    }
  }

  // Method untuk fade in background music (jika musik baru dimulai)
  fadeInBackgroundMusic() {
    if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
      this.backgroundMusic.setVolume(0);
      this.backgroundMusic.play();
      
      this.tweens.add({
        targets: this.backgroundMusic,
        volume: 0.5,
        duration: 2000,
        ease: 'Power2.easeOut'
      });
    }
  }

  // Method untuk fade out background music (hanya saat keluar ke non-menu scene)
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

  showTutorialStep(stepIndex, direction = 'none') {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentStep = stepIndex;

    // Hide current image if any
    this.tutorialImages.forEach(img => {
      if (img.alpha > 0) {
        this.tweens.add({
          targets: img,
          alpha: 0,
          x: direction === 'left' ? img.x + 100 : (direction === 'right' ? img.x - 100 : img.x),
          duration: direction === 'none' ? 0 : 300,
          ease: 'Power2.easeIn'
        });
      }
    });

    // Show new image
    const newImage = this.tutorialImages[stepIndex];
    const startX = direction === 'left' ? newImage.x - 100 : (direction === 'right' ? newImage.x + 100 : newImage.x);
    
    if (direction !== 'none') {
      newImage.setX(startX);
    }

    this.tweens.add({
      targets: newImage,
      alpha: 1,
      x: this.scale.width / 2,
      duration: direction === 'none' ? 500 : 400,
      delay: direction === 'none' ? 200 : 100,
      ease: direction === 'none' ? 'Back.easeOut' : 'Power2.easeOut',
      onComplete: () => {
        this.isTransitioning = false;
      }
    });
  }

  nextStep() {
    if (this.isTransitioning) return;
    
    if (this.currentStep < this.totalSteps - 1) {
      this.showTutorialStep(this.currentStep + 1, 'right');
    } else {
      // If at last step, pressing right goes back to start
      this.backToStart();
    }
  }

  previousStep() {
    if (this.isTransitioning) return;
    
    if (this.currentStep > 0) {
      this.showTutorialStep(this.currentStep - 1, 'left');
    } else {
      // If at first step, pressing left goes back to start
      this.backToStart();
    }
  }

  backToStart() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Clean up keyboard listeners
    this.input.keyboard.removeAllListeners();
    
    // Stop tweens untuk tutorial images
    this.tutorialImages.forEach(img => {
      this.tweens.killTweensOf(img);
    });
    
    // Fade out tutorial images
    this.tweens.add({
      targets: this.tutorialImages,
      alpha: 0,
      duration: 400,
      ease: 'Power2.easeIn',
      onComplete: () => {
        // PENTING: Jangan stop background music saat kembali ke StartScene
        // Biarkan musik terus berjalan untuk seamless transition
        this.scene.start("StartScene");
      }
    });
  }

  // Cleanup method yang tidak menghentikan background music
  shutdown() {
    // Clean up keyboard listeners
    this.input.keyboard.removeAllListeners();
    
    // Stop tweens untuk tutorial images saja
    this.tutorialImages.forEach(img => {
      this.tweens.killTweensOf(img);
    });
    
    // Clean up references tapi JANGAN stop background music
    this.tutorialImages = [];
    this.buttonClickSound = null;
    
    // JANGAN set this.backgroundMusic = null agar musik terus berjalan
    console.log('TutorialScene shutdown - background music continues');
  }

  // Method yang dipanggil saat scene di-destroy
  destroy() {
    this.shutdown();
  }
}