import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Button } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

const Layout = () => {
  //   const [fontLoaded] = useFonts({
  // DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
  // DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
  // DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  //   });
  //   if (!fontLoaded) {
  // return null;
  //   }

  return (
    <Stack initialRouteName="home">
      <Stack.Screen
        name="(tab)"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name="index" options={{ title: "로그인" }} /> */}
      {/* <Stack.Screen name="home" /> */}
      {/* <Stack.Screen name="signup" options={{ title: "회원가입" }} /> */}
      <Stack.Screen name="expected_info" options={{ title: "경기계획" }} />
      <Stack.Screen name="result_info" options={{ title: "경기결과" }} />
    </Stack>
  );
};

export default Layout;
