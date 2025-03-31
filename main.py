from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()

# Configuration du terrain
chunk_size = 5
tile_size = 1
chunk_range = 5

def safe_load_texture(path, fallback='white_cube'):
    try:
        return load_texture(path)
    except:
        print(f"⚠️ Impossible de charger {path}, utilisation de {fallback}")
        return load_texture(fallback)

textures = {
    'grass': safe_load_texture('grass_block'),
    'stone': safe_load_texture('assets/stone_block'),
}

print(f"Grass texture: {textures['grass']}")
print(f"Stone texture: {textures['stone']}")

class Voxel(Button):
    def __init__(self, position=(0, 0, 0), texture='grass'):
        texture_path = textures.get(texture, load_texture('white_cube'))
        super().__init__(
            parent=scene,
            position=position,
            model='cube',
            texture=texture_path,
            texture_scale=(1,1),
            color=color.white,
            highlight_color=color.lime,
            scale=0.5
        )

    def input(self, key):
        if self.hovered:
            if key == 'left mouse down':
                self.add_voxel()
            elif key == 'right mouse down':
                self.remove_voxel()

    def add_voxel(self):
        new_position = self.position + Vec3(0, tile_size, 0)
        if new_position not in terrain_generator.placed_voxels:
            Voxel(position=new_position, texture='grass')
            terrain_generator.placed_voxels.add(new_position)

    def remove_voxel(self):
        terrain_generator.placed_voxels.remove(self.position)
        destroy(self)

class TerrainGenerator:
    def __init__(self):
        self.loaded_chunks = set()
        self.placed_voxels = set()

    def generate_chunk(self, position):
        for i in range(chunk_size):
            for j in range(chunk_size):
                pos = Vec3(position[0] + i * tile_size, 0, position[2] + j * tile_size)
                if pos not in self.placed_voxels:
                    Voxel(position=pos, texture='grass')
                    self.placed_voxels.add(pos)
        self.loaded_chunks.add(position)

    def update_chunks(self, player_position):
        chunk_x = int(player_position.x // (chunk_size * tile_size)) * chunk_size * tile_size
        chunk_z = int(player_position.z // (chunk_size * tile_size)) * chunk_size * tile_size

        chunk_positions = {
            (chunk_x + dx * chunk_size * tile_size, 0, chunk_z + dz * chunk_size * tile_size)
            for dx in range(-chunk_range, chunk_range + 1)
            for dz in range(-chunk_range, chunk_range + 1)
        }

        for pos in chunk_positions - self.loaded_chunks:
            self.generate_chunk(pos)

player = FirstPersonController()
terrain_generator = TerrainGenerator()
terrain_generator.update_chunks(player.position)

class Sky(Entity):
    def __init__(self):
        super().__init__(
            parent=scene,
            model='sphere',
            texture='skybox',
            scale=500,
            double_sided=True
        )

sky = Sky()

def update():
    terrain_generator.update_chunks(player.position)

app.run()
