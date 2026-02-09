import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, InteractionManager } from 'react-native';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import Icons from '../../env/icons';
import { useSelector } from "react-redux";

const Footer = () => {
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState('HomeScreen');
  const configData = useSelector((state) => state.usersSlice.config || {}); 

  useFocusEffect(
    useCallback(() => {
      try {
        const state = navigation.getState();
        if (state && state.routes && state.index >= 0) {
          const currentRouteName = state.routes[state.index].name;
          
          // Map screen names to footer button names
          const screenMapping = {
            'HomeScreen': 'HomeScreen',
            'DashboardScreen': 'DashboardScreen',
            'BotCategory': 'BotCategory',
            'DataScreen': 'BotCategory', // DataScreen should highlight BotCategory
            'DashboardDetailScreen': 'DashboardScreen', // Detail screen highlights Dashboard
          };
          
          setActiveButton(screenMapping[currentRouteName] || currentRouteName);
        }
      } catch (error) {
        console.log("Navigation state error:", error);
      }
    }, [navigation])
  );

  // ✅ UPDATED handlePress function
  const handlePress = (navigateTo) => {
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
        // ✅ Use dispatch with NAVIGATE action directly
        navigation.dispatch(
          CommonActions.navigate({
            name: destination,
          })
        );
      }
    });
  };

  const FooterButton = ({ title, iconName, navigateTo }) => {
    const isActive = activeButton === navigateTo 
    || (activeButton === 'DocumentScreen' && navigateTo=== 'DocumentCategory' ) 
    || (activeButton === 'DataSetsScreen' && navigateTo=== 'DataSetCategory' ) 
    || (activeButton === 'DataScreen' && navigateTo=== 'BotCategory' );

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.button, isActive && styles.activeButton]}
        onPress={() => handlePress(navigateTo)}
      >
        <View style={styles.iconContainer}>
          <Image source={iconName} style={[styles.icon, { tintColor: isActive ? '#ffcc00' : '#fff' }]} />
        </View>
        <Text style={[styles.buttonText, isActive && styles.activeText]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.footer}>
      <View style={styles.buttonContainer}>
        <FooterButton title="Home" iconName={Icons.Icon15} navigateTo="HomeScreen" />
        <FooterButton title="Bot" iconName={Icons.Icon14} navigateTo="BotCategory" />
        <FooterButton title="Dashboard" iconName={Icons.Icon17} navigateTo="DashboardScreen" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#174054',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingBottom: 10,
    borderTopColor: '#ffffff',
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    width: '70%',
    paddingHorizontal: 10,
    padding: 12
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeButton: {
    backgroundColor: '#112d3a', 
    borderRadius: 10, 
    padding: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 8,
    marginTop: 5,
  },
  activeText: {
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default Footer;