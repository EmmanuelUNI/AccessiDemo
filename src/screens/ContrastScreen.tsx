// src/screens/ContrastScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useA11y } from '../accessibility/AccessibilityContext';
import { ThemeMode, borderRadius, spacing } from '../theme';

// Contrast ratio calculation helper
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  try {
    const l1 = hexToRgb(fg);
    const l2 = hexToRgb(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 0;
  }
}

// ─── Contrast Pair Demo ───────────────────────────────────────────────────────

interface ContrastPairProps {
  label: string;
  fg: string;
  bg: string;
  example: string;
}

const ContrastPair: React.FC<ContrastPairProps> = ({ label, fg, bg, example }) => {
  const { scaledFont } = useA11y();
  const ratio = contrastRatio(fg, bg);
  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7;

  return (
    <View
      style={[pairStyles.container, { backgroundColor: bg }]}
      accessible={true}
      accessibilityLabel={`${label}. Relación de contraste: ${ratio.toFixed(1)} a 1. ${passesAA ? 'Cumple WCAG AA' : 'No cumple WCAG AA'}`}
    >
      <Text style={[pairStyles.text, { color: fg, fontSize: scaledFont(16) }]}>{example}</Text>
      <View style={pairStyles.badges} accessible={false} importantForAccessibility="no">
        <View
          style={[
            pairStyles.ratioBadge,
            { backgroundColor: passesAA ? '#22C55E' : '#EF4444' },
          ]}
        >
          <Text style={[pairStyles.ratioText, { fontSize: scaledFont(11) }]}>
            {ratio.toFixed(1)}:1
          </Text>
        </View>
        {passesAAA ? (
          <View style={[pairStyles.wcagBadge, { backgroundColor: '#7C3AED' }]}>
            <Text style={[pairStyles.ratioText, { fontSize: scaledFont(9) }]}>AAA</Text>
          </View>
        ) : passesAA ? (
          <View style={[pairStyles.wcagBadge, { backgroundColor: '#059669' }]}>
            <Text style={[pairStyles.ratioText, { fontSize: scaledFont(9) }]}>AA ✓</Text>
          </View>
        ) : (
          <View style={[pairStyles.wcagBadge, { backgroundColor: '#DC2626' }]}>
            <Text style={[pairStyles.ratioText, { fontSize: scaledFont(9) }]}>FALLA</Text>
          </View>
        )}
      </View>
      <Text style={[pairStyles.label, { color: fg + 'CC', fontSize: scaledFont(11) }]}>{label}</Text>
    </View>
  );
};

const pairStyles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  text: { fontFamily: 'SpaceGrotesk_600SemiBold', marginBottom: spacing[2] },
  badges: { flexDirection: 'row', gap: spacing[2], marginBottom: spacing[2] },
  ratioBadge: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  wcagBadge: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  ratioText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  label: { fontFamily: 'SpaceGrotesk_400Regular' },
});

// ─── Theme Toggle Button ──────────────────────────────────────────────────────

