import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";

garden();
export function garden() {
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

  let path = "/assets/garden.ksplat";

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
