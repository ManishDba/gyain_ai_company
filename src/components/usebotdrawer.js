import React, { useState, useMemo } from 'react';
import {
  Modal,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconchat from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.6;

const UseBotDrawer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-DRAWER_WIDTH))[0];

  const correspondents = useSelector(
    state => state.askSlice.Category?.results || [],
  );
  const currentCategoryId = route.params?.Cat_name;

  React.useEffect(() => {
    if (correspondents.length === 0) {
    }
  }, [correspondents.length]);

  const rootCategories = useMemo(() => {
    const mbot = correspondents.find(item =>
      item.name?.toLowerCase().includes('mbot'),
    );
    if (!mbot) return [];

    return correspondents
      .filter(item => item.division === mbot.id && item.visible !== false)
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  }, [correspondents]);
  const categoriesWithHome = useMemo(() => {
    return [{ id: 'HOME', display: 'Home', isHome: true }, ...rootCategories];
  }, [rootCategories]);
  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerVisible(false));
  };

  const handleCategoryPress = item => {
    if (item.isHome) {
      navigation.goBack();
      return;
    }
    closeDrawer();
    const params = { Cat_name: item.id || 0 };
    if (route.name === 'DataScreen') {
      navigation.setParams(params);
    } else {
      navigation.navigate('DataScreen', params);
    }
  };

  const Drawer = () => {
    if (!drawerVisible) return null;

    return (
      <Modal
        transparent
        animationType="none"
        visible={drawerVisible}
        onRequestClose={closeDrawer}
      >
        <View style={styles.modalContainer}>
          {/* Drawer on LEFT, Backdrop on RIGHT */}
          <Animated.View
            style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Gyain AI </Text>
              <TouchableOpacity onPress={closeDrawer}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categoriesWithHome}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => {
                const isSelected = item.id === currentCategoryId;
                return (
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      isSelected && styles.drawerItemSelected,
                    ]}
                    onPress={() => handleCategoryPress(item)}
                  >
                    {item.isHome ? (
                      <Icon
                        name="home-outline"
                        size={20}
                        color={isSelected ? '#007bff' : '#000'}
                      />
                    ) : (
                      <Iconchat
                        name="chat"
                        size={20}
                        color={isSelected ? '#007bff' : '#000'}
                      />
                    )}
                    <Text
                      style={[
                        styles.drawerItemText,
                        isSelected && styles.drawerItemTextSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {item.display}
                    </Text>
                    {isSelected && (
                      <Icon name="check-circle" size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContainer}
            />
          </Animated.View>

          <Pressable style={styles.backdrop} onPress={closeDrawer} />
        </View>
      </Modal>
    );
  };

  return { openDrawer, Drawer };
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row', // Left to right layout
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  drawerItemSelected: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  drawerItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  drawerItemTextSelected: { color: '#007bff', fontWeight: '600' },
  separator: { height: 1, backgroundColor: '#eee', marginHorizontal: 20 },
  listContainer: { paddingBottom: 20 },
});

export default UseBotDrawer;
