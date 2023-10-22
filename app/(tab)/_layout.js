import { Tabs, Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { Button } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "홈",
          headerTitle: "경마정보",

          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="record"
        options={{
          tabBarLabel: "말 전적검색",
          headerTitle: "말 전적검색",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="result"
        options={{
          tabBarLabel: "경기결과",
          headerTitle: "경기결과",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="archive" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    marginRight: 10,
    elevation: 3, // Android용 그림자
  },
  loginButtonText: {
    padding: 10,

    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
