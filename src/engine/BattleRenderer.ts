import type { FloorTheme, SpriteFrame } from "../utils/types";
import { TILE_SIZE, VIEWPORT } from "../utils/constants";
import { drawSprite, getAnimationFrame } from "./SpriteRenderer";
import { renderParticles } from "./ParticleSystem";
import { renderDamageNumbers } from "./DamageNumbers";
import { renderFlash } from "./ScreenEffects";
import type { ParticleSystem } from "./ParticleSystem";
import type { DamageNumber } from "./DamageNumbers";
import type { ScreenFlash, ScreenShake } from "./ScreenEffects";
import { getShakeOffset } from "./ScreenEffects";
import { monsterBattleSprites } from "../sprites/monsters/battleIndex";
import { playerBattleSprite } from "../sprites/playerBattle";
import { hitSparkEffect } from "../sprites/effects";

export type BattleEnemy = {
  readonly spriteId: string;
  readonly animKey: string;
  readonly x: number;
  readonly y: number;
  readonly hpPercent: number;
  readonly maxHp: number;
  readonly currentHp: number;
  readonly name: string;
  readonly flashWhite: boolean;
  readonly visible: boolean;
  readonly offsetX: number;
  readonly offsetY: number;
};

export type BattlePlayer = {
  readonly animKey: string;
  readonly x: number;
  readonly y: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly flashWhite: boolean;
};

export type HitSpark = {
  readonly x: number;
  readonly y: number;
  readonly elapsed: number;
};

export type BattleRenderState = {
  readonly theme: FloorTheme;
  readonly elapsedMs: number;
  readonly enemies: readonly BattleEnemy[];
  readonly player: BattlePlayer;
  readonly particles: ParticleSystem;
  readonly damageNumbers: readonly DamageNumber[];
  readonly screenFlash: ScreenFlash | null;
  readonly screenShake: ScreenShake | null;
  readonly hitSparks: readonly HitSpark[];
};

const PLAYER_X = VIEWPORT.logicalWidth - 56;
const PLAYER_Y = VIEWPORT.logicalHeight - 72;
const PLAYER_W = 32;
const PLAYER_H = 48;
const MONSTER_Y = 24;
const MONSTER_SIZE_NORMAL = 32;
const MONSTER_SIZE_BOSS = 48;

