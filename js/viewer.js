import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "bootstrap/dist/css/bootstrap.min.css";

let model, path, mixer, actions, idleAction, walkAction, step, yaw;
let modelPath = "/assets/models/jogging_woman.glb";
let clock = new THREE.Clock();

const UIButton = document.getElementById("liveToastBtn");
const UIToast = document.getElementById("liveToast");
UIButton.addEventListener("click", function () {
  if (UIToast.style.display === "none") {
    UIToast.style.display = "block";
  } else {
    UIToast.style.display = "none";
  }
});

let sceneName = document.getElementById("scene_name");
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const scene = urlParams.get("scene");
  if (scene) {
    viewer(scene);
    sceneName.textContent = scene;
  }
});

async function viewer(scene) {
  const threeScene = new THREE.Scene();

  const rootElement = document.createElement("div");
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  rootElement.appendChild(renderer.domElement);

  const keys = { w: false, a: false, s: false, d: false };

  let isLocked = true;
  let isWalking = false;

  document.addEventListener("pointerlockchange", () => {
    isLocked = document.pointerLockElement === rootElement;
  });

  window.addEventListener("keydown", function (event) {
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
      event.preventDefault();
      keys[event.code.toLowerCase().slice(-1)] = true;
      isWalking = true;
    }
  });

  window.addEventListener("keyup", function (event) {
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
      event.preventDefault();
      keys[event.code.toLowerCase().slice(-1)] = false;
      if (keys.a === false && keys.w === false && keys.s === false && keys.d === false) isWalking = false;
    }
  });

  const light = new THREE.AmbientLight("#ffffff");
  threeScene.add(light);
  const initialPitch = Math.PI;
  // GaussianSplats3D Viewer 초기화
  let params = {
    useBuiltInControls: false,
    threeScene: threeScene,
    render: renderer,
    sphericalHarmonicsDegree: 2,
  };

  const viewer = new GaussianSplats3D.Viewer(params);

  switch (scene) {
    case "bicycle":
      step = 0.05;
      yaw = -Math.PI / 2;
      params = {
        ...params,
        cameraUp: [0.07552, -0.9436, -0.32235],
        initialCameraPosition: [-6.22758, -2.52872, 12.08985],
        initialCameraLookAt: [2.17701, -0.39949, 7.77921],
      };
      path = "/assets/models/bicycle.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    case "garden":
      params = {
        ...params,
        cameraUp: [0.0, -0.87991, -0.47515],
        initialCameraPosition: [-0.97843, 2.49011, -2.73756],
        initialCameraLookAt: [10.38782, -3.54582, 10.42273],
      };
      path = "/assets/models/garden.ksplat";
      break;
    case "stump":
      step = 0.09;
      yaw = Math.PI / 3;
      console.log(viewer.splatMesh.rotation.set(THREE.MathUtils.degToRad(-45), 0, 0));
      params = {
        ...params,
        cameraUp: [0.0, -1.70711, -0.70711],
        initialCameraPosition: [-11.39912, -0.36364, 1.44364],
        initialCameraLookAt: [-1.37417, -0.94295, 0.65241],
      };
      path = "/assets/models/stump.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    case "postshot":
      step = 0.05;
      yaw = Math.PI / 1.8;
      params = {
        ...params,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [7.221565, -0.6847299, 5.82408308],
        initialCameraLookAt: [3.38005, -0.36812, 3.40332],
      };
      path = "/assets/models/postshot-quickstart.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    case "treehill":
      yaw = -Math.PI / 5;
      step = 0.05;
      params = {
        ...params,
        cameraUp: [0.0, 0.0, 0.0],
        initialCameraPosition: [-1.5268, -2.86369, 8.54446],
        initialCameraLookAt: [0, 0, 0],
      };
      path = "/assets/models/treehill.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    case "mosaic":
      step = 0.05;
      yaw = Math.PI / 1.8;
      params = {
        ...params,
        cameraUp: [0.41197, -0.79784, 0.44015],
        initialCameraPosition: [0.05654, 0.78808, -0.21461],
        initialCameraLookAt: [0.01862, 1.60604, -0.67796],
      };
      path = "/assets/models/mosaic51.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    case "codebrain":
      yaw = -Math.PI / 5;
      step = 0.009;
      params = {
        ...params,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [-2.3626, 0.17483, -5.08453],
        initialCameraLookAt: [7.50303, -1.43167, 4.06931],
      };
      path = "/assets/models/codebrain.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    default:
      console.error("Unknown scene:", scene);
      return;
  }

  viewer
    .addSplatScene(path, {
      progressiveLoad: false,
    })
    .then(() => {
      console.log("Loaded successfully:", path);
      viewer.start();
    })
    .catch((error) => {
      console.error("Error loading file:", error);
    });

  document.addEventListener("mousedown", (event) => {
    isLocked = true;
    document.addEventListener("mousemove", (event) => {
      if (isLocked) {
        yaw -= event.movementX * 0.0002;
      }
    });
  });

  document.addEventListener("mouseup", (event) => {
    isLocked = false;
  });

  // 카메라 업데이트
  const offset = new THREE.Vector3(0, 0.19, 0.4);
  async function updateCameraPosition() {
    if (model !== undefined) {
      viewer.camera.rotation.set(initialPitch, yaw, 0);
      model.scene.rotation.set(initialPitch, yaw, 0);
      const direction = new THREE.Vector3();
      const sideDirection = new THREE.Vector3();

      direction.set(0, 0, -1).applyQuaternion(viewer.camera.quaternion);
      sideDirection.set(1, 0, 0).applyQuaternion(viewer.camera.quaternion);

      const moveDirection = new THREE.Vector3();

      if (keys.w) moveDirection.add(direction.clone().multiplyScalar(step));
      if (keys.s) moveDirection.add(direction.clone().negate().multiplyScalar(step));
      if (keys.a) moveDirection.add(sideDirection.clone().negate().multiplyScalar(step));
      if (keys.d) moveDirection.add(sideDirection.clone().multiplyScalar(step));

      model.scene.position.add(moveDirection);
      const newCameraPosition = model.scene.position
        .clone()
        .add(offset.clone().applyQuaternion(viewer.camera.quaternion));
      viewer.camera.position.copy(newCameraPosition);
    }
  }

  renderer.setAnimationLoop(animate);
  async function animate() {
    renderer.render(threeScene, viewer.camera);
    await updateCameraPosition();

    if (mixer) {
      const delta = clock.getDelta();

      if (isWalking === true) {
        idleAction.reset();
        walkAction.play();
      } else {
        walkAction.reset();
        idleAction.play();
      }
      mixer.update(delta);
    }
  }

  animate();
}

async function loadGltf(scene, path, position, lookAt) {
  const loader = new GLTFLoader();
  loader.load(
    path,
    function (gltf) {
      model = gltf;
      model.scene.position.set(position.x, position.y, position.z);
      model.scene.lookAt(lookAt.x, lookAt.y, lookAt.z);
      model.scene.scale.set(0.1, 0.1, 0.1);
      const animations = model.animations;
      mixer = new THREE.AnimationMixer(gltf.scene);
      idleAction = mixer.clipAction(animations[2]);
      walkAction = mixer.clipAction(animations[0]);
      actions = [idleAction, walkAction];
      idleAction.play();
      scene.add(gltf.scene);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log("An error happened");
    }
  );
}
