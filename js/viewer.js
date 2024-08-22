import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "bootstrap/dist/css/bootstrap.min.css";
import nipplejs from "nipplejs";

function detectMobileDevice(agent) {
  const mobileRegex = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

  return mobileRegex.some((mobile) => agent.match(mobile));
}

const isMobile = detectMobileDevice(window.navigator.userAgent);

if (isMobile) {
  console.log("current device is mobile");
} else {
  console.log("current device is not mobile");
}

let model, path, mixer, actions, idleAction, walkAction, step, yaw;
let modelPath = "/assets/models/jogging_woman.glb";

let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
let tempVector = new THREE.Vector3();
let upVector = new THREE.Vector3(0, 1, 0);
let joyManager;

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

let sceneName = document.querySelectorAll(".scene_name");
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const scene = urlParams.get("scene");
  if (scene) {
    viewer(scene);
    sceneName.forEach((name) => {
      name.textContent = scene.toUpperCase();
    });
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

  document.addEventListener("keydown", function (event) {
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
      event.preventDefault();
      keys[event.code.toLowerCase().slice(-1)] = true;
      isWalking = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
      event.preventDefault();
      keys[event.code.toLowerCase().slice(-1)] = false;
      if (keys.a === false && keys.w === false && keys.s === false && keys.d === false) isWalking = false;
    }
  });

  document.addEventListener("touchend", () => {
    isLocked = false;
  });

  document.addEventListener("touchstart", (event) => {
    const initialTouchX = event.touches[0].clientX;
    //const initialTouchY = event.touches[0].clientY;

    document.addEventListener(
      "touchmove",
      (event) => {
        const currentTouchX = event.touches[0].clientX;
        //const currentTouchY = event.touches[0].clientY;

        const deltaX = currentTouchX - initialTouchX;
        //const deltaY = currentTouchY - initialTouchY;

        console.log("Movement:", deltaX);
        yaw -= deltaX * 0.0002;
      },
      { passive: false }
    ); // Prevent default scrolling behavior
  });

  document.addEventListener("mousedown", (event) => {
    isLocked = true;
    document.addEventListener("mousemove", (event) => {
      if (isLocked) {
        console.log(event);
        yaw -= event.movementX * 0.0002;
      }
    });
  });

  document.addEventListener("mouseup", (event) => {
    isLocked = false;
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
      yaw = -Math.PI / 1.1;
      viewer.splatobject.rotation.set(THREE.MathUtils.degToRad(-15), 0, 0);
      params = {
        ...params,
        cameraUp: [0.07552, -0.9436, -0.32235],
        initialCameraPosition: [-6.22758, -0.32872, 12.08985],
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
      step = 0.05;
      yaw = -Math.PI / 3;
      viewer.splatobject.rotation.set(THREE.MathUtils.degToRad(-30), 0, 0);
      params = {
        ...params,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [-7.3626, 0.97483, -8.08453],
        initialCameraLookAt: [7.50303, -1.43167, 4.06931],
      };
      path = "/assets/models/garden.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    case "stump":
      step = 0.09;
      yaw = Math.PI / 3;
      viewer.splatobject.rotation.set(THREE.MathUtils.degToRad(-46.5), 0, 0);
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
      step = 0.04;
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
      yaw = -Math.PI / 1.1;
      step = 0.04;
      viewer.splatobject.rotation.set(THREE.MathUtils.degToRad(-25), 0, 0);
      params = {
        ...params,
        cameraUp: [-0.15356, -0.97605, -0.15408],
        initialCameraPosition: [-2.81607, -0.11878, 6.30533],
        initialCameraLookAt: [0.33259, 1.1165, -0.47275],
      };
      path = "/assets/models/treehill.ksplat";
      await loadGltf(
        params.threeScene,
        modelPath,
        { x: params.initialCameraPosition[0], y: params.initialCameraPosition[1], z: params.initialCameraPosition[2] },
        { x: params.initialCameraLookAt[0], y: params.initialCameraLookAt[1], z: params.initialCameraLookAt[2] }
      );
      break;
    case "codebrain":
      yaw = -Math.PI / 5;
      step = 0.006;
      params = {
        ...params,
        cameraUp: [0.0, -1.0, 0.0],
        initialCameraPosition: [-2.6626, 0.17483, -5.08453],
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
      progressiveLoad: true,
    })
    .then(() => {
      console.log("Loaded successfully:", path);
      viewer.start();
    })
    .catch((error) => {
      console.error("Error loading file:", error);
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

      if (isMobile) {
        // 모바일 환경 일 때
        if (fwdValue > 0) {
          isWalking = true;
          tempVector = moveDirection.add(direction.clone().multiplyScalar(step));
          model.scene.position.addScaledVector(tempVector, 1);
        } else {
          isWalking = false;
        }

        if (bkdValue > 0) {
          isWalking = true;
          tempVector = moveDirection.add(direction.clone().negate().multiplyScalar(step));
          model.scene.position.addScaledVector(tempVector, 1);
        } else {
          isWalking = false;
        }

        if (lftValue > 0) {
          isWalking = true;
          tempVector = moveDirection.add(sideDirection.clone().negate().multiplyScalar(step));
          model.scene.position.addScaledVector(tempVector, 1);
        } else {
          isWalking = false;
        }

        if (rgtValue > 0) {
          isWalking = true;
          tempVector = moveDirection.add(sideDirection.clone().multiplyScalar(step));
          model.scene.position.addScaledVector(tempVector, 1);
        } else {
          isWalking = false;
        }
      } else {
        // 모바일 환경이 아닐 떄
        if (keys.w) moveDirection.add(direction.clone().multiplyScalar(step));
        if (keys.s) moveDirection.add(direction.clone().negate().multiplyScalar(step));
        if (keys.a) moveDirection.add(sideDirection.clone().negate().multiplyScalar(step));
        if (keys.d) moveDirection.add(sideDirection.clone().multiplyScalar(step));
      }

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
  addJoystick();
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
    function (xhr) {},
    function (error) {
      console.log("An error happened");
    }
  );
}

function addJoystick() {
  const options = {
    zone: document.getElementById("joystickWrapper1"),
    size: 120,
    multitouch: true,
    maxNumberOfNipples: 2,
    mode: "static",
    restJoystick: true,
    shape: "circle",
    position: { top: "60px", left: "60px" },
    dynamicPage: true,
  };

  joyManager = nipplejs.create(options);

  joyManager["0"].on("move", function (evt, data) {
    const forward = data.vector.y;
    const turn = data.vector.x;

    if (forward > 0) {
      fwdValue = Math.abs(forward);
      bkdValue = 0;
    } else if (forward < 0) {
      fwdValue = 0;
      bkdValue = Math.abs(forward);
    }

    if (turn > 0) {
      lftValue = 0;
      rgtValue = Math.abs(turn);
    } else if (turn < 0) {
      lftValue = Math.abs(turn);
      rgtValue = 0;
    }
  });

  joyManager["0"].on("end", function (evt) {
    bkdValue = 0;
    fwdValue = 0;
    lftValue = 0;
    rgtValue = 0;
  });
}
