import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Dispose texture
export function disposeTexture(texture: THREE.Texture): void {
  texture?.dispose();
}

// Dispose material
export function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
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
}

// Dispose object
export function disposeObject(object: THREE.Object3D | null): void {
  if (!object) return;

  object.removeFromParent();

  object.traverse((child) => {
    if ((<THREE.Mesh>child).isMesh) {
      const { geometry, material } = child as THREE.Mesh;

      geometry?.dispose();
      disposeMaterial(material);
    }
  });
}

const LOADING_MANAGER = new THREE.LoadingManager();
const RGBE_LOADER = new RGBELoader(LOADING_MANAGER);
const EXR_LOADER = new EXRLoader(LOADING_MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);

// Get hdr loader by give extension
export function getHDRLoader(ext: string) {
  switch (ext) {
    case 'hdr':
      return RGBE_LOADER;
    case 'exr':
      return EXR_LOADER;
    default:
      return TEXTURE_LOADER;
  }
}

// Load texture
export async function loadTexture(src: string): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(src);

  return texture;
}

// Load env map
export async function loadEnvMap(
  src: string,
  renderer: THREE.WebGLRenderer,
): Promise<THREE.Texture | null> {
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
}

// Calculate total length of vector3 points
export function calculateTotalLength(arr: THREE.Vector3[]): number {
  let totalLength = 0;

  // Iterate through each vector in the array
  for (let i = 0; i < arr.length - 1; i++) {
    const currentVector = arr[i];
    const nextVector = arr[i + 1];

    // Calculate the distance between currentVector and nextVector
    const distance = currentVector.distanceTo(nextVector);

    // Add the distance to the total length
    totalLength += distance;
  }

  return totalLength;
}

// Function to calculate solar radiation based on time and location
export function calculateSolarRadiation(seconds: number, latitude: number): number {
  // Convert seconds to hours
  const hour = seconds / (60 * 60);

  // Calculate solar declination angle
  const declinationAngle = 23.45 * Math.sin((2 * Math.PI * (284 + hour)) / 365);

  // Calculate hour angle
  const hourAngle = (hour - 12) * 15;

  // Calculate solar elevation angle
  const solarElevationAngle = Math.asin(
    Math.sin((latitude * Math.PI) / 180) * Math.sin((declinationAngle * Math.PI) / 180) +
      Math.cos((latitude * Math.PI) / 180) *
        Math.cos((declinationAngle * Math.PI) / 180) *
        Math.cos((hourAngle * Math.PI) / 180),
  );

  // Calculate extraterrestrial radiation
  const extraterrestrialRadiation = 1367 * (1 + 0.033 * Math.cos((2 * Math.PI * hour) / 365));

  // Calculate clear sky solar radiation
  const clearSkyRadiation = extraterrestrialRadiation * (0.7 + 0.00001 * 10);

  // Calculate solar radiation on horizontal surface
  const solarRadiationHorizontal = clearSkyRadiation * Math.max(0, Math.sin(solarElevationAngle));

  // Convert solar radiation to Joules per square meter
  return solarRadiationHorizontal;
}

// Format seconds
export function formatSeconds(sec: number): string {
  const hours = Math.floor(sec / (60 * 60));
  const minutes = Math.floor((sec % (60 * 60)) / 60);
  const seconds = Math.floor(sec % 60); // Calculate remaining seconds

  // Format the result
  const formattedHours = hours < 10 ? '0' + hours : hours; // Add leading zero if hours is less than 10
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero if minutes is less than 10
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds; // Add leading zero if seconds is less than 10

  // Return the result in "hh:mm:ss" format
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Heatmap color by temperature value
export function getHeatmapColor(temperature: number) {
  // Ensure value is within the range of 0 to 100
  temperature = Math.max(0, Math.min(100, temperature));

  // Convert temperature to a position between 0 and 1 in the gradient
  let normalizedValue = temperature / 100;

  let red, green, blue;

  if (normalizedValue <= 0.5) {
    // Blue to green
    red = 0;
    green = Math.floor(255 * (2 * normalizedValue));
    blue = Math.floor(255 * (1 - 2 * normalizedValue));
  } else {
    // Green to yellow to red
    red = Math.floor(255 * (2 * normalizedValue - 1));
    green = Math.floor(255 * (2 - 2 * normalizedValue));
    blue = 0;
  }

  // Convert RGB values to hexadecimal format
  let hexRed = red.toString(16).padStart(2, '0');
  let hexGreen = green.toString(16).padStart(2, '0');
  let hexBlue = blue.toString(16).padStart(2, '0');

  // Concatenate and return the hexadecimal color
  return '#' + hexRed + hexGreen + hexBlue;
}
