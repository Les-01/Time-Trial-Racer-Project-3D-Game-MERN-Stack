// This imports 'React' from 'react'.
import React from 'react';
// This imports 'THREE' namespace from 'three'.
import * as THREE from 'three';
// This imports 'Detector' from the file 'Detector' within the 'libraries' folder.
import Detector from '../libraries/Detector';
// This imports 'CANNON' from the file 'cannon.min.js' within the 'libraries' folder.
import CANNON from '../libraries/cannon.min.js';
// This imports 'FBXLoader' from 'three/examples/jsm/loaders/FBXLoader'.
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// This imports 'JoyStick' from the file 'joystick.js' within the 'components' folder.
import JoyStick from './joystick.js';
// This imports 'SFX' from the file 'sfx.js' within the 'components' folder.
import SFX from './sfx.js';
// This imports 'Preloader' from the file 'preloader.js' within the 'components' folder.
import Preloader from './preloader.js';
// This imports 'Timer' from the file 'lapTimer.js' within the 'components' folder.
import Timer from './lapTimer.js';

// Define the class ThreeGame a React component.
class ThreeGame extends React.Component {
	// Constructor function for the ThreeGame class.
	constructor() {
		// Call super() to initialise the parent class.
		super(); 
		// Check for WebGL support using Detector.
		if (!Detector.webgl) Detector.addGetWebGLMessage();    
		// Set the fixed time step for the real time physics simulation.
		this.fixedTimeStep = 1.0/60.0;
		// Initialise joystick input values.
		this.js = { forward:0, turn:0 };    
		// Initialise lap count.
		this.lapCount = 0;		
		// Create a container element
		this.container = document.createElement('div');
		this.container.style.height = '100%';
		document.body.appendChild(this.container);	
		// Method to initialise the joystick
		this.initJoystick();

		// Create the 'closeGame' button element and configure its attributes, text and styling.
		const closeGameButton = document.createElement('button');
		closeGameButton.setAttribute('id', 'closeGameButton');
		closeGameButton.textContent = 'Close Game';
		closeGameButton.style.position = 'absolute';
		closeGameButton.style.top = '30px';
		closeGameButton.style.right = '10px';
		closeGameButton.style.display = 'inline-block';
		closeGameButton.style.padding = '10px';
		closeGameButton.style.margin = '10px';
		closeGameButton.style.backgroundColor = 'red';
		closeGameButton.style.boxShadow = '0 0 20px red';
		closeGameButton.style.border = '0';
		closeGameButton.style.color = 'black';
		closeGameButton.style.fontFamily = 'Arial, Helvetica, sans-serif';
		closeGameButton.style.borderRadius = '4px';
		closeGameButton.style.cursor = 'pointer';
		closeGameButton.style.fontWeight = 'bold';
		closeGameButton.style.fontSize = '1em';		
		// Attach an event listener to the button.
		closeGameButton.addEventListener('click', () => {
			this.closeGame()
		});		
		// Append the button to the container
		this.container.appendChild(closeGameButton);	
		// Define the default path for the game assets.
		this.assetsPath = "/assets/";
		// Determine the audio file extension based on browser support.
		const sfxExt = SFX.supportsAudioType('mp3') ? 'mp3' : 'ogg';
		// Reference to the current instance of the game component, replacing 'this' with 'game'.
		const game = this;		
		// Options object for preloading assets
		const options = {
			// Assests array containing the paths to all the assets to be preloaded.
			assets:[
				"/assets/raceTrack.fbx",
				"/assets/images/logo.png",
				"/assets/images/west.jpg",
				"/assets/images/east.jpg",
				"/assets/images/ground.jpg",
				"/assets/images/sky.jpg",
				"/assets/images/north.jpg",
				"/assets/images/south.jpg",
				`${this.assetsPath}sfx/crash.${sfxExt}`,
                `${this.assetsPath}sfx/victory.${sfxExt}`,
                `${this.assetsPath}sfx/engine.${sfxExt}`,
                `${this.assetsPath}sfx/skid.${sfxExt}`,
                `${this.assetsPath}sfx/overdrive.${sfxExt}`,
			],
			// Callback function, executed when all assets are loaded.
			oncomplete: function(){
				// Calls 'init' method initialising the game.
				game.init();
				// Calls 'animate' method initialising the game engine and the animation loop.
				game.animate();
				// Play the engine sound effect.
				game.sfx.engine.play();				
			}
		}		
		// Initialise motion.
		this.motion = { forward:0, turn:0 };
		// Initialise clock.
		this.clock = new THREE.Clock();
		// Initialise sound effects.
		this.initSfx()
		// Initialise keyboard controls.
		this.keyboardControls = {
			forward: 0,
			turn: 0,
		};	

		// Bind event handlers to the current game instance.
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);	
		
