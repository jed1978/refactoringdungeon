import { STRINGS } from "../../data/strings";

export function formatPlayerDamageLog(
  damage: number,
  isCrit: boolean,
): string {
  return isCrit
    ? STRINGS.playerDealsCrit.replace("{0}", String(damage))
    : STRINGS.playerDealsNormal.replace("{0}", String(damage));
}

export function formatEnemyDamageLog(damage: number, isCrit: boolean): string {
  return isCrit
    ? STRINGS.enemyDealsCrit.replace("{0}", String(damage))
    : STRINGS.enemyDealsNormal.replace("{0}", String(damage));
}

export function clampHpDemoMode(rawHp: number, isDemoMode: boolean): number {
  return isDemoMode && rawHp <= 0 ? 1 : rawHp;
}
