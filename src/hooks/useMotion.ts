import { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
export function useMotion() {
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (alive) {
          setReduced(value);
        }
      })
      .catch(() => {});
    const motion = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    const activity = AppState.addEventListener('change', value =>
      setActive(value === 'active'),
    );
    return () => {
      alive = false;
      motion.remove();
      activity.remove();
    };
  }, []);
  return { reduced, enabled: !reduced && active };
}
