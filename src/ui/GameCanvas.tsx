import { useRef, useEffect, useCallback } from 'react';
import { Direction, TileType } from '../utils/types';
import type { CameraState, TileMap } from '../utils/types';
import { TILE_SIZE, VIEWPORT } from '../utils/constants';
import { createGameLoop } from '../engine/GameLoop';
import type { GameLoopHandle } from '../engine/GameLoop';
import { renderExploration } from '../engine/Renderer';
import type { ExplorationRenderState } from '../engine/Renderer';
import { createCamera, setCameraTarget, updateCamera } from '../engine/Camera';
import { DEMO_MAP, DEMO_PLAYER_START } from '../data/demoMap';

function isWalkable(tileMap: TileMap, x: number, y: number): boolean {
  const row = tileMap[y];
  if (!row) return false;
  const tile = row[x];
  return tile === TileType.Floor;
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    playerTileX: DEMO_PLAYER_START.x,
    playerTileY: DEMO_PLAYER_START.y,
    playerPixelX: DEMO_PLAYER_START.x * TILE_SIZE,
    playerPixelY: DEMO_PLAYER_START.y * TILE_SIZE,
    playerDirection: Direction.Down,
    playerIsMoving: false,
    camera: createCamera(0, 0) as CameraState,
    elapsedMs: 0,
    keysDown: new Set<string>(),
    moveTargetX: DEMO_PLAYER_START.x,
    moveTargetY: DEMO_PLAYER_START.y,
    isAnimatingMove: false,
    moveProgress: 0,
    moveStartX: DEMO_PLAYER_START.x * TILE_SIZE,
    moveStartY: DEMO_PLAYER_START.y * TILE_SIZE,
  });

  const loopRef = useRef<GameLoopHandle | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      e.preventDefault();
      stateRef.current.keysDown.add(key);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    stateRef.current.keysDown.delete(e.key.toLowerCase());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false })!;
    ctx.imageSmoothingEnabled = false;

    // Initialize camera
    const state = stateRef.current;
    state.camera = setCameraTarget(
      state.camera,
      state.playerTileX,
      state.playerTileY,
    );
    // Snap camera immediately
    state.camera = { ...state.camera, x: state.camera.targetX, y: state.camera.targetY };

    const tileMap = DEMO_MAP;
    const mapWidth = tileMap[0].length;
    const mapHeight = tileMap.length;
    const moveSpeed = 120; // ms per tile

    const loop = createGameLoop(ctx, {
      update(dt: number) {
        state.elapsedMs += dt;

        // Handle movement
        if (state.isAnimatingMove) {
          state.moveProgress += dt;
          const t = Math.min(state.moveProgress / moveSpeed, 1);
          state.playerPixelX = state.moveStartX + (state.moveTargetX * TILE_SIZE - state.moveStartX) * t;
          state.playerPixelY = state.moveStartY + (state.moveTargetY * TILE_SIZE - state.moveStartY) * t;
          state.playerIsMoving = true;

          if (t >= 1) {
            state.playerTileX = state.moveTargetX;
            state.playerTileY = state.moveTargetY;
            state.playerPixelX = state.playerTileX * TILE_SIZE;
            state.playerPixelY = state.playerTileY * TILE_SIZE;
            state.isAnimatingMove = false;
            state.moveProgress = 0;
          }
        }

        if (!state.isAnimatingMove) {
          let dx = 0;
          let dy = 0;
          let newDir = state.playerDirection;

          const keys = state.keysDown;
          if (keys.has('w') || keys.has('arrowup')) { dy = -1; newDir = Direction.Up; }
          else if (keys.has('s') || keys.has('arrowdown')) { dy = 1; newDir = Direction.Down; }
          else if (keys.has('a') || keys.has('arrowleft')) { dx = -1; newDir = Direction.Left; }
          else if (keys.has('d') || keys.has('arrowright')) { dx = 1; newDir = Direction.Right; }

          if (dx !== 0 || dy !== 0) {
            const newX = state.playerTileX + dx;
            const newY = state.playerTileY + dy;
            state.playerDirection = newDir;

            if (isWalkable(tileMap, newX, newY)) {
              state.moveTargetX = newX;
              state.moveTargetY = newY;
              state.moveStartX = state.playerPixelX;
              state.moveStartY = state.playerPixelY;
              state.isAnimatingMove = true;
              state.moveProgress = 0;
            }
          } else {
            state.playerIsMoving = false;
          }
        }

        // Update camera
        state.camera = setCameraTarget(state.camera, state.playerTileX, state.playerTileY);
        state.camera = updateCamera(state.camera, dt, mapWidth, mapHeight);
      },

      render(renderCtx: CanvasRenderingContext2D) {
        const renderState: ExplorationRenderState = {
          tileMap,
          playerTileX: state.playerTileX,
          playerTileY: state.playerTileY,
          playerPixelX: state.playerPixelX,
          playerPixelY: state.playerPixelY,
          playerDirection: state.playerDirection,
          playerIsMoving: state.playerIsMoving,
          camera: state.camera,
          elapsedMs: state.elapsedMs,
        };
        renderExploration(renderCtx, renderState);
      },
    });

    loop.start();
    loopRef.current = loop;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      loop.stop();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <canvas
      ref={canvasRef}
      width={VIEWPORT.logicalWidth}
      height={VIEWPORT.logicalHeight}
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
