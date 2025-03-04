import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  Animated,
  Platform,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CustomTextInputProps } from "@/services/core/types";
import RNPickerSelect from "react-native-picker-select";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomPickerProps } from "@/services/core/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { CustomDatePickerProps } from "@/services/core/types";
import { uploadImageToCloudinary } from "./cloudinary";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  fadeAnim,
  value,
  placeholderTextColor,
  onChangeText,
  placeholder,
  className = "",
  errorMessage,
  label = "",
  keyboardType,
  ...props
}) => {
  return (
    <View className="space-y-[5px] mb-[31px]">
      <Text
        className="text-[16px] leading-[25px]"
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        {label}
      </Text>
      <View>
        <TextInput
          style={{ fontFamily: "Inter_500Medium" }}
          value={value}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          className={`py-[16px] px-[10px] border-[#E4E7EC] border-[1px] rounded-[8px] text-[16px] leading-[24px] ${className}`}
          {...props}
        />
        {errorMessage && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
              {errorMessage}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  value,
  onValueChange,
  items,
  placeholder,
  fadeAnim,
  error,
}) => {
  return (
    <View className="space-y-[5px] mb-[31px]">
      {label && (
        <Text
          className="text-[16px] leading-[25px]"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          {label}
        </Text>
      )}
      <View
        className={`${
          Platform.OS === "ios" ? "py-[16px]" : ""
        } px-[10px] border-[#E4E7Ec] border-[1px] rounded-[8px] text-[16px] leading-[24px]`}
      >
        <RNPickerSelect
          Icon={() =>
            Platform.OS === "ios" ? (
              <Entypo name="chevron-small-down" size={24} color="black" />
            ) : null
          }
          // style={col}
          value={value}
          onValueChange={onValueChange}
          items={items}
          placeholder={{
            label: placeholder || "Select an option",
            value: "",
          }}
        />
      </View>
      {error && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  selectedDate,
  showDatePicker,
  toggleDatePicker,
  errorMessage,
  placeholder = "Select Date",
  // fadeAnim,
  maximumDate = new Date(),
  onDateSelected,
}) => {
  const handleDateChange = (event: any, date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD
      onDateSelected?.(formattedDate); // Pass only the formattedDate
    }
  };

  return (
    <View className="space-y-2 mb-[16px]">
      <Text
        className="text-[16px] leading-[25px]"
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        {label}
      </Text>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, date) => handleDateChange(event, date)}
          maximumDate={maximumDate}
        />
      )}

      {showDatePicker && Platform.OS === "ios" && (
        <View className="flex-row justify-around mt-2">
          <TouchableOpacity
            onPress={toggleDatePicker}
            className="px-4 py-2 rounded bg-gray-100"
          >
            <Text style={{ color: "#075985" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleDatePicker}
            className="px-4 py-2 rounded bg-gray-300"
          >
            <Text>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showDatePicker && (
        <Pressable onPress={toggleDatePicker}>
          <View className="py-[16px] px-[10px] border border-[#E4E7Ec] rounded-[8px] flex-row justify-between">
            <TextInput
              value={
                selectedDate ? new Date(selectedDate).toLocaleDateString() : ""
              }
              placeholder={placeholder}
              editable={false}
            />
            <Ionicons name="calendar-number-outline" size={24} color="black" />
          </View>
        </Pressable>
      )}

      {/* <Animated.View style={{ opacity: fadeAnim }}> */}
      <Text className="text-[#FF0000] text-[10px] leading-[10px] mt-1">
        {errorMessage}
      </Text>
      {/* </Animated.View> */}
    </View>
  );
};
interface ReusableImageUploadProps {
  fieldName: string;
  handleChange: (name: string, value: string | null) => void;
  errorMessage?: string;
}

export const ReusableImageUpload: React.FC<ReusableImageUploadProps> = ({
  fieldName,
  handleChange,
  errorMessage,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImageToCloudinary(setLoading);
      setImageUri(imageUrl);
      handleChange(fieldName, imageUrl); // Update parent state via handleChange
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <Pressable onPress={handleImageUpload}>
      <View style={{ marginBottom: 20 }}>
        <View
          className={`${
            imageUri ? "p-[12px]" : "p-[24px]"
          } rounded-[8px] border-dashed border-[1px] border-[#B9E6FE] mt-[14px] flex flex-col items-center`}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#0086C9" />
          ) : imageUri ? (
            <View className="flex flex-col items-center w-full">
              <Image
                resizeMode="contain"
                source={{ uri: imageUri }}
                style={{ width: 200, height: 100 }}
              />
              <Pressable
                onPress={() => {
                  setImageUri(null);
                  handleChange(fieldName, null);
                }}
              >
                <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] py-2 mt-2">
                  Remove Image
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex flex-col items-center">
              <MaterialCommunityIcons
                name="cloud-upload-outline"
                size={24}
                color="#0086C9"
              />
              <View className="flex flex-col items-center mt-[12px]">
                <Text
                  className="text-[16px] leading-[24px] text-[#1D2939]"
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  Drag your file(s) or{" "}
                  <Text
                    className="text-[14px] leading-[20px] text-[#0BA5EC]"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    browse
                  </Text>
                </Text>
                <Text
                  className="text-[14px] leading-[20px] text-[#6D6D6D]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Max 10 MB files are allowed
                </Text>
              </View>
            </View>
          )}
        </View>

        {errorMessage && (
          <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
            {errorMessage}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export const getUserToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Error retrieving user token:", error);
    return null;
  }
};
interface ProfileImagePlaceholderProps {
  imageUri?: string | ImageSourcePropType;
}
export const ProfileImagePlaceholder: React.FC<
  ProfileImagePlaceholderProps
> = ({ imageUri }) => {
  return (
    <View className="relative w-[100px] h-[100px] rounded-full border-2 border-gray-300 flex items-center justify-center ">
      {imageUri ? (
        <Image
          source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
          className="w-full h-full"
        />
      ) : (
        <FontAwesome name="user" size={50} color="#ccc" />
      )}
      {/* Icon positioned at 4 o'clock */}
      <View className="absolute bottom-2 right-0 bg-white rounded-full p-1 shadow-md">
        <MaterialIcons name="border-color" size={12} color="black" />
      </View>
    </View>
  );
};
