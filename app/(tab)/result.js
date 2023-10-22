import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
// import { COLORS } from "../../constants";
import { COLORS } from "../../constants";
import { router } from "expo-router";
const ResultPage = () => {
  const [date, setDate] = useState([]);
  const [exRacing, setExRacing] = useState([]);
  const [filteredRacing, setFilteredRacing] = useState([[]]);

  const [selectedDay, setSelectedDay] = useState(0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("https://racing-horse-server.vercel.app/api/raced_day")
      .then((response) => response.json())
      .then((json) => {
        json.sort((a, b) => a.date - b.date);
        setDate(json);
      });

    setLoaded(true);
  }, []);

  const filtering = async () => {
    var test = [];

    for (var i = 0; i < date.length; i++) {
      var filteredData = exRacing
        .filter((item) => item.rcDate === date[i].date)
        .sort((a, b) => a.stTime.localeCompare(b.stTime));
      test[i] = filteredData;
      // if (i == 0) {
      //   await setFilteredRacing([filteredData]);
      // } else {
      //   await setFilteredRacing((prev) => {
      //     return [...prev, filteredData];
      //   });

      // }
    }
    setFilteredRacing(test);
  };

  useEffect(() => {
    fetch("https://racing-horse-server.vercel.app/api/racing_result_summary")
      .then((response) => response.json())
      .then((json) => {
        json.sort((a, b) => {
          a.rcDate - b.rcDate;
        });
        setExRacing(json);
      });
  }, [date]);
  useEffect(() => {
    filtering();
  }, [exRacing]);

  if (loaded) {
    return (
      <View>
        <View
          style={{
            backgroundColor: COLORS.theme4,
            height: "7%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 35, color: COLORS.theme1 }}>
            주간 경마 결과
          </Text>
        </View>

        <ScrollView
          horizontal={true}
          style={{
            flexDirection: "row",

            height: 50,
          }}
        >
          {date[0] != null ? (
            date.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.selectTab(date.length, index == selectedDay)}
                  onPress={() => {
                    setSelectedDay(index);
                  }}
                >
                  <Text style={styles.TapButton}>
                    {String(item.date)
                      .substring(4)
                      .replace(/^(.{2})/, "$1/") +
                      "(" +
                      item.day +
                      ")"}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View disabled={true} style={styles.selectTab(0, false)}>
              <Text style={styles.TapButton}>주간경주정보없음</Text>
            </View>
          )}
        </ScrollView>

        <ScrollView style={{ paddingBottom: 100 }}>
          <View
            style={{
              height: "20%",
            }}
          >
            {filteredRacing.length != 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  height: 30,
                  backgroundColor: COLORS.theme2light,
                }}
              >
                <Text style={styles.raceTable(10)}>순서</Text>
                <Text style={styles.raceTable(20)}>경주</Text>
                <Text style={styles.raceTable(20)}>출발시간</Text>
                <Text style={styles.raceTable(20)}>등급</Text>

                <Text style={styles.raceTable(10)}>출전수</Text>
              </View>
            ) : (
              <Text></Text>
            )}
            {filteredRacing[0] != null ? (
              filteredRacing[selectedDay].map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 1,
                    }}
                    key={index}
                    onPress={() => {
                      router.push(
                        `/result_info?date=${item.rcDate}&rcNo=${item.rcNo}&meet=${item.meet}&index=${index}`
                      );
                    }}
                  >
                    <Text style={styles.raceData(10)}>{index + 1}</Text>
                    <Text style={styles.raceData(20)}>
                      {item.meet + item.rcNo + "R"}
                    </Text>
                    <Text style={styles.raceData(20)}>
                      {item.stTime.slice(11, -9)}
                    </Text>
                    <Text style={styles.raceData(20)}>{item.rank}</Text>

                    <Text style={styles.raceData(10)}>
                      {item.horses.length}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text></Text>
            )}
          </View>

          <View style={{ height: 40 }}></View>
        </ScrollView>
      </View>
    );
  } else {
    return <Text>asd</Text>;
  }
};

const styles = StyleSheet.create({
  selectTab: (selected) => ({
    backgroundColor: selected ? COLORS.theme3 : COLORS.theme2,
    width: 130,
    height: 50,
    borderColor: COLORS.theme2light,
    shadowColor: COLORS.theme1light,
    // elevation: 3,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  }),
  TapButton: {
    fontSize: 20,
  },
  raceTable: (ratio) => ({
    width: `${ratio}%`,
  }),
  raceData: (ratio) => ({
    width: `${ratio}%`,
    height: 40,
    fontSize: 15,
  }),
});

export default ResultPage;
