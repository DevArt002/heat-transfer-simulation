import { useCallback, useState } from 'react';

interface IToggle {
  set: (a: boolean) => void;
  reset: () => void;
  toggle: () => void;
  toggleOn: () => void;
  toggleOff: () => void;
}

/**
 * Hooks for toggling
 * @param initial initial boolean value
 * @returns properties/functions for toggle
 */
export const useToggle = (initial = false): [boolean, IToggle] => {
  const [on, setToggle] = useState(initial);

  const reset = useCallback(() => setToggle(initial), [initial]);
  const toggle = useCallback(() => {
    setToggle((prev) => !prev);
  }, []);
  const toggleOn = useCallback(() => setToggle(true), []);
  const toggleOff = useCallback(() => setToggle(false), []);

  return [on, { set: setToggle, reset, toggle, toggleOn, toggleOff }];
};
