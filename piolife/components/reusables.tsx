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
  FlatList,
  StyleSheet,
} from "react-native";
import { Menu } from "react-native-paper";
import { Feather, FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  CustomTextInputProps,
  ReusableImageUploadProps,
} from "@/services/core/types";
import RNPickerSelect from "react-native-picker-select";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomPickerProps } from "@/services/core/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { CustomDatePickerProps } from "@/services/core/types";
import { uploadImageToCloudinary } from "./cloudinary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const wallet = require("../assets/images/Cash Wallet.png");
const consult = require("../assets/images/image 46.png");
const history = require("../assets/images/image 45-2.png");
const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
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
    <View className="flex flex-col gap-[12px]">
      <Text
        className="text-[14px] leading-[25px] text-[#030319]"
        style={{ fontFamily: "Inter_300Light" }}
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
          className={` px-[10px] border-[#a5a5a5] border-[1px] rounded-[8px] text-[14px] leading-[15px] h-[45px] ${className}`}
          {...props}
        />

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
            {errorMessage}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};
export const CountryPicker: React.FC<CustomPickerProps> = ({
  label,
  value,
  onValueChange,
  items,
  placeholder,
  fadeAnim,
  error,
}) => {
  return (
    <View className="flex flex-col gap-[12px]">
      {label && (
        <Text
          className="text-[14px] leading-[25px]"
          style={{ fontFamily: "Inter_300Light" }}
        >
          {label}
        </Text>
      )}
      <View>
        <View
          className={`${
            Platform.OS === "ios" ? "" : ""
          } px-[10px] border-[#a5a5a5] border-[1px] rounded-[8px] text-[16px] leading-[24px] h-[45px] flex items-center justify-center`}
        >
          <RNPickerSelect
            Icon={() =>
              Platform.OS === "ios" ? (
                <Entypo name="chevron-small-down" size={24} color="black" />
              ) : null
            }
            darkTheme={true}
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
    <View className="flex flex-col gap-[12px]">
      {label && (
        <Text
          className="text-[14px] leading-[25px] text-[#030319]"
          style={{ fontFamily: "Inter_300Light" }}
        >
          {label}
        </Text>
      )}
      <View>
        <View
          className={`${
            Platform.OS === "ios" ? "" : ""
          } px-[10px] border-[#a5a5a5] border-[1px] rounded-[8px] text-[16px] leading-[24px] h-[45px] flex items-center justify-center`}
        >
          <RNPickerSelect
            Icon={() =>
              Platform.OS === "ios" ? (
                <Entypo name="chevron-small-down" size={24} color="black" />
              ) : null
            }
            darkTheme={true}
            value={value}
            onValueChange={onValueChange}
            items={items}
            placeholder={{
              label: placeholder || "Select an option",
              value: "",
            }}
          />
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
            {error}
          </Text>
        </Animated.View>
      </View>
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
    <View className="flex flex-col gap-[12px]">
      <Text
        className="text-[14px] leading-[25px]"
        style={{ fontFamily: "Inter_300Light" }}
      >
        {label}
      </Text>
      <View>
        {showDatePicker && (
          <DateTimePicker
            textColor="#000000"
            style={{}}
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
            <View className="h-[45px] px-[10px] border border-[#a5a5a5] rounded-[8px] flex flex-row justify-between items-center">
              <TextInput
                value={
                  selectedDate
                    ? new Date(selectedDate).toLocaleDateString()
                    : ""
                }
                placeholder={placeholder}
                editable={false}
              />
              <Ionicons
                name="calendar-number-outline"
                size={24}
                color="black"
              />
            </View>
          </Pressable>
        )}

        <Text className="text-[#FF0000] text-[10px] leading-[10px] mt-1">
          {errorMessage}
        </Text>
      </View>
    </View>
  );
};
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
      <View>
        <View
          className={`${
            imageUri ? "p-[12px]" : "p-[24px]"
          } rounded-[4px]  border-[1px] border-[#a5a5a5]  flex flex-col items-center`}
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
                <Text
                  className="font-600 text-[10px] leading-[10px] text-[#FF0000] py-2 mt-2"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Remove Image
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex flex-col items-center">
              <FontAwesome name="image" size={24} color="#a5a5a5" />
              <View className="flex flex-col items-center mt-[12px]">
                <Text
                  className="text-[12px] leading-[20px] text-[#272757]"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Upload here
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
  imageUri?: string | null;
  upload?: () => void;
}
export const ProfileImagePlaceholder: React.FC<
  ProfileImagePlaceholderProps & { showBorder?: boolean }
> = ({ imageUri, showBorder = true, upload }) => {
  return (
    <Pressable
      onPress={upload}
      className={`relative w-[100px] h-[100px] rounded-full flex items-center justify-center ${
        showBorder ? "border-2 border-gray-300" : ""
      }`}
    >
      {imageUri ? (
        <Image
          source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
          className="w-[100px] h-[100px] rounded-full"
        />
      ) : (
        <FontAwesome name="user" size={50} color="#ccc" />
      )}
      {/* Icon positioned at 4 o'clock */}
      <View className="absolute bottom-2 right-0 bg-white rounded-full p-1 shadow-md">
        <MaterialIcons name="border-color" size={12} color="black" />
      </View>
    </Pressable>
  );
};
interface CustomDropdownProps {
  label?: string;
  items: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}
