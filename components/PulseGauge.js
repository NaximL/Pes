import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Circle, G, Text as SvgText, Rect as SvgRect } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

export default function PulseGauge({ bpm }) {
  const bpmAnim = useSharedValue(bpm || 80);

  useEffect(() => {
    bpmAnim.value = withTiming(bpm || 80, { duration: 400 });
  }, [bpm]);

  const width = Dimensions.get('window').width - 120;
  const height = 16;
  const radius = height / 2;
  const minBpm = 40;
  const maxBpm = 160;
  const dotRadius = 14;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedText = Animated.createAnimatedComponent(SvgText);
  

  const animatedProps = useAnimatedProps(() => {
    const clamped = Math.min(Math.max(bpmAnim.value, minBpm), maxBpm);
    const ratio = (clamped - minBpm) / (maxBpm - minBpm);
    const x = radius + ratio * (width - 2 * radius) + 10;
    const y = height / 2 + 22;
    return { cx: x, cy: y };
  });


  return (
    <View style={styles.wrap}>
      <Svg width={width} height={dotRadius * 2 + 40}>
        
        <Rect x={0} y={dotRadius + 8} width={width} height={height} rx={radius} fill="#333" />

        
        <SvgText x={2} y={dotRadius - 4} fill="#bfbfbf" fontSize="12">{minBpm}</SvgText>
        <SvgText x={width - 28} y={dotRadius - 4} fill="#bfbfbf" fontSize="12">{maxBpm}</SvgText>

        
        <AnimatedCircle r={dotRadius} fill="#FF6B6B" animatedProps={animatedProps} />




        <AnimatedText
          animatedProps={useAnimatedProps(() => {
            const clamped = Math.min(Math.max(bpmAnim.value, minBpm), maxBpm);
            const ratio = (clamped - minBpm) / (maxBpm - minBpm);
            const x = radius + ratio * (width - 2 * radius) + 16;
            const y = height / 2 + 14 + dotRadius + 28;
            return { x: x - 14, y: y };
          })}
          fill="#fff"
          fontSize="14"
          fontWeight="700"
        >
          {Math.round(bpm || 0)}
        </AnimatedText>

      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: '100%' },
  label: { color: '#9a9a9a', fontSize: 12, marginTop: 6 },
});
