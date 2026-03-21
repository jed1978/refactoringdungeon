import type { SpriteSheet } from '../../utils/types';
import { duplicateCodeSprite } from './duplicateCode';
import { magicNumberSprite } from './magicNumber';
import { deadCodeSprite } from './deadCode';
import { longMethodSprite } from './longMethod';
import { featureEnvySprite } from './featureEnvy';
import { shotgunSurgerySprite } from './shotgunSurgery';
import { circularDependencySprite } from './circularDependency';
import { nPlusOneSprite } from './nPlusOne';
import { prematureOptimizationSprite } from './prematureOptimization';
import { leakyAbstractionSprite } from './leakyAbstraction';
import { bigBallOfMudSprite } from './bigBallOfMud';
import { dataClumpSprite } from './dataClump';
import { lazyClassSprite } from './lazyClass';
import { godClassSprite } from './godClass';

export const monsterMapSprites: Record<string, SpriteSheet> = {
  duplicate_code: duplicateCodeSprite,
  magic_number: magicNumberSprite,
  dead_code: deadCodeSprite,
  long_method: longMethodSprite,
  feature_envy: featureEnvySprite,
  shotgun_surgery: shotgunSurgerySprite,
  circular_dependency: circularDependencySprite,
  n_plus_one: nPlusOneSprite,
  premature_optimization: prematureOptimizationSprite,
  leaky_abstraction: leakyAbstractionSprite,
  big_ball_of_mud: bigBallOfMudSprite,
  data_clump: dataClumpSprite,
  lazy_class: lazyClassSprite,
  god_class: godClassSprite,
};
