import map from '../assets/tilemaps/map.json'
import tiles from '../assets/tilemaps/ground-plates.png'
import tower from '../assets/Tower-32.png'
import monster from '../assets/sprites/monster39x40.png'
import EasyStar from 'easystarjs'

export default class GameScene extends Phaser.Scene {
	constructor() {
		super()
	}

	preload() {
		this.marker; 

		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
		this.load.image('ground-plates', tiles);
		this.load.tilemapTiledJSON('map', map);
		this.load.image('tower', tower);

		this.load.spritesheet('monster', monster, {
			frameWidth: 39,
			frameHeight: 40,
		});
	}

	
	create() {
		this.towers = []; 
		
		this.finder = new EasyStar.js()

		
		this.map = this.make.tilemap({
			key: 'map'
		})

		// Walkanimation for sprite
		const monsterAnimation = this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('monster'),
			repeat: -1
		});

		// layers
		this.groundtiles = this.map.addTilesetImage('ground-plates')
		// this.groundlayer.putTileAtWorldXY(34, 100, 100);
		this.groundlayer = this.map.createStaticLayer('top', this.groundtiles, 0, 0)

		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, 32, 32);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, 32, 32);
		

		let monster = this.add.sprite(180, 0, 'monster');
		var timeline = this.tweens.createTimeline();
		this.monster = monster;

		let speed = 10000
		
		timeline.add({
			targets: monster,
			x: 180,
			y: 200,
			duration: speed
		});

		timeline.add({
			targets: monster,
			x: 500,
			duration: speed
		});
		
		timeline.add({
			targets: monster,
			y: 360,
			duration: speed
		});

		timeline.add({
			targets: monster,
			x: 310,
			duration: speed
		});
		timeline.add({
			targets: monster,
			y: 660,
			duration: speed
		});
		monster.play('walk')
		timeline.play();
		
		this.input.on('pointerup', this.addTower, this);
	}
	
	
	update() {
		this.worldPoint = this.input.activePointer;
		this.pointerTileXY = this.groundlayer.worldToTileXY(this.worldPoint.x, this.worldPoint.y);
		this.snapperWorldPoint = this.groundlayer.tileToWorldXY(this.pointerTileXY.x, this.pointerTileXY.y);
		this.marker.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);

		this.towers.map(tower => {
			if (!tower.disabled) {
				this.shoot(tower, this.monster);
			}
		});
	}

	addTower() {
		let tower = this.add.image(this.snapperWorldPoint.x + 16, this.snapperWorldPoint.y + 16, 'tower');
		tower.disabled = false;
		this.towers.push(tower);
		console.log(this.towers);
	}

	shoot(tower, monster) {
		console.log(tower);
		console.log(monster);
		tower.disabled = true;
		setTimeout(() => {
			console.log(tower);
		}, 500);
	}
}