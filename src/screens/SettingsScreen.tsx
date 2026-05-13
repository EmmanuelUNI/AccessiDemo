// src/screens/SettingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useA11y } from '../accessibility/AccessibilityContext';
import { ThemeMode, FontScale, borderRadius, spacing } from '../theme';

const SettingsScreen: React.FC = () => {
  const {
    theme,
    scaledFont,
    themeMode,
    fontScale,
    boldText,
    reduceMotion,
    screenReaderActive,
    showA11yBadges,
    highlightFocusRing,
    setTheme,
    setFontScale,
    toggleBoldText,
    toggleA11yBadges,
    toggleFocusRing,
    announce,
  } = useA11y();
  const insets = useSafeAreaInsets();

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setTheme('light');
    setFontScale('normal');
    announce('Configuración restaurada a valores por defecto');
  };

  // ─── Theme options ───────────────────────────────────────────────────────────
  const THEMES: { mode: ThemeMode; label: string; desc: string; emoji: string }[] = [
    { mode: 'light',        label: 'Modo Claro',      desc: 'Interfaz luminosa para uso en exteriores',          emoji: '☀️' },
    { mode: 'dark',         label: 'Modo Oscuro',      desc: 'Reduce la fatiga visual en ambientes oscuros',       emoji: '🌙' },
    { mode: 'highContrast', label: 'Alto Contraste',   desc: 'Máxima legibilidad para personas con baja visión',   emoji: '⚡' },
  ];

  // ─── Font scale options ──────────────────────────────────────────────────────
  const SCALES: { scale: FontScale; label: string; emoji: string }[] = [
    { scale: 'small',  label: 'Pequeño (×0.85)',      emoji: '🔽' },
    { scale: 'normal', label: 'Normal (×1.0)',         emoji: '📏' },
    { scale: 'large',  label: 'Grande (×1.25)',        emoji: '🔼' },
    { scale: 'xlarge', label: 'Extra Grande (×1.5)',   emoji: '⬆️' },
  ];

  // ─── Toggle rows ─────────────────────────────────────────────────────────────
  const TOGGLES = [
    {
      key: 'bold',
      label: 'Texto en negrita',
      desc: 'Aumenta el peso de fuente para mayor legibilidad',
      emoji: '𝗕',
      value: boldText,
      onToggle: toggleBoldText,
    },
    {
      key: 'badges',
      label: 'Badges de accesibilidad',
      desc: 'Muestra etiquetas WCAG en los componentes de la demo',
      emoji: '🏷️',
      value: showA11yBadges,
      onToggle: toggleA11yBadges,
    },
    {
      key: 'focus',
      label: 'Anillo de foco visible',
      desc: 'Resalta el elemento actualmente enfocado',
      emoji: '🔲',
      value: highlightFocusRing,
      onToggle: toggleFocusRing,
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={['#059669', '#0D9488']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Configuración de accesibilidad. Las preferencias se guardan automáticamente"
        >
          <Text style={{ fontSize: scaledFont(48) }}>⚙️</Text>
          <Text style={[styles.headerTitle, { fontSize: scaledFont(26) }]}>
            Configuración
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: scaledFont(14) }]}>
            Las preferencias se guardan automáticamente{'\n'}y persisten entre sesiones
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[5] }}>

          {/* ── Sistema OS ── */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11) }]}
            accessibilityRole="header"
          >
            ESTADO DEL SISTEMA OPERATIVO
          </Text>
          <View
            style={[styles.statusCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            accessible={true}
            accessibilityLabel={
              `Lector de pantalla ${screenReaderActive ? 'activado' : 'desactivado'}. ` +
              `Reducir movimiento ${reduceMotion ? 'activado' : 'desactivado'}.`
            }
          >
            {[
              { label: 'Lector de pantalla (TalkBack/VoiceOver)', value: screenReaderActive, emoji: '🔊' },
              { label: 'Reducir movimiento del sistema',           value: reduceMotion,        emoji: '🎭' },
            ].map((item, idx, arr) => (
              <View
                key={item.label}
                style={[
                  styles.statusRow,
                  { borderBottomColor: theme.border, borderBottomWidth: idx < arr.length - 1 ? 1 : 0 },
                ]}
                accessible={false}
                importantForAccessibility="no"
              >
                <Text style={{ fontSize: scaledFont(20) }}>{item.emoji}</Text>
                <Text style={[styles.statusLabel, { color: theme.text, fontSize: scaledFont(14) }]}>
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.value ? '#22C55E' : theme.border },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: scaledFont(11),
                      color: item.value ? '#fff' : theme.textSecondary,
                      fontFamily: 'SpaceGrotesk_700Bold',
                    }}
                  >
                    {item.value ? 'ON' : 'OFF'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Tema ── */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11), marginTop: spacing[5] }]}
            accessibilityRole="header"
          >
            TEMA DE COLOR
          </Text>
          <View accessibilityRole="radiogroup" accessibilityLabel="Selector de tema de color">
            {THEMES.map((t) => {
              const active = themeMode === t.mode;
              return (
                <TouchableOpacity
                  key={t.mode}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTheme(t.mode);
                    announce(`Tema cambiado a ${t.label}`);
                  }}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: active ? theme.primary + '15' : theme.surface,
                      borderColor: active ? theme.primary : theme.border,
                      borderWidth: active ? 2 : 1,
                    },
                  ]}
                  accessible={true}
                  accessibilityLabel={`${t.label}. ${t.desc}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <Text style={{ fontSize: scaledFont(22) }}>{t.emoji}</Text>
                  <View style={{ flex: 1, marginLeft: spacing[3] }}>
                    <Text style={[styles.optionLabel, { color: theme.text, fontSize: scaledFont(15) }]}>
                      {t.label}
                    </Text>
                    <Text style={[styles.optionDesc, { color: theme.textSecondary, fontSize: scaledFont(12) }]}>
                      {t.desc}
                    </Text>
                  </View>
                  {active && (
                    <Text style={{ fontSize: scaledFont(20), color: theme.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Fuente ── */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11), marginTop: spacing[5] }]}
            accessibilityRole="header"
          >
            TAMAÑO DE FUENTE
          </Text>
          <View accessibilityRole="radiogroup" accessibilityLabel="Selector de tamaño de fuente">
            {SCALES.map((s) => {
              const active = fontScale === s.scale;
              return (
                <TouchableOpacity
                  key={s.scale}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setFontScale(s.scale);
                    announce(`Fuente cambiada a ${s.label}`);
                  }}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: active ? theme.primary + '15' : theme.surface,
                      borderColor: active ? theme.primary : theme.border,
                      borderWidth: active ? 2 : 1,
                    },
                  ]}
                  accessible={true}
                  accessibilityLabel={s.label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <Text style={{ fontSize: scaledFont(22) }}>{s.emoji}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: theme.text, fontSize: scaledFont(15), flex: 1, marginLeft: spacing[3] },
                    ]}
                  >
                    {s.label}
                  </Text>
                  {active && (
                    <Text style={{ fontSize: scaledFont(20), color: theme.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Toggles demo ── */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11), marginTop: spacing[5] }]}
            accessibilityRole="header"
          >
            OPCIONES DE DEMO
          </Text>
          {TOGGLES.map((item) => (
            <View
              key={item.key}
              style={[
                styles.toggleRow,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={{ fontSize: scaledFont(20) }}>{item.emoji}</Text>
              <View style={{ flex: 1, marginLeft: spacing[3] }}>
                <Text style={[styles.optionLabel, { color: theme.text, fontSize: scaledFont(15) }]}>
                  {item.label}
                </Text>
                <Text style={[styles.optionDesc, { color: theme.textSecondary, fontSize: scaledFont(12) }]}>
                  {item.desc}
                </Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  item.onToggle();
                  announce(`${item.label} ${!item.value ? 'activado' : 'desactivado'}`);
                }}
                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                thumbColor={item.value ? theme.primary : theme.textDisabled}
                accessible={true}
                accessibilityLabel={item.label}
                accessibilityHint={item.desc}
                accessibilityRole="switch"
                accessibilityState={{ checked: item.value }}
              />
            </View>
          ))}

          {/* ── Reset ── */}
          <TouchableOpacity
            onPress={handleReset}
            style={[styles.resetBtn, { borderColor: theme.danger }]}
            accessible={true}
            accessibilityLabel="Restaurar toda la configuración a valores por defecto"
            accessibilityHint="Restablecerá tema, fuente y preferencias a valores originales"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: scaledFont(18) }}>🔄</Text>
            <Text style={[styles.resetText, { color: theme.danger, fontSize: scaledFont(15) }]}>
              Restaurar valores por defecto
            </Text>
          </TouchableOpacity>

          {/* ── Persistencia info ── */}
          <View
            style={[styles.infoBox, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}
            accessible={true}
            accessibilityLabel="Almacenamiento persistente. Las preferencias se guardan con AsyncStorage y persisten al cerrar y reabrir la aplicación"
          >
            <Text style={[{ color: theme.primary, fontSize: scaledFont(13), fontFamily: 'SpaceGrotesk_700Bold', marginBottom: spacing[1] }]}>
              💾 Almacenamiento persistente (AsyncStorage)
            </Text>
            <Text style={[{ color: theme.text, fontSize: scaledFont(13), fontFamily: 'SpaceGrotesk_400Regular', lineHeight: 20 }]}>
              Las preferencias se guardan localmente y persisten entre sesiones, sin necesidad de servidor.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

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
  statusCard: { borderRadius: borderRadius.xl, borderWidth: 1, overflow: 'hidden', marginBottom: spacing[2] },
  statusRow: { flexDirection: 'row', alignItems: 'center', padding: spacing[4], gap: spacing[3] },
  statusLabel: { flex: 1, fontFamily: 'SpaceGrotesk_500Medium' },
  statusBadge: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    minWidth: 40,
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
  },
  optionLabel: { fontFamily: 'SpaceGrotesk_600SemiBold' },
  optionDesc: { fontFamily: 'SpaceGrotesk_400Regular', lineHeight: 18, marginTop: 2 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing[2],
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[2],
    marginTop: spacing[3],
    marginBottom: spacing[3],
  },
  resetText: { fontFamily: 'SpaceGrotesk_600SemiBold' },
  infoBox: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
  },
});