import { View, Text, TouchableOpacity } from './Themed'
import React, { useState, useRef } from 'react';
import { TextInput, FlatList, StyleSheet } from 'react-native';


export const CustomDropdown = ({ options, onSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const searchInputRef = useRef<any>(null);

  const handleSelectOption = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
    searchInputRef.current.blur();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = options.filter((option: any) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const renderOption = ({ item }: any) => (
    <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            searchInputRef.current.focus();
          }
        }}
      >
        <Text>{selectedOption ? selectedOption?.label : 'Select an option'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownOptions}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
          />

          <FlatList
            data={filteredOptions}
            renderItem={renderOption}
            keyExtractor={(item) => item.value}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CustomDropdown;
