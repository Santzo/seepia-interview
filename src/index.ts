import './style.css';
import * as THREE from 'three';
import * as PIXI from 'pixi.js';

import Loader from './assets/components/Loader';
import Player, { PlayerAnimations } from './assets/components/Player';

import { Texture, Mesh } from 'three';

const ninjaModel = require('./assets/models/cibus_ninja.glb');
const ninjaTexture = require('./assets/images/ninja.png');

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

const light = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(light);
const light3 = new THREE.DirectionalLight(0xffffff, 1.45);
scene.add(light3);

const material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });
const box = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(box, material);
scene.add(cube);

const clock = new THREE.Clock();
var player: Player;



window.onresize = () => renderer.setSize(window.innerWidth * 0.975, window.innerHeight * 0.95);

renderer.setSize(window.innerWidth * 0.975, window.innerHeight * 0.95);
const canvasHolder = document.querySelector('.canvas-holder');
canvasHolder.appendChild(renderer.domElement);
const axis = new THREE.AxesHelper(-10);
scene.add(axis);

const InitializePlayer = async (): Promise<void> => {
  const model = await Loader.LoadModel(ninjaModel.default);
  const texture: Texture = await Loader.LoadTexture(ninjaTexture.default);
  player = new Player(model.scene, model.animations, new THREE.AnimationMixer(model.scene));
  Loader.ApplyMaterialToGroup(player.model, texture);

  document.addEventListener('keydown', player.handleKeyPress);
  document.addEventListener('keyup', player.handleKeyPress);
  scene.add(player.model);
}


camera.position.x = -12;
camera.position.y = 1;
camera.position.z = 0;




const render = (): void => {
  requestAnimationFrame(render);
  const deltaTime = clock.getDelta();
  if (player) {
    player.mixer.update(deltaTime);
    player.handleMovement(deltaTime);
  }
  cube.rotateY(deltaTime);
  cube.rotateX(deltaTime);
  renderer.render(scene, camera);
}

const StartGame = async (): Promise<void> => {
  await InitializePlayer();
  camera.lookAt(player.model.position);
  render();
}

StartGame();
