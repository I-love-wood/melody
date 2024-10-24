import { View, Image, TextInput, FlatList, StyleSheet, TouchableOpacity,Text } from "react-native";
// 提供了一个易于使用的 Google Places API 自动完成搜索框
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Geocoder } from '@mapbox/search-js-react';
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";
import React, { useEffect, useRef, useState } from "react";
import Places,{ PlacesInstance, Suggestion } from "places.js";
import axios from "axios"
import { useLocationStore } from "@/store";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;
const mapboxApiAccesstoken = process.env.EXPO_PUBLIC_MAPBOX_API_ACCESSTOKEN

// 定义接口来描述Geocoding API返回的数据结构
interface Feature {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
}

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // 搜索框的输入
  const [suggestions, setSuggestions] = useState<Feature[]>([]); // 地点自动补全的建议列表
  const { setUserLocation } =  useLocationStore()

  const language = navigator.language || 'en';

  // 调用Mapbox Geocoding API来获取地点自动补全建议
  const fetchPlaces = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
          {
            params: {
              access_token: mapboxApiAccesstoken,
              autocomplete: true,
              limit: 5,
              language,  // 动态传入语言参数
            },
          }
        );
        setSuggestions(response.data.features);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // 当用户选择某个地点时，设置地图中心点并清空搜索框
  const handlePlaceSelect = (place: Feature) => {
    const address = place.place_name
    const [longitude, latitude] = place.center;
    setSearchQuery(address);
    setUserLocation({latitude, longitude, address})
    setSuggestions([]); // 清空建议列表
  };

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <TextInput
        style={styles.input}
        placeholder="Search for places"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          fetchPlaces(text); // 获取自动补全建议
        }}
      />

      {/* 自动补全建议列表 */}
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePlaceSelect(item)}>
            <Text style={styles.suggestion}>{item.place_name}</Text>
          </TouchableOpacity>
        )}
      />
      {/* <GooglePlacesAutocomplete
        fetchDetails={true} // whether to fetch details for the selected place
        placeholder="Search"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        onPress={(data, details = null) => {
          // 选择地点时的回调函数，可以接收到选择的数据和详细信息。
          // 输入一个地址并点击查询后，onPress 回调函数会被触发，允许你获取到该地址的基本数据和详细信息。
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
        }}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 5,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  map: {
    flex: 1,
  },
  marker: {
    height: 30,
    width: 30,
    backgroundColor: '#ff0000',
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 3,
  },
});

export default GoogleTextInput;
