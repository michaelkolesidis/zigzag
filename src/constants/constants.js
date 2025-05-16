// Camera
export const CAMERA_OFFSET_X = 19.05;
export const CAMERA_OFFSET_Y = 14.66; // TODO: 12 after fixing camera y position
export const CAMERA_OFFSET_Z = 15;
export const ZOOM_LEVEL_MOBILE = 35;
export const ZOOM_LEVEL_DESKTOP = 70;

// Lights
export const AMBIENT_INTENSITY = 2.5;
export const DIRECTIONAL_INTENSITY = 3.5;
export const DIRECTIONAL_POSITION = [15, 30, 10];

// Physics
export const GRAVITY = 16;

// Level
export const TILE_SIZE = 1.35; // length and width of each tile
export const TILE_DEPTH = 4; // height of each tile
export const TILE_COLOR = '#007acc'; // color of the tiles
export const TILE_STATUS = {
  ACTIVE: 'active',
  FALLING: 'falling',
};
export const TARGET_LOOKAHEAD_DISTANCE = 40;
export const FALL_DELAY_SECONDS = 0.75; // delay before tile starts falling after sphere leaves it
export const OBJECT_REMOVAL_POSITION_Y = -40; // y-position at which objects are removed from the scene
export const PLATFORM_WIDTH_TILES = 8; // initial platform width in tiles
export const PLATFORM_LENGTH_TILES = 8; // initial platform length in tiles
export const PLATFORM_TILE_COUNT = PLATFORM_WIDTH_TILES * PLATFORM_LENGTH_TILES;
export const MAX_DIVERGENCE = 3; // how far to the x and z axis the path can diverge in total

// Sphere (Player)
export const SPHERE_RADIUS = 0.26;
export const INITIAL_SPEED = 6;
export const SPEED_INCREMENT = 0.0125;
export const SPHERE_SEGMENTS = 9;
export const SPHERE_COLOR = '#888888';
export const SPHERE_METALNESS = 1;
export const SPHERE_ROUGHNESS = 0.7;

// Gems
export const GEM_RADIUS = 0.35;
export const GEM_HEIGHT = GEM_RADIUS * 1.5;
export const GEM_SEGMENTS = 4;
export const GEM_METALNESS = 0.3;
export const GEM_ROUGHNESS = 0.2;
export const GEM_ROTATION = [0, Math.PI / 4, 0];
export const GEM_SPAWN_PROBABILITY = 0.2; // chance for a gem to spawn on a new tile
export const GEM_HEIGHT_OFFSET = TILE_DEPTH / 2 + GEM_HEIGHT; // place gem centered on top of tile
export const GEM_COLOR = '#ff44eb';