export function renderBattle(
  ctx: CanvasRenderingContext2D,
  state: BattleRenderState,
): void {
  const { logicalWidth, logicalHeight } = VIEWPORT;

  // Apply screen shake
  let shakeX = 0;
  let shakeY = 0;
  if (state.screenShake) {
    const offset = getShakeOffset(state.screenShake);
    shakeX = offset.x;
    shakeY = offset.y;
    ctx.save();
    ctx.translate(shakeX, shakeY);
  }

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, logicalHeight);
  bgGrad.addColorStop(0, darken(state.theme.wallColor, 0.5));
  bgGrad.addColorStop(1, darken(state.theme.floorColor, 0.3));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Floating background particles (ambient atmosphere)
  ctx.fillStyle = state.theme.accent;
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 8; i++) {
    const px = (state.elapsedMs * (0.01 + i * 0.005) + i * 30) % logicalWidth;
    const py =
      (state.elapsedMs * (0.008 + i * 0.003) + i * 20) % (logicalHeight * 0.6);
    ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
  }
  ctx.globalAlpha = 1;

  // Ground tiles (3 rows at bottom)
  const groundY = logicalHeight - TILE_SIZE * 3;
  ctx.fillStyle = state.theme.floorColor;
  ctx.fillRect(0, groundY, logicalWidth, TILE_SIZE * 3);
  ctx.fillStyle = darken(state.theme.floorColor, 0.2);
  ctx.fillRect(0, groundY, logicalWidth, 1);

  // Draw monsters
  state.enemies.forEach((enemy, idx) => {
    if (!enemy.visible) return;

    const spriteSheets = monsterBattleSprites[enemy.spriteId];
    const sheet = spriteSheets?.[enemy.animKey] ?? spriteSheets?.["idle"];
    if (!sheet) return;

    const isBoss = enemy.spriteId === "spaghetti_code";
    const size = isBoss ? MONSTER_SIZE_BOSS : MONSTER_SIZE_NORMAL;
    const drawX = Math.round(enemy.x + enemy.offsetX);
    const drawY = Math.round(enemy.y + enemy.offsetY);

    if (enemy.flashWhite) {
      drawWhiteFlash(ctx, sheet.frames[0], size, size, drawX, drawY);
    } else {
      const frame = getAnimationFrame(sheet, state.elapsedMs);
      drawSprite(ctx, frame, drawX, drawY, size, size);
    }

    // HP bar above monster
    renderHpBar(
      ctx,
      drawX,
      drawY - 8,
      size,
      enemy.hpPercent,
      enemy.currentHp,
      enemy.maxHp,
    );

    // Monster name below sprite (避免被頂部 log 遮住)
    ctx.font = "10px 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    // 半透明黑色底色增加可讀性
    const nameY = drawY + size + 3;
    const nameW = ctx.measureText(enemy.name).width;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(drawX + size / 2 - nameW / 2 - 2, nameY - 1, nameW + 4, 11);
    ctx.fillStyle = "#fde68a";
    ctx.fillText(enemy.name, drawX + size / 2, nameY);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  });

  // Draw player
  {
    const sheet =
      playerBattleSprite[state.player.animKey] ?? playerBattleSprite.idle;
    const drawX = Math.round(state.player.x + state.player.offsetX);
    const drawY = Math.round(state.player.y + state.player.offsetY);

    if (state.player.flashWhite) {
      drawWhiteFlash(
        ctx,
        sheet.frames[0],
        PLAYER_W,
        PLAYER_H,
        drawX,
        drawY,
        true,
      );
    } else {
      const frame = getAnimationFrame(sheet, state.elapsedMs);
      drawSprite(ctx, frame, drawX, drawY, PLAYER_W, PLAYER_H, true); // flip=true to face left
    }
  }

  // Hit sparks
  for (const spark of state.hitSparks) {
    const frame = getAnimationFrame(hitSparkEffect, spark.elapsed);
    drawSprite(ctx, frame, spark.x - 8, spark.y - 8, 16, 16);
  }

  // Particles (pixel dissolve, etc.)
  renderParticles(ctx, state.particles);

  // Damage numbers
  renderDamageNumbers(ctx, state.damageNumbers);

  // Restore shake transform
  if (state.screenShake) {
    ctx.restore();
  }

  // Screen flash (outside shake transform)
  if (state.screenFlash) {
    renderFlash(ctx, state.screenFlash, logicalWidth, logicalHeight);
  }
}

function renderHpBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  hpPercent: number,
  currentHp: number,
  maxHp: number,
): void {
  const barW = width;
  const barH = 4;
  // Border
  ctx.fillStyle = "#000000";
  ctx.fillRect(x - 1, y - 1, barW + 2, barH + 2);
  // Background
  ctx.fillStyle = "#4a1515";
  ctx.fillRect(x, y, barW, barH);
  // Fill
  const fillW = Math.round(barW * hpPercent);
  const hpColor =
    hpPercent > 0.5 ? "#22c55e" : hpPercent > 0.25 ? "#eab308" : "#ef4444";
  ctx.fillStyle = hpColor;
  if (fillW > 0) ctx.fillRect(x, y, fillW, barH);
}

function drawWhiteFlash(
  ctx: CanvasRenderingContext2D,
  frame: SpriteFrame,
  width: number,
  height: number,
  x: number,
  y: number,
  flip = false,
): void {
  // Draw sprite then overlay white
  drawSprite(ctx, frame, x, y, width, height, flip);
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, width, height);
  ctx.globalAlpha = 1;
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `rgb(${dr},${dg},${db})`;
}

export function getDefaultEnemyPositions(
  count: number,
): { x: number; y: number }[] {
  const spacing = VIEWPORT.logicalWidth / (count + 1);
  return Array.from({ length: count }, (_, i) => ({
    x: Math.round(spacing * (i + 1) - MONSTER_SIZE_NORMAL / 2),
    y: MONSTER_Y,
  }));
}

export const BATTLE_PLAYER_X = PLAYER_X;
export const BATTLE_PLAYER_Y = PLAYER_Y;
