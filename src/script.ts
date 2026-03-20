import GUI from "lil-gui";
import * as three from "three";
import { OrbitControls, RectAreaLightUniformsLib } from "three/examples/jsm/Addons.js";

/**
 * Debug
 */
const parameters = {
  ambientLightIntensity: 0.5,
  ambientLightColor: 0xe3e3e3,
  directionalLightIntensity: 1.3,
  directionalLightColor: 0xffffff,
  ballMetalness: 0.1,
  ballRoughness: 0.3,
  ballColor: 0xdf8af0,
  ballRadius: 0.15,
  ballCount: 75,
  ballSeparation: 0,
  amplitude: 4,
  speedFalloff: 4,
  redLightColor: "#ff4800",
  blueLightColor: "#0099ff",
  greenLightColor: "#30f000",
  rectLightIntensity: 12,
  rectLightWidth: 10,
  rectLightHeight: 20,
  rectLightDistance: 15,
  lightsVisible: false,
  doubleSide: false,
  rotateLights: true
};

const gui = new GUI({ width: 340 });
gui.close();
const lightsFolder = gui.addFolder("Lights");
const ambientLightFolder = lightsFolder.addFolder("Ambient");
// const directionalLightFolder = lightsFolder.addFolder("Directional");
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

/* // Directional
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
  }); */

// Rect area
RectAreaLightUniformsLib.init();
const position = new three.Vector3(parameters.rectLightDistance, 0, 0);

const rectAreaLightRed = new three.RectAreaLight(
  parameters.redLightColor,
  parameters.rectLightIntensity,
  parameters.rectLightWidth,
  parameters.rectLightHeight
);
rectAreaLightRed.position.z = position.z;
rectAreaLightRed.position.x = position.x;
rectAreaLightRed.lookAt(0, 0, 0);

const rectMeshRed = new three.Mesh(
  new three.PlaneGeometry(parameters.rectLightWidth, parameters.rectLightHeight),
  new three.MeshBasicMaterial({
    visible: parameters.lightsVisible,
    side: parameters.doubleSide ? three.DoubleSide : three.FrontSide,
    color: parameters.redLightColor
  })
);
rectMeshRed.position.z = position.z;
rectMeshRed.position.x = position.x;
rectMeshRed.lookAt(0, 0, 0);

scene.add(rectAreaLightRed);
scene.add(rectMeshRed);

position
  .set(Math.cos((Math.PI * 2) / 3), 0, Math.sin((Math.PI * 2) / 3))
  .setLength(parameters.rectLightDistance);

const rectAreaLightBlue = new three.RectAreaLight(
  parameters.blueLightColor,
  parameters.rectLightIntensity,
  parameters.rectLightWidth,
  parameters.rectLightHeight
);
rectAreaLightBlue.position.z = position.z;
rectAreaLightBlue.position.x = position.x;
rectAreaLightBlue.lookAt(0, 0, 0);

const rectMeshBlue = new three.Mesh(
  new three.PlaneGeometry(parameters.rectLightWidth, parameters.rectLightHeight),
  new three.MeshBasicMaterial({
    visible: parameters.lightsVisible,
    side: parameters.doubleSide ? three.DoubleSide : three.FrontSide,
    color: parameters.blueLightColor
  })
);
rectMeshBlue.position.z = position.z;
rectMeshBlue.position.x = position.x;
rectMeshBlue.lookAt(0, 0, 0);

scene.add(rectAreaLightBlue);
scene.add(rectMeshBlue);

position
  .set(Math.cos((Math.PI * 4) / 3), 0, Math.sin((Math.PI * 4) / 3))
  .setLength(parameters.rectLightDistance);

const rectAreaLightWhite = new three.RectAreaLight(
  parameters.greenLightColor,
  parameters.rectLightIntensity,
  parameters.rectLightWidth,
  parameters.rectLightHeight
);
rectAreaLightWhite.position.z = position.z;
rectAreaLightWhite.position.x = position.x;
rectAreaLightWhite.lookAt(0, 0, 0);

const rectMeshWhite = new three.Mesh(
  new three.PlaneGeometry(parameters.rectLightWidth, parameters.rectLightHeight),
  new three.MeshBasicMaterial({
    visible: parameters.lightsVisible,
    side: parameters.doubleSide ? three.DoubleSide : three.FrontSide,
    color: parameters.greenLightColor
  })
);
rectMeshWhite.position.z = position.z;
rectMeshWhite.position.x = position.x;
rectMeshWhite.lookAt(0, 0, 0);

scene.add(rectAreaLightWhite);
scene.add(rectMeshWhite);

const updateLights = [rectAreaLightRed, rectAreaLightBlue, rectAreaLightWhite];

const updateMeshes = [rectMeshBlue, rectMeshRed, rectMeshWhite];

const updateElements = [...updateLights, ...updateMeshes];

lightsFolder
  .add(parameters, "rectLightDistance")
  .min(0.001)
  .max(20)
  .step(0.001)
  .onChange((v: number) => {
    updateElements.forEach(element => {
      element.position.setLength(v);
    });
  });

lightsFolder
  .add(parameters, "rectLightIntensity")
  .min(0)
  .max(50)
  .step(0.001)
  .onChange((v: number) => {
    updateLights.forEach(light => {
      light.intensity = v;
    });
  });

lightsFolder.addColor(parameters, "redLightColor").onChange((v: string) => {
  rectAreaLightRed.color.set(v);
  rectMeshRed.material.color.set(v);
});

lightsFolder.addColor(parameters, "blueLightColor").onChange((v: string) => {
  rectAreaLightBlue.color.set(v);
  rectMeshBlue.material.color.set(v);
});

lightsFolder.addColor(parameters, "greenLightColor").onChange((v: string) => {
  rectAreaLightWhite.color.set(v);
  rectMeshWhite.material.color.set(v);
});

lightsFolder.add(parameters, "lightsVisible").onChange((v: boolean) => {
  updateMeshes.forEach(mesh => {
    mesh.material.visible = v;
  });
});

lightsFolder.add(parameters, "doubleSide").onChange((v: boolean) => {
  updateMeshes.forEach(mesh => {
    mesh.material.side = v ? three.DoubleSide : three.FrontSide;
  });
});

lightsFolder.add(parameters, "rotateLights");

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
camera.position.set(0, 0, 20);
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
const timer = new three.Timer();
timer.connect(document);

const ani = () => {
  timer.update();
  const elapsed = timer.getElapsed();
  const delta = timer.getDelta();

  // Update objects
  balls.forEach((ball, idx) => {
    ball.position.x =
      Math.cos(elapsed * 0.1 * (idx / parameters.speedFalloff + 1)) * parameters.amplitude;
    ball.position.z =
      Math.sin(elapsed * 0.1 * (idx / parameters.speedFalloff + 1)) * parameters.amplitude;
  });

  // directionalLight.position.x = Math.cos(elapsed * 0.0005) * 5;
  // directionalLight.position.z = Math.sin(elapsed * 0.0005) * 5;

  if (parameters.rotateLights) {
    updateElements.forEach(element => {
      element.position.applyAxisAngle(new three.Vector3(0, 1, 0), delta * 0.5);
      element.lookAt(0, 0, 0);
    });
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(ani);
