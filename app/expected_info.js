import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  useLocalSearchParams,
  router,
  useGlobalSearchParams,
} from "expo-router";
import { COLORS } from "../constants";

const Detail = () => {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const [race, setRaces] = useState([local.date, local.time, local.meet]);

  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [exRacing, setExRacing] = useState([]);
  const [filteredRacing, setFilteredRacing] = useState([]);
  const [selectedButton, setSelectedButton] = useState(parseInt(local.index));

  useEffect(() => {
    setData([]);
    fetch(
      `https://racing-horse-server.vercel.app/api/expected_racing_detail?date=${race[0]}&time=${race[1]}&meet=${race[2]}`
    )
      .then((response) => response.json())
      .then((json) => {
        json.sort((a, b) => {
          a.chulNo - b.chulNo;
        });
        setData(json);
        setLoaded(true);
      });
  }, [race]);

  const filtering = () => {
    var filteredData = exRacing
      .filter((item) => item.rcDate === parseInt(local.date))
      .sort((a, b) => a.stTime.localeCompare(b.stTime));

    setFilteredRacing(filteredData);
  };

  useEffect(() => {
    fetch("https://racing-horse-server.vercel.app/api/expected_racing_summary")
      .then((response) => response.json())
      .then((json) => {
        json.sort((a, b) => {
          a.rcDate - b.rcDate;
        });
        setExRacing(json);
      });
  }, []);

  useEffect(() => {
    filtering();
  }, [exRacing]);

  if (loaded) {
    return (
      <View>
        <ScrollView horizontal={true} style={styles.raceRow}>
          {filteredRacing.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.raceSummary(index === selectedButton)}
                key={index}
                onPress={() => {
                  setSelectedButton(index);
                  setRaces([item.rcDate, item.stTime, item.meet]);
                }}
              >
                <Text>{item.meet + item.rcNo}R</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <ScrollView>
          <View
            style={{
              backgroundColor: COLORS.theme3,
              height: 60,
              flexDirection: "column",
            }}
          >
            <View style={styles.descriptionRow}>
              <Text style={styles.description(25)}>마명</Text>
              <Text style={styles.description(20)}>마령</Text>
              <Text style={styles.description(20)}>성별</Text>
              <Text style={styles.description(20)}>등급</Text>
              <Text style={styles.description(20)}>무게</Text>
            </View>

            <View style={styles.descriptionRow}>
              <Text style={styles.description(20)}>기수</Text>
              <Text style={styles.description(20)}>조련사</Text>
              <Text style={styles.description(20)}>통산1위</Text>
              <Text style={styles.description(20)}>통산2위</Text>
              <Text style={styles.description(20)}>통산3위</Text>
            </View>
          </View>

          {data.map((item, index) => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "column",
                  borderBottomWidth: 1,
                }}
                key={index}
                onPress={() => {}}
              >
                <View style={styles.dataRow}>
                  <Text style={styles.dataText(25)}>{item.hrName}</Text>
                  <Text style={styles.dataText(20)}>{item.ageCond}</Text>
                  <Text style={styles.dataText(20)}>{item.sex}</Text>
                  <Text style={styles.dataText(20)}>{item.rank}</Text>
                  <Text style={styles.dataText(20)}>{item.wgBudam}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataText(25)}>{item.jkName}</Text>
                  <Text style={styles.dataText(20)}>{item.trName}</Text>
                  <Text style={styles.dataText(20)}>
                    {item.ord1CntT}/{item.rcCntT}
                  </Text>
                  <Text style={styles.dataText(20)}>
                    {item.ord2CntT}/{item.rcCntT}
                  </Text>
                  <Text style={styles.dataText(20)}>
                    {item.ord3CntT}/{item.rcCntT}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  } else return <Text>로딩중</Text>;
};

const styles = StyleSheet.create({
  raceRow: {
    flexDirection: "row",

    height: 60,
  },
  raceSummary: (bool) => ({
    width: 70,
    borderRightWidth: 1,
    borderColor: COLORS.theme3,
    backgroundColor: bool ? COLORS.theme2 : COLORS.theme2light,
  }),
  descriptionRow: {
    flexDirection: "row",
    height: 30,
  },
  description: (ratio) => ({
    fontSize: 15,
    width: `${ratio}%`,
  }),
  dataRow: {
    flexDirection: "row",
    height: 30,
  },
  dataText: (ratio) => ({
    fontSize: 15,
    width: `${ratio}%`,
  }),
});

export default Detail;
