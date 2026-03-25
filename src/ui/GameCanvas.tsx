import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Direction, TileType } from "../utils/types";
import type { CameraState, CombatAction, GameMode } from "../utils/types";
import { MusicSystem } from "../engine/MusicSystem";
import type { MusicTrack } from "../engine/MusicSystem";
import { TILE_SIZE, VIEWPORT } from "../utils/constants";
import { createGameLoop } from "../engine/GameLoop";
import type { GameLoopHandle } from "../engine/GameLoop";
import { renderExploration } from "../engine/Renderer";
import type { ExplorationRenderState, MapMonster } from "../engine/Renderer";
import { renderBattle } from "../engine/BattleRenderer";
import { createCamera, setCameraTarget, updateCamera } from "../engine/Camera";
import { useGameState, useGameDispatch } from "../state/GameContext";
import {
  isWalkable,
  checkTileInteraction,
  checkFacingTile,
} from "../features/map/interactions";
import {
  getVisibleTiles,
  updateExplored,
  buildVisibleSet,
} from "../features/map/fogOfWar";
import { computeTouchDirection } from "../features/game/touchInput";
import {
  updateTransition,
  getTransitionAlpha,
  startTransition,
} from "../features/game/floorTransition";
import type { TransitionPhase } from "../features/game/floorTransition";
import { generateFloor } from "../features/map/bspGenerator";
import { STRINGS } from "../data/strings";
import { FLOOR_THEMES } from "../utils/constants";
import {
  createCombatLoopState,
  updateCombatLoop,
  buildBattleRenderState,
} from "../features/combat/combatLoop";
import type { CombatLoopState } from "../features/combat/combatLoop";
import { queueAnimation } from "../engine/BattleAnimator";
import { createRng } from "../utils/random";
import { getMonsterPool } from "../features/map/monsterPools";
import { AudioSystem } from "../engine/AudioSystem";

export type GameCanvasHandle = {
  submitCombatAction: (action: CombatAction) => void;
};

function computeMusicTrack(gameMode: GameMode, floor: number): MusicTrack {
  switch (gameMode.mode) {
    case "title":
      return "title";
    case "exploring":
    case "event":
    case "shop":
      return `explore_${Math.min(floor, 4)}` as MusicTrack;
    case "combat":
      return gameMode.combat.enemies.some((e) =>
        e.def.behavior.startsWith("boss_"),
      )
        ? "combat_boss"
        : "combat";
    case "victory":
      return "victory";
    case "game_over":
      return "game_over";
    default:
      return "silence";
  }
}

