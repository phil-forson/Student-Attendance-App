import React from 'react'
import { useColorScheme } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import Colors from '../constants/Colors'

type Props = {
    placeholder: string
    searchPlaceholder: string
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>
    data: Array<{id: number, value: string}>
}
const Dropdown = ({placeholder, searchPlaceholder, value, setValue, data}: Props) => {
    const theme = useColorScheme()
  return (
    <SelectList
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            boxStyles={{
              backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
              borderWidth: 0,
              height: 55,
              paddingHorizontal: 20,
              alignItems: "center",
              borderRadius: 0,
              padding: 0,
            }}
            inputStyles={{
              color:
                theme === "dark"
                  ? value
                    ? "white"
                    : "gray"
                  : value
                  ? "black"
                  : "gray",
            }}
            dropdownStyles={{
              borderColor: theme === "dark" ? "#000" : "#fff",
              backgroundColor: theme === "dark" ? "#302e2e" : "#fff",
              paddingHorizontal: 5,
              paddingVertical: 0,
              borderRadius: 0,
            }}
            dropdownItemStyles={{
              paddingVertical: 1,
              height: 50,
              justifyContent: "center",
              borderBottomWidth: 0.2,
              borderBottomColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.primaryGrey,
            }}
            search
            setSelected={(val: string) => setValue(val)}
            data={data}
            save="value"
          />
  )
}

export default Dropdown