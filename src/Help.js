class Help extends Phaser.Scene {
    constructor() {
        super("Help");
    }
    init(data) {
        this.soundOn = data.sound;
    }

    preload() {
        this.load.image('button-back', 'assets/button-back.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.audio('click', [ 'assets/click.ogg', 'assets/click.mp3' ]);
    }
    create() {
        this.clickSoundEffect = this.sound.add('click');
        this.add.image(400, 300, 'sky');

        this.add.text(400, 350, 'left, right - move', {fontSize: '26px', fill: '#020202'}).setOrigin(0.5, 0.5);
        this.add.text(400, 400, 'up - jump', {fontSize: '26px', fill: '#020202'}).setOrigin(0.5, 0.5);
        this.add.text(400, 200, 'Goal of each level is to collect all of the stars', {fontSize: '26px', fill: '#020202'}).setOrigin(0.5, 0.5);
        this.add.text(400, 250, 'Beware of bombs, in every level you get one more', {fontSize: '26px', fill: '#020202'}).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown', this.handleKey, this);

        this.buttonBack = new Button(400, 500, 'button-back', this.clickBack, this);
        this.buttonBack.setOrigin(0.5, 0.5);

        this.cameras.main.fadeIn(250);
    }
    handleKey(e) {
        switch(e.code) {
            case 'Enter': {
                this.clickBack();
                break;
            }
            default: {}
        }
    }
    clickBack() {
        this.soundOn && this.clickSoundEffect.play();
        this.scene.switch('Menu');
    }
}