export const GameCanvas = forwardRef<GameCanvasHandle, object>(
  function GameCanvas(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameState = useGameState();
    const dispatch = useGameDispatch();

    const gameStateRef = useRef(gameState);
    useEffect(() => {
      gameStateRef.current = gameState;
    }, [gameState]);

    const musicTrack = computeMusicTrack(
      gameState.gameMode,
      gameState.currentFloor,
    );
    useEffect(() => {
      MusicSystem.setTrack(musicTrack);
    }, [musicTrack]);

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
      inputQueue: [] as string[],
      moveTargetX: 0,
      moveTargetY: 0,
      isAnimatingMove: false,
      moveProgress: 0,
      moveStartX: 0,
      moveStartY: 0,
      visibleSet: new Set<string>(),
      transition: { kind: "idle" } as TransitionPhase,
      initialized: false,
      combatLoop: null as CombatLoopState | null,
      pendingCombatAction: null as CombatAction | null,
    });

    useImperativeHandle(ref, () => ({
      submitCombatAction: (action: CombatAction) => {
        stateRef.current.pendingCombatAction = action;
      },
    }));

    const loopRef = useRef<GameLoopHandle | null>(null);

    useEffect(() => {
      const s = stateRef.current;
      const pos = gameState.player.position;
      if (
        !s.initialized ||
        s.playerTileX !== pos.x ||
        s.playerTileY !== pos.y
      ) {
        s.playerTileX = pos.x;
        s.playerTileY = pos.y;
        s.playerPixelX = pos.x * TILE_SIZE;
        s.playerPixelY = pos.y * TILE_SIZE;
        s.moveTargetX = pos.x;
        s.moveTargetY = pos.y;

        s.camera = setCameraTarget(s.camera, pos.x, pos.y);
        if (!s.initialized) {
          s.camera = { ...s.camera, x: s.camera.targetX, y: s.camera.targetY };
          s.initialized = true;
        }

        const visible = getVisibleTiles(pos.x, pos.y);
        s.visibleSet = buildVisibleSet(visible);
        const gs = gameStateRef.current;
        const mapWidth = gs.floor.tileMap[0]?.length ?? 0;
        const mapHeight = gs.floor.tileMap.length;
        const newExplored = updateExplored(
          gs.floor.explored,
          visible,
          mapWidth,
          mapHeight,
        );
        if (newExplored !== gs.floor.explored) {
          dispatch({ type: "UPDATE_EXPLORED", explored: newExplored });
        }
      }
    }, [gameState.player.position, dispatch]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          " ",
        ].includes(key)
      ) {
        e.preventDefault();
        stateRef.current.keysDown.add(key);
        if (
          [
            "w",
            "a",
            "s",
            "d",
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",
          ].includes(key)
        ) {
          stateRef.current.inputQueue.push(key);
        }
      }
    }, []);

    const handleKeyUp = useCallback(
      (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        stateRef.current.keysDown.delete(key);

        if (key === " ") {
          const s = stateRef.current;
          const gs = gameStateRef.current;
          if (gs.gameMode.mode !== "exploring") return;
          const facing = checkFacingTile(
            gs.floor.tileMap,
            { x: s.playerTileX, y: s.playerTileY },
            s.playerDirection,
          );

          switch (facing.kind) {
            case "chest":
              dispatch({ type: "OPEN_CHEST", position: facing.position });
              AudioSystem.play("chest_open");
              dispatch({
                type: "SET_INTERACTION_PROMPT",
                prompt: STRINGS.chestOpened,
              });
              setTimeout(
                () =>
                  dispatch({ type: "SET_INTERACTION_PROMPT", prompt: null }),
                1500,
              );
              break;
            case "door_locked": {
              const tile =
                gs.floor.tileMap[facing.position.y]?.[facing.position.x];
              if (tile === TileType.DoorLocked) {
                dispatch({
                  type: "SET_INTERACTION_PROMPT",
                  prompt: STRINGS.doorLockedPrompt,
                });
                setTimeout(
                  () =>
                    dispatch({ type: "SET_INTERACTION_PROMPT", prompt: null }),
                  1500,
                );
              }
              break;
            }
            case "event":
              dispatch({
                type: "SET_GAME_MODE",
                gameMode: {
                  mode: "event",
                  eventId: tileTypeToEventId(facing.tileType),
                  eventTilePos: facing.position,
                },
              });
              break;
            case "boss_door": {
              const nonBossAlive = gs.floor.monsters.some(
                (m) => !m.def.behavior.startsWith("boss_"),
              );
              if (nonBossAlive) {
                dispatch({
                  type: "SET_INTERACTION_PROMPT",
                  prompt: STRINGS.bossDoorLocked,
                });
                setTimeout(
                  () =>
                    dispatch({ type: "SET_INTERACTION_PROMPT", prompt: null }),
                  1500,
                );
              } else {
                dispatch({
                  type: "OPEN_BOSS_DOOR",
                  position: facing.position,
                });
                AudioSystem.play("door_open");
              }
              break;
            }
            case "shop":
              dispatch({
                type: "SET_GAME_MODE",
                gameMode: { mode: "shop" },
              });
              break;
            case "training": {
              const pool = getMonsterPool(gs.currentFloor);
              const count = Math.random() < 0.4 ? 2 : 1;
              const trainingMonsters = Array.from({ length: count }, () => {
                const def = pool[Math.floor(Math.random() * pool.length)];
                return {
                  def,
                  currentHp: def.hp,
                  position: { x: 0, y: 0 },
                  buffs: [],
                  stunResistance: 0,
                };
              });
              dispatch({
                type: "TRIGGER_COMBAT",
                monsters: trainingMonsters,
                floorMonsterIndex: -1,
              });
              break;
            }
            case "stairs":
            case "none":
              break;
          }

          const standing = checkTileInteraction(
            gs.floor.tileMap,
            gs.floor.monsters,
            { x: s.playerTileX, y: s.playerTileY },
          );
          if (standing.kind === "stairs" && s.transition.kind === "idle") {
            const bossAlive = gs.floor.monsters.some((m) =>
              m.def.behavior.startsWith("boss_"),
            );
            if (bossAlive) {
              dispatch({
                type: "SET_INTERACTION_PROMPT",
                prompt: STRINGS.bossAliveNoStairs,
              });
              setTimeout(
                () =>
                  dispatch({ type: "SET_INTERACTION_PROMPT", prompt: null }),
                1500,
              );
            } else {
              s.transition = startTransition();
            }
          }
        }
      },
      [dispatch],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
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

        const dir = computeTouchDirection(
          tapX,
          tapY,
          playerScreenX,
          playerScreenY,
        );
        if (dir !== null) {
          const keyMap: Record<number, string> = {
            [Direction.Up]: "arrowup",
            [Direction.Down]: "arrowdown",
            [Direction.Left]: "arrowleft",
            [Direction.Right]: "arrowright",
          };
          const key = keyMap[dir];
          s.keysDown.add(key);
          setTimeout(() => s.keysDown.delete(key), 50);
        }
      },
      [],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false })!;
      ctx.imageSmoothingEnabled = false;

      const moveSpeed = 120;

      const loop = createGameLoop(ctx, {
        update(dt: number) {
          const s = stateRef.current;
          const gs = gameStateRef.current;

          // --- COMBAT UPDATE ---
          if (gs.gameMode.mode === "combat") {
            // Initialize combat loop on first frame
            if (!s.combatLoop) {
              const rng = createRng(Date.now());
              s.combatLoop = createCombatLoopState(gs.gameMode.combat, rng);
              s.combatLoop.animState = queueAnimation(s.combatLoop.animState, {
                kind: "transition_in",
                elapsed: 0,
              });
            }

            const pending = s.pendingCombatAction;
            updateCombatLoop(
              s.combatLoop,
              gs,
              dt,
              pending,
              () => {
                s.pendingCombatAction = null;
              },
              dispatch,
            );
            return;
          }

          // Clean up combat loop when leaving combat
          if (s.combatLoop) {
            s.combatLoop = null;
          }

          // --- EXPLORATION UPDATE ---
          if (gs.gameMode.mode !== "exploring" && gs.gameMode.mode !== "event")
            return;

          s.elapsedMs += dt;
          const tileMap = gs.floor.tileMap;
          const mapWidth = tileMap[0]?.length ?? 0;
          const mapHeight = tileMap.length;

          if (s.transition.kind !== "idle") {
            const floorLevel = gs.currentFloor;
            const floorName = `${floorLevel}F ${FLOOR_THEMES[Math.min(floorLevel - 1, 3)].name}`;
            s.transition = updateTransition(s.transition, dt, floorName);

            if (s.transition.kind === "loading") {
              const nextLevel = gs.currentFloor + 1;
              if (nextLevel <= 4) {
                const seed = Date.now();
                const newFloor = generateFloor(nextLevel, seed);
                const startRoom = newFloor.rooms.find(
                  (r) => r.type === "start",
                );
                const startPos = startRoom
                  ? {
                      x: Math.floor(startRoom.x + startRoom.width / 2),
                      y: Math.floor(startRoom.y + startRoom.height / 2),
                    }
                  : { x: 5, y: 5 };
                dispatch({ type: "CHANGE_FLOOR", floor: newFloor, startPos });
                dispatch({ type: "SET_FLOOR_CLEARED", floor: gs.currentFloor });
                s.initialized = false;
              } else {
                dispatch({
                  type: "SET_GAME_MODE",
                  gameMode: { mode: "victory" },
                });
                s.transition = { kind: "idle" };
                return;
              }
              const nextFloorName = `${gs.currentFloor + 1}F ${FLOOR_THEMES[Math.min(gs.currentFloor, 3)].name}`;
              s.transition = {
                kind: "name_display",
                progress: 0,
                floorName: nextFloorName,
              };
            }
            return;
          }

          if (s.isAnimatingMove) {
            s.moveProgress += dt;
            const t = Math.min(s.moveProgress / moveSpeed, 1);
            s.playerPixelX =
              s.moveStartX + (s.moveTargetX * TILE_SIZE - s.moveStartX) * t;
            s.playerPixelY =
              s.moveStartY + (s.moveTargetY * TILE_SIZE - s.moveStartY) * t;
            s.playerIsMoving = true;

            if (t >= 1) {
              s.playerTileX = s.moveTargetX;
              s.playerTileY = s.moveTargetY;
              s.playerPixelX = s.playerTileX * TILE_SIZE;
              s.playerPixelY = s.playerTileY * TILE_SIZE;
              s.isAnimatingMove = false;
              s.moveProgress = 0;
              AudioSystem.play("step");

              const visible = getVisibleTiles(s.playerTileX, s.playerTileY);
              s.visibleSet = buildVisibleSet(visible);
              const newExplored = updateExplored(
                gs.floor.explored,
                visible,
                mapWidth,
                mapHeight,
              );
              if (newExplored !== gs.floor.explored) {
                dispatch({ type: "UPDATE_EXPLORED", explored: newExplored });
              }

              dispatch({
                type: "MOVE_PLAYER",
                position: { x: s.playerTileX, y: s.playerTileY },
              });

              const interaction = checkTileInteraction(
                tileMap,
                gs.floor.monsters,
                { x: s.playerTileX, y: s.playerTileY },
              );

              switch (interaction.kind) {
                case "monster":
                  if (gs.skipEncounters > 0) {
                    dispatch({ type: "DECREMENT_SKIP" });
                    dispatch({
                      type: "DEFEAT_MONSTER",
                      monsterIndex: interaction.monsterIndex,
                    });
                    dispatch({
                      type: "SET_INTERACTION_PROMPT",
                      prompt: STRINGS.encounterSkipped.replace(
                        "{0}",
                        String(gs.skipEncounters - 1),
                      ),
                    });
                    setTimeout(
                      () =>
                        dispatch({
                          type: "SET_INTERACTION_PROMPT",
                          prompt: null,
                        }),
                      1800,
                    );
                  } else {
                    dispatch({
                      type: "TRIGGER_COMBAT",
                      monsters: [interaction.monster],
                      floorMonsterIndex: interaction.monsterIndex,
                    });
                  }
                  break;
                case "stairs":
                  dispatch({
                    type: "SET_INTERACTION_PROMPT",
                    prompt: STRINGS.stairsPrompt,
                  });
                  break;
                default:
                  break;
              }

              const facing = checkFacingTile(
                tileMap,
                { x: s.playerTileX, y: s.playerTileY },
                s.playerDirection,
              );
              if (facing.kind !== "none" && interaction.kind === "none") {
                dispatch({
                  type: "SET_INTERACTION_PROMPT",
                  prompt: getFacingPrompt(facing),
                });
              } else if (
                interaction.kind === "none" &&
                facing.kind === "none"
              ) {
                dispatch({ type: "SET_INTERACTION_PROMPT", prompt: null });
              }
            }
          }

          // Consume queued key taps (press+release within a single frame)
          const queuedKey = s.inputQueue.shift();
          s.inputQueue.length = 0;

          if (!s.isAnimatingMove) {
            let dx = 0;
            let dy = 0;
            let newDir = s.playerDirection;

            const keys = s.keysDown;
            const activeKey =
              keys.has("w") || keys.has("arrowup")
                ? "w"
                : keys.has("s") || keys.has("arrowdown")
                  ? "s"
                  : keys.has("a") || keys.has("arrowleft")
                    ? "a"
                    : keys.has("d") || keys.has("arrowright")
                      ? "d"
                      : (queuedKey ?? "");

            if (activeKey === "w" || activeKey === "arrowup") {
              dy = -1;
              newDir = Direction.Up;
            } else if (activeKey === "s" || activeKey === "arrowdown") {
              dy = 1;
              newDir = Direction.Down;
            } else if (activeKey === "a" || activeKey === "arrowleft") {
              dx = -1;
              newDir = Direction.Left;
            } else if (activeKey === "d" || activeKey === "arrowright") {
              dx = 1;
              newDir = Direction.Right;
            }

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

          s.camera = setCameraTarget(s.camera, s.playerTileX, s.playerTileY);
          s.camera = updateCamera(s.camera, dt, mapWidth, mapHeight);
        },

        render(renderCtx: CanvasRenderingContext2D) {
          const s = stateRef.current;
          const gs = gameStateRef.current;

          // --- COMBAT RENDER ---
          if (gs.gameMode.mode === "combat" && s.combatLoop) {
            const renderState = buildBattleRenderState(
              s.combatLoop,
              gs.gameMode.combat,
              gs.floor.theme,
            );
            renderBattle(renderCtx, renderState);
            return;
          }

          // --- EXPLORATION RENDER ---
          if (gs.gameMode.mode !== "exploring" && gs.gameMode.mode !== "event")
            return;

          const mapMonsters: MapMonster[] = gs.floor.monsters.map((m) => ({
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
            floorLevel: gs.currentFloor,
          };
          renderExploration(renderCtx, renderState);

          const alpha = getTransitionAlpha(s.transition);
          if (alpha > 0) {
            renderCtx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            renderCtx.fillRect(
              0,
              0,
              VIEWPORT.logicalWidth,
              VIEWPORT.logicalHeight,
            );

            if (s.transition.kind === "name_display") {
              renderCtx.fillStyle = "#22c55e";
              renderCtx.font = "24px 'Press Start 2P'";
              renderCtx.textAlign = "center";
              renderCtx.textBaseline = "middle";
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

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      const clearKeys = () => {
        stateRef.current.keysDown.clear();
        stateRef.current.inputQueue.length = 0;
      };
      const handleVisibilityChange = () => {
        if (document.hidden) clearKeys();
      };
      window.addEventListener("blur", clearKeys);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        loop.stop();
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("blur", clearKeys);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }, [handleKeyDown, handleKeyUp, dispatch]);

    return (
      <canvas
        ref={canvasRef}
        width={VIEWPORT.logicalWidth}
        height={VIEWPORT.logicalHeight}
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
        onPointerDown={handlePointerDown}
      />
    );
  },
);

function tileTypeToEventId(tileType: TileType): string {
  switch (tileType) {
    case TileType.Shrine:
      return "shrine";
    case TileType.Bookshelf:
      return "bookshelf";
    case TileType.CoffeeMachine:
      return "coffee";
    case TileType.DebtCollector:
      return "debt_collector";
    case TileType.PairProgrammer:
      return "pair_programmer";
    case TileType.LegacyDocs:
      return "legacy_docs";
    default:
      return "shrine";
  }
}

function getFacingPrompt(
  facing: import("../features/map/interactions").InteractionResult,
): string {
  switch (facing.kind) {
    case "chest":
      return STRINGS.chestPrompt;
    case "door_locked":
      return STRINGS.doorLockedPrompt;
    case "boss_door":
      return STRINGS.bossDoorOpen;
    case "shop":
      return STRINGS.shopPrompt;
    case "training":
      return STRINGS.trainingRoomPrompt;
    case "event":
      switch (facing.tileType) {
        case TileType.Shrine:
          return STRINGS.shrinePrompt;
        case TileType.Bookshelf:
          return STRINGS.bookshelfPrompt;
        case TileType.CoffeeMachine:
          return STRINGS.coffeePrompt;
        case TileType.DebtCollector:
          return STRINGS.debtCollectorPrompt;
        case TileType.PairProgrammer:
          return STRINGS.pairProgrammerPrompt;
        case TileType.LegacyDocs:
          return STRINGS.legacyDocsPrompt;
        default:
          return "按 Space 互動";
      }
    default:
      return "";
  }
}
