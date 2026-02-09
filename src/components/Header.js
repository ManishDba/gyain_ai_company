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
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../env/icons';
import { clearDataSetsDetails } from '../reducers/dataSets.slice';
import { clearIndicatorsDetails } from '../reducers/indicators.Slice';

const Header = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const isHomeScreen = route.name === 'HomeScreen';

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
          {!isHomeScreen && (
            <Icon
              name="chevron-back"
              onPress={handleBackPress}
              color="#fff"
              size={24}
              style={styles.iconStyle}
            />
          )}

          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>Gyain AI</Text>
          </TouchableOpacity>
        </View>

        <Appbar.Content title="" />

        <View style={styles.rightContainer}>
          <Appbar.Action
            icon={Icons.Icon12}
            onPress={() => navigation.navigate('Profile')}
            color="#fff"
          />
        </View>
      </Appbar.Header>
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