		// Variables to track last tap time for detecting double clicks and double taps.
		this.lastTapTime = 0;
		this.tapTimer = null;	

		// Add event listeners for keyboard input, click input and touch input.
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);		
		document.addEventListener('dblclick', this.handleDoubleClick);
		document.addEventListener('touchstart', this.handleTouchStart);		

		 // Initialise preloader with options array.
		this.preloader = new Preloader(options);		
		window.onError = function(error){
			// Log any errors to the console.
			console.error(JSON.stringify(error));
		}
		// Bind the closeGame method to the current instance
        this.closeGame = this.closeGame.bind(this);
        // Add an event listener for the 'beforeunload' event to call closeGame method
        window.addEventListener('beforeunload', this.closeGame);		
	}	
	
	// Method to handle closing the game.
	closeGame() {
		// Check if the container exists and has a parent node.
		if (this.container && this.container.parentNode) {
			// Hide joystick element.
			if (this.joystick && this.joystick.domElement) {
				// Hide the joystick thumb element.
				this.joystick.domElement.style.display = 'none';				
				// Hide the joystick background circle element.
				const parentElement = this.joystick.domElement.parentNode;
				if (parentElement) {
					parentElement.style.display = 'none';
				}
			}
			// Remove the container from the document body.
			this.container.parentNode.removeChild(this.container);
			// Delete the lapCount cookie
			document.cookie = 'lapCount=; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/;';
			// Play skid sound effect.
			this.sfx.skid.play();
			// Exit the method.
            return;			
		}
	}

	// Method to initialise the joystick.
	initJoystick() {
		// Create a new instance of the JoyStick class.
		this.joystick = new JoyStick({
			// Assign the current instance of the ThreeGame class to the 'game' property of the joystick object.
			game: this,
			// Callback function to execute whenever the joystick moves.
			onMove: this.joystickCallback
		});
	}
	
	// Method to initialise the game sound effects.
	initSfx(){
		// Initialise the empty 'sfx' object to store the sound effects.
		this.sfx = {};
		// Create an AudioContext for managing audio playback.
		this.sfx.context = new (window.AudioContext || window.webkitAudioContext)();		
		// Initialize the Crash sound effect with specific settings.
		this.sfx.crash = new SFX({
			context: this.sfx.context,
			src:{mp3:`${this.assetsPath}sfx/crash.mp3`, ogg:`${this.assetsPath}sfx/crash.ogg`},
			loop: false,
			volume: 0.3
		});
		// Initialize the victory sound effect with specific settings.
        this.sfx.victory = new SFX({
			context: this.sfx.context,
			src:{mp3:`${this.assetsPath}sfx/victory.mp3`, ogg:`${this.assetsPath}sfx/victory.ogg`},
			loop: false,
			volume: 0.6
		});
		// Initialize the engine sound effect with specific settings.
        this.sfx.engine = new SFX({
			context: this.sfx.context,
			src:{mp3:`${this.assetsPath}sfx/engine.mp3`, ogg:`${this.assetsPath}sfx/engine.ogg`},
			loop: true,
			volume: 0.2
		});
		// Initialize the skid sound effect with specific settings.
        this.sfx.skid = new SFX({
			context: this.sfx.context,
			src:{mp3:`${this.assetsPath}sfx/skid.mp3`, ogg:`${this.assetsPath}sfx/skid.ogg`},
			loop: false,
			volume: 0.3
		});
		// Initialize the overdrive music track with specific settings.
		this.sfx.overdrive = new SFX({
			context: this.sfx.context,
			src:{mp3:`${this.assetsPath}sfx/overdrive.mp3`,  ogg:`${this.assetsPath}sfx/overdrive.ogg`},
			loop: false,
			volume: 0.1
		});
	}	

	// Method to initialise the game environment.
    init() {
		// Adjust the aspect ratio for wide-screen movie view.
		const aspectRatio = 16 / 9;
		// Create a perspective camera with specific parameters.
		this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
		// Set the cameras position.
		this.camera.position.set(0, -10, -15);	
		// Create a new scene.
		this.scene = new THREE.Scene();
		// Set the scenes background color.
		this.scene.background = new THREE.Color(0xa0a0a0);	
		// Add ambient light to the scene
		const ambient = new THREE.AmbientLight(0xaaaaaa);
		this.scene.add(ambient);	
		// Add directional light to the scene for shadows.
		const light = new THREE.DirectionalLight(0xaaaaaa);
		// Set light position.
		light.position.set(30, 100, 40);
		// Set light target position.
		light.target.position.set(0, 0, 0);	
		// Enable shadow casting for the light.
		light.castShadow = true;	
		// Define the size of the light's shadow camera.
		const lightSize = 30;
		light.shadow.camera.near = 1;
		light.shadow.camera.far = 500;
		light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
		light.shadow.camera.right = light.shadow.camera.top = lightSize;	
		// Set bias for shadow map.
		light.shadow.bias = 0.0039;
		// Set the size of the shadow map texture.
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;	
		// Assign the light to 'sun' property for reference.
		this.sun = light;
		// Add the light to the scene.
		this.scene.add(light);	

		// Resize the renderer to make the screen smaller.
		const width = window.innerWidth * 0.8;
		const height = window.innerHeight * 0.8;
		// Create a WebGL renderer with antialiasing enabled.
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		// Set the pixel ratio of the renderer to match the device pixel ratio.
		this.renderer.setPixelRatio(window.devicePixelRatio);
		// Set the size of the renderer to the adjusted width and height.
		this.renderer.setSize(width, height);
		// Enable shadow mapping for the renderer.
		this.renderer.shadowMap.enabled = true;
		// Append the renderer's DOM element to the container in the HTML document.
		this.container.appendChild(this.renderer.domElement);	

		// Center the canvas horizontally and vertically within the container.
		const canvas = this.renderer.domElement;
		// Set the position style to absolute.
		canvas.style.position = 'absolute';
		// Set the left CSS property to 50% to horizontally center the canvas.
		canvas.style.left = '50%';
		// Set the top CSS property to 50% to vertically center the canvas.
		canvas.style.top = '50%';
		// Use CSS transform to adjust the canvas position based on its size, ensuring accurate centering.
		canvas.style.transform = 'translate(-50%, -50%)';	
		// Calls the 'loadAssets' method after centering the canvas.
		this.loadAssets();		
	}	

	// Method to load the assets required for the game.
	loadAssets(){
		// Store a reference to the current instance of the game.
		const game = this;
		// Create a new FBXLoader instance.
		const loader = new FBXLoader();	
		// Load the game environment (race track FBX file).	
		loader.load( '/assets/raceTrack.fbx', 
		function ( object ){
			// Initialise the checkpoints array.
			game.checkpoints = [];		
			// Traverse through each child object in the loaded object.		
			object.traverse( function ( child ) {
				// Set receiveShadow flag to true by default.
				let receiveShadow = true;

				// Check if the child object is a mesh.
				if ( child.isMesh ) {
					// Check if the child is the chassis of the car.
					if (child.name=="Chassis"){	
						// Set up the car object and camera.		
						// Define the car object with chassis, shell, and wheel properties.			
						game.car = { chassis:child, shell:[], wheel:[] };
						// Create a new Object3D for the camera to follow.
						game.followCam = new THREE.Object3D();
						// Set the initial position of the follow camera to match the main camera.
						game.followCam.position.copy(game.camera.position);
						// Add the follow camera to the scene.
						game.scene.add(game.followCam)
						// Set the parent of the follow camera to the car's chassis.
						game.followCam.parent = child;
						// Set the target of the sun to the car's chassis for lighting.
						game.sun.target = child;
						// Enable casting shadows for the car's chassis.
						child.castShadow = true;
						// Set receiveShadow to false for the child object.
						receiveShadow = false;
					}
					// Check if the child is a shell component of the car.
					else if (child.name.includes("Shell")){
						// Add the shell component to the car object
						game.car.shell.push(child);
						child.visible = true;
						child.castShadow = true;
						receiveShadow = false;
					}
					// Check if the child is a wheel component of the car.
					else if (child.name.includes("Wheel") && child.children.length>0){
						// Add the wheel component to the car object.
						game.car.wheel.push(child);
						child.parent = game.scene;
						child.visible = true;
						child.castShadow = true;
						receiveShadow = false;				
					}			
					// Set the receiveShadow property of the child mesh.		
					child.receiveShadow = receiveShadow;
				}else{
					// If the child object is not a mesh, check if it represents a checkpoint.
					if (child.name.includes("Checkpoint")){
						// Add the checkpoint to the checkpoints array.
						game.checkpoints.push(child);
						// Adjust the y-position of the checkpoint.
						child.position.y += 1;
					}
				}
			});
			// Build the car at the position specified.
			game.buildCar(0,0,0);	
			// Store the loaded object as an asset.		
			game.assets = object;
			// Add the loaded object to the scene.
			game.scene.add( object );		
				
			// Load the surrounding cube texture for the background.
			const tloader = new THREE.CubeTextureLoader();
			tloader.setPath( '/assets/images/' );
			var textureCube = tloader.load( [
				'east.jpg', 'west.jpg',
				'sky.jpg', 'ground.jpg',
				'south.jpg', 'north.jpg'
			] );
			// Set the cube texture as the scene background.
			game.scene.background = textureCube;	
			// Initialise the physics for the game.		
			game.initPhysics();
		},

		null, 
		function(error){
			// Log any errors that occur during loading to the console.
			console.error(error);
		}			
	 );
	}
	// Method to build the car with the components shell and wheel.
	buildCar( shell=0, wheel=0){
		// Set the visibility of the shell and wheel components to true.
		this.car.shell[shell].visible = true;
		this.car.wheel[wheel].visible = true;
		// Set the shell and wheel components as the active shell and wheel of the car.
		this.car.shell = this.car.shell[shell];
		this.car.wheel = this.car.wheel[wheel];
	}
	
	// Method to initialize the real world physics simulation.
	initPhysics(){
		// Create a physics object to store physics-related properties and methods.
		this.physics = {};		
		const game = this;
        const mass = 160;
		// Initialise a new 'Cannon.js' world for the physics simulation.
		const world = new CANNON.World();
		this.world = world;	
		// Set up the broadphase collision detection algorithm.	
		world.broadphase = new CANNON.SAPBroadphase(world);
		// Set gravity in the world.
		world.gravity.set(0, -10, 0);
		// Set the default contact material properties.
		world.defaultContactMaterial.friction = 0;
		// Define materials for ground and wheel.
		const groundMaterial = new CANNON.Material("groundMaterial");
		const wheelMaterial = new CANNON.Material("wheelMaterial");
		// Define contact material properties between wheel and ground.
		const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
			friction: 0.3,
			restitution: 0,
			contactEquationStiffness: 1000
		});

		// Add the contact material to the world.
		world.addContactMaterial(wheelGroundContactMaterial);
		// Define the shape and body for the chassis.
		const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.3, 2));
		const chassisBody = new CANNON.Body({ mass: mass });
		const pos = this.car.chassis.position.clone();
		pos.y += 3;
		chassisBody.addShape(chassisShape);
		chassisBody.position.copy(pos);
		chassisBody.angularVelocity.set(0, -10.4, 0);
		chassisBody.threemesh = this.car.chassis;
		// Create a follow camera object.		
		this.followCam = new THREE.Object3D();
		this.followCam.position.copy(this.camera.position);
		this.scene.add(this.followCam);
		this.followCam.parent = chassisBody.threemesh;

		// Define options for the wheels.
		const options = {
			// Radius of the wheel.
			radius: 0.3,
			// Local direction of the suspension.
			directionLocal: new CANNON.Vec3(0, -1, 0),
			// Stiffness of the suspension.
			suspensionStiffness: 45,
			// Rest length of the suspension.
			suspensionRestLength: 0.4,
			// Friction coefficient between the wheel and ground.
			frictionSlip: 5,
			// Relaxation damping of the suspension.
			dampingRelaxation: 2.3,
			// Compression damping of the suspension.
			dampingCompression: 4.5,
			// Maximum suspension force.
			maxSuspensionForce: 200000,
			// Influence of the wheel's roll on the vehicle's roll.
			rollInfluence:  0.01,
			// Local axle direction of the wheel.
			axleLocal: new CANNON.Vec3(-1, 0, 0),
			// Local connection point of the wheel to the chassis.
			chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
			// Maximum suspension travel.
			maxSuspensionTravel: 0.25,
			// Custom sliding rotational speed.
			customSlidingRotationalSpeed: -30,
			// Whether to use custom sliding rotational speed.
			useCustomSlidingRotationalSpeed: true
		};

		// Create the 'Raycast' vehicle
		const vehicle = new CANNON.RaycastVehicle({
			// The chassis body of the vehicle.
			chassisBody: chassisBody,
			// Index of the right axis.
			indexRightAxis: 0,
			// Index of the up axis.
			indexUpAxis: 1,
			// Index of the forward axis.
			indexForwardAxis: 2
		});

		// Define the width of the axle.
		const axlewidth = 0.7;
		// Set up the connection points for the wheels and add them to the Raycast vehicle.
		options.chassisConnectionPointLocal.set(axlewidth, 0, 1.5);
		vehicle.addWheel(options);
		options.chassisConnectionPointLocal.set(-axlewidth, 0, 1.5);
		vehicle.addWheel(options);
		options.chassisConnectionPointLocal.set(axlewidth, 0, -1);
		vehicle.addWheel(options);
		options.chassisConnectionPointLocal.set(-axlewidth, 0, -1);
		vehicle.addWheel(options);

		// Add the raycast vehicle to the world.
		vehicle.addToWorld(world);
		// Create wheel bodies for visualization.
		const wheelBodies = [];
		let index = 0;
		const wheels = [this.car.wheel];

		for(let i=0; i<3; i++){
			// Clone the wheel object.
			let wheel = this.car.wheel.clone();
			// Add the cloned wheel to the scene.
			this.scene.add(wheel);
			// Add the cloned wheel to the wheels array.
			wheels.push(wheel);
		}		

		vehicle.wheelInfos.forEach( function(wheel){
			// Create cylinder shape for the wheel.
			const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
			// Create a new body for the wheel.
			const wheelBody = new CANNON.Body({ mass: 1 });
			// Create a quaternion for rotation adjustment.
			const q = new CANNON.Quaternion();
			q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
			// Add the cylinder shape to the wheel body with rotation adjustment.
			wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
			// Push the wheel body to the wheelBodies array.
			wheelBodies.push(wheelBody);
			// Assign the cloned wheel to the wheel body's threemesh property.
			wheelBody.threemesh = wheels[index++];
		});
		// Assign the array of wheel bodies to the game's car wheels property.
		game.car.wheels = wheelBodies;

		// Update wheel positions and orientations in the world after physics simulation steps
		world.addEventListener('postStep', function(){
			// Update wheel positions and orientations.
			let index = 0;
			game.vehicle.wheelInfos.forEach(function(wheel){
				// Update wheel transform.
            	game.vehicle.updateWheelTransform(index);
                const t = wheel.worldTransform;
				// Copy position and quaternion to corresponding three.js mesh.
                wheelBodies[index].threemesh.position.copy(t.position);
                wheelBodies[index].threemesh.quaternion.copy(t.quaternion);
				index++; 
			});
		});	
		// Store the vehicle in the game object.
		this.vehicle = vehicle;	

		// Call 'createColliders' method to enable collision detection.	
		this.createColliders();		
		// Call 'createTriggerVolumes' method to enable trigger volume mechanisms.	
		this.createTriggerVolumes();
		// Call 'musicTrigger' method to enable in game music.	
		this.musicTrigger()
	}

	// Method to create colliders for collision detection based on the game assets.
	createColliders(){
		// Get the reference to the physics world.
		const world = this.world;
		// Define a scale adjustment factor.
		const scaleAdjust = 0.90;
		// Calculate the divisor for scaling.
		const divisor = 2 / scaleAdjust;
		// Capture the reference to 'this' in 'game'.
		const game = this; 
		// Iterate over each child in the game assets.
		this.assets.children.forEach(function(child){
			// Check if the child is a mesh and its name includes "Collider".
			if (child.isMesh && child.name.includes("Collider")){
				// Hide the collider mesh.
				child.visible = false;
				// Calculate half extents for the collider.
				const halfExtents = new CANNON.Vec3(child.scale.x/divisor, child.scale.y/divisor, child.scale.z/divisor);
				// Create a box shape for the collider.
				const box = new CANNON.Box(halfExtents);
				// Create a rigid body for the collider.
				const body = new CANNON.Body({mass:0});
				// Add the box shape to the body.
				body.addShape(box);
				// Set the position of the body.
				body.position.copy(child.position);
				// Set the orientation of the body.
				body.quaternion.copy(child.quaternion);
				// Add the collider body to the physics world.
				world.add(body);

				// Event listener to detect collisions with the collider.
				body.addEventListener('collide', function(event) {
					// Check if the collided body is the player's vehicle.
					if (event.body === game.vehicle.chassisBody) {
						// Check if the lap count has already been incremented for this collision
						if (!event.collidedWithTrigger) { 
							// Play collision sound effect.
							game.sfx.crash.play();						
						}
					}	
				});		
			}
		});
	}

	// Method to create trigger volumes for lap counting and lap-related events based on the game assets.
	createTriggerVolumes() {
		// Get the reference to the physics world.
		const world = this.world;
		// Define a scale adjustment factor.
		const scaleAdjust = 0.90;
		// Calculate the divisor for scaling.
		const divisor = 2 / scaleAdjust;
		// Capture the reference to 'this' in 'game'.
		const game = this; 	
		// Iterate over each child in the game assets.
		this.assets.children.forEach(function(child){
			// Check if the child is a mesh and its name includes "LapCounter".
			if (child.isMesh && child.name.includes("LapCounter")){
				// Hide the trigger volume mesh.
				child.visible = false;
				// Calculate half extents for the trigger volume.
				const halfExtents = new CANNON.Vec3(child.scale.x/divisor, child.scale.y/divisor, child.scale.z/divisor);
				// Create a box shape for the trigger volume.
				const box = new CANNON.Box(halfExtents);
				// Create a rigid body for the trigger volume.
				const body = new CANNON.Body({ mass: 0 });
				// Add the box shape to the body.
				body.addShape(box);
				// Set the position of the body.
				body.position.copy(child.position);
				// Set the orientation of the body.
				body.quaternion.copy(child.quaternion);
				// Disable collision response with other objects.
				body.collisionResponse = false;
				// Set as a trigger volume.
				body.isTrigger = true;
				// Add the trigger volume body to the physics world.
				world.add(body);				
	
				// Event listener to detect collisions with the trigger volume.
				body.addEventListener('collide', function(event) {
					// Check if the collided body is the player's vehicle.
					if (event.body === game.vehicle.chassisBody) {
						// Check if the lap count has already been incremented for this collision.
						if (!event.collidedWithTrigger) { 
							// Increment lap counter.
							game.lapCount++;
							console.log("Lap: " + game.lapCount);
							// If the lap count reaches execute the code within the IF statement.
							if (game.lapCount === 3) {
								// Stop the overdrive music.
								game.sfx.overdrive.stop();
								// Play the victory sound effect.
								game.sfx.victory.play();	
							}	
							// Send a cookie to the browser with the value of lapCount, set to expire 1 hour from creation + SameSite=None attribute.
                        	// This attribute indicates that the cookie can be sent in cross-site requests.
							document.cookie = `lapCount=${game.lapCount}; expires=${new Date(Date.now() + 3600000).toUTCString()}; path=/; SameSite=None; Secure`;
	
							// Mark this collision as processed to prevent double counting.
							event.collidedWithTrigger = true;
	
							// Set a timeout to reset the flag after 10 seconds.
							setTimeout(function() {
								event.collidedWithTrigger = false;
								// 10000 milliseconds = 10 seconds
							}, 10000);
						}
					}	
				});
			}
		});
	}

	// Method to trigger game music.
	musicTrigger() {
		// Get the reference to the physics world.
		const world = this.world;
		// Define a scale adjustment factor.
		const scaleAdjust = 0.90;
		// Calculate the divisor for scaling.
		const divisor = 2 / scaleAdjust;
		// Capture the reference to 'this' in 'game'.
		const game = this; 	
		// Iterate over each child in the game assets.
		this.assets.children.forEach(function(child){
			// Check if the child is a mesh and its name includes "Music".
			if (child.isMesh && child.name.includes("Music")){
				// Hide the music trigger volume.
				child.visible = false;
				// Calculate half extents for the music trigger volume.
				const halfExtents = new CANNON.Vec3(child.scale.x/divisor, child.scale.y/divisor, child.scale.z/divisor);
				// Create a box shape for the music trigger volume.
				const box = new CANNON.Box(halfExtents);
				// Create a rigid body for the music trigger volume.
				const body = new CANNON.Body({ mass: 0 });
				// Add the box shape to the body.
				body.addShape(box);
				// Set the position of the body.
				body.position.copy(child.position);
				// Set the orientation of the body.
				body.quaternion.copy(child.quaternion);
				// Disable collision response with other objects.
				body.collisionResponse = false;
				// Set as trigger volume.
				body.isTrigger = true;
				// Add the music trigger volume body to the physics world.
				world.add(body);				
	
				// Event listener to detect collisions with the music trigger volume.
				body.addEventListener('collide', function(event) {
					// Check if the collided body is the player's vehicle.
					if (event.body === game.vehicle.chassisBody) {
						// Check if the collision event hasn't been processed yet.
						if (!event.collidedWithTrigger) { 
							// Play the overdrive music.
							game.sfx.overdrive.play();	
							// Mark the collision as processed to prevent double counting.
							event.collidedWithMusicTrigger = true;
						}
					}	
				});
			}
		});
	}
	
	// Method to handle double-click events.
	handleDoubleClick(event) {
		// Prevent the default action for double clicks.
		event.preventDefault();	
		// Call the resetCar function when a double click is detected.
		this.resetCar();
	}
	
	// Method to handle touch start events.
	handleTouchStart(event) {
		// Check if the touch event is a double tap.
		const currentTime = new Date().getTime();
		const tapLength = currentTime - this.lastTapTime;
		clearTimeout(this.tapTimer);	
		// If the time between taps is less than 500 milliseconds and greater than 0, its classed as a double tap, execute the code in the IF statement.
		if (tapLength < 500 && tapLength > 0) {
			// Double tap detected, prevent the default action for double clicks/taps.
			event.preventDefault();	
			// Calls the resetCar function.
			this.resetCar();
		}	
		// Update the last tap time with the current time.
		this.lastTapTime = currentTime;	
		// Set a timer to clear the last tap time after 500 ms.
		this.tapTimer = setTimeout(() => {
			this.lastTapTime = 0;
		}, 500);
	}

	// Method to reset the raycast vehicle to the nearest checkpoint.
	resetCar(){
		// Check if the vehicle is initialised.
		if (this.vehicle) {
			let checkpoint;
			// Initial large distance value.
			let distance = 10000000000;
			// Get the position of the vehicle.
			const carPos = this.vehicle.chassisBody.position;
			// Iterate through each checkpoint to find the nearest one to the vehicle.
			this.checkpoints.forEach(function(obj){
				// Clone the position of the checkpoint.
				const pos = obj.position.clone();
				// Set the y-coordinate to match the vehicle's y-coordinate.
				pos.y = carPos.y;
				// Calculate the distance between the checkpoint and the vehicle.
				const dist = pos.distanceTo(carPos);
				// Update the nearest checkpoint and distance if the current checkpoint is closer.
				if (dist<distance){
					checkpoint = obj;
					distance = dist;
				}
			});
			// Set the position of the vehicle to match the nearest checkpoint.
			this.vehicle.chassisBody.position.copy(checkpoint.position);
			// Set the orientation of the vehicle to match the nearest checkpoint.
			this.vehicle.chassisBody.quaternion.copy(checkpoint.quaternion);
			// Reset the velocity of the vehicle to zero.
			this.vehicle.chassisBody.velocity.set(0,0,0);
			// Reset the angular velocity of the vehicle to zero.
			this.vehicle.chassisBody.angularVelocity.set(0,0,0);
		} else {
			// Log an error if the vehicle is not initialised.
			console.error("Vehicle is not initialized")
		}
		// Play a skid sound effect.
		this.sfx.skid.play();
	}
	
	// Method to update the forward and turn values based on joystick input.
	joystickCallback( forward, turn ){
		// Update the forward value based on joystick input.		
		this.js.forward = forward;
		// Update the turn values based on joystick input, inverting the turn value to match the control scheme.
		this.js.turn = -turn;
	}

	// Method to handle keyboard 'keydown' events.
	onKeyDown(event) {
		// Switch statement to handle 'keydown' events.
		switch (event.key.toLowerCase()) {
		// If 'w' key is pressed, set forward movement to '-1'
		case 'w':
			this.keyboardControls.forward = -1;
			break;
		// If 's' key is pressed, set forward movement to '1'.
		case 's':
			this.keyboardControls.forward = 1;
			break;
		// If 'a' key is pressed, set turn movement to left '0.5'
		case 'a':
			this.keyboardControls.turn = 0.5;
			break;
		 // If 'd' key is pressed, set turn movement to right '-0.5'
		case 'd':
			this.keyboardControls.turn = -0.5;
			break;
		// Default case: do nothing.
		default:
			break;
		}
	}
	
	// Method to handle keyboard 'keyup' events.
	onKeyUp(event) {
		// Switch statement to handle 'keyup' events.
		switch (event.key.toLowerCase()) {
		// If 'w' or 's' keys are released, set forward movement to '0'.
		case 'w':
		case 's':
			this.keyboardControls.forward = 0;
			break;
		// If 'a' or 'd' keys are released, set turn movement to '0'.
		case 'a':
		case 'd':
			this.keyboardControls.turn = 0;
			break;
		 // Default case: do nothing.
		default:
			break;
		}
	}
		
	// Method to update the vehicle's drive based on keyboard and joystick inputs.
	updateDrive() {
		// Retrieve keyboard forward input.
		const keyboardForward = this.keyboardControls.forward;
		// Retrieve keyboard turn input.
		const keyboardTurn = this.keyboardControls.turn;	
		// Retrieve joystick forward input.
		const joystickForward = this.js.forward;
		// Retrieve joystick turn input.
		const joystickTurn = this.js.turn;	
		// Adjust engine sound volume based on input intensity.
		this.sfx.engine.volume = Math.abs(keyboardForward, joystickForward) * 0.1;
		// Set maximum steering value.
		const maxSteerVal = 1;
		// Set maximum force.
		const maxForce = 1000;
		// Set brake force.
		const brakeForce = 2;	

		// Combine keyboard and joystick inputs for forward.
		const combinedForward = joystickForward !== 0 ? joystickForward : keyboardForward;
		// Combine keyboard and joystick inputs for turn.
		const combinedTurn = joystickTurn !== 0 ? joystickTurn : keyboardTurn;	
		// Calculate force based on combined inputs.
		const force = maxForce * combinedForward;
		// Calculate steer based on combined inputs.
		const steer = maxSteerVal * combinedTurn;
		
		// IF no forward input is detected execute the code within the if statement.
		if (combinedForward !== 0) {
			// Apply brake to wheel 0.
			this.vehicle.setBrake(0, 0);
			// Apply brake to wheel 1.
			this.vehicle.setBrake(0, 1);
			// Apply brake to wheel 2.
			this.vehicle.setBrake(0, 2);
			// Apply brake to wheel 3.
			this.vehicle.setBrake(0, 3);			
		} 
		else {
			// Apply 'brakeForce' to wheel 0.
			this.vehicle.setBrake(brakeForce, 0);
			// Apply 'brakeForce' to wheel 1.
			this.vehicle.setBrake(brakeForce, 1);
			// Apply 'brakeForce' to wheel 2.
			this.vehicle.setBrake(brakeForce, 2);
			// Apply 'brakeForce' to wheel 3.
			this.vehicle.setBrake(brakeForce, 3);
		}	
		// Set steering value and apply it to wheel 0.
		this.vehicle.setSteeringValue(steer, 0);
		// Set steering value and apply it to wheel 1.
		this.vehicle.setSteeringValue(steer, 1);
		// Set engine force and apply it to wheel 0.
		this.vehicle.applyEngineForce(force, 0);
		// Set engine force and apply it to wheel 1.
		this.vehicle.applyEngineForce(force, 1);
	}	
	
	// Method to adjust the camera aspect ratio and update the renderer size when the window is resized, function is triggered when the window is resized.
	onWindowResize() {
		// Update the camera aspect ratio to match the new window dimensions.
		this.camera.aspect = window.innerWidth / window.innerHeight;
		// Update the camera's projection matrix to reflect the changes in aspect ratio.
		this.camera.updateProjectionMatrix();
		// Resize the renderer to match the new window size.
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

	// Method to update the camera position to follow the car.
	updateCamera() {
		// Return if the followCam is not defined.
		if (this.followCam === undefined) return;	
		// Set the target position slightly behind and above the car.
		const targetPosition = this.car.chassis.position.clone();
		// Vertical offset from the car.
		const yOffset = 5;
		// Vertical position.
		targetPosition.y += yOffset; 
		// Distance behind the car.
		const distanceBehind = 15; 
		const direction = this.car.chassis.getWorldDirection(new THREE.Vector3()).multiplyScalar(-distanceBehind);
		targetPosition.add(direction);	
		// Apply smoothing by interpolating between current and target positions.
		const smoothingFactor = 0.1;
		this.camera.position.lerp(targetPosition, smoothingFactor);	
		// Make the camera focus on the car's position.
		this.camera.lookAt(this.car.chassis.position);	
		// Update sun position if available.
		if (this.sun !== undefined) {
			this.sun.position.copy(this.camera.position);
			this.sun.position.y += 10;
		}
	}	

	// Method to retrieve assets by their name from the loaded assets.
	getAssetsByName(name){
		// Return if assets are undefined.
		if (this.assets==undefined) return;		
		// Split the name by periods to traverse nested object names.
		const names = name.split('.');
		// Initialise assets with the loaded assets.
		let assets = this.assets;		
		// Iterate through each name segment.
		names.forEach(function(name){
			// Check if assets are not undefined.
			if (assets!==undefined){
				// Find the child asset with the current name.
				assets = assets.children.find(function(child){ return child.name==name; });
			}
		});		
		// Return the found asset.
		return assets;
	}
						
	// Method for animating the scene and updating the game state.
	animate() {
		// Store reference to 'this' in 'game' variable.
		const game = this;		
		// Request next animation frame and recursively call animate method.
		requestAnimationFrame( function(){ game.animate(); } );		
		// Calculate delta time (dt) for smooth animation.
		const now = Date.now();
		if (this.lastTime===undefined) this.lastTime = now;
		const dt = (Date.now() - this.lastTime)/1000.0;
		// Store delta time as FPS factor.
		this.FPSFactor = dt;
		// Update last time.
		this.lastTime = now;	
		// If physics world exists, update physics and objects.	
		if (this.world!==undefined){
			// Update vehicle controls.
			this.updateDrive();			
			// Step physics simulation.
			this.world.step(this.fixedTimeStep, dt, 10);
			// Update Three.js objects based on physics simulation.
			this.world.bodies.forEach( function(body){
				if ( body.threemesh != undefined){
					// Update position of Three.js mesh.
					body.threemesh.position.copy(body.position);
					// Update orientation of Three.js mesh.
					body.threemesh.quaternion.copy(body.quaternion);
					// Adjust vehicle chassis position to account for suspension.
					if (body==game.vehicle.chassisBody){
						const elements = body.threemesh.matrix.elements;
						const yAxis = new THREE.Vector3(elements[4], elements[5], elements[6]);
						body.threemesh.position.sub(yAxis.multiplyScalar(0.6));
					}
				}
			});	
		}		
		// Update camera position and orientation.
		this.updateCamera();			
		// Render the scene.
		this.renderer.render( this.scene, this.camera );		
	}

	render() {
		return (
			<div>
				{/* Render the lap timer. */}
				<Timer />
			</div>
		)
	}
}
// Export the ThreeGame component as the default export.
export default ThreeGame;