import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Dispose texture
export const disposeTexture = (texture: THREE.Texture): void => {
  texture?.dispose();
};

// Dispose material
export const disposeMaterial = (material: THREE.Material | THREE.Material[]): void => {
  if (!material) return;

  let materialArr: THREE.Material[] = [];

  if (Array.isArray(material)) {
    materialArr = material;
  } else {
    materialArr[0] = material;
  }

  // Iterate all materials and their props
  for (const el of materialArr) {
    for (const [key, val] of Object.entries(el)) {
      // Filter out map props only
      if ((!key.endsWith('Map') && !key.endsWith('map')) || !val) continue;

      disposeTexture(val as THREE.Texture);
    }

    el.dispose();
  }
};

// Dispose object
export const disposeObject = (object: THREE.Object3D | null): void => {
  if (!object) return;

  object.removeFromParent();

  object.traverse((child) => {
    if ((<THREE.Mesh>child).isMesh) {
      const { geometry, material } = child as THREE.Mesh;

      geometry?.dispose();
      disposeMaterial(material);
    }
  });
};

const LOADING_MANAGER = new THREE.LoadingManager();
const RGBE_LOADER = new RGBELoader(LOADING_MANAGER);
const EXR_LOADER = new EXRLoader(LOADING_MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);

// Get hdr loader by give extension
export const getHDRLoader = (ext: string) => {
  switch (ext) {
    case 'hdr':
      return RGBE_LOADER;
    case 'exr':
      return EXR_LOADER;
    default:
      return TEXTURE_LOADER;
  }
};

// Load texture
export const loadTexture = async (src: string): Promise<THREE.Texture> => {
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(src);

  return texture;
};

// Load env map
export const loadEnvMap = async (
  src: string,
  renderer: THREE.WebGLRenderer,
): Promise<THREE.Texture | null> => {
  const ext = src.split('.').pop();

  if (!ext) return null;

  const loader = getHDRLoader(ext);
  const texture = await loader.loadAsync(src);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.rotation = 1;

  const gen = new THREE.PMREMGenerator(renderer);
  gen.compileEquirectangularShader();
  const envMap = gen.fromEquirectangular(texture);
  gen.dispose();

  return envMap.texture;
};
