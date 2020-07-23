import { TextureLoader, Texture } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';


export default class Player {

    static LoadPlayerModel = (): Promise<THREE.Group> => {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('/src/assets/models/cibus_ninja.glb', data => resolve(data.scene), null, reject);
        })
    }
    static LoadPlayerTexture = (): Promise<Texture> => {
        return new Promise((resolve, reject) => {
            const loader = new TextureLoader();
            loader.load('/src/assets/images/ninja.png', data => resolve(data), null, reject);
        })
    }
};
