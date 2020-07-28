import './style.css';
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import Player from './assets/components/Player';
import Loader from './assets/components/Loader';
import Background from './assets/components/Background';
import UI from './assets/components/UI';
import Events, { CollectibleArgs } from './Events';
import Platform from './assets/components/levelobjects/Platform';
import Collider from './assets/components/collisions/Collider';
import CollisionHandler from './assets/components/collisions/CollisionHandler';
import Collectible from './assets/components/levelobjects/Collectible';

const extensions = require('./Extensions.ts');
const ninjaModel = require('./assets/models/cibus_ninja.glb');
const ninjaTexture = require('./assets/images/ninja.png');
const bgImage = require('./assets/images/background.jpg');

const scene = new THREE.Scene();
// Decided on an orthographic camera since movement is handled in two dimensions only.
// const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// Set pixel ratio of the renderer to avoid stretching
renderer.setPixelRatio(window.devicePixelRatio);

// Set lighting 
const light = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(light);
const light2 = new THREE.DirectionalLight(0xffffff, 1.45);
scene.add(light2);




const clock = new THREE.Clock();
var player: Player; var background: Background; var ui: UI;
var backgroundPixi: PIXI.Application; var uiPixi: PIXI.Application;
var collectibles: Collectible[];
var width = window.innerWidth * 0.975;
var height = width * 0.5625 * 0.875;

renderer.setSize(width, height);
const canvasHolder = document.querySelector('.canvas-holder');

// Force a 16:9 ratio on window resize to avoid stretching
window.onresize = () => {
  width = window.innerWidth * 0.975;
  height = width * 0.5625 * 0.875;
  renderer.setSize(width, height);
  background.recalculateGameArea(width, height);

  backgroundPixi.view.width = uiPixi.view.width = width;
  backgroundPixi.view.height = uiPixi.view.height = height;
  backgroundPixi.renderer.resolution = uiPixi.renderer.resolution = width / screen.width;
}

// Initialize player by loading the model, textures and an instance of the player class. Also 
// set events for keypresses and finally add the model to the scene. 
const InitializePlayer = async (): Promise<void> => {
  const model = await Loader.LoadModel(ninjaModel.default);
  const texture: THREE.Texture = await Loader.LoadTexture(ninjaTexture.default);
  player = new Player(model);
  Loader.ApplyMaterialToGroup(player.model, texture);

  document.addEventListener('keydown', player.handleKeyPress);
  document.addEventListener('keyup', player.handleKeyPress);
  scene.add(player.model);
}

const InitializePlatforms = async (): Promise<void> => {
  const platforms: Platform[] = new Array();
  platforms.push(new Platform(0, -2.5, 6, 1));
  platforms.push(new Platform(8, -8, 8, 1));
  platforms.push(new Platform(0, 5, 5, 1));
  platforms.push(new Platform(5, -12, 20, 1));
  platforms.push(new Platform(20, -8.5, 9, 1));
  platforms.push(new Platform(20, -41.5, 6, 1));
  platforms.push(new Platform(-8, -50, 100, 10, 0xaaff0b));
  platforms.push(new Platform(-6, -42, 4, 1));
  platforms.push(new Platform(-2, -37.5, 6, 1));
  platforms.push(new Platform(5, -33, 16, 1));
  platforms.forEach(platform => {
    scene.add(platform.mesh);
    const collider = new Collider('Platform', platform);
    CollisionHandler.addCollider(collider);
  });
}

const InitializeCollectibles = async (): Promise<void> => {
  collectibles = new Array();
  collectibles.push(new Collectible(-3, 0));
  collectibles.push(new Collectible(0, 0));
  collectibles.push(new Collectible(5.5, -5.5));
  collectibles.push(new Collectible(20, -6.5));
  collectibles.push(new Collectible(-10, 44));
  collectibles.push(new Collectible(18.5, -6.5));
  collectibles.push(new Collectible(-2, -10));
  collectibles.push(new Collectible(0, -31.5));
  collectibles.push(new Collectible(5, -31.5));
  collectibles.push(new Collectible(10, -31.5));
  collectibles.forEach(collectible => {
    scene.add(collectible.mesh);
    const collider = new Collider('Collectible', collectible);
    CollisionHandler.addCollider(collider);
  });
}

// Initialize both background and UI with Pixi. Both are handled on separate layers
// to ensure that the UI is always on top of everything and the background at the bottom.
const InitializeBackgroundAndUI = async (): Promise<void> => {
  background = new Background(backgroundPixi, player.model.position.z, width, height, bgImage.default);
  ui = new UI(uiPixi, player, width, height);
  SetCanvasZIndex(ui.app.view, 5);
  SetCanvasZIndex(background.app.view, -1);
}

// Initialize PIXI Apps
const InitPixiAPP = () => {
  backgroundPixi = new PIXI.Application({
    width: width,
    height: height,
  });
  uiPixi = new PIXI.Application({
    width: width,
    height: height,
    transparent: true
  });
  backgroundPixi.renderer.resolution = uiPixi.renderer.resolution = width / screen.width;
}

// Function to set the Z-index of different canvases.
const SetCanvasZIndex = (element: HTMLCanvasElement, index: number) => {
  canvasHolder.appendChild(element);
  element.style.position = 'absolute';
  element.style.zIndex = index.toString();
}

// The render method that runs on every frame
const render = (): void => {
  requestAnimationFrame(render);
  const deltaTime = clock.getDelta();
  if (player) {
    player.mixer.update(deltaTime);
    player.handleMovement(deltaTime, camera.position);
  }
  const rotateSpeed = deltaTime * 2.5;
  collectibles.forEach(collectible => {
    collectible.mesh.rotateY(rotateSpeed);
  });

  renderer.render(scene, camera);
}
const destroyCollectible = (args: CollectibleArgs) => {
  scene.remove(args.collectible.mesh);
  const index = collectibles.findIndex(col => col == args.collectible)
  collectibles.splice(index, 1);
  CollisionHandler.removeCollider(args.collectible);
}
// Start Application

const StartGame = async (): Promise<void> => {
  SetCanvasZIndex(renderer.domElement, 1);
  await InitializePlayer();
  await InitializeBackgroundAndUI();
  await InitializePlatforms();
  await InitializeCollectibles();
  Events.addListener('onCollectCollectible', destroyCollectible)
  camera.position.x = -12;
  camera.position.y = -1.8;
  camera.position.z = player.model.position.z;
  camera.lookAt(player.model.position);
  render();
}



InitPixiAPP();
StartGame();
export { camera };
