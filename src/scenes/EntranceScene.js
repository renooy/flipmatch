// src/scenes/EntranceScene.js
import Phaser from "phaser";

export default class EntranceScene extends Phaser.Scene {
  constructor() {
    super("EntranceScene");
  }

  preload() {
    // Background entrance dan logo dari gambar yang dikirim
    this.load.image("entranceBg", "assets/loading screen.png"); // Background dari gambar yang Anda kirim
    
    // Kartu-kartu sesuai dengan gambar (4 kartu yang terlihat)
    this.load.image("yellowCard", "assets/kuning3d.png");     // Kartu kuning (kiri atas)
    this.load.image("blueCard", "assets/ubur3d.png");        // Kartu biru (kanan atas) 
    this.load.image("greenCard", "assets/zombie3d.png");      // Kartu hijau (kiri bawah)
    this.load.image("brownCard", "assets/owl3d.png");    // Kartu coklat (kanan bawah)
    this.load.image("cardBack", "assets/punggung kartu.png");
    
    // Asset untuk efek partikel
    this.load.image("particle", "assets/particle.png"); // Opsional untuk efek
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background entrance dengan aspect ratio yang dipertahankan
    const bg = this.add.image(centerX, centerY, "entranceBg");
    
    // Hitung scale untuk mempertahankan aspect ratio tanpa membuat gepeng
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY); // Gunakan scale yang lebih besar agar tidak gepeng
    
    bg.setScale(scale);

    // Array kartu dengan posisi dan rotasi yang lebih sesuai gambar
    this.cardData = [
      { 
        type: "yellowCard", 
        startX: centerX - 250, 
        startY: centerY - 120, 
        rotation: -0.4,
        color: "yellow",
        scale: 0.5
      },
      { 
        type: "blueCard", 
        startX: centerX + 250, 
        startY: centerY - 120, 
        rotation: 0.35,
        color: "blue",
        scale: 0.5
      },
      { 
        type: "greenCard", 
        startX: centerX - 250, 
        startY: centerY + 120, 
        rotation: 0.25,
        color: "green",
        scale: 0.5
      },
      { 
        type: "brownCard", 
        startX: centerX + 250, 
        startY: centerY + 120, 
        rotation: -0.3,
        color: "brown",
        scale: 0.5
      }
    ];

    this.animatedCards = [];
    this.cardsCompleted = 0; // Counter untuk tracking kartu yang selesai animasi

    // Buat kartu-kartu di posisi awal
    this.createInitialCards();

    // Mulai animasi langsung setelah delay singkat
    this.time.delayedCall(1000, () => {
      this.startCardLaunchSequence();
    });

    // Skip ke StartScene jika user click
    this.input.on('pointerdown', () => {
      this.skipToStart();
    });

    // Skip dengan keyboard
    this.input.keyboard.on('keydown', () => {
      this.skipToStart();
    });
  }

  createInitialCards() {
    // Buat kartu-kartu di posisi awal dengan animasi floating ringan
    this.cardData.forEach((cardInfo, index) => {
      const card = this.add.image(cardInfo.startX, cardInfo.startY, cardInfo.type)
        .setScale(cardInfo.scale)
        .setRotation(cardInfo.rotation)
        .setDepth(5);

      // Efek floating subtle hanya sampai animasi launch
      this.tweens.add({
        targets: card,
        y: cardInfo.startY - 8,
        duration: 1500 + (index * 200),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: 1 // Hanya 1 kali bolak-balik sebelum launch
      });

      this.animatedCards.push({
        sprite: card,
        info: cardInfo
      });
    });
  }

  startCardLaunchSequence() {
    const { width, height } = this.scale;
    
    // Hentikan semua animasi floating
    this.tweens.killAll();

    // Launch semua kartu bersamaan tanpa delay
    this.animatedCards.forEach((cardData, index) => {
      const card = cardData.sprite;
      this.launchCard(card);
    });
  }

  launchCard(card) {
    const { width, height } = this.scale;
    
    // Animasi kartu melesat ke arah layar (menuju kamera/player)
    this.tweens.add({
      targets: card,
      scaleX: 3.0, // Membesar seolah menuju layar
      scaleY: 3.0,
      alpha: 0,
      duration: 800,
      ease: 'Power3.easeIn',
      onComplete: () => {
        // Efek flash saat kartu menghilang
        this.createCardFlash(card.x, card.y);
        
        // Hancurkan kartu
        card.destroy();
        
        // Increment counter dan check apakah semua kartu sudah selesai
        this.cardsCompleted++;
        if (this.cardsCompleted >= this.animatedCards.length) {
          // Semua kartu selesai, langsung ke StartScene
          this.time.delayedCall(300, () => {
            this.proceedToStart();
          });
        }
      }
    });
  }

  createCardFlash(x, y) {
    // Efek kilat putih saat kartu menghilang
    const flash = this.add.circle(x, y, 80, 0xffffff, 0.9)
      .setDepth(15);
    
    this.tweens.add({
      targets: flash,
      radius: 200,
      alpha: 0,
      duration: 400,
      ease: 'Power2.easeOut',
      onComplete: () => {
        flash.destroy();
      }
    });
  }

  skipToStart() {
    // Stop semua animasi dan timer
    this.tweens.killAll();
    this.time.removeAllEvents();
    
    // Langsung ke StartScene tanpa delay
    this.scene.start("StartScene");
  }

  proceedToStart() {
    // Langsung fade out dan pindah ke StartScene
    const { width, height } = this.scale;
    const fadeOut = this.add.rectangle(width / 2, height / 2, width, height, 0x000000)
      .setAlpha(0)
      .setDepth(20);
    
    this.tweens.add({
      targets: fadeOut,
      alpha: 1,
      duration: 500,
      ease: 'Power2.easeOut',
      onComplete: () => {
        this.scene.start("StartScene");
      }
    });
  }
}