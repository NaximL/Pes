import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Circle, G, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

export default function OxygenGauge({ spo2 }) {
  const spo2Anim = useSharedValue(spo2 || 98);

  useEffect(() => {
    spo2Anim.value = withTiming(spo2 || 98, { duration: 400 });
  }, [spo2]);

  const width = Dimensions.get('window').width - 120;
  const height = 16;
  const radius = height / 2;
  const minSp = 80;
  const maxSp = 100;
  const dotRadius = 14;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedText = Animated.createAnimatedComponent(SvgText);

  const animatedProps = useAnimatedProps(() => {
    const clamped = Math.min(Math.max(spo2Anim.value, minSp), maxSp);
    const ratio = (clamped - minSp) / (maxSp - minSp);
    const x = radius + ratio * (width - 2 * radius) + 10;
    const y = height / 2 + 22;
    return { cx: x, cy: y };
  });

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={dotRadius * 2 + 40}>
        <Rect x={0} y={dotRadius + 8} width={width} height={height} rx={radius} fill="#2b2b2b" />

        
        <SvgText x={2} y={dotRadius - 4} fill="#bfbfbf" fontSize="12">{minSp}</SvgText>
        <SvgText x={width - 30} y={dotRadius -4} fill="#bfbfbf" fontSize="12">{maxSp}</SvgText>

        
        <AnimatedCircle r={dotRadius} fill="#7BE495" animatedProps={animatedProps} />

        
        <AnimatedText
          animatedProps={useAnimatedProps(() => {
            const clamped = Math.min(Math.max(spo2Anim.value, minSp), maxSp);
            const ratio = (clamped - minSp) / (maxSp - minSp);
            const x = radius + ratio * (width - 2 * radius) + 7;
            const y = height / 2 + 18 + dotRadius + 24;
            return { x: x - 10, y: y };
          })}
          fill="#fff"
          fontSize="14"
          fontWeight="700"
        >
          {Math.round(spo2 || 0)}%
        </AnimatedText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: '100%' },
  label: { color: '#9a9a9a', fontSize: 12, marginTop: 6 },
});
