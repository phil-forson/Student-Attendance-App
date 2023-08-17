import { useColorScheme } from 'react-native'
import {View, Text} from './Themed'
import React from 'react'
import { styles } from '../styles/styles'
import { FlatList } from 'react-native-gesture-handler'
import Colors from '../constants/Colors'
import { ClassItem } from './ClassItem'

export default function ClassGroupItem({item, handleClassItemPressed}: any) {
    const theme = useColorScheme()
  return (
    <View>
        <View style={[{ paddingVertical: 5 }]}>
          <Text style={[styles.semiBold, { color: Colors.dark.tetiary }]}>
            {item[0].classDate.toDate().toDateString()}
          </Text>
        </View>
        <FlatList
          data={item}
          renderItem={({ item }) => <ClassItem item={item} handleClassItemPressed={handleClassItemPressed} />}
          keyExtractor={(item) => item.classDate}
          style={[
            {
              backgroundColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.primaryGrey,
            },
            styles.rounded,
          ]}
          ItemSeparatorComponent={() => (
            <View
              style={[
                styles.transBg,
                {
                  borderBottomWidth: 1,
                  height: 2,
                  borderBottomColor:
                    theme === "dark"
                      ? Colors.dark.secondaryGrey
                      : Colors.light.secondaryGrey,
                },
              ]}
            ></View>
          )}
          ListEmptyComponent={() => (
            <Text style={[styles.textCenter]}>No members</Text>
          )}
        />
      </View>
  )
}