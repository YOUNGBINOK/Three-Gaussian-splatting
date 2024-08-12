import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {
  bonsai();
});

function bonsai() {
  const renderWidth = 100;
  const renderHeight = 100;

  const canvas = document.getElementById("canvas");
  canvas.style.width = `${renderWidth}%`;
  canvas.style.height = `${renderHeight}%`;
  document.body.appendChild(canvas);

  const viewer = new GaussianSplats3D.Viewer({
    cameraUp: [0.01933, -0.7583, -0.65161],
    initialCameraPosition: [1.54163, 2.68515, -6.37228],
    initialCameraLookAt: [0.45622, 1.95338, 1.51278],
    sphericalHarmonicsDegree: 2,
  });

  document.querySelectorAll(".demo-scene-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const value = event.target.value;
      let path;

      switch (value) {
        case "bicycle":
          path = "/assets/models/bicycle.ksplat";
          break;
        case "bonsai":
          path = "/assets/models/bonsai.ksplat";
          break;
        case "garden":
          path = "/assets/models/garden.ksplat";
          break;
        case "plush":
          path = "/assets/models/plush.ksplat";
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
          path = "/assets/models/truck.ksplat";
          break;
        default:
          console.error("Unknown value:", value);
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
    });
  });

  function update() {
    requestAnimationFrame(update);
    viewer.update();
    viewer.render();
  }

  update();
}
