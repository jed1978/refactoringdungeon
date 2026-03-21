import { useRef, useEffect, useCallback } from 'react';
import { Direction, TileType } from '../utils/types';
import type { CameraState } from '../utils/types';
import { TILE_SIZE, VIEWPORT } from '../utils/constants';
import { createGameLoop } from '../engine/GameLoop';
import type { GameLoopHandle } from '../engine/GameLoop';
import { renderExploration } from '../engine/Renderer';
import type { ExplorationRenderState, MapMonster } from '../engine/Renderer';
import { createCamera, setCameraTarget, updateCamera } from '../engine/Camera';
import { useGameState, useGameDispatch } from '../state/GameContext';
import { isWalkable, checkTileInteraction, checkFacingTile } from '../features/map/interactions';
import { getVisibleTiles, updateExplored, buildVisibleSet } from '../features/map/fogOfWar';
import { computeTouchDirection } from '../features/game/touchInput';
import {
  updateTransition,
  getTransitionAlpha,
  startTransition,
} from '../features/game/floorTransition';
import type { TransitionPhase } from '../features/game/floorTransition';
import { generateFloor } from '../features/map/bspGenerator';
import { STRINGS } from '../data/strings';
import { FLOOR_THEMES } from '../utils/constants';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  // Keep a mutable ref that mirrors context for game loop access
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const stateRef = useRef({
    playerTileX: 0,
    playerTileY: 0,
    playerPixelX: 0,
    playerPixelY: 0,
    playerDirection: Direction.Down,
    playerIsMoving: false,
    camera: createCamera(0, 0) as CameraState,
    elapsedMs: 0,
    keysDown: new Set<string>(),
    moveTargetX: 0,
    moveTargetY: 0,
    isAnimatingMove: false,
    moveProgress: 0,
    moveStartX: 0,
    moveStartY: 0,
    visibleSet: new Set<string>(),
    transition: { kind: 'idle' } as TransitionPhase,
    initialized: false,
  });

  const loopRef = useRef<GameLoopHandle | null>(null);

  // Sync player position from context to loop state
  useEffect(() => {
    const s = stateRef.current;
    const pos = gameState.player.position;
    if (!s.initialized || (s.playerTileX !== pos.x || s.playerTileY !== pos.y)) {
      s.playerTileX = pos.x;
      s.playerTileY = pos.y;
      s.playerPixelX = pos.x * TILE_SIZE;
      s.playerPixelY = pos.y * TILE_SIZE;
      s.moveTargetX = pos.x;
      s.moveTargetY = pos.y;

      // Update camera
      s.camera = setCameraTarget(s.camera, pos.x, pos.y);
      if (!s.initialized) {
        s.camera = { ...s.camera, x: s.camera.targetX, y: s.camera.targetY };
        s.initialized = true;
      }

      // Update fog
      const visible = getVisibleTiles(pos.x, pos.y);
      s.visibleSet = buildVisibleSet(visible);
      const gs = gameStateRef.current;
      const mapWidth = gs.floor.tileMap[0]?.length ?? 0;
      const mapHeight = gs.floor.tileMap.length;
      const newExplored = updateExplored(gs.floor.explored, visible, mapWidth, mapHeight);
      if (newExplored !== gs.floor.explored) {
        dispatch({ type: 'UPDATE_EXPLORED', explored: newExplored });
      }
    }
  }, [gameState.player.position, dispatch]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault();
      stateRef.current.keysDown.add(key);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    stateRef.current.keysDown.delete(key);

    // Space: interact with facing tile
    if (key === ' ') {
      const s = stateRef.current;
      const gs = gameStateRef.current;
      const facing = checkFacingTile(gs.floor.tileMap, { x: s.playerTileX, y: s.playerTileY }, s.playerDirection);

      switch (facing.kind) {
        case 'chest':
          dispatch({ type: 'OPEN_CHEST', position: facing.position });
          dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: STRINGS.chestOpened });
          setTimeout(() => dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: null }), 1500);
          break;
        case 'door_locked': {
          // Open door if all monsters in the floor are defeated (for boss doors)
          const tile = gs.floor.tileMap[facing.position.y]?.[facing.position.x];
          if (tile === TileType.DoorLocked) {
            dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: STRINGS.doorLockedPrompt });
            setTimeout(() => dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: null }), 1500);
          }
          break;
        }
        case 'event':
          dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: getEventPrompt(facing.tileType) });
          setTimeout(() => dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: null }), 2000);
          break;
        case 'shop':
          dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: STRINGS.shopPrompt });
          setTimeout(() => dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: null }), 1500);
          break;
        case 'stairs':
        case 'none':
          break;
      }

      // Check if standing on stairs
      const standing = checkTileInteraction(
        gs.floor.tileMap,
        gs.floor.monsters,
        { x: s.playerTileX, y: s.playerTileY },
      );
      if (standing.kind === 'stairs' && s.transition.kind === 'idle') {
        s.transition = startTransition();
      }
    }
  }, [dispatch]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    const rect = canvas.getBoundingClientRect();
    const scaleX = VIEWPORT.logicalWidth / rect.width;
    const scaleY = VIEWPORT.logicalHeight / rect.height;
    const tapX = (e.clientX - rect.left) * scaleX;
    const tapY = (e.clientY - rect.top) * scaleY;

    const playerScreenX = s.playerPixelX - s.camera.x + TILE_SIZE / 2;
    const playerScreenY = s.playerPixelY - s.camera.y + TILE_SIZE / 2;

    const dir = computeTouchDirection(tapX, tapY, playerScreenX, playerScreenY);
    if (dir !== null) {
      // Simulate key press for one frame
      const keyMap: Record<number, string> = {
        [Direction.Up]: 'arrowup',
        [Direction.Down]: 'arrowdown',
        [Direction.Left]: 'arrowleft',
        [Direction.Right]: 'arrowright',
      };
      const key = keyMap[dir];
      s.keysDown.add(key);
      setTimeout(() => s.keysDown.delete(key), 50);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false })!;
    ctx.imageSmoothingEnabled = false;

    const moveSpeed = 120;

    const loop = createGameLoop(ctx, {
      update(dt: number) {
        const s = stateRef.current;
        const gs = gameStateRef.current;

        if (gs.gameMode.mode !== 'exploring') return;

        s.elapsedMs += dt;
        const tileMap = gs.floor.tileMap;
        const mapWidth = tileMap[0]?.length ?? 0;
        const mapHeight = tileMap.length;

        // Handle floor transition
        if (s.transition.kind !== 'idle') {
          const floorLevel = gs.currentFloor;
          const floorName = `${floorLevel}F ${FLOOR_THEMES[Math.min(floorLevel - 1, 3)].name}`;
          s.transition = updateTransition(s.transition, dt, floorName);

          if (s.transition.kind === 'loading') {
            const nextLevel = gs.currentFloor + 1;
            if (nextLevel <= 4) {
              const seed = Date.now();
              const newFloor = generateFloor(nextLevel, seed);
              const startRoom = newFloor.rooms.find(r => r.type === 'start');
              const startPos = startRoom
                ? { x: Math.floor(startRoom.x + startRoom.width / 2), y: Math.floor(startRoom.y + startRoom.height / 2) }
                : { x: 5, y: 5 };
              dispatch({ type: 'CHANGE_FLOOR', floor: newFloor, startPos });
              s.initialized = false;
            } else {
              dispatch({ type: 'SET_GAME_MODE', gameMode: { mode: 'victory' } });
              s.transition = { kind: 'idle' };
              return;
            }
            const nextFloorName = `${nextLevel}F ${FLOOR_THEMES[Math.min(nextLevel - 1, 3)].name}`;
            s.transition = { kind: 'name_display', progress: 0, floorName: nextFloorName };
          }
          return;
        }

        // Handle movement animation
        if (s.isAnimatingMove) {
          s.moveProgress += dt;
          const t = Math.min(s.moveProgress / moveSpeed, 1);
          s.playerPixelX = s.moveStartX + (s.moveTargetX * TILE_SIZE - s.moveStartX) * t;
          s.playerPixelY = s.moveStartY + (s.moveTargetY * TILE_SIZE - s.moveStartY) * t;
          s.playerIsMoving = true;

          if (t >= 1) {
            s.playerTileX = s.moveTargetX;
            s.playerTileY = s.moveTargetY;
            s.playerPixelX = s.playerTileX * TILE_SIZE;
            s.playerPixelY = s.playerTileY * TILE_SIZE;
            s.isAnimatingMove = false;
            s.moveProgress = 0;

            // Update fog
            const visible = getVisibleTiles(s.playerTileX, s.playerTileY);
            s.visibleSet = buildVisibleSet(visible);
            const newExplored = updateExplored(gs.floor.explored, visible, mapWidth, mapHeight);
            if (newExplored !== gs.floor.explored) {
              dispatch({ type: 'UPDATE_EXPLORED', explored: newExplored });
            }

            // Dispatch position update to context
            dispatch({ type: 'MOVE_PLAYER', position: { x: s.playerTileX, y: s.playerTileY } });

            // Check tile interaction
            const interaction = checkTileInteraction(
              tileMap,
              gs.floor.monsters,
              { x: s.playerTileX, y: s.playerTileY },
            );

            switch (interaction.kind) {
              case 'monster':
                // Placeholder: defeat monster immediately (combat in Phase 3)
                dispatch({ type: 'DEFEAT_MONSTER', monsterIndex: interaction.monsterIndex });
                dispatch({
                  type: 'SET_INTERACTION_PROMPT',
                  prompt: STRINGS.combatTriggered.replace('{0}', interaction.monster.def.name),
                });
                setTimeout(() => dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: null }), 1500);
                break;
              case 'stairs':
                dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: STRINGS.stairsPrompt });
                break;
              default:
                break;
            }

            // Check facing tile for prompt
            const facing = checkFacingTile(tileMap, { x: s.playerTileX, y: s.playerTileY }, s.playerDirection);
            if (facing.kind !== 'none' && interaction.kind === 'none') {
              dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: getFacingPrompt(facing.kind) });
            } else if (interaction.kind === 'none' && facing.kind === 'none') {
              dispatch({ type: 'SET_INTERACTION_PROMPT', prompt: null });
            }
          }
        }

        // Start new movement
        if (!s.isAnimatingMove) {
          let dx = 0;
          let dy = 0;
          let newDir = s.playerDirection;

          const keys = s.keysDown;
          if (keys.has('w') || keys.has('arrowup')) { dy = -1; newDir = Direction.Up; }
          else if (keys.has('s') || keys.has('arrowdown')) { dy = 1; newDir = Direction.Down; }
          else if (keys.has('a') || keys.has('arrowleft')) { dx = -1; newDir = Direction.Left; }
          else if (keys.has('d') || keys.has('arrowright')) { dx = 1; newDir = Direction.Right; }

          if (dx !== 0 || dy !== 0) {
            const newX = s.playerTileX + dx;
            const newY = s.playerTileY + dy;
            s.playerDirection = newDir;

            if (isWalkable(tileMap, newX, newY)) {
              s.moveTargetX = newX;
              s.moveTargetY = newY;
              s.moveStartX = s.playerPixelX;
              s.moveStartY = s.playerPixelY;
              s.isAnimatingMove = true;
              s.moveProgress = 0;
            }
          } else {
            s.playerIsMoving = false;
          }
        }

        // Update camera
        s.camera = setCameraTarget(s.camera, s.playerTileX, s.playerTileY);
        s.camera = updateCamera(s.camera, dt, mapWidth, mapHeight);
      },

      render(renderCtx: CanvasRenderingContext2D) {
        const s = stateRef.current;
        const gs = gameStateRef.current;

        if (gs.gameMode.mode !== 'exploring') return;

        // Build monster list for rendering
        const mapMonsters: MapMonster[] = gs.floor.monsters.map(m => ({
          position: m.position,
          spriteId: m.def.spriteId,
        }));

        const renderState: ExplorationRenderState = {
          tileMap: gs.floor.tileMap,
          playerTileX: s.playerTileX,
          playerTileY: s.playerTileY,
          playerPixelX: s.playerPixelX,
          playerPixelY: s.playerPixelY,
          playerDirection: s.playerDirection,
          playerIsMoving: s.playerIsMoving,
          camera: s.camera,
          elapsedMs: s.elapsedMs,
          mapMonsters,
          explored: gs.floor.explored,
          visibleSet: s.visibleSet,
        };
        renderExploration(renderCtx, renderState);

        // Draw transition overlay
        const alpha = getTransitionAlpha(s.transition);
        if (alpha > 0) {
          renderCtx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          renderCtx.fillRect(0, 0, VIEWPORT.logicalWidth, VIEWPORT.logicalHeight);

          // Draw floor name during name_display phase
          if (s.transition.kind === 'name_display') {
            renderCtx.fillStyle = '#22c55e';
            renderCtx.font = "8px 'Press Start 2P'";
            renderCtx.textAlign = 'center';
            renderCtx.textBaseline = 'middle';
            renderCtx.fillText(
              s.transition.floorName,
              VIEWPORT.logicalWidth / 2,
              VIEWPORT.logicalHeight / 2,
            );
          }
        }
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
  }, [handleKeyDown, handleKeyUp, dispatch]);

  return (
    <canvas
      ref={canvasRef}
      width={VIEWPORT.logicalWidth}
      height={VIEWPORT.logicalHeight}
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }}
      onPointerDown={handlePointerDown}
    />
  );
}

function getEventPrompt(tileType: TileType): string {
  switch (tileType) {
    case TileType.Shrine: return STRINGS.shrinePrompt;
    case TileType.Bookshelf: return STRINGS.bookshelfPrompt;
    case TileType.CoffeeMachine: return STRINGS.coffeePrompt;
    default: return '';
  }
}

function getFacingPrompt(kind: string): string {
  switch (kind) {
    case 'chest': return STRINGS.chestPrompt;
    case 'door_locked': return STRINGS.doorLockedPrompt;
    case 'event': return '';
    case 'shop': return STRINGS.shopPrompt;
    default: return '';
  }
}
