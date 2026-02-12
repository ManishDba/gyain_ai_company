// Footer.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, InteractionManager } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from "react-redux";
 
const Footer = React.memo(() => {
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState('HomeScreen');
  const configData = useSelector((state) => state.usersSlice.config || {});
 
  useFocusEffect(
    useCallback(() => {
      try {
        const state = navigation.getState();
        if (state && state.routes && state.index >= 0) {
          const currentRouteName = state.routes[state.index].name;
          setActiveButton(currentRouteName);
        }
      } catch (error) {
        console.log("Navigation state error:", error);
      }
    }, [navigation])
  );
 
  const handlePress = useCallback((navigateTo) => {
    let destination = navigateTo;
 
    if (navigateTo === 'BotCategory') {
      const botLevel = configData[0]?.bot_level;
      if (botLevel === 1) {
        destination = 'DataScreen';
      } else if (botLevel === 2) {
        destination = 'BotCategory';
      }
    }
 
    setActiveButton(destination);
    InteractionManager.runAfterInteractions(() => {
      if (destination !== activeButton) {
        navigation.navigate(destination);
      }
    });
  }, [activeButton, configData, navigation]);
 
  const FooterButton = React.memo(({ iconName, navigateTo }) => {
    const isActive = activeButton === navigateTo
      || (activeButton === 'DocumentScreen' && navigateTo === 'DocumentCategory')
      || (activeButton === 'DataSetsScreen' && navigateTo === 'DataSetCategory')
      || (activeButton === 'DataScreen' && navigateTo === 'BotCategory');
 
    const getIconName = () => {
      if (!isActive) return iconName;
      return iconName.replace('-outline', '');
    };
 
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.button, isActive && styles.activeButton]}
        onPress={() => handlePress(navigateTo)}
      >
        <Ionicons
          name={getIconName()}
          size={24}
          color={isActive ? '#1C1C1E' : '#FFFFFF'}
        />
      </TouchableOpacity>
    );
  });
 
  return (
    <View style={styles.footerWrapper}>
      <View style={styles.footer}>
        <FooterButton
          iconName="home-outline"
          navigateTo="HomeScreen"
        />
        <FooterButton
          iconName="chatbubbles-outline"
          navigateTo="BotCategory"
        />
        <FooterButton
          iconName="grid-outline"
          navigateTo="DashboardScreen"
        />
        <FooterButton
          iconName="person-outline"
          navigateTo="Profile"
        />
      </View>
    </View>
  );
});
 
const styles = StyleSheet.create({
  footerWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#191919',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: '#191919',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  activeButton: {
    backgroundColor: '#E5E4DF',
  },
});
 
export default Footer;