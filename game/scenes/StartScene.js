import tower from '../assets/stone-tower-32px.png'
import background from '../assets/start-background.jpg';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartScene'
        });
    }

    preload() {
        this.load.image('tower', tower);
        this.load.image('background', background);
    }

    create() {
        let posX = this.cameras.main.centerX;
        let posY = this.cameras.main.centerY;
        let background = this.add.image(posX, posY, 'background');
        let text = this.make.text({
            x: posX, 
            y: posY, 
            text: 'New Game', 
            origin: 0.5,
            style: {
                fontSize: '60px',
                fill: 'black',
                align: 'center',
            }
        });

        // let image =  this.add.image(100, 100, 'tower')
        text.setInteractive().on('pointerup', () => {
            this.scene.start("GameScene");
        });
    }

    update() {

    }
}