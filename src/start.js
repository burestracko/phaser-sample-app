var config = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    audio: {
        disableWebAudio: true
    },
    scene: [Menu, Help, Game]
};

game = new Phaser.Game(config);
window.focus();