
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  Keyboard,
} from "react-native";
import UseBotScreenHooks from "../Hooks/UseBotScreenHooks";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AuthHooks from "../Hooks/AuthHooks";
import useProfileHooks from "../Hooks/ProfileHooks";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AppColors, AppSizes, AppFonts, AppShadows } from "../theme";

const { width } = Dimensions.get("window");

const BotCategory = ({route}) => {
  const navigation = useNavigation();
  const { fetchCorrespondents } = UseBotScreenHooks({route});
  const { fetchConfig } = AuthHooks();
  const { fetchProfile } = useProfileHooks();
  const searchInputRef = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  const correspondents = useSelector(
    (state) => state.askSlice.Category?.results || []
  );

  const rootCategories = useMemo(() => {
    const mbotItem = correspondents.find((item) =>
      item.name.toLowerCase().includes("mbot")
    );
    if (mbotItem === -1) {
      throw Error("Item not found");
    }
    return correspondents
      .filter((item) => item.division === mbotItem.id && item.visible !== false)
      .sort((a, b) => a.sequence - b.sequence);
  }, [correspondents]);

  const displayData = useMemo(() => {
    const baseData = categoryStack.length > 0 ? filteredItems : rootCategories;

    if (searchText.trim()) {
      return baseData.filter(
        (item) =>
          item.display?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return baseData;
  }, [categoryStack.length, filteredItems, rootCategories, searchText]);

  useEffect(() => {
    fetchCorrespondents();
    fetchConfig();
    fetchProfile();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCorrespondents();
    setRefreshing(false);
  }, [fetchCorrespondents]);

  const normalize = (text) => text?.toLowerCase().trim().replace(/\s+/g, "-");

  const handleCategoryPress = useCallback(
    (item) => {
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
      navigation.navigate("DataScreen", { Cat_name: item.id || 0 });
    },
    [navigation]
  );

  const clearSearch = useCallback(() => {
    setSearchText("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          style={styles.tutorCard}
          onPress={() => handleCategoryPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.tutorInfo}>
            <Text style={styles.tutorName}>{item.display}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={AppColors.textTertiary}
          />
        </TouchableOpacity>
      );
    },
    [handleCategoryPress]
  );

  const handleBackPress = useCallback(() => {
    const newStack = categoryStack.slice(0, categoryStack.length - 1);
    setCategoryStack(newStack);

    if (newStack.length === 0) {
      setFilteredItems([]);
    } else {
      const lastItem = newStack[newStack.length - 1];
      const matched = correspondents.filter(
        (subItem) => normalize(subItem.division) === normalize(lastItem.name)
      );
      setFilteredItems(matched);
    }
  }, [categoryStack, correspondents]);

  const keyExtractor = useCallback(
    (item, index) => `${item.id || index}-${item.name || index}`,
    []
  );

  // const SearchBar = useMemo(
  //   () => (
  //     <View style={styles.searchContainer}>
  //       <Icon name="magnify" size={AppSizes.iconMd} color={AppColors.textSecondary} />
  //       <TextInput
  //         ref={searchInputRef}
  //         style={styles.searchInput}
  //         placeholder="Search bots..."
  //         placeholderTextColor={AppColors.textTertiary}
  //         value={searchText}
  //         onChangeText={handleSearchChange}
  //         autoCorrect={false}
  //         autoCapitalize="none"
  //         returnKeyType="search"
  //         blurOnSubmit={false}
  //       />
  //       {searchText.length > 0 && (
  //         <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
  //           <Icon name="close" size={AppSizes.iconMd} color={AppColors.textSecondary} />
  //         </TouchableOpacity>
  //       )}
  //     </View>
  //   ),
  //   [searchText, handleSearchChange, clearSearch]
  // );

  const Breadcrumb = useMemo(() => {
    if (categoryStack.length === 0) return null;

    return (
      <View style={styles.breadcrumbContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumbText}>
          {categoryStack.map((cat) => cat.display).join(" / ")}
        </Text>
      </View>
    );
  }, [categoryStack, handleBackPress]);

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>AI Assistants</Text>
        {Breadcrumb}
      </View> 
    ),
    [Breadcrumb]
  );

  const EmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          {searchText ? "No bots found" : ""}
        </Text>
        <Text style={styles.emptyText}>
          {searchText
            ? `No bots match "${searchText}". Try a different search term.`
            : ""}
        </Text>
      </View>
    ),
    [searchText]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={displayData}
        keyExtractor={keyExtractor}
        numColumns={1}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        windowSize={10}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        getItemLayout={null}
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  listContent: {
    padding: AppSizes.md,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: AppSizes.lg,
  },
  mainTitle: {
    fontSize: AppFonts.xxl,
    fontWeight: '600',
    fontFamily: AppFonts.semiBold,
    color: AppColors.textPrimary,
    marginBottom: AppSizes.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.white,
    borderRadius: AppSizes.radiusMd,
    paddingHorizontal: AppSizes.md,
    paddingVertical: AppSizes.sm,
    marginBottom: AppSizes.md,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...AppShadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: AppFonts.md,
    fontFamily: AppFonts.regular,
    color: AppColors.textPrimary,
    paddingVertical: 0,
    marginLeft: AppSizes.sm,
  },
  clearButton: {
    padding: AppSizes.xs,
  },
  breadcrumbContainer: {
    marginBottom: AppSizes.md,
    paddingHorizontal: AppSizes.md,
    paddingVertical: AppSizes.sm,
    backgroundColor: AppColors.white,
    borderRadius: AppSizes.radiusMd,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    ...AppShadows.small,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  backButton: {
    marginRight: AppSizes.sm,
    paddingHorizontal: AppSizes.sm,
    paddingVertical: AppSizes.xs,
    borderRadius: AppSizes.radiusSm,
    backgroundColor: AppColors.primary,
  },
  backButtonText: {
    fontWeight: "600",
    fontFamily: AppFonts.semiBold,
    fontSize: AppFonts.sm,
    color: AppColors.white,
  },
  breadcrumbText: {
    fontSize: AppFonts.sm,
    fontFamily: AppFonts.medium,
    color: AppColors.textSecondary,
    flexShrink: 1,
  },
  
  // Card styles matching the image - no icon, same color
  tutorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface, // Single light gray color
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: AppFonts.medium,
    color: AppColors.textPrimary,
  },
  
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: AppSizes.xl,
  },
  emptyTitle: {
    fontSize: AppFonts.xl,
    fontWeight: "bold",
    fontFamily: AppFonts.semiBold,
    color: AppColors.textPrimary,
    marginBottom: AppSizes.sm,
  },
  emptyText: {
    fontSize: AppFonts.md,
    fontFamily: AppFonts.regular,
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: AppSizes.lg,
  },
});

export default BotCategory;