import { View, Text, InvTouchableOpacity } from '../components/Themed'
import React from 'react'
import { ICourseDetails } from '../types';
import useColorScheme from '../hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetails({ navigation, route}: any) {
    const course: ICourseDetails = route.params;
    const theme = useColorScheme()
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
            onPress={() => navigation.openDrawer()}
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