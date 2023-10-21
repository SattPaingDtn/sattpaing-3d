import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

// Create our sphere
const geometry = new THREE.OctahedronGeometry(6,3);
const wireframe = new THREE.WireframeGeometry( geometry );
const line = new THREE.LineSegments( wireframe );
line.material.depthTest = false;
line.material.opacity = 1;
line.material.transparent = true;
scene.add( line );

// Create Particles
const particleShape = new THREE.CircleGeometry(1, 16);
const particleGeometry = new THREE.BufferGeometry();
const positions = [];
for (var i = 0; i < 7000; i++) {
  positions.push(
    Math.random() * 200 - 100,
    Math.random() * 200 - 100,
    Math.random() * 200 - 100
  );
}
particleGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);
particleGeometry.setAttribute("uv", particleShape.attributes.uv);
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Light 1
const light = new THREE.PointLight(0xdfccaf, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 125;
scene.add(light);

// Light 2
const light2 = new THREE.PointLight(0x854442, 1, 100);
light2.position.set(0, -10, 0);
light2.intensity = 125;
scene.add(light2);

// Light 3
const light3 = new THREE.PointLight(0xffffff, 1, 100);
light3.position.set(-10, 0, 0);
light3.intensity = 125;
scene.add(light3);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 9;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

// Resize
window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Timeline magic
const tl = gsap.timeline({ default: { duration: 1 } });
tl.fromTo(line.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse animation color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    // let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(line.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

// Touch animation color for mobile
let touchStart = false;
window.addEventListener("touchstart", () => (touchStart = true));
window.addEventListener("touchend", () => (touchStart = false));

window.addEventListener("touchmove", (e) => {
  if (touchStart) {
    rgb = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ];
    // let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(line.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
