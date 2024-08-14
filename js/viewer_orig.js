import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";
import "bootstrap/dist/css/bootstrap.min.css";

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
  threeScene.add(cube);

  const rootElement = document.createElement("div");
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  rootElement.appendChild(renderer.domElement);

  // 카메라 설정
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.copy(new THREE.Vector3().fromArray([-1, -4, 6]));
  camera.up = new THREE.Vector3().fromArray([0, -1, -0.6]).normalize();
  camera.lookAt(new THREE.Vector3().fromArray([0, 4, -0]));

  const step = 0.1;
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

  function updateCameraPosition() {
    if (keys.w) cube.position.z -= step;
    if (keys.s) cube.position.z += step;
    if (keys.a) cube.position.x -= step;
    if (keys.d) cube.position.x += step;

    // // 카메라를 큐브와 같은 방향으로 설정
    camera.position.x = cube.position.x;
    camera.position.y = cube.position.y;
    camera.position.z = cube.position.z;
  }

  // GaussianSplats3D Viewer 초기화
  let params = {
    threeScene: threeScene,
    //camera: camera,
    render: renderer,
    cameraUp: [0.01933, -0.7583, -0.65161],
    initialCameraPosition: [1.54163, 2.68515, -6.37228],
    initialCameraLookAt: [0.45622, 1.95338, 1.51278],
    sphericalHarmonicsDegree: 2,
  };

  let path;
  switch (scene) {
    case "bicycle":
      params = {
        threeScene: threeScene,
        //camera: camera,
        render: renderer,
        cameraUp: [0.03966, -0.76135, -0.64713],
        initialCameraPosition: [-0.32965, -1.09144, 7.14262],
        initialCameraLookAt: [1.24785, -0.06874, 0.68925],
        sphericalHarmonicsDegree: 2,
      };
      path = "/assets/models/bicycle.ksplat";
      break;
    case "bonsai":
      params = {
        threeScene: threeScene,
        //camera: camera,
        render: renderer,
        cameraUp: [0.01933, -0.7583, -0.65161],
        initialCameraPosition: [2.41994, 3.83644, -4.56361],
        initialCameraLookAt: [0.96609, 1.39598, 0.43847],
        sphericalHarmonicsDegree: 2,
      };
      path = "/assets/models/bonsai.ksplat";
      break;
    case "garden":
      path = "/assets/models/garden.ksplat";
      break;
    case "stump":
      path = "/assets/models/stump.ksplat";
      break;
    case "train":
      path = "/assets/models/train.ksplat";
      break;
    case "treehill":
      path = "/assets/models/treehill.ksplat";
      break;
    case "truck":
      params = {
        threeScene: threeScene,
        //camera: camera,
        render: renderer,
        cameraUp: [0, -1, -0.17],
        initialCameraPosition: [-5, -1, -1],
        initialCameraLookAt: [-1.72477, 0.05395, -0.00147],
        sphericalHarmonicsDegree: 2,
      };
      path = "/assets/models/truck.ksplat";
      break;
    case "codebrain":
      params = {
        threeScene: threeScene,
        //camera: camera,
        render: renderer,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [6.25148, 0.11561, 2.86036],
        initialCameraLookAt: [2.06688, 0.64891, -0.89687],
        sphericalHarmonicsDegree: 2,
      };
      path = "/assets/models/codebrain.ksplat";
      break;
    default:
      console.error("Unknown scene:", scene);
      return;
  }

  const viewer = new GaussianSplats3D.Viewer(params);
  viewer.controls.stopListenToKeyEvents();

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

  function update() {
    updateCameraPosition();
    viewer.update();
    viewer.render();
  }

  requestAnimationFrame(update);
}
