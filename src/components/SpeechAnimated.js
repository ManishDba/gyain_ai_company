import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
 
export default function SimpleSpeechVisualizer({
  isActive,
  subjectColor = '#FF5733',
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    if (isActive) {
      // Start pulsing animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      // Stop animation
      pulseAnim.stopAnimation();
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);
 
  return (
    <View style={styles.container}>
      {/* Center core */}
      <Animated.View
        style={[
          styles.core,
          {
            backgroundColor: subjectColor,
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
 
      {/* Outer rings */}
      <Animated.View
        style={[
          styles.ring,
          styles.ring1,
          {
            borderColor: subjectColor,
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ring2,
          {
            borderColor: subjectColor,
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [1.2, 1.5],
                }),
              },
            ],
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.2],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ring3,
          {
            borderColor: subjectColor,
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [1.4, 1.7],
                }),
              },
            ],
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        ]}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 999,
  },
  ring1: {
    width: 60,
    height: 60,
  },
  ring2: {
    width: 80,
    height: 80,
  },
  ring3: {
    width: 100,
    height: 100,
  },
});