// src/screens/HomeScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useA11y } from '../accessibility/AccessibilityContext';
import { TabParamList } from '../navigation';
import { borderRadius, spacing } from '../theme';

type NavProp = BottomTabNavigationProp<TabParamList, 'Home'>;

interface FeatureItem {
  emoji: string;
  title: string;
  subtitle: string;
  screen: keyof TabParamList;
  gradient: [string, string];
  wcag: string;
  a11yLabel: string;
}

const FEATURES: FeatureItem[] = [
  {
    emoji: '🔊',
    title: 'TalkBack',
    subtitle: 'Lector de pantalla en acción',
    screen: 'TalkBack',
    gradient: ['#7C3AED', '#4F46E5'],
    wcag: 'WCAG 1.3.1',
    a11yLabel: 'Demo TalkBack: lector de pantalla. Toca para explorar',
  },
  {
    emoji: '🎨',
    title: 'Alto Contraste',
    subtitle: 'Modos de color accesibles',
    screen: 'Contrast',
    gradient: ['#0E7490', '#0F766E'],
    wcag: 'WCAG 1.4.3',
    a11yLabel: 'Demo de contraste de color. Toca para explorar',
  },
  {
    emoji: '🔤',
    title: 'Tamaño de Texto',
    subtitle: 'Tipografía escalable',
    screen: 'FontSize',
    gradient: ['#D97706', '#DC2626'],
    wcag: 'WCAG 1.4.4',
    a11yLabel: 'Demo de tamaño de fuente dinámica. Toca para explorar',
  },
  {
    emoji: '⚙️',
    title: 'Configuración',
    subtitle: 'Preferencias persistentes',
    screen: 'Settings',
    gradient: ['#059669', '#0D9488'],
    wcag: 'WCAG 2.1',
    a11yLabel: 'Configuración de accesibilidad. Toca para abrir',
  },
];

// ─── Animated feature card ────────────────────────────────────────────────────

interface FeatureCardProps {
  item: FeatureItem;
  index: number;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ item, index, onPress }) => {
  const { theme, scaledFont, reduceMotion } = useA11y();
  const anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      anim.setValue(1);
      return;
    }
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    if (reduceMotion) return;
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    if (reduceMotion) return;
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          { scale: scaleAnim },
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible={true}
        accessibilityLabel={item.a11yLabel}
        accessibilityRole="button"
        accessibilityHint={`Navega a la pantalla de ${item.title}`}
      >
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* WCAG Badge */}
          <View style={styles.wcagBadge} accessible={false} importantForAccessibility="no">
            <Text style={[styles.wcagText, { fontSize: scaledFont(10) }]}>{item.wcag}</Text>
          </View>

          {/* Emoji */}
          <Text
            style={{ fontSize: scaledFont(44) }}
            accessible={false}
            importantForAccessibility="no"
          >
            {item.emoji}
          </Text>

          {/* Title + Subtitle */}
          <Text
            style={[styles.cardTitle, { fontSize: scaledFont(20) }]}
            accessible={false}
            importantForAccessibility="no"
          >
            {item.title}
          </Text>
          <Text
            style={[styles.cardSubtitle, { fontSize: scaledFont(13) }]}
            accessible={false}
            importantForAccessibility="no"
          >
            {item.subtitle}
          </Text>

          {/* Arrow indicator */}
          <View style={styles.arrowContainer} accessible={false} importantForAccessibility="no">
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }}>→</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

// ─── Stats bar ────────────────────────────────────────────────────────────────

const StatsBar: React.FC = () => {
  const { theme, scaledFont, screenReaderActive, themeMode, fontScale } = useA11y();

  const stats = [
    { label: 'Lector', value: screenReaderActive ? 'ON' : 'OFF', on: screenReaderActive },
    { label: 'Tema', value: themeMode === 'highContrast' ? 'HC' : themeMode === 'dark' ? 'Dark' : 'Light', on: themeMode !== 'light' },
    { label: 'Fuente', value: fontScale, on: fontScale !== 'normal' },
  ];

  return (
    <View
      style={[styles.statsBar, { backgroundColor: theme.surface, borderColor: theme.border }]}
      accessible={true}
      accessibilityLabel={`Estado actual: lector de pantalla ${screenReaderActive ? 'activado' : 'desactivado'}, tema ${themeMode}, fuente ${fontScale}`}
    >
      {stats.map((s, i) => (
        <View key={i} style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: scaledFont(10) }]}>
            {s.label}
          </Text>
          <Text
            style={[
              styles.statValue,
              {
                color: s.on ? theme.primary : theme.text,
                fontSize: scaledFont(12),
              },
            ]}
          >
            {s.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const HomeScreen: React.FC = () => {
  const { theme, scaledFont } = useA11y();
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }}
        >
          <LinearGradient
            colors={[theme.cardGradientStart, theme.cardGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.header, { paddingTop: insets.top + 20 }]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="A11y Showcase. Demo profesional de accesibilidad en React Native"
          >
            <Text style={{ fontSize: scaledFont(56) }}>♿</Text>
            <Text style={[styles.headerTitle, { fontSize: scaledFont(30) }]}>
              A11y Showcase
            </Text>
            <Text style={[styles.headerSubtitle, { fontSize: scaledFont(15) }]}>
              Demo profesional de accesibilidad{'\n'}en React Native con Expo
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Status bar */}
        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[3] }}>
          <StatsBar />
        </View>

        {/* Section label */}
        <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[5] }}>
          <Text
            style={[
              styles.sectionLabel,
              { color: theme.textSecondary, fontSize: scaledFont(11) },
            ]}
            accessibilityRole="header"
          >
            MÓDULOS DE DEMOSTRACIÓN
          </Text>
        </View>

        {/* Feature cards grid */}
        <View style={styles.grid}>
          {FEATURES.map((item, i) => (
            <View key={item.screen} style={styles.gridItem}>
              <FeatureCard
                item={item}
                index={i}
                onPress={() => navigation.navigate(item.screen)}
              />
            </View>
          ))}
        </View>

        {/* Footer note */}
        <View
          style={[styles.footer, { backgroundColor: theme.surface, borderColor: theme.border }]}
          accessible={true}
          accessibilityLabel="WCAG 2.1 AA. Todos los componentes cumplen con los estándares internacionales de accesibilidad web"
        >
          <Text style={[styles.footerEmoji]}>✅</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.footerTitle, { color: theme.text, fontSize: scaledFont(14) }]}>
              WCAG 2.1 AA Compliant
            </Text>
            <Text style={[styles.footerDesc, { color: theme.textSecondary, fontSize: scaledFont(12) }]}>
              Todos los componentes cumplen con los estándares internacionales
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[5],
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#FFFFFF',
    marginTop: spacing[2],
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: 'SpaceGrotesk_400Regular',
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing[2],
    lineHeight: 22,
  },
  statsBar: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[3],
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statLabel: {
    fontFamily: 'SpaceGrotesk_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    marginTop: 2,
  },
  sectionLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[3],
    marginTop: spacing[1],
  },
  gridItem: {
    width: '50%',
    padding: spacing[2],
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    minHeight: 170,
    justifyContent: 'space-between',
  },
  wcagBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  wcagText: {
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontFamily: 'SpaceGrotesk_400Regular',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  arrowContainer: {
    alignItems: 'flex-end',
    marginTop: spacing[1],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing[3],
  },
  footerEmoji: { fontSize: 24 },
  footerTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 2,
  },
  footerDesc: {
    fontFamily: 'SpaceGrotesk_400Regular',
    lineHeight: 18,
  },
});