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

  const renderWidth = 100;
  const renderHeight = 100;

  const rootElement = document.createElement("div");
  rootElement.style.width = `${renderWidth}%`;
  rootElement.style.height = `${renderHeight}%`;

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
  });
  renderer.setSize(renderWidth, renderHeight);
  rootElement.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(65, renderWidth / renderHeight, 0.1, 500);

  document.addEventListener("keydown", function (event) {
    //console.log(event);
    const forward = new THREE.Vector3();
    const tempMatrixLeft = new THREE.Matrix4();
    const tempMatrixRight = new THREE.Matrix4();

    switch (event.code) {
      case "KeyW":
        console.log(camera.getWorldDirection(new THREE.Vector3(1, 0, 0)));
        //camera.getWorldDirection(forward);
        camera.position.set(0, 10, 0);
        break;
      case "KeyG":
        break;
      case "KeyF":
        break;
      case "ArrowLeft":
        break;
      case "ArrowRight":
        break;
      case "KeyC":
        showMeshCursor = !showMeshCursor;
        break;
      case "KeyU":
        showControlPlane = !showControlPlane;
        break;
      case "KeyI":
        showInfo = !showInfo;
        if (showInfo) {
          infoPanel.show();
        } else {
          infoPanel.hide();
        }
        break;
      case "KeyO":
        if (!usingExternalCamera) {
          setOrthographicMode(!camera.isOrthographicCamera);
        }
        break;
      case "KeyP":
        if (!usingExternalCamera) {
          splatMesh.setPointCloudModeEnabled(!splatMesh.getPointCloudModeEnabled());
        }
        break;
      case "Equal":
        if (!usingExternalCamera) {
          splatMesh.setSplatScale(splatMesh.getSplatScale() + 0.05);
        }
        break;
      case "Minus":
        if (!usingExternalCamera) {
          splatMesh.setSplatScale(Math.max(splatMesh.getSplatScale() - 0.05, 0.0));
        }
        break;
    }
  });

  // 기본 카메라 설정
  let params = {
    threeScene: threeScene,
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
        cameraUp: [0, -1, -0.17],
        initialCameraPosition: [-5, -1, -1],
        initialCameraLookAt: [-1.72477, 0.05395, -0.00147],
        sphericalHarmonicsDegree: 2,
      };
      path = "/assets/models/truck.ksplat";
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

  function update() {
    requestAnimationFrame(update);
    viewer.update();
    viewer.render();
  }

  update();
}
