// src/accessibility/AccessibilityContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  AccessibilityInfo,
  Platform,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Theme,
  ThemeMode,
  FontScale,
  lightTheme,
  darkTheme,
  highContrastTheme,
  fontScaleMultipliers,
} from '../theme';

// ─── State ────────────────────────────────────────────────────────────────────

interface A11yState {
  themeMode: ThemeMode;
  theme: Theme;
  fontScale: FontScale;
  reduceMotion: boolean;
  screenReaderActive: boolean;
  boldText: boolean;
  // Demo-specific toggles
  showA11yBadges: boolean;
  highlightFocusRing: boolean;
}

type A11yAction =
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'SET_FONT_SCALE'; payload: FontScale }
  | { type: 'SET_REDUCE_MOTION'; payload: boolean }
  | { type: 'SET_SCREEN_READER'; payload: boolean }
  | { type: 'SET_BOLD_TEXT'; payload: boolean }
  | { type: 'TOGGLE_A11Y_BADGES' }
  | { type: 'TOGGLE_FOCUS_RING' }
  | { type: 'LOAD_SAVED'; payload: Partial<A11yState> };

const resolveTheme = (mode: ThemeMode): Theme => {
  switch (mode) {
    case 'dark':        return darkTheme;
    case 'highContrast': return highContrastTheme;
    default:            return lightTheme;
  }
};

const initialState: A11yState = {
  themeMode: 'light',
  theme: lightTheme,
  fontScale: 'normal',
  reduceMotion: false,
  screenReaderActive: false,
  boldText: false,
  showA11yBadges: true,
  highlightFocusRing: true,
};

function reducer(state: A11yState, action: A11yAction): A11yState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        themeMode: action.payload,
        theme: resolveTheme(action.payload),
      };
    case 'SET_FONT_SCALE':
      return { ...state, fontScale: action.payload };
    case 'SET_REDUCE_MOTION':
      return { ...state, reduceMotion: action.payload };
    case 'SET_SCREEN_READER':
      return { ...state, screenReaderActive: action.payload };
    case 'SET_BOLD_TEXT':
      return { ...state, boldText: action.payload };
    case 'TOGGLE_A11Y_BADGES':
      return { ...state, showA11yBadges: !state.showA11yBadges };
    case 'TOGGLE_FOCUS_RING':
      return { ...state, highlightFocusRing: !state.highlightFocusRing };
    case 'LOAD_SAVED':
      return {
        ...state,
        ...action.payload,
        theme: resolveTheme(action.payload.themeMode ?? state.themeMode),
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface A11yContextValue extends A11yState {
  setTheme: (mode: ThemeMode) => void;
  setFontScale: (scale: FontScale) => void;
  toggleReduceMotion: () => void;
  toggleBoldText: () => void;
  toggleA11yBadges: () => void;
  toggleFocusRing: () => void;
  announce: (message: string, polite?: boolean) => void;
  scaledFont: (baseSize: number) => number;
}

const A11yContext = createContext<A11yContextValue | null>(null);

// ─── Storage keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY = '@a11y_showcase_prefs';

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Enable Android layout animations
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Listen to OS screen reader changes
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      dispatch({ type: 'SET_SCREEN_READER', payload: enabled });
    });

    const sub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        dispatch({ type: 'SET_SCREEN_READER', payload: enabled });
      }
    );

    return () => sub.remove();
  }, []);

  // Listen to OS reduce motion
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      dispatch({ type: 'SET_REDUCE_MOTION', payload: enabled });
    });

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        dispatch({ type: 'SET_REDUCE_MOTION', payload: enabled });
      }
    );

    return () => sub.remove();
  }, []);

  // Load persisted preferences
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        dispatch({ type: 'LOAD_SAVED', payload: saved });
      } catch {}
    });
  }, []);

  // Persist on change
  useEffect(() => {
    const toSave = {
      themeMode: state.themeMode,
      fontScale: state.fontScale,
      boldText: state.boldText,
      showA11yBadges: state.showA11yBadges,
      highlightFocusRing: state.highlightFocusRing,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [
    state.themeMode,
    state.fontScale,
    state.boldText,
    state.showA11yBadges,
    state.highlightFocusRing,
  ]);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const setTheme = useCallback((mode: ThemeMode) => {
    dispatch({ type: 'SET_THEME', payload: mode });
  }, []);

  const setFontScale = useCallback((scale: FontScale) => {
    dispatch({ type: 'SET_FONT_SCALE', payload: scale });
  }, []);

  const toggleReduceMotion = useCallback(() => {
    dispatch({ type: 'SET_REDUCE_MOTION', payload: !state.reduceMotion });
  }, [state.reduceMotion]);

  const toggleBoldText = useCallback(() => {
    dispatch({ type: 'SET_BOLD_TEXT', payload: !state.boldText });
  }, [state.boldText]);

  const toggleA11yBadges = useCallback(() => {
    dispatch({ type: 'TOGGLE_A11Y_BADGES' });
  }, []);

  const toggleFocusRing = useCallback(() => {
    dispatch({ type: 'TOGGLE_FOCUS_RING' });
  }, []);

  // Screen reader announcement
  const announce = useCallback(
    (message: string, polite = true) => {
      AccessibilityInfo.announceForAccessibility(message);
    },
    []
  );

  // Scaled font helper
  const scaledFont = useCallback(
    (baseSize: number): number => {
      return Math.round(baseSize * fontScaleMultipliers[state.fontScale]);
    },
    [state.fontScale]
  );

  return (
    <A11yContext.Provider
      value={{
        ...state,
        setTheme,
        setFontScale,
        toggleReduceMotion,
        toggleBoldText,
        toggleA11yBadges,
        toggleFocusRing,
        announce,
        scaledFont,
      }}
    >
      {children}
    </A11yContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useA11y = (): A11yContextValue => {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be inside AccessibilityProvider');
  return ctx;
};