import GUI from "lil-gui";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

/**
 * Debug
 */
const parameters = {
  ambientLightIntensity: 0.9,
  ambientLightColor: 0xffffff,
  directionalLightIntensity: 1.3,
  directionalLightColor: 0xffffff,
  ballMetalness: 0.1,
  ballRoughness: 0.3,
  ballColor: 0xff7575,
  ballRadius: 0.05,
  ballCount: 75,
  ballSeparation: 0.01,
  amplitude: 2,
  speedFalloff: 4
};

const gui = new GUI({ width: 340 });
const lightsFolder = gui.addFolder("Lights");
const ambientLightFolder = lightsFolder.addFolder("Ambient");
const directionalLightFolder = lightsFolder.addFolder("Directional");
const ballsFolder = gui.addFolder("Objects");
const animationFolder = gui.addFolder("Animation");

animationFolder.add(parameters, "amplitude").min(1).max(10).step(0.001);
animationFolder.add(parameters, "speedFalloff").min(1).max(10).step(0.001);

/**
 * Base
 */
const canvas = document.getElementById("three") as HTMLCanvasElement;
const scene = new three.Scene();

/**
 * Sizes
 */
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth
};

document.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Lights
 */
// Ambient
const ambientLight = new three.AmbientLight(
  parameters.ambientLightColor,
  parameters.ambientLightIntensity
);
scene.add(ambientLight);

ambientLightFolder
  .addColor(parameters, "ambientLightColor")
  .name("color")
  .onChange((c: number | string) => {
    ambientLight.color.set(c);
  });
ambientLightFolder
  .add(parameters, "ambientLightIntensity")
  .min(0)
  .max(2)
  .step(0.01)
  .name("intensity")
  .onChange((v: number) => {
    ambientLight.intensity = v;
  });

// Directional
const directionalLight = new three.DirectionalLight(
  parameters.directionalLightColor,
  parameters.directionalLightIntensity
);
directionalLight.position.set(5, 2, 3);
scene.add(directionalLight);

directionalLightFolder
  .addColor(parameters, "directionalLightColor")
  .name("color")
  .onChange((c: number | string) => {
    directionalLight.color.set(c);
  });
directionalLightFolder
  .add(parameters, "directionalLightIntensity")
  .min(0)
  .max(2)
  .step(0.01)
  .name("intensity")
  .onChange((v: number) => {
    directionalLight.intensity = v;
  });

/**
 * Objects
 */
const ballGeometry = new three.SphereGeometry(1);
const ballMaterial = new three.MeshStandardMaterial({
  color: parameters.ballColor,
  metalness: parameters.ballMetalness,
  roughness: parameters.ballRoughness
});

const balls: three.Mesh[] = [];
const ballsGroup = new three.Group();
scene.add(ballsGroup);

const generateBalls = () => {
  if (balls.length) {
    ballsGroup.remove(...balls);
    balls.splice(0, balls.length);
  }

  const totalHeight =
    parameters.ballRadius * 2 * parameters.ballCount +
    parameters.ballSeparation * (parameters.ballCount - 1);

  for (let i = 0; i < parameters.ballCount; i++) {
    const sphere = new three.Mesh(ballGeometry, ballMaterial);
    sphere.scale.setScalar(parameters.ballRadius);
    sphere.position.y =
      totalHeight / 2 - i * (parameters.ballRadius * 2 + parameters.ballSeparation);
    ballsGroup.add(sphere);
    balls.push(sphere);
  }
};

generateBalls();

ballsFolder
  .add(parameters, "ballCount")
  .min(1)
  .max(200)
  .step(1)
  .name("count")
  .onFinishChange(generateBalls);

ballsFolder
  .add(parameters, "ballRadius")
  .min(0)
  .max(1)
  .step(0.001)
  .name("radius")
  .onChange((v: number) => {
    const totalHeight =
      v * 2 * parameters.ballCount + parameters.ballSeparation * (parameters.ballCount - 1);
    balls.forEach((ball, idx) => {
      // Update scale
      ball.scale.setScalar(v);
      // Update position
      ball.position.y = totalHeight / 2 - idx * (v * 2 + parameters.ballSeparation);
    });
  });

ballsFolder
  .add(parameters, "ballSeparation")
  .min(0)
  .max(1)
  .step(0.001)
  .name("separation")
  .onChange((v: number) => {
    const totalHeight =
      parameters.ballRadius * 2 * parameters.ballCount + v * (parameters.ballCount - 1);
    balls.forEach((ball, idx) => {
      // Update position
      ball.position.y = totalHeight / 2 - idx * (parameters.ballRadius * 2 + v);
    });
  });

ballsFolder
  .addColor(parameters, "ballColor")
  .name("color")
  .onChange((c: number) => {
    ballMaterial.color.set(c);
  });

ballsFolder
  .add(parameters, "ballMetalness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("metalness")
  .onChange((v: number) => {
    ballMaterial.metalness = v;
  });

ballsFolder
  .add(parameters, "ballRoughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("roughness")
  .onChange((v: number) => {
    ballMaterial.roughness = v;
  });

/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 3, 7);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animation
 */
const ani = (time: number) => {
  // Update objects
  balls.forEach((ball, idx) => {
    ball.position.x =
      Math.cos(time * 0.0001 * (idx / parameters.speedFalloff + 1)) * parameters.amplitude;
    ball.position.z =
      Math.sin(time * 0.0001 * (idx / parameters.speedFalloff + 1)) * parameters.amplitude;
  });

  directionalLight.position.x = Math.cos(time * 0.0005) * 5;
  directionalLight.position.z = Math.sin(time * 0.0005) * 5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(ani);
