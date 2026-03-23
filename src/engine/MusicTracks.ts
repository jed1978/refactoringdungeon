// Barrel file — re-exports all track definitions
export type { Note, VoiceDef, TrackDef, MusicTrack } from "./MusicTypes";

import type { MusicTrack, TrackDef } from "./MusicTypes";
import { titleTrack }     from "./tracks/title";
import { explore1Track }  from "./tracks/explore1";
import { explore2Track }  from "./tracks/explore2";
import { explore3Track }  from "./tracks/explore3";
import { explore4Track }  from "./tracks/explore4";
import { combatTrack }    from "./tracks/combat";
import { combatBossTrack } from "./tracks/combatBoss";
import { victoryTrack }   from "./tracks/victory";
import { gameOverTrack }  from "./tracks/gameOver";

export const TRACKS: Partial<Record<MusicTrack, TrackDef>> = {
  title:        titleTrack,
  explore_1:    explore1Track,
  explore_2:    explore2Track,
  explore_3:    explore3Track,
  explore_4:    explore4Track,
  combat:       combatTrack,
  combat_boss:  combatBossTrack,
  victory:      victoryTrack,
  game_over:    gameOverTrack,
};
