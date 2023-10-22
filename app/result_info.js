import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
} from "react-native";

import {
  useLocalSearchParams,
  useGlobalSearchParams,
  router,
} from "expo-router";
import { COLORS } from "../constants";

const Detail = () => {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const [race, setRaces] = useState([local.date, local.rcNo, local.meet]);

  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [exRacing, setExRacing] = useState([]);
  const [filteredRacing, setFilteredRacing] = useState([]);
  const [selectedButton, setSelectedButton] = useState(parseInt(local.index));
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState(0);
  const [horseInfo, setHorseInfo] = useState();

  const ModalComponent = ({ visible, onClose }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {type == 0 ? <HrInfo /> : null}

            <Button title="닫기" onPress={onClose} />
          </View>
        </View>
      </Modal>
    );
  };

  const HrInfo = () => {
    return (
      <View>
        <Text>마명:{horseInfo.hrName}</Text>
        <Text>성별: {horseInfo.sex}</Text>
        <Text>생년월일:{horseInfo.birthday}</Text>
        <Text>등급: {horseInfo.rank}</Text>
        <Text>통산 출전수:{horseInfo.rcCntT}</Text>

        <Text>통산 1등-{horseInfo.ord1CntT}</Text>
        <Text>통산 2등-{horseInfo.ord2CntT}</Text>
        <Text>통산 3등-{horseInfo.ord3CntT}</Text>

        <Text>총 획득상금: {horseInfo.chaksunT}</Text>
        <Text>레이팅 : {horseInfo.rating}</Text>
      </View>
    );
  };

  const getHrInfo = (hrname) => {
    // console.log(process.env.EXPO_PUBLIC_API_KEY);

    fetch(
      `https://apis.data.go.kr/B551015/API8_2/raceHorseInfo_2?ServiceKey=${process.env.EXPO_PUBLIC_API_KEY}&pageNo=1&numOfRows=100&hr_name=${hrname}&_type=json`
    )
      .then((response) => response.json())
      .then((json) => {
        setHorseInfo(json.response.body.items.item);

        setModalVisible(true);
        setType(0);
      });
  };

  useEffect(() => {
    setData([]);
    fetch(
      `https://racing-horse-server.vercel.app/api/racing_result_detail?date=${race[0]}&rcNo=${race[1]}&meet=${race[2]}`
    )
      .then((response) => response.json())
      .then((json) => {
        json.sort((a, b) => {
          return a.ord - b.ord;
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
    fetch("https://racing-horse-server.vercel.app/api/racing_result_summary")
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
                key={index + "a"}
                onPress={() => {
                  setSelectedButton(index);
                  setRaces([item.rcDate, item.rcNo, item.meet]);
                }}
              >
                <Text>{item.meet + item.rcNo}R</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <ScrollView>
          <View style={styles.descriptionRow}>
            <Text style={styles.description(15)}>순위</Text>
            <Text style={styles.description(30)}>마명</Text>
            <Text style={styles.description(25)}>기수</Text>
            <Text style={styles.description(25)}>조련사</Text>
          </View>

          {data.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.dataRow}
                key={index}
                onPress={() => {
                  router.replace(`/record?hrName=${item.hrName}`);
                }}
              >
                <Text style={styles.dataText(15)}>{item.ord}</Text>

                <Text style={styles.dataText(30)}>{item.hrName}</Text>

                <Text style={styles.dataText(25)}>{item.jkName}</Text>

                <Text style={styles.dataText(25)}>{item.trName}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ModalComponent
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
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
    backgroundColor: COLORS.theme3,
    flexDirection: "row",
    height: 50,
  },
  description: (ratio) => ({
    fontSize: 20,
    width: `${ratio}%`,
  }),
  dataRow: {
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 60,
    backgroundColor: COLORS.theme1,
  },
  dataText: (ratio) => ({
    fontSize: 20,
    width: `${ratio}%`,
  }),
  dataTable: {
    borderStartWidth: 1,
    borderColor: COLORS.theme3,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Detail;
