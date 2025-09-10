import Phaser from "phaser";

export default class PlayHardScene extends Phaser.Scene {
  constructor() {
    super("PlayHardScene");
  }

  preload() {
    // Assets gambar
    this.load.image("bg laut", "assets/hard/bg laut.png");
    this.load.image("board batu", "assets/hard/board batu.png");
    this.load.image("cardBack", "assets/punggung kartu.png");
    this.load.image("card1", "assets/gajah.png");
    this.load.image("card2", "assets/burung.png");
    this.load.image("card3", "assets/buaya.png");
    this.load.image("card4", "assets/jerapah.png");
    this.load.image("card5", "assets/burunghantu.png");
    this.load.image("card7", "assets/gurita.png");
    this.load.image("card6", "assets/ubur.png");
    this.load.image("pauseBtn", "assets/pause.png");
    this.load.image("obengbtn", "assets/obeng.png");
    this.load.image("ramuan", "assets/ramuan.png");
    this.load.image("meja laut", "assets/hard/batuu.png");
    this.load.image("papan_nyawa", "assets/papan_nyawa.png");
    this.load.image("nyawa_hidup", "assets/nyawa_hidup.png");
    this.load.image("nyawa_mati", "assets/nyawa_mati.png");
    this.load.image("pauseMenu", "assets/menu.png");
    this.load.image("winOverlay", "assets/victory.png");
    this.load.image("loseOverlay", "assets/defeat easy.png");

    // Tombol untuk pause menu
    this.load.image("resumeBtn", "assets/resume.png");
    this.load.image("backBtn", "assets/back.png");

    // Assets audio
    this.load.audio("bgm", "assets/sounds/bgm.mp3");
    this.load.audio("cardFlip", "assets/sounds/flip.mp3");
    this.load.audio("matchSound", "assets/sounds/ting.mp3");
    this.load.audio("wrongMatch", "assets/sounds/bruh.mp3");
    this.load.audio("winSound", "assets/sounds/win.mp3");
    this.load.audio("loseSound", "assets/sounds/lose.mp3");

    // Event listener untuk mengecek loading audio
    this.load.on('filecomplete-audio-bgm', () => {
      console.log('BGM loaded successfully');
    });
    this.load.on('filecomplete-audio-cardFlip', () => {
      console.log('Card flip sound loaded successfully');
    });
    this.load.on('filecomplete-audio-matchSound', () => {
      console.log('Match sound loaded successfully');
    });
    this.load.on('filecomplete-audio-wrongMatch', () => {
      console.log('Wrong match sound loaded successfully');
    });
    this.load.on('loaderror', (file) => {
      console.error('Failed to load:', file.src);
    });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    this.add.image(centerX, centerY, "bg laut").setDisplaySize(width, height);
    this.add.image(centerX, height - 420,"meja laut").setScale(1.2).setDepth(0);
    this.add.image(centerX, centerY - 90, "board batu").setScale(0.9, 0.85).setDepth(1);

    // Flag untuk mencegah multiple end game
    this.gameEnded = false;

    // Inisialisasi audio SETELAH semua asset dimuat
    this.initAudio();
    
    this.createCards(centerX, centerY - 20);
    this.createUI();
    this.createPauseMenu();
  }

  initAudio() {
    this.audioEnabled = false;
    
    try {
      // Cek apakah semua audio telah dimuat
      const bgmCache = this.cache.audio.get('bgm');
      const cardFlipCache = this.cache.audio.get('cardFlip');
      
      if (!bgmCache) {
        console.warn('BGM not found in cache');
        this.setupDummyAudio();
        return;
      }

      // Background music
      this.bgm = this.sound.add("bgm", {
        volume: 0.2,
        loop: true
      });
      
      // Sound effects
      this.cardFlipSound = this.sound.add("cardFlip", { volume: 0.6 });
      this.matchSound = this.sound.add("matchSound", { volume: 0.4 });
      this.wrongMatchSound = this.sound.add("wrongMatch", { volume: 0.3 });
      this.winSound = this.sound.add("winSound", { volume: 0.6 });
      this.loseSound = this.sound.add("loseSound", { volume: 0.6 });
      
      this.audioEnabled = true;
      console.log("Audio initialized successfully");
      
      this.setupAudioUnlock();
      
    } catch (error) {
      console.error("Error initializing audio:", error);
      this.setupDummyAudio();
    }
  }

