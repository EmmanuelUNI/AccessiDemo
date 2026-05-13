// src/screens/FontSizeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useA11y } from '../accessibility/AccessibilityContext';
import { FontScale, borderRadius, spacing } from '../theme';

const fontScaleMultipliers: Record<FontScale, number> = {
  small: 0.85,
  normal: 1.0,
  large: 1.25,
  xlarge: 1.5,
};

const SCALES: { value: FontScale; label: string; multiplier: string; emoji: string }[] = [
  { value: 'small',  label: 'Pequeño',     multiplier: '×0.85', emoji: '🔽' },
  { value: 'normal', label: 'Normal',       multiplier: '×1.0',  emoji: '📏' },
  { value: 'large',  label: 'Grande',       multiplier: '×1.25', emoji: '🔼' },
  { value: 'xlarge', label: 'Extra Grande', multiplier: '×1.5',  emoji: '⬆️' },
];

const FontSizeScreen: React.FC = () => {
  const { theme, scaledFont, fontScale, setFontScale, announce } = useA11y();
  const insets = useSafeAreaInsets();
  const baseSize = 15;

  const handleChange = (scale: FontScale) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFontScale(scale);
    const labels: Record<FontScale, string> = {
      small: 'pequeño',
      normal: 'normal',
      large: 'grande',
      xlarge: 'extra grande',
    };
    announce(`Tamaño de texto cambiado a ${labels[scale]}`);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#D97706', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Demo de Tamaño de Fuente. WCAG 1.4.4 Redimensionar texto"
        >
          <Text style={{ fontSize: scaledFont(48) }}>🔤</Text>
          <Text style={[styles.headerTitle, { fontSize: scaledFont(26) }]}>
            Tamaño de Texto
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: scaledFont(14) }]}>
            WCAG 1.4.4 — El texto debe poder escalarse{'\n'}hasta 200% sin pérdida de contenido
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[5] }}>
          {/* Scale selector */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11) }]}
            accessibilityRole="header"
          >
            NIVEL DE ESCALA
          </Text>

          <View
            style={[styles.scaleSelector, { backgroundColor: theme.surface, borderColor: theme.border }]}
            accessibilityRole="radiogroup"
            accessibilityLabel="Selector de tamaño de texto"
          >
            {SCALES.map((s) => {
              const active = fontScale === s.value;
              return (
                <TouchableOpacity
                  key={s.value}
                  onPress={() => handleChange(s.value)}
                  style={[
                    styles.scaleBtn,
                    { backgroundColor: active ? theme.primary : 'transparent' },
                  ]}
                  accessible={true}
                  accessibilityLabel={`Tamaño ${s.label}, multiplicador ${s.multiplier}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
                  <Text
                    style={[
                      styles.scaleBtnLabel,
                      { color: active ? '#fff' : theme.text, fontSize: 12 },
                    ]}
                  >
                    {s.label}
                  </Text>
                  <Text
                    style={[
                      styles.scaleBtnMult,
                      { color: active ? 'rgba(255,255,255,0.75)' : theme.textSecondary, fontSize: 10 },
                    ]}
                  >
                    {s.multiplier}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Live preview */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11), marginTop: spacing[5] }]}
            accessibilityRole="header"
          >
            VISTA PREVIA EN VIVO
          </Text>

          <View
            style={[styles.preview, { backgroundColor: theme.surface, borderColor: theme.border }]}
            accessible={true}
            accessibilityLabel={`Vista previa con escala ${fontScale}. El rápido zorro marrón`}
          >
            <View style={[styles.previewBadge, { backgroundColor: theme.primary + '20' }]}>
              <Text style={{ fontSize: 11, color: theme.primary, fontFamily: 'SpaceGrotesk_700Bold' }}>
                Escala actual: {fontScaleMultipliers[fontScale]}× — {Math.round(baseSize * fontScaleMultipliers[fontScale])}pt base
              </Text>
            </View>
            <Text
              style={[styles.previewTitle, { color: theme.text, fontSize: scaledFont(24) }]}
              accessible={false}
              importantForAccessibility="no"
            >
              El rápido zorro marrón
            </Text>
            <Text
              style={[styles.previewBody, { color: theme.textSecondary, fontSize: scaledFont(15) }]}
              accessible={false}
              importantForAccessibility="no"
            >
              La accesibilidad no es una característica adicional, es un derecho que permite a todas las personas usar la tecnología sin importar sus capacidades.
            </Text>
            <Text
              style={[styles.previewCaption, { color: theme.primary, fontSize: scaledFont(11) }]}
              accessible={false}
              importantForAccessibility="no"
            >
              WCAG 1.4.4 — Texto escalable sin pérdida de información
            </Text>
          </View>

          {/* Scale table */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11), marginTop: spacing[5] }]}
            accessibilityRole="header"
          >
            ESCALA TIPOGRÁFICA COMPLETA
          </Text>

          <View style={[styles.scaleTable, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {[
              { name: 'xs',   base: 11 },
              { name: 'sm',   base: 13 },
              { name: 'base', base: 15 },
              { name: 'md',   base: 17 },
              { name: 'lg',   base: 20 },
              { name: 'xl',   base: 24 },
              { name: '2xl',  base: 28 },
            ].map((size, idx, arr) => (
              <View
                key={size.name}
                style={[
                  styles.scaleRow,
                  {
                    borderBottomColor: theme.border,
                    borderBottomWidth: idx < arr.length - 1 ? 1 : 0,
                  },
                ]}
                accessible={true}
                accessibilityLabel={`Tamaño ${size.name}: ${Math.round(size.base * fontScaleMultipliers[fontScale])} puntos`}
              >
                <View style={[styles.sizeTag, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={{ fontSize: 10, color: theme.primary, fontFamily: 'SpaceGrotesk_700Bold' }}>
                    {size.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: scaledFont(size.base),
                    color: theme.text,
                    fontFamily: 'SpaceGrotesk_400Regular',
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  Texto Aa
                </Text>
                <Text style={{ fontSize: 11, color: theme.textSecondary, fontFamily: 'SpaceGrotesk_700Bold', minWidth: 36, textAlign: 'right' }}>
                  {Math.round(size.base * fontScaleMultipliers[fontScale])}pt
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FontSizeScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingBottom: spacing[6], paddingHorizontal: spacing[5], alignItems: 'flex-start', gap: spacing[2] },
  headerTitle: { fontFamily: 'SpaceGrotesk_700Bold', color: '#fff', letterSpacing: -0.5 },
  headerSubtitle: { fontFamily: 'SpaceGrotesk_400Regular', color: 'rgba(255,255,255,0.85)', lineHeight: 22 },
  sectionLabel: { fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing[2] },
  scaleSelector: {
    flexDirection: 'row',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing[2],
    gap: spacing[1],
    marginBottom: spacing[2],
  },
  scaleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    gap: 2,
    minHeight: 72,
    borderRadius: borderRadius.lg,
  },
  scaleBtnLabel: { fontFamily: 'SpaceGrotesk_700Bold', textAlign: 'center' },
  scaleBtnMult:  { fontFamily: 'SpaceGrotesk_400Regular', textAlign: 'center' },
  preview: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing[5],
    gap: spacing[3],
  },
  previewBadge: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  previewTitle:   { fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.5 },
  previewBody:    { fontFamily: 'SpaceGrotesk_400Regular', lineHeight: 24 },
  previewCaption: { fontFamily: 'SpaceGrotesk_500Medium', lineHeight: 18 },
  scaleTable: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[3],
  },
  sizeTag: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    minWidth: 36,
    alignItems: 'center',
  },
});