// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajout d'une lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Contrôles FPS avec verrouillage du pointeur
const controls = new THREE.PointerLockControls(camera, document.body);
document.addEventListener("click", () => controls.lock());
scene.add(controls.getObject());

// Terrain de blocs
const terrainSize = 10; // Taille du terrain
const blockSize = 1; // Taille d'un bloc
const blocks = []; // Stocker les blocs

const blockGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const grassTexture = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Herbe
const dirtTexture = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Terre

function createBlock(x, y, z, material) {
    const block = new THREE.Mesh(blockGeometry, material);
    block.position.set(x, y, z);
    scene.add(block);
    blocks.push(block);
}

// Générer le sol en blocs verts (herbe)
for (let x = -terrainSize / 2; x < terrainSize / 2; x++) {
    for (let z = -terrainSize / 2; z < terrainSize / 2; z++) {
        createBlock(x, -1, z, grassTexture);
    }
}

// Ajouter des blocs en cliquant
window.addEventListener("mousedown", (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(blocks);
    if (intersects.length > 0) {
        const pos = intersects[0].point;
        const gridPos = new THREE.Vector3(
            Math.round(pos.x),
            Math.round(pos.y + blockSize),
            Math.round(pos.z)
        );
        createBlock(gridPos.x, gridPos.y, gridPos.z, dirtTexture);
    }
});

// Animation et rendu
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Ajuster la fenêtre lors du redimensionnement
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
