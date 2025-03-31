document.addEventListener("DOMContentLoaded", function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lumière
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // Terrain
    const blockSize = 1;
    const terrainSize = 10;
    const blocks = [];
    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('grass_block.png');

    function createBlock(x, y, z) {
        const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
        const material = new THREE.MeshStandardMaterial({ map: grassTexture });
        const block = new THREE.Mesh(geometry, material);
        block.position.set(x, y, z);
        scene.add(block);
        blocks.push(block);
    }

    for (let x = -terrainSize / 2; x < terrainSize / 2; x++) {
        for (let z = -terrainSize / 2; z < terrainSize / 2; z++) {
            createBlock(x, -0.5, z);
        }
    }

    // Contrôles FPS
    const controls = new THREE.PointerLockControls(camera, document.body);
    document.addEventListener("click", () => controls.lock());
    scene.add(controls.getObject());

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});
