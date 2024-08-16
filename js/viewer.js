import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "bootstrap/dist/css/bootstrap.min.css";

let model, path, mixer, actions, settings, idleAction, walkAction;
let modelPath = "/assets/models/Soldier.glb";
let clock = new THREE.Clock();

settings = {
  "modify step size": 0.05,
  "use default duration": true,
  "set custom duration": 3.5,
  "modify idle weight": 0.0,
  "modify walk weight": 1.0,
  "modify run weight": 0.0,
  "modify time scale": 1.0,
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

  await loadGltf(threeScene, modelPath);

  const step = 0.005;
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

  document.addEventListener("mousemove", (event) => {
    if (isLocked) {
      yaw -= event.movementX * 0.001;
    }
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
    cameraUp: [0, -1, 0],
    initialCameraPosition: [0, 0, 6],
    initialCameraLookAt: [0, 0, 0],
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
      params = {
        ...params,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [8.96491, -0.33876, -3.03454],
        initialCameraLookAt: [3.03079, -0.33447, -3.41642],
      };
      path = "/assets/models/postshot-quickstart.ksplat";
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
    case "truck":
      params = {
        ...params,
        cameraUp: [0, -1, -0.17],
        initialCameraPosition: [-5, -1, -1],
        initialCameraLookAt: [-1.72477, 0.05395, -0.00147],
      };
      path = "/assets/models/truck.ksplat";
      break;
    case "codebrain":
      params = {
        ...params,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [-2.27476, 0.02409, -5.03016],
        initialCameraLookAt: [7.59087, -0.58241, 4.12368],
      };
      path = "/assets/models/codebrain.ksplat";
      break;
    default:
      console.error("Unknown scene:", scene);
      return;
  }
  const viewer = new GaussianSplats3D.Viewer(params);
  //viewer.cameraUp.set(0, 1, 0);
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
        walkAction.play();
      } else {
        prepareCrossFade(idleAction, walkAction, 0.1);
      }
      mixer.update(delta);
    }
  }

  animate();
}

function prepareCrossFade(startAction, endAction, defaultDuration) {
  const duration = setCrossFadeDuration(defaultDuration);

  if (startAction === idleAction) {
    executeCrossFade(startAction, endAction, duration);
  } else {
    synchronizeCrossFade(startAction, endAction, duration);
  }
}

function setCrossFadeDuration(defaultDuration) {
  if (settings["use default duration"]) {
    return defaultDuration;
  } else {
    return settings["set custom duration"];
  }
}

function synchronizeCrossFade(startAction, endAction, duration) {
  mixer.addEventListener("loop", onLoopFinished);

  function onLoopFinished(event) {
    if (event.action === startAction) {
      mixer.removeEventListener("loop", onLoopFinished);

      executeCrossFade(startAction, endAction, duration);
    }
  }
}

function executeCrossFade(startAction, endAction, duration) {
  setWeight(endAction, 1);
  endAction.time = 0;

  startAction.crossFadeTo(endAction, duration, true);
}

function setWeight(action, weight) {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
}

async function loadGltf(scene, path) {
  const loader = new GLTFLoader();
  loader.load(
    path,
    function (gltf) {
      model = gltf;
      scene.add(gltf.scene);
      model.scene.position.set(-2.27476, 0.2, -5.03016);
      model.scene.lookAt(7.59087, -0.58241, 4.12368);
      model.scene.scale.set(0.1, 0.1, 0.1);
      model.scene.rotation.set(Math.PI, -Math.PI / 4, 0);

      const animations = model.animations;
      mixer = new THREE.AnimationMixer(gltf.scene);
      idleAction = mixer.clipAction(animations[0]);
      walkAction = mixer.clipAction(animations[3]);
      actions = [idleAction, walkAction];
      walkAction.play();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log("An error happened");
    }
  );
}
