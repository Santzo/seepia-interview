import './style.css';
import * as THREE from 'three';
import * as PIXI from 'pixi.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const axis = new THREE.AxesHelper(10);

scene.add(axis);

const light = new THREE.DirectionalLight(0xffffff, 1.0);

light.position.set(100, 100, 100);

scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

light2.position.set(-100, 100, -100);

scene.add(light2);

const material = new THREE.MeshBasicMaterial({
  color: 'rgb(255,0,125)',
  wireframe: true,
});

// create a box and add it to the scene
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), material);

scene.add(box);

box.position.x = 0.5;
box.rotation.y = 0.5;

camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

camera.lookAt(scene.position);

function animate(): void {
  requestAnimationFrame(animate);
  render();
}

function render(): void {
  const timer = 0.002 * Date.now();
  box.position.y = 0.5 + 0.5 * Math.sin(timer);
  box.rotation.x += 0.1;
  renderer.render(scene, camera);
}

animate();
