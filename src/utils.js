class Button extends Phaser.GameObjects.Image {
    constructor(x, y, texture, callback, scene, noframes) {
        super(scene, x, y, texture, 0);
        this.setInteractive({ useHandCursor: true });

        this.on('pointerdown', function() {
            if(!noframes) {
                this.setFrame(2);
            }
            callback.call(scene);
        }, this);

        scene.add.existing(this);
    }
}
