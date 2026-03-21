import type { Viewport } from './types';

export const TILE_SIZE = 16;

export const VIEWPORT: Viewport = {
  widthTiles: 15,
  heightTiles: 11,
  logicalWidth: 240,
  logicalHeight: 176,
};

export const CAMERA_LERP_SPEED = 0.1;

export const LIGHT_RADIUS_BRIGHT = 5;
export const LIGHT_RADIUS_DIM = 3;
export const LIGHT_FLICKER_AMPLITUDE = 0.3;

export const PLAYER_MOVE_SPEED = 120; // ms per tile
export const SPRITE_FRAME_DURATION = 200; // ms per animation frame

export const FLOOR_THEMES = [
  {
    id: 1,
    name: '前端泥沼',
    floorColor: '#4a5944',
    wallColor: '#2d3328',
    accent: '#6fbf3b',
    atmosphere: 'Sticky, slimy feel',
  },
  {
    id: 2,
    name: '後端迷宮',
    floorColor: '#44505c',
    wallColor: '#1e2a36',
    accent: '#3b8fbf',
    atmosphere: 'Technical, maze-like',
  },
  {
    id: 3,
    name: '資料庫深淵',
    floorColor: '#4a3f5c',
    wallColor: '#1e1636',
    accent: '#3bbfbf',
    atmosphere: 'Deep, vast, echoing',
  },
  {
    id: 4,
    name: '神類聖殿',
    floorColor: '#5c2a2a',
    wallColor: '#1a0a0a',
    accent: '#ffd700',
    atmosphere: 'Oppressive, final',
  },
] as const;
