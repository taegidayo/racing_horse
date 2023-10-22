import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
// import { COLORS } from "../../constants";
import { COLORS } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { FontAwesome5 } from "@expo/vector-icons";

const RecordPage = () => {
  const [names, setNames] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const local = useLocalSearchParams();
  const [params, setParams] = useState(local.hrName);

  useEffect(() => {
    if (params != undefined) {
      fetchNames(params);
    }
    fetch("https://racing-horse-server.vercel.app/api/hrName")
      .then((response) => response.json())
      .then((json) => {
        setNames(json);
      });
  }, []);

  const fetchNames = async (searchQuery) => {
    try {
      const response = await fetch(
        `https://racing-horse-server.vercel.app/api/search_hrName?hrName=${searchQuery}`
      );
      const data = await response.json();

      setResults(data);
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

  const handleSearchPress = () => {
    if (query.length > 0) {
      fetchNames(query);
    } else {
      setSuggestions([]);
    }
  };

  const handleTextChange = (text) => {
    setQuery(text);
    if (text.length > 0) {
      const matched = names.filter((name) =>
        name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionPress = (name) => {
    setQuery(name);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={(text) => {
            setQuery(text), handleTextChange(text);
          }}
          placeholder="Search names..."
        />
        <Button title="Search" onPress={handleSearchPress} />
      </View>

      {query != "" ? (
        <FlatList
          style={styles.autocompleteList}
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
              <Text style={styles.autocompleteItem}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : null}

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell(10)}>마명</Text>
          <Text style={styles.tableCell(10)}>순위</Text>
          <Text style={styles.tableCell(10)}>경기일자</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell(10)}>지역</Text>

          <Text style={styles.tableCell(10)}>출번</Text>

          <Text style={styles.tableCell(10)}>경기보러가기</Text>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.rcNo.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                borderBottomWidth: 1,

                borderColor: COLORS.theme4,
              }}
            >
              <View style={styles.tableRow}>
                <Text style={styles.resultCell(10)}>{item.hrName}</Text>
                <Text style={styles.resultCell(10)}>{item.ord}</Text>
                <Text style={styles.resultCell(10)}>{item.rcDate}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.resultCell(10)}>
                  {item.meet + item.rcNo + "R"}
                </Text>
                <Text style={styles.resultCell(10)}>{item.chulNo}</Text>
                <TouchableOpacity
                  style={styles.resultCell(10)}
                  onPress={async () => {
                    var url = `http://kra.fiveplayer.co.kr/player.php?f=${item.rcDate}/`;
                    if ("서울" === item.meet) url += `s${item.rcNo}r`;
                    else if ("부산경남" === item.meet) url += `b${item.rcNo}r`;
                    else url += `j${item.rcNo}r`;

                    await WebBrowser.openBrowserAsync(url);
                  }}
                >
                  <FontAwesome5 name="play-circle" size={25} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  autocompleteList: {
    position: "absolute", // 절대 위치 지정
    top: 49, // search bar 아래로 설정, 필요한 경우 조절
    left: 11,
    right: 10,
    maxHeight: 200, // 보여줄 최대 높이 설정. 필요한 경우 조절
    backgroundColor: "white",
    zIndex: 2, // 다른 요소 위에 나타나게 함
  },
  autocompleteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.theme3,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: (ratio) => ({
    flex: 1,
    width: `${ratio}%`,
    height: 30,
    borderWidth: 1,
    borderColor: COLORS.theme4,
    backgroundColor: COLORS.theme3,
    textAlign: "center",
  }),
  resultCell: (ratio) => ({
    flex: 1,
    height: 40,
    width: `${ratio}%`,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.theme3,
    backgroundColor: COLORS.theme2,
    textAlign: "center",
  }),
});

export default RecordPage;
