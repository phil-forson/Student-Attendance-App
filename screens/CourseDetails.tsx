import { View, Text, InvTouchableOpacity } from '../components/Themed'
import React from 'react'
import { ICourseDetails } from '../types';
import useColorScheme from '../hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function CourseDetails({ navigation, route}: any) {
    const course: ICourseDetails = route.params;
    const theme = useColorScheme()
    const nav = useNavigation<'Drawer'>()
  return (
    <SafeAreaView>
                <View
          style={[
            {
              justifyContent: "space-between",
            },
          ]}
        >
          <InvTouchableOpacity
            onPress={() => navigation.navigate("Body")}
          >
            <FontAwesome5
              name="bars"
              color={theme === "dark" ? "white" : "black"}
              size={25}
            />
          </InvTouchableOpacity>
          <View></View>
        </View>
      <Text>CourseDetails</Text>
      <Text>{course.courseName}</Text>
      <Text>{course.lecturerName}</Text>
    </SafeAreaView>
  )
}