import type { SpriteFrame, SpriteSheet } from "../utils/types";

// Cache pre-rendered sprites as ImageBitmap for performance
const spriteCache = new Map<SpriteFrame, ImageData>();

function renderFrameToImageData(
  frame: SpriteFrame,
  width: number,
  height: number,
): ImageData {
  const cached = spriteCache.get(frame);
  if (cached) return cached;

  const imageData = new ImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    const row = frame[y];
    if (!row) continue;
    for (let x = 0; x < width; x++) {
      const color = row[x];
      if (color === null) continue;
      const idx = (y * width + x) * 4;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  spriteCache.set(frame, imageData);
  return imageData;
}

// Offscreen canvas cache for putImageData -> drawImage workflow
const canvasCache = new Map<SpriteFrame, HTMLCanvasElement>();

function getFrameCanvas(
  frame: SpriteFrame,
  width: number,
  height: number,
): HTMLCanvasElement {
  const cached = canvasCache.get(frame);
  if (cached) return cached;

  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const octx = offscreen.getContext("2d")!;
  const imageData = renderFrameToImageData(frame, width, height);
  octx.putImageData(imageData, 0, 0);
  canvasCache.set(frame, offscreen);
  return offscreen;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  frame: SpriteFrame,
  x: number,
  y: number,
  width: number,
  height: number,
  flip: boolean = false,
): void {
  const offscreen = getFrameCanvas(frame, width, height);

  if (flip) {
    ctx.save();
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(offscreen, 0, 0);
    ctx.restore();
  } else {
    ctx.drawImage(offscreen, x, y);
  }
}

export function getAnimationFrame(
  sheet: SpriteSheet,
  elapsedMs: number,
): SpriteFrame {
  const totalDuration = sheet.frames.length * sheet.frameDuration;
  const loopTime = elapsedMs % totalDuration;
  const frameIndex = Math.floor(loopTime / sheet.frameDuration);
  return sheet.frames[frameIndex];
}
