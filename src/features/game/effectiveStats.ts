import type { PlayerState, PlayerStats } from "../../utils/types";

export function getEffectiveStats(player: PlayerState): PlayerStats {
  const base = player.stats;
  const eq = player.equipment;
  const bonus = { atk: 0, def: 0, spd: 0 };
  for (const slot of Object.values(eq)) {
    if (slot) {
      bonus.atk += slot.stats.atk ?? 0;
      bonus.def += slot.stats.def ?? 0;
      bonus.spd += slot.stats.spd ?? 0;
    }
  }
  return {
    ...base,
    atk: base.atk + bonus.atk,
    def: base.def + bonus.def,
    spd: base.spd + bonus.spd,
  };
}
