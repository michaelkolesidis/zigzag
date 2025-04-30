// Level
export const TILE_SIZE = 1.75; // length and width of each tile
export const TILE_DEPTH = 4; // height of each tile
export const TILE_COLOR = '#0088cc'; // color of the tiles
export const TILE_STATUS = {
  ACTIVE: 'active',
  FALLING: 'falling',
};
export const TARGET_LOOKAHEAD_DISTANCE = 40;
export const FALL_DELAY_SECONDS = 0.75; // delay before tile starts falling after sphere leaves it
export const OBJECT_REMOVAL_POSITION_Y = -40; // y-position at which objects are removed from the scene
export const PLATFORM_WIDTH_TILES = 5; // initial platform width in tiles
export const PLATFORM_LENGTH_TILES = 5; // initial platform length in tiles
export const PLATFORM_TILE_COUNT = PLATFORM_WIDTH_TILES * PLATFORM_LENGTH_TILES;
export const MAX_DIVERGENCE = 3; // how far to the x and z axis the path can diverge in total

// Sphere (Player)
export const SPHERE_RADIUS = 0.3;
export const INITIAL_SPEED = 7;
export const SPEED_INCREMENT = 0.025;

// Gems
export const GEM_RADIUS = 0.4;
export const GEM_HEIGHT = GEM_RADIUS * 1.5;
export const GEM_SPAWN_PROBABILITY = 0.4; // chance for a gem to spawn on a new tile
export const GEM_HEIGHT_OFFSET = TILE_DEPTH / 2 + GEM_HEIGHT; // place gem centered on top of tile
export const GEM_COLOR = '#ff69b4';

// Physics
export const GRAVITY = 24;

// Camera
export const CAMERA_OFFSET_Y = 15;
export const CAMERA_OFFSET_XZ = 15;
