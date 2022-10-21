function mapLoad(scene, params) {}

function mapCreate(scene, params) {}

function sceneCreated({ overlayScene, robots }) {
  overlayScene.freeMode();
  overlayScene.camera.scrollY -= 200;
}
