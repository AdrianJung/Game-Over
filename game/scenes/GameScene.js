// Map assets
import map from '../assets/tilemaps/map-updated.json'
import tiles from '../assets/tilemaps/tuxmon-sample-32px.png'

// Sprite and images
import tower from '../assets/stone-tower-32px.png'
import bullet from '../assets/bullets/small-spike.png'
import monster from '../assets/sprites/monster39x40.png'

// Classes
import Enemy from './classes/Enemy';
import Tower from './classes/Tower';


export default class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene',
		});
	}

	preload() {
		// Load map 
		this.load.image('tuxmon-sample-32px', tiles);
		this.load.tilemapTiledJSON('map-updated', map);

		// Load tower and bullet
		this.load.image('tower', tower);
		this.load.spritesheet('bullet', bullet, {
			frameWidth: 10,
			frameHeight: 10
		});

		// Load monster
		this.load.spritesheet('monster', monster, {
			frameWidth: 39,
			frameHeight: 40,
		});
	}
	
	create() {
		// Create map
		this.map = this.make.tilemap({
			key: 'map-updated'
		})

		// Walkanimation for sprite
		const monsterAnimation = this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('monster'),
			repeat: -1
		});

		// Set tiles
		this.groundtiles = this.map.addTilesetImage('tuxmon-sample-32px')

		// Set layer
		this.groundlayer = this.map.createStaticLayer('top', this.groundtiles, 0, 0)

		// Set mouse marker
		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, 32, 32);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, 32, 32);
		
		// Towers group
		let towers = this.add.group();
		this.towers = towers;
		this.arrayOfTowers = towers.getChildren();
		this.input.on('pointerup', () => {
			// Check if tile is allowed to place tower on
			let currentTile = this.map.getTileAtWorldXY((this.snapperWorldPoint.x + 16), (this.snapperWorldPoint.y + 16))
			if (currentTile.properties.collide === true) {
				return;
			}
			// Check if tower already exists on pointer position
			if (this.arrayOfTowers.some(t => t.x === this.snapperWorldPoint.x + 16 && t.y === this.snapperWorldPoint.y + 16)) {
				return;
			}
			
			// Adding tower to towers group
			let tower = new Tower({
				scene: this,
				x: this.snapperWorldPoint.x + 16, 
				y: this.snapperWorldPoint.y + 16,
				key: 'tower'
			});
			towers.add(tower);
			console.log(tower);
		});
		

		let offset = 0;
		let path;

		const spawn = (enemyObject) => {
			enemyObject.children.entries.map(child => {
				path = this.add.path(child.x, child.y)
					.lineTo(112, 304)
					.lineTo(400, 304)
					.lineTo(400, 80)
					.lineTo(944, 80)
					.lineTo(944, 720)
					.lineTo(592, 720)
					.lineTo(592, 496)
					.lineTo(112, 496)
					.lineTo(112, 784)

				child.pathFollower = this.plugins.get('PathFollower').add(child, {
					path: path, // path object
					t: 0, // t: 0~1
					rotateToPath: false
					// rotationOffset: 0,
					// angleOffset: 0
				});
				offset += 1500

				this.tweens.add({
					targets: child.pathFollower,
					t: 1,
					ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
					duration: 10000 + offset,
					repeat: 0, // -1: infinity
					yoyo: false,
					onComplete: function () {
						child.destroy()
					}
				});
				child.play('walk')
			})
		}

		let enemies = this.add.group();
		this.enemies = enemies;
		let startOffset = 0;
		let startPosX = 112;

		for (let i = 0; i < 10; i++) {
			startOffset -= 400;
			let enemy = new Enemy(this, startPosX, startOffset, 'monster');
			enemies.add(enemy);
		}

		// Spawn enemy function 
		spawn(enemies);

		 // BULLET
		this.anims.create({
			key: 'bullet',
			frames: [{
				key: 'bullet',
				frame: 0
			}],
		});
	}
	
	update() {
		// Update mouse marker
		this.worldPoint = this.input.activePointer;
		this.pointerTileXY = this.groundlayer.worldToTileXY(this.worldPoint.x, this.worldPoint.y);
		this.snapperWorldPoint = this.groundlayer.tileToWorldXY(this.pointerTileXY.x, this.pointerTileXY.y);
		this.marker.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);


		if (this.towers.getLength() > 0 && this.enemies.getLength() > 0) {
			this.arrayOfTowers.map(tower => {
				tower.checkForEnemies();
			});
		}
	}
}