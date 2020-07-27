import './style.css';
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import Player from './assets/components/Player';
import Loader from './assets/components/Loader';
import Background from './assets/components/Background';
import UI from './assets/components/UI';
import Events from './Events';

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

const material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });
const box = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(box, material);
scene.add(cube);

const clock = new THREE.Clock();
var player: Player; var background: Background; var ui: UI;
var backgroundPixi: PIXI.Application; var uiPixi: PIXI.Application;
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

// Initialize both background and UI with Pixi. Both are handled on separate layers
// to ensure that the UI is always on top of everything and the background at the bottom.
const InitializeBackgroundAndUI = async (): Promise<void> => {
  background = new Background(backgroundPixi, width, height, bgImage.default);
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
    player.handleMovement(deltaTime, camera.position.z);
  }
  cube.rotateY(deltaTime);
  cube.rotateX(deltaTime);
  renderer.render(scene, camera);
}

// Start Application

const StartGame = async (): Promise<void> => {
  SetCanvasZIndex(renderer.domElement, 1);
  await InitializePlayer();
  await InitializeBackgroundAndUI();
  camera.lookAt(player.model.position);
  render();
}

camera.position.x = -12;
camera.position.y = 1;
camera.position.z = 0;

InitPixiAPP();
StartGame();
export { camera };