export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  items,
  value,
  onValueChange,
  placeholder = "Select an option",
}) => {
  const [visible, setVisible] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);

  return (
    <View style={{ marginBottom: 20 }}>
      {label && (
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{label}</Text>
      )}

      <View onLayout={(event) => setMenuWidth(event.nativeEvent.layout.width)}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setVisible(true)}
              style={{
                padding: 14,
                borderWidth: 1,
                borderColor: "#E4E7Ec",
                borderRadius: 8,
                backgroundColor: "white",
              }}
            >
              <Text style={{ fontSize: 16, color: value ? "black" : "gray" }}>
                {value
                  ? items.find((item) => item.value === value)?.label
                  : placeholder}
              </Text>
            </TouchableOpacity>
          }
        >
          <View style={{ width: menuWidth }}>
            <FlatList
              nestedScrollEnabled={true}
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Menu.Item
                  contentStyle={{ width: "100%" }}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                  title={item.label}
                />
              )}
            />
          </View>
        </Menu>
      </View>
    </View>
  );
};
export const ClientScreen = () => {
  return (
    <View className="py-[8px] px-[24px] bg-[#0e16ff] flex flex-row rounded-[16px] items-center justify-between">
      {/* Fund Your Account */}
      <View className="w-1/3 flex items-center">
        <Pressable
          className="flex flex-col items-center"
          onPress={() => {
            router.push("/clientWallet");
          }}
        >
          <Image source={wallet} className="w-[56px] h-[56px]" />
          <Text
            className="text-[#ffffff] text-[14px] leading-[20px] text-center h-[40px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Fund Your Account
          </Text>
        </Pressable>
      </View>

      {/* Divider */}
      <View className="h-[60px] w-[1px] bg-[#dadada]"></View>

      {/* Consult */}
      <View className="w-1/3 flex items-center">
        <Pressable
          className="flex flex-col items-center"
          onPress={() => {
            router.push("/consult");
          }}
        >
          <Image source={consult} className="w-[56px] h-[56px]" />
          <Text
            className="text-[#ffffff] text-[14px] leading-[20px] text-center h-[40px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Consult
          </Text>
        </Pressable>
      </View>

      {/* Divider */}
      <View className="h-[60px] w-[1px] bg-[#dadada]"></View>

      {/* History */}
      <View className="w-1/3 flex items-center">
        <Pressable className="flex flex-col items-center">
          <Image source={history} className="w-[56px] h-[56px]" />
          <Text
            className="text-[#ffffff] text-[14px] leading-[20px] text-center h-[40px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            History
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
interface DoctorScreenProps {
  balance: number;
}
export const DoctorScreen = ({ balance }: DoctorScreenProps) => {
  return (
    <View className="py-[16px] px-[24px] bg-[#0e16ff] flex flex-col rounded-[16px] ">
      <View className="flex flex-col gap-[8px]">
        <Text
          className="font-[400] text-[16px] leading-[150%] text-[#FFFFF0]"
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Balance Amount
        </Text>
        <Text
          className="font-[400] text-[24px] leading-[100%] text-[#FFFFF0]"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          ₦{balance}
        </Text>
      </View>
      <View className="flex flex-row justify-end">
        <Pressable
          className="py-[8px] px-[16px] border-[#F4F1F1] border-[1px] bg-[#FFFFFF] rounded-[8px]"
          onPress={() => {
            router.push("/creditMe");
          }}
        >
          <Text
            className="font-[400] text-[14px] leading-[100%] text-[#272757]"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Credit Me
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export const Stat = () => {
  return (
    <View
      className="rounded-[4px] border-[#A5A5A566] border-[1px] px-[16px] py-[8px] flex flex-row gap-[16px] items-center bg-white justify-between w-1/2"
      style={[styles.shadowProp]}
    >
      <View className="flex flex-col gap-[8px]">
        <Text
          className="text-[#030319] text-[14px] leading-[150%]  "
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Consultations
        </Text>
        <Text
          className="text-[#000000] text-[14px] leading-[150%]  "
          style={{ fontFamily: "Inter_500Medium" }}
        >
          3
        </Text>
      </View>
    </View>
  );
};
export const ClientMenu = () => {
  return (
    <View className="flex flex-col gap-[20px]">
      <Text
        className="text-[#272757] text-[18px] leading-[17px] "
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        Activity
      </Text>
      <View className="flex flex-col gap-[16px]">
        <Pressable
          className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-white justify-between"
          style={[styles.shadowProp]}
        >
          <View className="flex flex-col gap-[8px] flex-1">
            <Text
              className="text-[#272757] text-[14px] leading-[20px]  "
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Subscribe (App Data)
            </Text>
            <Text
              className="text-[#272757] text-[12px] leading-[20px]  "
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Subscribe to continue enjoying our services
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color="black" />
        </Pressable>
        <Pressable
          className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-white justify-between"
          style={[styles.shadowProp]}
        >
          <View className="flex flex-col gap-[8px] flex-1">
            <Text
              className="text-[#272757] text-[14px] leading-[20px]  "
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Set Up Passcodes
            </Text>
            <Text
              className="text-[#272757] text-[12px] leading-[20px]  "
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Lock the app with passcodes or biometrics
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};
export function formatNumberToThousands(number: any) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
