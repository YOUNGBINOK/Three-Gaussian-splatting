import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import "bootstrap/dist/css/bootstrap.min.css";

let model, path, mixer, actions, settings, idleAction, walkAction, step;
let modelPath = "/assets/models/walk_woman.glb";
let clock = new THREE.Clock();

settings = {
  "modify step size": 0.05,
  "use default duration": true,
  "set custom duration": 3.5,
};

const UIButton = document.getElementById("liveToastBtn");
const UIToast = document.getElementById("liveToast");
UIButton.addEventListener("click", function () {
  if (UIToast.style.display === "none") {
    UIToast.style.display = "block";
  } else {
    UIToast.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const scene = urlParams.get("scene");

  if (scene) {
    viewer(scene);
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

  const initialPitch = Math.PI;
  let yaw = 0;

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
  const offset = new THREE.Vector3(0, 0.2, 0.4);
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

  const light = new THREE.AmbientLight("#ffffff");
  threeScene.add(light);

  // GaussianSplats3D Viewer 초기화
  let params = {
    useBuiltInControls: false,
    threeScene: threeScene,
    render: renderer,
    sphericalHarmonicsDegree: 2,
  };

  switch (scene) {
    case "bicycle":
      params = {
        ...params,
        cameraUp: [0.03966, -0.76135, -0.64713],
        initialCameraPosition: [-0.32965, -1.09144, 7.14262],
        initialCameraLookAt: [1.24785, -0.06874, 0.68925],
      };
      path = "/assets/models/bicycle.ksplat";
      break;
    case "bonsai":
      params = {
        ...params,
        cameraUp: [0.01933, -0.7583, -0.65161],
        initialCameraPosition: [2.41994, 3.83644, -4.56361],
        initialCameraLoowkAt: [0.96609, 1.39598, 0.43847],
      };
      path = "/assets/models/bonsai.ksplat";
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
      params = {
        ...params,
        cameraUp: [0.06881, -0.65246, -0.75469],
        initialCameraPosition: [10.2829, 0.2205, 2.34208],
        initialCameraLookAt: [0.40369, 0.44649, 1.42204],
      };
      path = "/assets/models/stump.ksplat";
      break;
    case "postshot":
      step = 0.05;

      params = {
        ...params,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [9.450669438394524, -0.08472999999999996, -7.040204875651971],
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
      params = {
        ...params,
        cameraUp: [-0.11233, -0.99321, -0.0302],
        initialCameraPosition: [-1.5268, -2.86369, 8.54446],
        initialCameraLookAt: [0, 0, 0],
      };
      path = "/assets/models/treehill.ksplat";
      break;
    case "mosaic":
      params = {
        ...params,
        cameraUp: [0.08473, -0.98009, 0.17957],
        initialCameraPosition: [0.58407, 2.61195, -0.86032],
        initialCameraLookAt: [-1.03002, 0.67666, -0.78232],
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
      step = 0.005;
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
  const viewer = new GaussianSplats3D.Viewer(params);
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

  async function animate() {
    renderer.render(threeScene, viewer.camera);
    requestAnimationFrame(animate);
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
      idleAction = mixer.clipAction(animations[0]);
      walkAction = mixer.clipAction(animations[1]);

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
