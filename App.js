// App.js
import React from "react";
import { Provider, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
 
// ✅ All imports
import LoginScreen from "./src/screens/LoginScreen";
import DataScreen from "./src/screens/DataScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import DashboardDetailScreen from "./src/screens/DashboardDetails";
import MainLayout from "./src/components/MainLayout";
import HeaderOnlyLayout from "./src/components/HeaderOnlyLayout";
import Footer from "./src/components/Footer";
import store from "./src/store";
import Loader from "./src/components/Loader";
import BotCategory from "./src/screens/BotCategory";
import SplashScreen from "./src/screens/SplashScreen";
import PdfViewerScreen from "./src/components/PdfViewerScreen";
import ExcelScreen from "./src/screens/ExcelScreen";
 
 
const Stack = createStackNavigator();
 
const screens = [
  { name: "DataScreen", component: DataScreen },
  { name: "BotCategory", component: BotCategory },
  { name: "HomeScreen", component: HomeScreen },
  { name: "DashboardScreen", component: DashboardScreen },
  { name: "DashboardDetailScreen", component: DashboardDetailScreen },
];
 
// Screens where footer should be hidden
const screensWithoutFooter = ['DataScreen', 'Login', 'SplashScreen', 'Profile', 'PdfViewerScreen', 'ExcelScreen'];
 
const AppContent = () => {
  const isLoading = useSelector((state) => state.loaderSlice);
  const [currentRoute, setCurrentRoute] = React.useState('SplashScreen');
 
  return (
    <>
      {isLoading && <Loader />}
      <NavigationContainer
        onStateChange={(state) => {
          // Track current route
          if (state) {
            const route = state.routes[state.index];
            setCurrentRoute(route.name);
          }
        }}
      >
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{ headerShown: false, animationEnabled: false }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ExcelScreen" component={ExcelScreen} />
 
            {screens.map(({ name, component: Component }) => (
              <Stack.Screen key={name} name={name}>
                {({ route, navigation }) => (
                  <MainLayout route={route} showFooter={false}>
                    <Component route={route} navigation={navigation} />
                  </MainLayout>
                )}
              </Stack.Screen>
            ))}
 
            <Stack.Screen name="Profile">
              {({ route, navigation }) => (
                <HeaderOnlyLayout>
                  <ProfileScreen route={route} navigation={navigation} />
                </HeaderOnlyLayout>
              )}
            </Stack.Screen>
 
            <Stack.Screen name="PdfViewerScreen">
              {({ route, navigation }) => (
                <HeaderOnlyLayout>
                  <PdfViewerScreen route={route} navigation={navigation} />
                </HeaderOnlyLayout>
              )}
            </Stack.Screen>
          </Stack.Navigator>
          
          {/* Global Footer - only renders once */}
          {!screensWithoutFooter.includes(currentRoute) && <Footer />}
        </View>
      </NavigationContainer>
    </>
  );
};
 
const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);
 
export default App;