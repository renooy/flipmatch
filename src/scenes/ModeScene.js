import Phaser from "phaser";

export default class ModeScene extends Phaser.Scene {
  constructor() {
    super("ModeScene");
  }

  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("coverPanel", "assets/cover panel.png");

    this.load.image("cardEasy", "assets/panel.png");
    this.load.image("cardNormal", "assets/panel.png");
    this.load.image("cardHard", "assets/panel.png");
    this.load.image("cardExtreme", "assets/stone panel.png");
    this.load.image("cardAbnormal", "assets/stone panel.png");

    this.load.image("btnBack", "assets/back.png");
    this.load.image("titleMode", "assets/Sellect.png");

    this.load.image("iconEasy", "assets/icon easy.png");
    this.load.image("iconNormal", "assets/normal.png");
    this.load.image("iconHard", "assets/hard.png");
    this.load.image("iconExtreme", "assets/extreme.png");
    this.load.image("iconAbnormal", "assets/abnormal.png");

    // Load sound assets
    this.load.audio("buttonClick", "assets/sounds/clickdog.mp3");
    this.load.audio("backSound", "assets/sounds/clickdog.mp3");
    this.load.audio("modeSelect", "assets/sounds/clickdog.mp3");
    
    // Load BGM - ganti dengan nama file BGM Anda
    this.load.audio("modeBGM", "assets/sounds/jeobgm.mp3"); // Sesuaikan dengan nama file BGM Anda
  }

  create() {
    const { centerX, centerY, width, height } = this.cameras.main;

    // Setup audio termasuk BGM
    this.setupAudio();

    // Mulai BGM dengan fade in
    this.playBGM();

    // Background
    this.add.image(centerX, centerY, "bg").setDisplaySize(width, height);

    // Judul di atas cover panel dengan animasi masuk
    const titleMode = this.add.image(centerX, centerY - 350, "titleMode")
      .setScale(0.4)
      .setAlpha(0);
    
    this.tweens.add({
      targets: titleMode,
      y: centerY - 300,
      scaleX: 0.6,
      scaleY: 0.6,
      alpha: 1,
      duration: 800,
      ease: 'Back.easeOut'
    });

    // Cover Panel dengan animasi masuk
    const coverPanel = this.add.image(centerX, centerY + 120, "coverPanel")
      .setScale(1, 0.7)
      .setAlpha(0);
    
    this.tweens.add({
      targets: coverPanel,
      y: centerY + 60,
      scaleY: 0.9,
      alpha: 1,
      duration: 600,
      delay: 200,
      ease: 'Power2.easeOut'
    });

    // Tombol back dengan animasi masuk
    const back = this.add.image(-40, 40, "btnBack")
      .setScale(0.6)
      .setInteractive();
    
    this.tweens.add({
      targets: back,
      x: 60,
      duration: 500,
      delay: 400,
      ease: 'Power2.easeOut'
    });
    
    back.on("pointerdown", () => {
      // Play back sound
      this.playBackSound();

      // Stop BGM dengan fade out
      this.stopBGM();

      // Animasi keluar sebelum pindah scene
      this.tweens.add({
        targets: [titleMode, coverPanel],
        alpha: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 300,
        ease: 'Power2.easeIn',
        onComplete: () => {
          this.scene.start("StartScene");
        }
      });
    });

    // Data mode
    this.modes = [
      {
        title: "Easy",
        icon: "iconEasy",
        card: "cardEasy",
        desc: "Take it easy! Fewer cards, simple gameplay, and perfect for beginners to warm up their memory skills.",
        scene: "PlayEasyScene"
      },
      {
        title: "Normal",
        icon: "iconNormal",
        card: "cardNormal",
        desc: "A balanced challenge! More cards, steady pace — perfect for players ready to test their memory.",
        scene: "PlayNormalScene"
      },
      {
        title: "Hard",
        icon: "iconHard",
        card: "cardHard",
        desc: "Only for the brave! Many cards, fast pace — push your memory to the limit.",
        scene: "PlayHardScene"
      },
      {
        title: "Extreme",
        icon: "iconExtreme",
        card: "cardExtreme",
        desc: "Extreme challenge! Maximum cards with lightning speed — only for memory masters!",
        scene: "PlayExtremeScene"
      },
      {
        title: "Abnormal",
        icon: "iconAbnormal",
        card: "cardAbnormal",
        desc: "Beyond limits! Unpredictable patterns and mind-bending challenges await the fearless!",
        scene: "PlayAbnormalScene"
      }
    ];

    // Posisi tetap untuk 3 kartu (Kiri, Tengah, Kanan)
    this.cardPositions = [
      { x: centerX - 350, y: centerY + 80, scale: 1.0 }, // Kiri
      { x: centerX, y: centerY + 80, scale: 1.0 },       // Tengah
      { x: centerX + 350, y: centerY + 80, scale: 1.0 }  // Kanan
    ];

    // Variabel carousel
    this.currentStartIndex = 0; // Index mode pertama yang ditampilkan
    this.displayedCards = [];   // Array untuk menyimpan 3 kartu yang ditampilkan
    this.isAnimating = false;   // Flag untuk mencegah spam scroll

    // Setup kontrol
    this.setupControls();
    
    // Buat indikator dots
    this.time.delayedCall(600, () => {
      this.createIndicators();
      // Tampilkan kartu awal dengan delay
      this.time.delayedCall(200, () => {
        this.updateCarousel();
      });
    });
  }

  setupAudio() {
    try {
      // Stop semua sound yang mungkin masih berjalan
      this.sound.stopAll();

      // Sound Effects
      this.buttonClickSound = this.sound.add("buttonClick", {
        volume: 0.7
      });

      this.backSound = this.sound.add("backSound", {
        volume: 0.8
      });

      this.modeSelectSound = this.sound.add("modeSelect", {
        volume: 0.7
      });

      // Background Music
      this.bgmSound = this.sound.add("modeBGM", {
        volume: 0.4,
        loop: true
      });

    } catch (error) {
      console.warn('Audio setup failed:', error);
    }
  }

  playBGM() {
    if (this.bgmSound && !this.bgmSound.isPlaying) {
      // Set volume awal ke 0 untuk fade in effect
      this.bgmSound.setVolume(0);
      this.bgmSound.play();
      
      // Fade in BGM
      this.tweens.add({
        targets: this.bgmSound,
        volume: 0.4,
        duration: 2000,
        ease: 'Power2.easeOut'
      });
    }
  }

  stopBGM() {
    if (this.bgmSound && this.bgmSound.isPlaying) {
      // Fade out BGM
      this.tweens.add({
        targets: this.bgmSound,
        volume: 0,
        duration: 1000,
        ease: 'Power2.easeIn',
        onComplete: () => {
          this.bgmSound.stop();
        }
      });
    }
  }

  setupControls() {
    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    // Mouse wheel
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (deltaY > 0) {
        this.scrollRight();
      } else if (deltaY < 0) {
        this.scrollLeft();
      }
    });

    // Touch/Drag
    let startX = 0;
    let isDragging = false;

    this.input.on('pointerdown', (pointer) => {
      startX = pointer.x;
      isDragging = true;
    });

    this.input.on('pointerup', (pointer) => {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = pointer.x - startX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.scrollLeft();
        } else {
          this.scrollRight();
        }
      }
    });
  }

  update() {
    // Handle keyboard input
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.scrollLeft();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.scrollRight();
    }
  }

  scrollLeft() {
    if (this.isAnimating) return;
    if (this.currentStartIndex > 0) {
      this.currentStartIndex--;
      this.updateCarousel();
    }
  }

  scrollRight() {
    if (this.isAnimating) return;
    if (this.currentStartIndex < this.modes.length - 3) {
      this.currentStartIndex++;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    // Disable input sementara untuk mencegah spam click
    this.isAnimating = true;
    
    // ANIMASI TRANSISI YANG LEBIH MENARIK
    const slideOutPromises = [];
    
    // Phase 1: Slide out dengan efek berbeda untuk setiap kartu
    this.displayedCards.forEach((cardGroup, index) => {
      const elements = [cardGroup.card, cardGroup.icon, cardGroup.title, cardGroup.desc];
      
      // Efek slide out yang berbeda untuk setiap posisi
      let slideX, slideY, rotation, scaleEffect;
      
      if (index === 0) { // Kartu kiri
        slideX = -200;
        slideY = -30;
        rotation = -0.1;
        scaleEffect = 0.7;
      } else if (index === 2) { // Kartu kanan
        slideX = 200;
        slideY = -30;
        rotation = 0.1;
        scaleEffect = 0.7;
      } else { // Kartu tengah
        slideX = 0;
        slideY = -80;
        rotation = 0;
        scaleEffect = 0.5;
      }

      // Animasi slide out dengan stagger
      elements.forEach((element, elemIndex) => {
        this.tweens.add({
          targets: element,
          x: element.x + slideX,
          y: element.y + slideY,
          rotation: rotation,
          scaleX: element.scaleX * scaleEffect,
          scaleY: element.scaleY * scaleEffect,
          alpha: 0,
          duration: 400,
          delay: elemIndex * 50, // Stagger untuk setiap elemen
          ease: 'Power2.easeIn'
        });
      });
    });

    // Phase 2: Tunggu slide out selesai, lalu buat kartu baru
    this.time.delayedCall(350, () => {
      // Hapus kartu lama
      this.displayedCards.forEach(cardGroup => {
        cardGroup.card.destroy();
        cardGroup.icon.destroy();
        cardGroup.title.destroy();
        cardGroup.desc.destroy();
      });
      this.displayedCards = [];

      // Buat 3 kartu baru dengan animasi slide in yang spektakuler
      for (let i = 0; i < 3; i++) {
        const modeIndex = this.currentStartIndex + i;
        if (modeIndex >= this.modes.length) break;

        const mode = this.modes[modeIndex];
        const pos = this.cardPositions[i];
        
        // Posisi awal untuk slide in (dari arah berlawanan dengan slide out)
        let startX, startY, startRotation, startScale;
        
        if (i === 0) { // Kartu kiri - masuk dari kanan
          startX = pos.x + 300;
          startY = pos.y + 50;
          startRotation = 0.15;
          startScale = 0.6;
        } else if (i === 2) { // Kartu kanan - masuk dari kiri
          startX = pos.x - 300;
          startY = pos.y + 50;
          startRotation = -0.15;
          startScale = 0.6;
        } else { // Kartu tengah - masuk dari atas
          startX = pos.x;
          startY = pos.y - 150;
          startRotation = 0;
          startScale = 0.4;
        }

        // Panel card
        const card = this.add.image(startX, startY, mode.card)
          .setScale(0.99 * startScale)
          .setRotation(startRotation)
          .setAlpha(0)
          .setInteractive();

        // Icon
        const icon = this.add.image(startX, startY - 140, mode.icon)
          .setScale(0.9 * startScale)
          .setRotation(startRotation)
          .setAlpha(0);

        // Title
        const title = this.add.text(startX, startY - 5, mode.title, {
          fontFamily: "Irish Gover",
          fontSize: "40px",
          color: "#ffffff",
          fontStyle: "bold"
        })
        .setOrigin(0.5)
        .setShadow(2, 2, "#000000", 2, true, true)
        .setRotation(startRotation)
        .setScale(startScale)
        .setAlpha(0);

        // Description
        const desc = this.add.text(startX, startY + 120, mode.desc, {
          fontFamily: "Irish Gover",
          fontSize: "23px",
          color: "#fff",
          align: "center",
          wordWrap: { width: 200 }
        })
        .setOrigin(0.5)
        .setShadow(2, 2, "#000000", 2, true, true)
        .setRotation(startRotation)
        .setScale(startScale)
        .setAlpha(0);

        // Animasi slide in dengan efek bouncy
        const delay = i * 100; // Stagger animation
        
        // Animasi untuk card
        this.tweens.add({
          targets: card,
          x: pos.x,
          y: pos.y,
          scaleX: 0.99,
          scaleY: 0.99,
          rotation: 0,
          alpha: 1,
          duration: 600,
          delay: delay,
          ease: 'Back.easeOut'
        });

        // Animasi untuk icon
        this.tweens.add({
          targets: icon,
          x: pos.x,
          y: pos.y - 140,
          scaleX: 0.9,
          scaleY: 0.9,
          rotation: 0,
          alpha: 1,
          duration: 600,
          delay: delay + 100,
          ease: 'Back.easeOut'
        });

        // Animasi untuk title
        this.tweens.add({
          targets: title,
          x: pos.x,
          y: pos.y - 5,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          alpha: 1,
          duration: 600,
          delay: delay + 200,
          ease: 'Back.easeOut'
        });

        // Animasi untuk description
        this.tweens.add({
          targets: desc,
          x: pos.x,
          y: pos.y + 120,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          alpha: 1,
          duration: 600,
          delay: delay + 300,
          ease: 'Back.easeOut'
        });

        // Event klik - SEMUA kartu bisa diklik untuk masuk game
        card.on("pointerdown", () => {
          if (this.isAnimating) return;
          console.log(`Clicked ${mode.title} - Going to ${mode.scene}`);
          
          // Play mode select sound
          this.playModeSelectSound();
          
          // Stop BGM sebelum pindah scene
          this.stopBGM();
          
          // Animasi zoom out sebelum pindah scene
          this.tweens.add({
            targets: [card, icon, title, desc],
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 300,
            ease: 'Power2.easeIn',
            onComplete: () => {
              this.scene.start(mode.scene);
            }
          });
        });
        
        // Hover effect yang lebih smooth
        card.on('pointerover', () => {
          if (this.isAnimating) return;
          
          this.tweens.add({
            targets: card,
            scaleX: 1.08,
            scaleY: 1.08,
            y: pos.y - 10, // Sedikit naik
            duration: 300,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: icon,
            scaleX: 0.98,
            scaleY: 0.98,
            y: pos.y - 150, // Ikut naik
            duration: 300,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: [title, desc],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 300,
            ease: 'Power2.easeOut'
          });
          
          card.setTint(0xeeeeee);
          
          // Efek glow/shadow pada title
          title.setShadow(4, 4, "#000000", 4, true, true);
        });
        
        card.on('pointerout', () => {
          if (this.isAnimating) return;
          
          this.tweens.add({
            targets: card,
            scaleX: 0.99,
            scaleY: 0.99,
            y: pos.y, // Kembali ke posisi normal
            duration: 300,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: icon,
            scaleX: 0.9,
            scaleY: 0.9,
            y: pos.y - 140, // Kembali ke posisi normal
            duration: 300,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: [title, desc],
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Power2.easeOut'
          });
          
          card.clearTint();
          
          // Kembalikan shadow normal
          title.setShadow(2, 2, "#000000", 2, true, true);
        });

        // Simpan referensi
        this.displayedCards.push({
          card: card,
          icon: icon,
          title: title,
          desc: desc,
          modeIndex: modeIndex
        });
      }

      // Update indicators dengan animasi yang lebih menarik
      this.updateIndicators();
      
      // Re-enable input setelah animasi selesai
      this.time.delayedCall(800, () => {
        this.isAnimating = false;
      });
    });
  }

  createIndicators() {
    const { centerX, centerY } = this.cameras.main;
    this.indicators = [];

    const totalPages = this.modes.length - 2;
    const startX = centerX - ((totalPages - 1) * 25) / 2;

    for (let i = 0; i < totalPages; i++) {
      const indicator = this.add.circle(startX + i * 25, centerY + 320, 6, 0xffffff, 0.4)
        .setInteractive();

      // Animasi masuk untuk indikator
      indicator.setScale(0).setAlpha(0);
      this.tweens.add({
        targets: indicator,
        scaleX: 1,
        scaleY: 1,
        alpha: 0.4,
        duration: 300,
        delay: i * 100,
        ease: 'Back.easeOut'
      });

      // Klik indicator untuk langsung ke halaman
      indicator.on('pointerdown', () => {
        if (this.isAnimating) return;
        this.currentStartIndex = i;
        this.updateCarousel();
      });

      // Hover effect untuk indicator
      indicator.on('pointerover', () => {
        this.tweens.add({
          targets: indicator,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 200,
          ease: 'Power2.easeOut'
        });
      });

      indicator.on('pointerout', () => {
        const isActive = i === this.currentStartIndex;
        this.tweens.add({
          targets: indicator,
          scaleX: isActive ? 1.3 : 1,
          scaleY: isActive ? 1.3 : 1,
          duration: 200,
          ease: 'Power2.easeOut'
        });
      });

      this.indicators.push(indicator);
    }

    // Posisikan indikator
    this.time.delayedCall(400, () => {
      this.tweens.add({
        targets: this.indicators,
        y: centerY + 280,
        duration: 400,
        ease: 'Power2.easeOut'
      });
    });
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      const isActive = index === this.currentStartIndex;
      
      // Animasi perubahan indicator yang lebih dramatis
      this.tweens.add({
        targets: indicator,
        scaleX: isActive ? 1.3 : 1,
        scaleY: isActive ? 1.3 : 1,
        duration: 400,
        ease: 'Elastic.easeOut'
      });
      
      // Perubahan warna dengan animasi
      const targetAlpha = isActive ? 1 : 0.3;
      this.tweens.addCounter({
        from: indicator.alpha,
        to: targetAlpha,
        duration: 300,
        ease: 'Power2.easeOut',
        onUpdate: (tween) => {
          const value = tween.getValue();
          indicator.setFillStyle(0xffffff, value);
        }
      });
    });
  }

  // Audio methods
  playBackSound() {
    if (this.backSound) {
      this.backSound.play();
    }
  }

  playModeSelectSound() {
    if (this.modeSelectSound) {
      this.modeSelectSound.play();
    }
  }

  // Clean up audio saat scene berakhir
  shutdown() {
    // Kill all tweens first
    this.tweens.killAll();
    
    // Stop all sounds including BGM
    this.sound.stopAll();
    
    // Clean up references
    this.buttonClickSound = null;
    this.backSound = null;
    this.modeSelectSound = null;
    this.bgmSound = null;
  }

  // Method yang dipanggil saat scene di-destroy
  destroy() {
    this.shutdown();
  }
}