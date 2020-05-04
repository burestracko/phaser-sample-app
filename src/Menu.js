class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload() {
        this.load.image('button-start', 'assets/button-start.png', {frameWidth:180,frameHeight:180});
        this.load.image('button-help', 'assets/button-help.png');
        this.load.image('button-sound-on', 'assets/button-sound-on.png', {frameWidth:80,frameHeight:80});
        this.load.image('button-sound-off', 'assets/button-sound-off.png', {frameWidth:80,frameHeight:80});
        this.load.image('sky', 'assets/sky.png');
        this.load.audio('click', [ 'assets/click.ogg', 'assets/click.mp3' ]);
    }
    create() {
        this.clickSoundEffect = this.sound.add('click');
        this.soundOn = true;
        this.add.image(400, 300, 'sky');

        var title = this.add.text(400, 300, 'Platformer', {fontSize: '70px', fontStyle: 'bold', fill: '#020202'});
        title.setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown', this.handleKey, this);

        new Button(400, 500, 'button-start', this.clickStart, this).setOrigin(0.5, 0.5);
        new Button(740, 50, 'button-help', this.clickHelp, this).setOrigin(0.5, 0.5);

        var buttonSound = this.add.image(60, 50, 'button-sound-on').setInteractive();
        buttonSound.setOrigin(0.5, 0.5);
        buttonSound.on('pointerup', this.clickSound, this);
        this.textSound = this.add.text(buttonSound.width+50, 50, this.sound ? 'Sound: ON' : 'Sound: OFF', {fontSize: '40px', fill: '#030303'});
        this.textSound.setOrigin(0, 0.5);

        this.cameras.main.fadeIn(250);
    }
    handleKey(e) {
        switch(e.code) {
            case 'Enter': {
                this.clickStart();
                break;
            }
            default: {}
        }
    }
    clickStart() {
        this.soundOn && this.clickSoundEffect.play();
        this.scene.launch('Game', { 'sound': this.soundOn });
    }
    clickSound() {
        this.soundOn = !this.soundOn;
        this.textSound.setText(this.soundOn ? 'Sound: ON' : 'Sound: OFF');
        this.soundOn && this.clickSoundEffect.play();
    }
    clickHelp() {
        this.soundOn && this.clickSoundEffect.play();
        this.scene.launch('Help', { 'sound': this.soundOn });
    }
}