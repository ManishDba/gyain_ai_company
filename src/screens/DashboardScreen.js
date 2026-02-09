import React, {useState, useEffect, useCallback } from "react";
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,RefreshControl} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AuthHooks from "../Hooks/AuthHooks";
import { setdashboard } from "../reducers/dashboard.slice";
import axios from "../../services/axios";
import endpoint from "../../services/endpoint";
import Loader from '../components/Loader';
import UseBotScreenHooks from "../Hooks/UseBotScreenHooks";



const DashboardScreen = ({route,navigation}) => {
  const [groupedData, setGroupedData] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { fetchUser } = AuthHooks();
  const { fetchCorrespondents } = UseBotScreenHooks({route,navigation});
  const users = useSelector((state) => state.usersSlice.user?.results || []);
  const correspondents = useSelector(
    (state) => state.askSlice.Category?.results || []
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
    const fetchData = async () => {
      try {
        await Promise.all([fetchUser(), fetchCorrespondents(), fetchDashboard()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(endpoint.dasbobards(),);
      const data = response.data;
      const filteredData = data.filter((item) => {
        return correspondents.some((corr) => corr.id === item.category);
      });

      const grouped = filteredData.reduce((acc, item) => {
        const categoryId = item.category;
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push(item);
        return acc;
      }, {});

      setGroupedData(grouped);
      dispatch(setdashboard(filteredData));
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  useEffect(() => {  
    fetchUser();
    fetchCorrespondents();
    fetchDashboard();
  }, []);
  useEffect(() => {
    if (correspondents.length > 0) {
      fetchDashboard();
    }
  }, [correspondents]);
  
  const getOwnerName = (ownerId) => {
    const owner = users.find((user) => user.id === ownerId);
    return owner ? owner.username : "Unknown";
  };
  const getCategoryName = (correspondentId) => {
    const category = correspondents.find(
      (corr) => String(corr.id) === String(correspondentId)
    );
    return category ? category.display : "Unknown";
  };
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };
  const renderCategoryGroup = (categoryId) => {
    const items = groupedData[categoryId] || [];
    const categoryName = getCategoryName(categoryId);
    const isExpanded = expandedCategories[categoryId];
    return (
      <View key={categoryId} style={styles.categoryContainer}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.categoryCell]}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => toggleCategory(categoryId)}
            >
              <Text style={styles.categoryName}>
                {categoryName} ({items.length})
              </Text>
              <Text style={styles.arrow}>{isExpanded ? "▼" : "▶"}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.tableCell, { flex: 2 }]} />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.tableContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
        <Loader/>

        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { flex: 1 }]}>Category</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Dashboard Name</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Owner</Text>
        </View>
        {Object.keys(groupedData).length > 0 ? (
          Object.keys(groupedData).map((categoryId) => (
            <View key={categoryId}>
              {renderCategoryGroup(categoryId)}
              {expandedCategories[categoryId] &&
                groupedData[categoryId].map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 0
                        ? styles.tableRowEven
                        : styles.tableRowOdd,
                    ]}
                    onPress={() =>
                      navigation.navigate("DashboardDetailScreen", {
                        dashboard: item,
                      })
                    }
                  >
                    <View style={styles.tableCell} />
                    <Text
                      style={[styles.tableCell, styles.itemText, { flex: 1 }]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[styles.tableCell, styles.itemText, { flex: 1 }]}
                    >
                      {getOwnerName(item.owner)}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
            
          ))
        ) : (
          <Text style={styles.noDataText}>
            {/* No dashboard data with categories available */}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    padding: 2,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#174054",
    paddingVertical: 4,
    height: 40,
    alignItems: "center", 
    justifyContent: "center",
    borderBottomWidth: 1, 
  },
  headerCell: {
    fontWeight: "400",
    fontSize: 14,
    color: "#fff",
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
    // letterSpacing: 0.2,
  },
  categoryContainer: {
    borderBottomColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowEven: {
    backgroundColor: "#fff",
  },
  tableRowOdd: {
    backgroundColor: "#fff",
  },
  tableCell: {
    flex: 1,
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 15,
  },
  categoryCell: {
    flex: 0.8,
    fontWeight: "500",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bde0fe",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
  },
  arrow: {
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "bold",
  },
  itemText: {
    color: "#334155",
    fontSize: 15,
  },
  noDataText: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 16,
    color: "#64748b",
    fontStyle: "italic",
  },
});
export default DashboardScreen;
