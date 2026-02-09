import React, { useState, useEffect } from "react";
import { RefreshControl, StyleSheet, View, Text, Dimensions, FlatList } from "react-native";
import LineChartComponent from "../components/charts/LineGraph";
import GroupedBarChart from "../components/charts/GroupedBarChart";
import UseHomeScreenHooks from "../Hooks/UseHomeScreenHooks";
import AuthHooks from "../Hooks/AuthHooks";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const HomeScreen = ({ route, navigation }) => {
  const { dailyData, monthlyData, loading, userData, fetchData } = UseHomeScreenHooks({ route, navigation });
  const [refreshing, setRefreshing] = useState(false);
    const { fetchUser,fetchConfig } = AuthHooks();
  const { user=[]} = useSelector((state) => state?.usersSlice);
  const {results}=user

  useEffect(() => {
    fetchData();
    fetchUser();
    fetchConfig();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
    await fetchData();
    await  fetchUser();
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* <Text>Loading...</Text> */}
      </View>
    );
  }

  return (
    <FlatList
      data={["charts"]} // Dummy data to trigger FlatList render
      keyExtractor={(item) => item}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      renderItem={() => (
        <View style={styles.container}>
          <View style={styles.chartsWrapper}>
            <View style={[styles.chartContainer, styles.chartcss]}>
              <Text style={styles.chartTitle}>Daily Activity</Text>
              <LineChartComponent data={dailyData?.data} labels={dailyData?.labels} />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Monthly Activity</Text>
              <GroupedBarChart title="" monthlyData={monthlyData} />
            </View>

            <View style={[styles.chartContainer, styles.pieChartContainer]}>
              <Text style={styles.chartTitle}>Total User Activity</Text>

              {/* Table Header */}
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.cell, styles.headerText]}>User</Text>
                <Text style={[styles.cell, styles.headerText]}>Data</Text>
                <Text style={[styles.cell, styles.headerText]}>Document</Text>
              </View>

              {/* FlatList for User Data */}
              <FlatList
                data={userData}
                keyExtractor={(item, index) => index.toString()}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const matchedUser = results?.find((user) => String(user.id) === item.UserId);
                  const displayName = matchedUser ? matchedUser.username : item.UserId;
                  return (
                    <View style={styles.row}>
                      <Text style={styles.cell}>{displayName}</Text>
                      <Text style={styles.cell}>{item.Data}</Text>
                      <Text style={styles.cell}>{item.Document}</Text>
                    </View>
                  );
                }}
                
              />
            </View>
          </View>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chartsWrapper: { padding: 2, gap: 5 },
  // chartContainer: { borderColor: "#ffffff", borderBottomWidth: 5 },
  // chartcss: { height: 500 },
  // pieChartContainer: { minHeight: 200, paddingBottom: 20 },
  chartTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 8 },
  header: { backgroundColor: "#ddd",paddingVertical: 8, paddingHorizontal: 10 },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    marginVertical: 5,
  },
  cell: { flex: 1, textAlign: "center", fontSize: 16, paddingVertical: 5 },
  headerText: {fontWeight: "700", },
});

export default HomeScreen;