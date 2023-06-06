import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  DatePickerIOSComponent,
  FlatList
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import useColorScheme from "../hooks/useColorScheme";
import axios from "axios";

export default function CreateClass({ navigation }: any) {
  const [classTitle, setClassTitle] = useState("");
  const [classStartTime, setClassStartTime] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [classLocationSearch, setClassLocationSearch] = useState("")
  const [classDate, setClassDate] = useState(new Date(Date.now()));
  const [classTime, setClassTime] = useState(new Date(Date.now()));
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isPlacesLoading, setIsPlacesLoading] = useState(false)

  const [platform, setPlatform] = useState("");

  const theme = useColorScheme()

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setClassDate(currentDate ?? new Date(Date.now()));
  };

  useEffect(() => {
    
  }, [isItemSelected])

  const handleClassLocChange = async (loc: string) => {
    setIsItemSelected(false);
    setClassLocationSearch(loc);
    setIsPlacesLoading(true);
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${loc}&countrycodes=GH`;
    try {
      console.log("trying");
      await axios
        .get(apiUrl)
        .then((response) => {
          const data = response.data;
          console.log("data ", data);
          const placesData = data.map((location: any) => ({
            id: location.place_id,
            name: location.display_name,
            boundingBox: location.boundingbox,
          }));
          setPlaces(placesData);
          setIsPlacesLoading(false);
        })
        .catch((e) => console.log("places error ", e));
    } catch (error) {
      setIsPlacesLoading(false);
      // Handle error
      console.error(error);
    }
  };

  const openDate = () => {
    if(Platform.OS === "android"){
      setShowDate(false)
      DateTimePickerAndroid.open({
          value: classDate,
          onChange: onChangeDate,
          mode: "date",
          is24Hour: true,
        })
    }
    else if(Platform.OS === 'ios'){
      setShowDate(true)
    }

  };

  const width = Dimensions.get("screen").width - 40;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => createClass()}
            style={{}}
            disabled={!(classTitle.length && classLocation.length) || isLoading || !isItemSelected}
          >
            <Text
              style={{
                color: !(classTitle.length && classLocation.length) || isLoading || !isItemSelected
                  ? "#023f65"
                  : "#008be3",
                fontSize: 16,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [classTitle, classLocation, isLoading, isItemSelected]);

  const handleClassTitleChange = (title: string) => {
    setClassTitle(title);
  };

  const handleClassStartTime = (time: string) => {
    setClassStartTime(time);
  };

  const handleClassLoc = (loc: string) => {
    setClassLocation(loc);
  };

  const createClass = () => {
    console.log(classLocation);
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Enter the following details to create a class
      </Text>
      <View style={styles.inputContainer}>
        <InputField
          keyboardType="default"
          secure={false}
          placeholder="Class Title eg. Lecture 1"
          placeholderTextColor="gray"
          value={classTitle}
          setValue={handleClassTitleChange}
        />
      </View>
      <View style={[styles.inputContainer, styles.marginVertical]}>
        <InputField
          placeholder="Class Location"
          placeholderTextColor="gray"
          secure={false}
          keyboardType="default"
          value={classLocationSearch}
          setValue={handleClassLocChange}
        />
        {!(isPlacesLoading || isItemSelected) && (
          <FlatList
            data={places}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  setClassLocation(item);
                  setClassLocationSearch(
                    item.name.split(",").slice(0, 2).join(",")
                  );
                  setIsItemSelected(true);
                }}
                style={[
                  {
                    backgroundColor: theme === "light" ? "#eee" : "#121212",
                    padding: 10,
                  },
                ]}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item: any) => item.id.toString()}
          />
        )}
        {isPlacesLoading && (
          <View
            style={[
              {
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
              },
            ]}
          >
            <Text>Loading...</Text>
          </View>
        )}
      </View>
        <View style={[styles.inputContainer, styles.marginVertical]}>
          <InputField
            keyboardType="default"
            secure={false}
            placeholder="Class date"
            placeholderTextColor="gray"
            value={classDate.toLocaleDateString()}
            setValue={onChangeDate}
            editable={false}
            onClick={() => openDate()}
          />
        </View>
        {showDate && Platform.OS === "ios" && (
          <DateTimePicker
          testID="dateTimePicker"
          value={classDate}
          mode={"date"}
          is24Hour={true}
          onChange={onChangeDate}
        />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    marginTop: 30,
  },
  marginVertical: {
    marginVertical: 0,
  },
});
