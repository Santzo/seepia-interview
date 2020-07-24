import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';


export default class Loader {

    static LoadModel = (address: string): Promise<GLTF> => {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(address, data => resolve(data), null, reject);
        })
    }
    static LoadTexture = (address: string): Promise<THREE.Texture> => {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(address, data => resolve(data), null, reject);
        })
    }
    static ApplyMaterialToGroup = (model: THREE.Group, texture: THREE.Texture, skinning = true): void => {
        model.traverse(m => {
            if (m instanceof THREE.Mesh) m.material = new THREE.MeshLambertMaterial({ map: texture, skinning: skinning });
        });
    }
};
