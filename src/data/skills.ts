import type { Skill } from '../utils/types';

export const SKILLS: readonly Skill[] = [
  {
    id: 'extract_method',
    name: '提取方法',
    description: '把一坨程式碼提取成獨立方法，造成 1.5 倍傷害',
    mpCost: 2,
    multiplier: 1.5,
    effect: 'damage',
    unlockLevel: 1,
  },
  {
    id: 'rename_variable',
    name: '重新命名',
    description: '給變數一個有意義的名字，揭露敵人所有數值與弱點',
    mpCost: 1,
    multiplier: 0,
    effect: 'reveal',
    unlockLevel: 1,
  },
  {
    id: 'inline_temp',
    name: '內聯暫存',
    description: '消除不必要的中間變數，速度 0.8 倍傷害但永遠先手',
    mpCost: 1,
    multiplier: 0.8,
    effect: 'always_first',
    unlockLevel: 1,
  },
  {
    id: 'replace_magic_number',
    name: '常數替換',
    description: '用具名常數取代魔法數字，眩暈敵人 1 回合，對魔數精靈造成 2 倍傷害',
    mpCost: 3,
    multiplier: 2.0,
    effect: 'stun',
    unlockLevel: 3,
  },
  {
    id: 'move_method',
    name: '搬移方法',
    description: '把方法移到正確的類別，下一次攻擊必定閃避',
    mpCost: 2,
    multiplier: 0,
    effect: 'dodge_next',
    unlockLevel: 5,
  },
  {
    id: 'introduce_parameter_object',
    name: '參數物件化',
    description: '把一堆參數包成物件，對所有敵人造成 0.7 倍傷害',
    mpCost: 4,
    multiplier: 0.7,
    effect: 'aoe',
    unlockLevel: 7,
  },
] as const;

export const SKILLS_MAP: Readonly<Record<string, Skill>> = Object.fromEntries(
  SKILLS.map(s => [s.id, s]),
);
