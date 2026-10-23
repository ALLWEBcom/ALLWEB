<script type="module">
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const host = document.getElementById("allweb-3d");

if (host) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 4.4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const cyanLight = new THREE.PointLight(0x00f2fe, 30, 12);
    cyanLight.position.set(2, 2, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 18, 10);
    purpleLight.position.set(-2, -1, 2);
    scene.add(purpleLight);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.TorusKnotGeometry(0.92, 0.27, 150, 20, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.62,
      roughness: 0.22
    });

    const shape = new THREE.Mesh(geometry, material);
    group.add(shape);

    const wireframe = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: 0x9b5cff,
        wireframe: true,
        transparent: true,
        opacity: 0.16
      })
    );
    wireframe.scale.setScalar(1.025);
    group.add(wireframe);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.2
    });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.008, 8, 120),
      ringMaterial
    );
    ring.rotation.x = 1.1;
    ring.rotation.y = 0.35;
    group.add(ring);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointerX = 0;
    let pointerY = 0;

    function resize() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    host.addEventListener("pointermove", (event) => {
      if (reduceMotion) return;

      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.35;
    });

    host.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
    });

    function animate() {
      if (reduceMotion) return;

      requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.y += (pointerX - group.rotation.y) * 0.008;
      group.rotation.x += (pointerY - group.rotation.x) * 0.008;
      ring.rotation.z += 0.001;
      renderer.render(scene, camera);
    }

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }
  } catch (error) {
    console.warn("No se pudo cargar la animación 3D:", error);
  }
}
</script>
