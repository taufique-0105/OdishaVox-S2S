import React, { useRef } from 'react';
import { StyleSheet, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// This is our main SpeechButton component.
const SpeechButton = ({ onPressIn, onPressOut }) => {
  // We'll use an animated value to control the scale of the button.
  const scaleValue = useRef(new Animated.Value(1)).current;

  // This function starts the pulsating animation.
  const startAnimation = () => {
    // We use a looping animation to create the pulse effect.
    Animated.loop(
      Animated.sequence([
        // Animate from scale 1 to 1.2
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 700,
          useNativeDriver: true, // Use native driver for better performance
        }),
        // Animate from scale 1.2 back to 1
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // This function stops the animation and resets the scale.
  const stopAnimation = () => {
    // Stop all animations on scaleValue
    scaleValue.stopAnimation(() => {
      // Reset the scale back to its original size
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // The handler for when the user presses down on the button.
  const handlePressIn = () => {
    startAnimation();
    if (onPressIn) {
      onPressIn(); // Call the passed-in function
    }
  };

  // The handler for when the user releases the button.
  const handlePressOut = () => {
    stopAnimation();
    if (onPressOut) {
      onPressOut(); // Call the passed-in function
    }
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.button, { transform: [{ scale: scaleValue }] }]}>
        <Icon name="microphone" size={40} color="#fff" />
      </Animated.View>
    </Pressable>
  );
};

// Here we define the styles for our button.
const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes the view a circle
    backgroundColor: '#007AFF', // A nice blue color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Adding some shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SpeechButton;