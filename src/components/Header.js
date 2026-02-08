import React from 'react';

import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from '../../env/icons';
import { clearDataSetsDetails } from '../reducers/dataSets.slice';
import { clearIndicatorsDetails } from '../reducers/indicators.Slice';
import UseBotDrawer from '../components/usebotdrawer';

const Header = ({ showBackButton = false }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const configData = useSelector(state => state.usersSlice.config || []);
  const botLevel = configData[0]?.bot_level;
  const shouldShowBackButton = showBackButton && botLevel === 1;
  const isDataScreen = route.name === 'DataScreen';
  // Drawer hook only on DataScreen

  const { openDrawer, Drawer } = isDataScreen
    ? UseBotDrawer()
    : { openDrawer: null, Drawer: () => null };

  const handleBackPress = () => {
    dispatch(clearDataSetsDetails());
    dispatch(clearIndicatorsDetails());
    navigation.goBack();
  };

  return (
    <>
      <StatusBar backgroundColor="#142440" barStyle="light-content" />
      <Appbar.Header style={styles.header}>
        <View style={styles.leftContainer}>
          {isDataScreen ? (
            // 🔹 On DataScreen: Drawer icon replaces back icon
            <MaterialIcon
              name="menu"
              size={28}
              color="#fff"
              onPress={openDrawer}
              style={styles.iconStyle}
            />
          ) : (
            // 🔹 On other screens: Back icon

            shouldShowBackButton && (
              <Icon
                name="chevron-back"
                onPress={handleBackPress}
                color="#fff"
                size={24}
                style={styles.iconStyle}
              />
            )
          )}

          {/* 🔹 Logo clickable only on DataScreen */}
          <TouchableOpacity
            onPress={isDataScreen ? handleBackPress : undefined}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>Gyain AI</Text>
            <Text style={styles.logoTextSmall}>Gyain AI</Text>
          </TouchableOpacity>
        </View>

        <Appbar.Content title="" />

        <View style={styles.rightContainer}>
          {/* Only show menu button on DataScreen if needed */}

          <Appbar.Action
            icon={Icons.Icon12}
            onPress={() => navigation.navigate('Profile')}
            color="#fff"
          />   
        </View>
      </Appbar.Header>

      {/* Drawer only on DataScreen */}

      {isDataScreen && <Drawer />}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#142440',

    height: 56,

    justifyContent: 'space-between',
  },

  leftContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  logoContainer: {
    marginLeft: 8,
  },

  logoText: {
    fontSize: 16,

    fontWeight: '500',

    color: '#fff',
  },

  logoTextSmall: {
    fontSize: 16,

    fontWeight: '500',

    color: '#fff',
  },

  iconStyle: {
    paddingHorizontal: 8,
  },

  rightContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  iconButton: {
    paddingHorizontal: 8,

    marginRight: 8,
  },
});

export default Header;
