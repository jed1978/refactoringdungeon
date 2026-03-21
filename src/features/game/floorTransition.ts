export type TransitionPhase =
  | { readonly kind: 'idle' }
  | { readonly kind: 'fade_out'; readonly progress: number }
  | { readonly kind: 'loading' }
  | { readonly kind: 'name_display'; readonly progress: number; readonly floorName: string }
  | { readonly kind: 'fade_in'; readonly progress: number };

const FADE_DURATION = 400;
const NAME_DISPLAY_DURATION = 2000;

export function startTransition(): TransitionPhase {
  return { kind: 'fade_out', progress: 0 };
}

export function updateTransition(
  state: TransitionPhase,
  dt: number,
  floorName: string,
): TransitionPhase {
  switch (state.kind) {
    case 'idle':
      return state;

    case 'fade_out': {
      const progress = state.progress + dt;
      if (progress >= FADE_DURATION) {
        return { kind: 'loading' };
      }
      return { kind: 'fade_out', progress };
    }

    case 'loading':
      // Caller should generate new floor and advance to name_display
      return { kind: 'name_display', progress: 0, floorName };

    case 'name_display': {
      const progress = state.progress + dt;
      if (progress >= NAME_DISPLAY_DURATION) {
        return { kind: 'fade_in', progress: 0 };
      }
      return { kind: 'name_display', progress, floorName: state.floorName };
    }

    case 'fade_in': {
      const progress = state.progress + dt;
      if (progress >= FADE_DURATION) {
        return { kind: 'idle' };
      }
      return { kind: 'fade_in', progress };
    }
  }
}

export function getTransitionAlpha(state: TransitionPhase): number {
  switch (state.kind) {
    case 'idle':
      return 0;
    case 'fade_out':
      return Math.min(state.progress / FADE_DURATION, 1);
    case 'loading':
    case 'name_display':
      return 1;
    case 'fade_in':
      return 1 - Math.min(state.progress / FADE_DURATION, 1);
  }
}
