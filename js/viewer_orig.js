import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "bootstrap/dist/css/bootstrap.min.css";

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

function viewer(scene) {
  const threeScene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(8.63748, -0.80249, 5.0337);
  cube.lookAt(6.77614, -0.82427, 3.36641);
  cube.up.set(0.0, -1.0, 0.0);
  // cube.position.set(2.43189, 3.95382, -4.4558);
  // cube.up.set(0.01933, -0.7583, -0.65161);
  // cube.lookAt(0, 0, 0);

  threeScene.add(cube);
  console.log(cube);

  const rootElement = document.createElement("div");
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  rootElement.appendChild(renderer.domElement);

  const step = 0.2;
  const keys = { w: false, a: false, s: false, d: false };

  window.addEventListener("keydown", function (event) {
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
      event.preventDefault();
      keys[event.code.toLowerCase().slice(-1)] = true;
    }
  });

  window.addEventListener("keyup", function (event) {
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
      event.preventDefault();
      keys[event.code.toLowerCase().slice(-1)] = false;
    }
  });

  // function updateCameraPosition() {
  //   const direction = new THREE.Vector3();
  //   const sideDirection = new THREE.Vector3();

  //   direction.set(0, 0, -1).applyQuaternion(viewer.camera.quaternion);
  //   sideDirection.set(1, 0, 0).applyQuaternion(viewer.camera.quaternion);

  //   const moveDirection = new THREE.Vector3();

  //   if (keys.w) moveDirection.add(direction.clone().multiplyScalar(step));
  //   if (keys.s) moveDirection.add(direction.clone().negate().multiplyScalar(step));
  //   if (keys.a) moveDirection.add(sideDirection.clone().negate().multiplyScalar(step));
  //   if (keys.d) moveDirection.add(sideDirection.clone().multiplyScalar(step));

  //   viewer.camera.position.add(moveDirection);
  // }
  let isLocked = false;
  document.addEventListener("click", () => {
    rootElement.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", () => {
    isLocked = document.pointerLockElement === rootElement;
  });

  let yaw = 0;
  let pitch = 0;
  document.addEventListener("mousemove", (event) => {
    if (isLocked) {
      yaw -= event.movementX * 0.002;
      pitch -= event.movementY * 0.002;
      pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Clamp pitch to prevent flipping
    }
  });

  function updateCameraPosition() {
    const direction = new THREE.Vector3();
    const sideDirection = new THREE.Vector3();

    viewer.camera.rotation.set(pitch, yaw, 0);

    direction.set(0, 0, -1).applyQuaternion(viewer.camera.quaternion);
    sideDirection.set(1, 0, 0).applyQuaternion(viewer.camera.quaternion);

    const moveDirection = new THREE.Vector3();

    if (keys.w) moveDirection.add(direction.clone().multiplyScalar(step));
    if (keys.s) moveDirection.add(direction.clone().negate().multiplyScalar(step));
    if (keys.a) moveDirection.add(sideDirection.clone().negate().multiplyScalar(step));
    if (keys.d) moveDirection.add(sideDirection.clone().multiplyScalar(step));

    viewer.camera.position.add(moveDirection);
  }
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

  let path;
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
        initialCameraPosition: [8.63748, -0.80249, 5.0337],
        initialCameraLookAt: [6.77614, -0.82427, 3.36641],
      };
      path = "/assets/models/codebrain.ksplat";
      break;
    default:
      console.error("Unknown scene:", scene);
      return;
  }
  const viewer = new GaussianSplats3D.Viewer(params);
  //viewer.controls.stopListenToKeyEvents();

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

  function animate() {
    updateCameraPosition();
    renderer.render(threeScene, viewer.camera);
    requestAnimationFrame(animate);
  }

  animate();
}