interface ThemeButtonProps {
  mode: ThemeMode;
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ mode, label, emoji, active, onPress }) => {
  const { theme, scaledFont } = useA11y();
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[
        themeButtonStyles.btn,
        {
          backgroundColor: active ? theme.primary : theme.surface,
          borderColor: active ? theme.primary : theme.border,
          borderWidth: active ? 2 : 1,
        },
      ]}
      accessible={true}
      accessibilityLabel={`Cambiar a tema ${label}`}
      accessibilityRole="radio"
      accessibilityState={{ checked: active }}
    >
      <Text style={{ fontSize: scaledFont(24) }}>{emoji}</Text>
      <Text
        style={[
          themeButtonStyles.label,
          {
            color: active ? '#FFFFFF' : theme.text,
            fontSize: scaledFont(12),
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const themeButtonStyles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    gap: spacing[2],
    minHeight: 80,
  },
  label: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    textAlign: 'center',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const ContrastScreen: React.FC = () => {
  const { theme, scaledFont, setTheme, themeMode } = useA11y();
  const insets = useSafeAreaInsets();

  const CONTRAST_PAIRS: ContrastPairProps[] = [
    { label: 'Gris claro sobre blanco (FALLA)', fg: '#AAAAAA', bg: '#FFFFFF', example: 'Texto con bajo contraste — difícil de leer' },
    { label: 'Gris oscuro sobre blanco (AA)', fg: '#595959', bg: '#FFFFFF', example: 'Texto con contraste aceptable para leer' },
    { label: 'Negro sobre blanco (AAA)', fg: '#000000', bg: '#FFFFFF', example: 'Texto con contraste máximo — perfectamente legible' },
    { label: 'Blanco sobre violeta (AA)', fg: '#FFFFFF', bg: '#7C3AED', example: 'Texto claro sobre fondo colorido' },
    { label: 'Amarillo sobre negro (AAA)', fg: '#FFFF00', bg: '#000000', example: 'Alto contraste — modo de accesibilidad' },
    { label: 'Verde pálido sobre blanco (FALLA)', fg: '#88CC88', bg: '#FFFFFF', example: 'Color decorativo sin suficiente contraste' },
  ];

  const THEMES: { mode: ThemeMode; label: string; emoji: string }[] = [
    { mode: 'light', label: 'Claro', emoji: '☀️' },
    { mode: 'dark', label: 'Oscuro', emoji: '🌙' },
    { mode: 'highContrast', label: 'Alto Contraste', emoji: '⚡' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#0E7490', '#0F766E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Demo de Contraste de Color. WCAG 1.4.3"
        >
          <Text style={{ fontSize: scaledFont(48) }}>🎨</Text>
          <Text style={[styles.headerTitle, { fontSize: scaledFont(26) }]}>Contraste de Color</Text>
          <Text style={[styles.headerSubtitle, { fontSize: scaledFont(14) }]}>
            WCAG 1.4.3 — Contraste mínimo 4.5:1 para texto normal
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[5] }}>
          {/* Theme switcher */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11) }]}
            accessibilityRole="header"
          >
            CAMBIAR TEMA EN VIVO
          </Text>
          <View style={styles.themeRow} accessibilityRole="radiogroup" accessibilityLabel="Selector de tema">
            {THEMES.map((t) => (
              <ThemeButton
                key={t.mode}
                {...t}
                active={themeMode === t.mode}
                onPress={() => setTheme(t.mode)}
              />
            ))}
          </View>

          {/* Live preview card */}
          <View
            style={[styles.liveCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            accessible={true}
            accessibilityLabel={`Vista previa del tema ${themeMode}. Así se ve la interfaz con este tema aplicado`}
          >
            <Text style={[styles.liveCardLabel, { color: theme.textSecondary, fontSize: scaledFont(10) }]}>
              VISTA PREVIA EN VIVO
            </Text>
            <Text style={[styles.liveCardTitle, { color: theme.text, fontSize: scaledFont(18) }]}>
              Texto principal
            </Text>
            <Text style={[styles.liveCardSubtitle, { color: theme.textSecondary, fontSize: scaledFont(14) }]}>
              Texto secundario con menor énfasis visual
            </Text>
            <View style={[styles.liveCardBtn, { backgroundColor: theme.primary }]}>
              <Text style={{ color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: scaledFont(14) }}>
                Botón principal
              </Text>
            </View>
          </View>

          {/* Contrast pairs */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11), marginTop: spacing[5] }]}
            accessibilityRole="header"
          >
            ANÁLISIS DE CONTRASTE
          </Text>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary, fontSize: scaledFont(13) }]}>
            Cada ejemplo muestra la relación de contraste calculada según WCAG 2.1
          </Text>

          {CONTRAST_PAIRS.map((pair) => (
            <ContrastPair key={pair.label} {...pair} />
          ))}

          {/* Legend */}
          <View
            style={[styles.legend, { backgroundColor: theme.surface, borderColor: theme.border }]}
            accessible={true}
            accessibilityLabel="Niveles de conformidad WCAG: AA requiere relación 4.5 a 1 para texto normal, 3 a 1 para texto grande. AAA requiere relación 7 a 1 para texto normal"
          >
            <Text style={[styles.legendTitle, { color: theme.text, fontSize: scaledFont(13) }]}>
              📊 Niveles de conformidad WCAG
            </Text>
            {[
              { level: 'AA  (mínimo)', ratio: '4.5:1', color: '#059669' },
              { level: 'AA  texto grande', ratio: '3:1', color: '#0891B2' },
              { level: 'AAA (óptimo)', ratio: '7:1', color: '#7C3AED' },
            ].map((row) => (
              <View key={row.level} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: row.color }]} />
                <Text style={[styles.legendText, { color: theme.text, fontSize: scaledFont(13) }]}>
                  {row.level}
                </Text>
                <Text style={[styles.legendRatio, { color: theme.textSecondary, fontSize: scaledFont(13) }]}>
                  {row.ratio}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ContrastScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[5],
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  headerTitle: { fontFamily: 'SpaceGrotesk_700Bold', color: '#fff', letterSpacing: -0.5 },
  headerSubtitle: { fontFamily: 'SpaceGrotesk_400Regular', color: 'rgba(255,255,255,0.85)', lineHeight: 22 },
  sectionLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
  },
  sectionDesc: { fontFamily: 'SpaceGrotesk_400Regular', lineHeight: 20, marginBottom: spacing[3] },
  themeRow: { flexDirection: 'row', gap: spacing[2], marginBottom: spacing[4] },
  liveCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[5],
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  liveCardLabel: { fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1, textTransform: 'uppercase' },
  liveCardTitle: { fontFamily: 'SpaceGrotesk_700Bold' },
  liveCardSubtitle: { fontFamily: 'SpaceGrotesk_400Regular', lineHeight: 20 },
  liveCardBtn: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing[3],
    alignItems: 'center',
    marginTop: spacing[2],
  },
  legend: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginTop: spacing[3],
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  legendTitle: { fontFamily: 'SpaceGrotesk_700Bold', marginBottom: spacing[2] },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { flex: 1, fontFamily: 'SpaceGrotesk_500Medium' },
  legendRatio: { fontFamily: 'SpaceGrotesk_700Bold' },
});