  setupAudioUnlock() {
    this.autoStartAudio();
    
    const unlockAudio = () => {
      this.resumeAudioContext();
      this.input.off('pointerdown', unlockAudio);
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    this.input.once('pointerdown', unlockAudio);
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
  }

  autoStartAudio() {
    this.time.delayedCall(100, () => {
      this.resumeAudioContext();
    });
    
    this.time.delayedCall(500, () => {
      if (!this.bgm.isPlaying) {
        this.resumeAudioContext();
      }
    });
  }

  resumeAudioContext() {
    if (this.sound && this.sound.context) {
      const audioContext = this.sound.context;
      
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('Audio context resumed');
          this.startBackgroundMusic();
        }).catch(error => {
          console.warn('Failed to resume audio context:', error);
        });
      } else if (audioContext.state === 'running') {
        this.startBackgroundMusic();
      }
    }
  }

  startBackgroundMusic() {
    if (this.bgm && !this.bgm.isPlaying && this.audioEnabled) {
      try {
        this.bgm.play();
        console.log('Background music started');
      } catch (error) {
        console.warn('Failed to start background music:', error);
      }
    }
  }

  setupDummyAudio() {
    console.log('Setting up dummy audio');
    this.audioEnabled = false;
    this.bgm = { 
      stop: () => {}, 
      pause: () => {}, 
      resume: () => {}, 
      play: () => {},
      isPlaying: false 
    };
    this.cardFlipSound = { play: () => console.log('🔇 Card flip (silent)') };
    this.matchSound = { play: () => console.log('🔇 Match sound (silent)') };
    this.wrongMatchSound = { play: () => console.log('🔇 Wrong match (silent)') };
    this.winSound = { play: () => console.log('🔇 Win sound (silent)') };
    this.loseSound = { play: () => console.log('🔇 Lose sound (silent)') };
  }

  createCards(centerX, centerY) {
  const cardSpacingX = 110; // Jarak horizontal antar kartu
  const cardSpacingY = 120; // Jarak vertikal antar kartu

  // Layout sesuai gambar:
  // Baris 1: 6 kartu (atas)
  // Baris 2: 6 kartu (tengah)
  // Baris 3: 2 kartu (bawah tengah)
  // Total: 14 kartu (7 pasang)

  const cardPositions = [
    // Baris 1 (6 kartu) - atas
    { x: -3.7   , y: -2 }, { x: -2.2, y: -2 }, { x: -0.7, y: -2 }, 
    { x: 0.8, y: -2 }, { x: 2.3, y: -2 }, { x: 3.8, y: -2 },
    
    // Baris 2 (6 kartu) - tengah
    { x: -3.7, y: -0.6 }, { x: -2.2, y: -0.6 }, { x: -0.7, y: -0.6 }, 
    { x: 0.8, y: -0.6 }, { x: 2.3, y: -0.6 }, { x: 3.8, y: -0.6 },
    
    // Baris 3 (2 kartu) - bawah tengah
    { x: -0.7, y: 0.9 }, { x: 0.8, y:0.9  }
  ];

  // 7 jenis kartu, masing-masing 2 buah = 14 kartu total
  const cardTextures = [
    "card1", "card2", "card3", "card4", "card5", "card6", "card7",
    "card1", "card2", "card3", "card4", "card5", "card6", "card7"
  ];
  
  // Acak urutan kartu
  Phaser.Utils.Array.Shuffle(cardTextures);

  this.cards = [];
  this.flippedCards = [];
  this.lives = 3;
  this.previewing = true;

  // Buat kartu sesuai dengan posisi yang sudah didefinisikan
  cardPositions.forEach((pos, index) => {
    const x = centerX + pos.x * cardSpacingX;
    const y = centerY + pos.y * cardSpacingY;

    const card = this.add.image(x, y, cardTextures[index])
      .setInteractive()
      .setScale(0.4) // Ukuran kartu sedikit dikecilkan karena banyak kartu
      .setDepth(3);

    card.actualTexture = cardTextures[index];
    card.isFlipped = true;

    card.on("pointerdown", () => {
      if (!this.previewing && !this.paused && !this.gameEnded) this.flipCard(card);
    });

    this.cards.push(card);
  });

  this.startPreviewAnimation();
}

  startPreviewAnimation() {
    console.log('Starting preview animation with sound effects');
    
    this.time.delayedCall(2000, () => {
      this.cards.forEach((card, i) => {
        this.time.delayedCall(i * 200, () => {
          const flipSound = this.sound.add("cardFlip", { 
            volume: 0.3,
            destroy: true
          });
          
          try {
            if (this.audioEnabled) {
              flipSound.play();
              console.log(`Preview flip sound ${i + 1} played`);
            }
          } catch (error) {
            console.warn(`Error playing preview flip ${i + 1}:`, error);
          }
          
          this.flipToBack(card);
        });
      });
      
      const totalPreviewTime = this.cards.length * 200 + 500;
      this.time.delayedCall(totalPreviewTime, () => {
        this.previewing = false;
        console.log('Preview completed, game ready to play');
      });
    });
  }

  flipCard(card) {
    if (card.isFlipped || this.flippedCards.length === 2) return;

    this.playSound(this.cardFlipSound, 'card flip');

    card.isFlipped = true;
    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 150,
      onComplete: () => {
        card.setTexture(card.actualTexture).setScale(0.36);
        this.tweens.add({
          targets: card,
          scaleX: 0.36,
          duration: 150,
        });
      }
    });

    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.time.delayedCall(500, () => this.checkMatch());
    }
  }

  flipToBack(card) {
    this.tweens.add({
      targets: card, 
      scaleX: 0, 
      duration: 150,
      onComplete: () => {
        card.setTexture("cardBack").setScale(0.8);
        this.tweens.add({ 
          targets: card, 
          scaleX: 0.8, 
          duration: 150 
        });
        card.isFlipped = false;
      }
    });
  }

  checkMatch() {
    if (this.gameEnded) return;

    const [card1, card2] = this.flippedCards;

    if (card1.actualTexture === card2.actualTexture) {
      this.playSound(this.matchSound, 'match');
      this.flippedCards = [];
      
      const allMatched = this.cards.every(card => card.isFlipped);
      if (allMatched && !this.gameEnded) {
        this.gameEnded = true;
        console.log('All cards matched! Showing win overlay...');
        this.time.delayedCall(1000, () => {
          this.showEndOverlay("win");
        });
      }
    } else {
      this.playSound(this.wrongMatchSound, 'wrong match');
      
      // TAMBAHAN: Efek getaran kamera saat salah
      this.createScreenShake();
      
      this.time.delayedCall(800, () => {
        this.tweens.add({
          targets: [card1, card2],
          scaleX: 0,
          duration: 150,
          onComplete: () => {
            card1.setTexture("cardBack").setScale(0.8);
            card2.setTexture("cardBack").setScale(0.8);

            this.tweens.add({
              targets: [card1, card2],
              scaleX: 0.8,
              duration: 150
            });

            card1.isFlipped = false;
            card2.isFlipped = false;
          }
        });

        this.flippedCards = [];
        this.lives--;
        this.updateLives();

        if (this.lives === 0 && !this.gameEnded) {
          this.gameEnded = true;
          console.log('Game over! Showing lose overlay...');
          this.time.delayedCall(1000, () => {
            this.showEndOverlay("lose");
          });
        }
      });
    }
  }

  playSound(soundObject, soundName, customVolume = null) {
    if (!this.audioEnabled || !soundObject) {
      console.log(`🔇 ${soundName} (silent)`);
      return;
    }

    try {
      if (soundObject.isPlaying) {
        soundObject.stop();
      }
      
      if (customVolume !== null && soundObject.setVolume) {
        const originalVolume = soundObject.volume;
        soundObject.setVolume(customVolume);
        
        soundObject.play().then(() => {
          setTimeout(() => {
            if (soundObject.setVolume) {
              soundObject.setVolume(originalVolume);
            }
          }, 500);
        }).catch(error => {
          console.warn(`Error playing ${soundName}:`, error);
          if (soundObject.setVolume) {
            soundObject.setVolume(originalVolume);
          }
        });
      } else {
        soundObject.play().catch(error => {
          console.warn(`Error playing ${soundName}:`, error);
        });
      }
    } catch (error) {
      console.warn(`Error playing ${soundName}:`, error);
    }
  }

  stopBackgroundMusic() {
    if (this.bgm && this.bgm.stop) {
      this.bgm.stop();
    }
  }

  createUI() {
    const { width, height } = this.scale;

    // Simpan referensi papan nyawa untuk efek getaran
    this.papanNyawa = this.add.image(120, height - 220, "papan_nyawa").setScale(0.8).setDepth(1);
    const nyawaStartX = 35, nyawaY = height - 220, spacing = 80;

    this.nyawaIcons = [
      this.add.image(nyawaStartX, nyawaY, "nyawa_hidup").setScale(0.6).setDepth(2),
      this.add.image(nyawaStartX + spacing, nyawaY, "nyawa_hidup").setScale(0.6).setDepth(2),
      this.add.image(nyawaStartX + spacing * 2, nyawaY, "nyawa_hidup").setScale(0.6).setDepth(2)
    ];

    this.pauseBtn = this.add.image(250, height - 60, "pauseBtn").setScale(0.8).setInteractive();
    this.pauseBtn.on("pointerdown", () => this.togglePause());

    this.obengBtn = this.add.image(width - 340, height - 80, "obengbtn").setScale(0.8).setInteractive();
    this.ramuan = this.add.image(width - 140, height - 80, "ramuan").setScale(0.8);
  }

  createPauseMenu() {
    const { width, height } = this.scale;
    this.paused = false;

    // Panel pause menu
    this.pausePanel = this.add.image(width / 2, height / 2, "pauseMenu").setDepth(10).setVisible(false);

    // Tombol Resume
    this.btnResume = this.add.image(width / 2 + 200, height / 2 + 80, "resumeBtn")
      .setScale(0.8)
      .setInteractive()
      .setDepth(11)
      .setVisible(false);

    // Tombol Back
    this.btnBack = this.add.image(width / 2 - 200, height / 2 + 80, "backBtn")
      .setScale(1.36)
      .setInteractive()
      .setDepth(11)
      .setVisible(false);

    // Hover effects untuk tombol Resume
    this.btnResume.on('pointerover', () => {
      // Hentikan semua tween yang sedang berjalan untuk tombol ini
      this.tweens.killTweensOf(this.btnResume);
      
      this.tweens.add({
        targets: this.btnResume,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 150,
        ease: 'Power2'
      });
      this.btnResume.setTint(0xdddddd);
    });

    this.btnResume.on('pointerout', () => {
      // Hentikan semua tween yang sedang berjalan untuk tombol ini
      this.tweens.killTweensOf(this.btnResume);
      
      this.tweens.add({
        targets: this.btnResume,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 150,
        ease: 'Power2'
      });
      this.btnResume.clearTint();
    });

    // Hover effects untuk tombol Back
    this.btnBack.on('pointerover', () => {
      // Hentikan semua tween yang sedang berjalan untuk tombol ini
      this.tweens.killTweensOf(this.btnBack);
      
      this.tweens.add({
        targets: this.btnBack,
        scaleX: 1.46,
        scaleY: 1.46,
        duration: 150,
        ease: 'Power2'
      });
      this.btnBack.setTint(0xdddddd);
    });

    this.btnBack.on('pointerout', () => {
      // Hentikan semua tween yang sedang berjalan untuk tombol ini
      this.tweens.killTweensOf(this.btnBack);
      
      this.tweens.add({
        targets: this.btnBack,
        scaleX: 1.36,
        scaleY: 1.36,
        duration: 150,
        ease: 'Power2'
      });
      this.btnBack.clearTint();
    });

    // Event handlers - PERBAIKAN UTAMA DI SINI
    this.btnResume.on("pointerdown", () => {
      console.log('Resume button clicked');
      this.resumeGame();
    });
    
    this.btnBack.on("pointerdown", () => {
      console.log('Back button clicked');
      this.goBackToModeScene();
    });
  }

  togglePause() {
    if (this.gameEnded) return;

    this.paused = !this.paused;
    
    if (this.paused) {
      this.showPauseMenu();
    } else {
      this.resumeGame();
    }
  }

  showPauseMenu() {
    // Pause audio
    if (this.bgm && this.bgm.pause) {
      this.bgm.pause();
    }

    // Show pause menu dengan animasi
    this.pausePanel.setVisible(true).setScale(0);
    this.btnResume.setVisible(true).setAlpha(0);
    this.btnBack.setVisible(true).setAlpha(0);
    
    // Animasi entrance
    this.tweens.add({
      targets: this.pausePanel,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.out'
    });

    this.tweens.add({
      targets: [this.btnResume, this.btnBack],
      alpha: 1,
      duration: 400,
      delay: 150,
      ease: 'Power2'
    });

    console.log('Pause menu shown');
  }

  resumeGame() {
    this.paused = false;
    
    // Hide pause menu dengan animasi
    this.tweens.add({
      targets: this.pausePanel,
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.pausePanel.setVisible(false);
      }
    });

    this.tweens.add({
      targets: [this.btnResume, this.btnBack],
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.btnResume.setVisible(false);
        this.btnBack.setVisible(false);
      }
    });

    // Resume audio
    if (this.bgm && this.bgm.resume) {
      this.bgm.resume();
    }

    console.log('Game resumed');
  }

  goBackToModeScene() {
    console.log('Going back to ModeScene');
    this.stopBackgroundMusic();
    this.scene.start("ModeScene");
  }

  updateLives() {
    const mati = "nyawa_mati";
    if (this.lives <= 2) this.nyawaIcons[2].setTexture(mati);
    if (this.lives <= 1) this.nyawaIcons[1].setTexture(mati);
    if (this.lives <= 0) this.nyawaIcons[0].setTexture(mati);
  }

  showEndOverlay(type) {
    const { width, height } = this.scale;

    console.log(`Showing ${type} overlay`);

    this.stopBackgroundMusic();

    if (type === "win") {
      this.playSound(this.winSound, 'win sound');
    } else {
      this.playSound(this.loseSound, 'lose sound');
    }

    const darkOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setDepth(98)
      .setScrollFactor(0)
      .setInteractive();

    const overlayKey = type === "win" ? "winOverlay" : "loseOverlay";
    
    if (this.textures.exists(overlayKey)) {
      const overlay = this.add.image(width / 2, height / 2, overlayKey)
        .setDepth(100)
        .setScrollFactor(0)
        .setScale(1.0)
        .setInteractive();
      
      console.log(`${overlayKey} image created`);

      darkOverlay.setAlpha(0);
      overlay.setScale(0);

      this.tweens.add({
        targets: darkOverlay,
        alpha: 0.6,
        duration: 500,
        ease: 'Power2'
      });

      this.tweens.add({
        targets: overlay,
        scale: 1.0,
        duration: 800,
        ease: 'Back.out',
        delay: 200
      });

      this.tweens.add({
        targets: overlay,
        y: height / 2 - 15,
        duration: 2500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: 1000
      });

      const instructionText = this.add.text(width / 2, height - 60, "Tap anywhere to continue", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center"
      }).setOrigin(0.5).setDepth(102).setAlpha(0);

      this.tweens.add({
        targets: instructionText,
        alpha: 1,
        duration: 600,
        delay: 1200
      });

      this.tweens.add({
        targets: instructionText,
        alpha: 0.3,
        duration: 1000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: 2000
      });

    } else {
      console.warn(`Texture ${overlayKey} not found!`);
      const fallbackText = this.add.text(width / 2, height / 2, 
        type === "win" ? "YOU WIN!\nTap anywhere to continue" : "GAME OVER!\nTap anywhere to continue", {
        fontSize: "48px",
        fontFamily: "Arial Black",
        color: type === "win" ? "#FFD700" : "#FF4444",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center"
      }).setOrigin(0.5).setDepth(100);
    }

    const handleTapAnywhere = () => {
      console.log('Tap detected - going to ModeScene');
      this.input.off('pointerdown', handleTapAnywhere);
      darkOverlay.off('pointerdown', handleTapAnywhere);
      
      this.scene.start("ModeScene");
    };

    this.input.once('pointerdown', handleTapAnywhere);
    darkOverlay.on('pointerdown', handleTapAnywhere);

    if (type === "win") {
      this.createWinParticles(width, height);
    }

    console.log(`${type} overlay created successfully`);
  }

  createWinParticles(width, height) {
    const colors = [0xFFD700, 0xFFA500, 0xFF6347, 0x32CD32, 0x1E90FF];
    
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, width), 
        height + 50, 
        Phaser.Math.Between(3, 8), 
        colors[Phaser.Math.Between(0, colors.length - 1)]
      ).setDepth(99);

      this.tweens.add({
        targets: particle,
        y: -50,
        x: particle.x + Phaser.Math.Between(-100, 100),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 4000),
        ease: 'Cubic.out',
        delay: Phaser.Math.Between(0, 2000),
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  // TAMBAHAN: Fungsi untuk efek getaran layar
 createScreenShake() {
  console.log('Screen shake activated!');

  // Shake kamera dengan intensitas LEBIH RINGAN
  this.cameras.main.shake(300, 0.005, true); // sebelumnya 500, 0.02

  // Efek flash merah (biarkan seperti ini, atau bisa diredam juga)
  this.cameras.main.flash(150, 255, 50, 50, false, (camera, progress) => {
    if (progress === 1) {
      console.log('Screen flash completed');
    }
  });

  // Getaran ringan pada kartu yang salah
  if (this.flippedCards && this.flippedCards.length === 2) {
    const [card1, card2] = this.flippedCards;

    // Animasi shake tanpa mengubah posisi asli
    [card1, card2].forEach((card) => {
      this.tweens.add({
        targets: card,
        scaleX: card.scaleX * 0.98,
        scaleY: card.scaleY * 1.02,
        duration: 40,
        yoyo: true,
        repeat: 3,
        ease: 'Power1'
      });
      
      // Tambahan efek rotation kecil
      this.tweens.add({
        targets: card,
        rotation: card.rotation + 0.02,
        duration: 40,
        yoyo: true,
        repeat: 3,
        ease: 'Power1'
      });
    });
  }

  // Getaran ringan pada ikon nyawa
  if (this.nyawaIcons) {
    this.nyawaIcons.forEach((nyawa, index) => {
      this.tweens.add({
        targets: nyawa,
        y: nyawa.y - 5, // sebelumnya -10
        duration: 80,
        yoyo: true,
        repeat: 1, // sebelumnya 2
        ease: 'Power1',
        delay: index * 40
      });
    });
  }

  // Getaran ringan pada papan nyawa
  if (this.papanNyawa) {
    this.tweens.add({
      targets: this.papanNyawa,
      rotation: 0.02, // sebelumnya 0.05
      duration: 80,
      yoyo: true,
      repeat: 1, // sebelumnya 3
      ease: 'Power1'
    });
  }
}
 }