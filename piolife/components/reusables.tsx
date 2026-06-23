import React, { useEffect, useState } from "react";
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
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { CustomDatePickerProps } from "@/services/core/types";
import { uploadImageToCloudinary, uploadPdfToCloudinary } from "./cloudinary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Location from "expo-location";
import { FlatListProps } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { StreamChat } from "stream-chat";
import * as Crypto from "expo-crypto";
const wallet = require("../assets/images/Cash Wallet.png");
const consult = require("../assets/images/image 46.png");
const history = require("../assets/images/image 45-2.png");
const piocoinSymbol = require("../assets/images/piocoin_symbol-removebg-preview 1.png");

export const PioCoinAmount = ({
  amount,
  style,
  imageSize = 20,
}: {
  amount: string | number;
  style?: object;
  imageSize?: number;
}) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
    <Image
      source={piocoinSymbol}
      style={{ width: imageSize * 0.55, height: imageSize }}
      resizeMode="contain"
    />
    <Text style={style}>{typeof amount === "number" ? amount.toLocaleString() : amount}</Text>
  </View>
);

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
  secureTextEntry = false,
  ...props
}) => {
  const [isTextHidden, setIsTextHidden] = useState(secureTextEntry);

  return (
    <View className="flex flex-col gap-[12px]">
      <Text
        className="text-[14px] leading-[25px] text-[#030319]"
        style={{ fontFamily: "Inter_300Light" }}
      >
        {label}
      </Text>

      <View>
        <View className="flex-row items-center border border-[#a5a5a5] rounded-[8px] px-[10px] h-[45px]">
          <TextInput
            style={{ fontFamily: "Inter_500Medium", flex: 1 }}
            value={value}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            secureTextEntry={isTextHidden}
            className={`text-[14px] leading-[15px] ${className}`}
            {...props}
          />

          {/* Toggle only if secureTextEntry is true */}
          {secureTextEntry && (
            <Pressable onPress={() => setIsTextHidden((prev) => !prev)}>
              <Ionicons
                name={isTextHidden ? "eye-off" : "eye"}
                size={20}
                color="#808080"
              />
            </Pressable>
          )}
        </View>

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

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  selectedDate,
  showDatePicker,
  toggleDatePicker,
  errorMessage,
  placeholder = "Select Date",
  maximumDate = new Date(),
  onDateSelected,
}) => {
  const openAndroidDatePicker = () => {
    const today = new Date();

    DateTimePickerAndroid.open({
      value: selectedDate instanceof Date ? selectedDate : new Date(),
      onChange: (event, date) => {
        if (event.type === "set" && date) {
          const formattedDate = date.toISOString().split("T")[0];
          onDateSelected?.(formattedDate);
        }
      },
      mode: "date",
      maximumDate: maximumDate,
      is24Hour: true,
    });
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
        {/* iOS inline picker */}
        {Platform.OS === "ios" && showDatePicker && (
          <>
            <DateTimePicker
              textColor="#000000"
              value={selectedDate instanceof Date ? selectedDate : new Date()}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) {
                  const formattedDate = date.toISOString().split("T")[0];
                  onDateSelected?.(formattedDate);
                }
              }}
              maximumDate={maximumDate}
            />

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
          </>
        )}

        {/* Android uses native modal picker on press */}
        {Platform.OS === "android" && (
          <Pressable onPress={openAndroidDatePicker}>
            <View className="h-[45px] px-[10px] border border-[#a5a5a5] rounded-[8px] flex flex-row justify-between items-center">
              <TextInput
                value={
                  selectedDate instanceof Date
                    ? selectedDate.toLocaleDateString()
                    : undefined
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
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDocumentUpload = async () => {
    try {
      const result = await uploadPdfToCloudinary(setLoading);
      if (result) {
        setFileName(result.name);
        handleChange(fieldName, result.url); // Update parent state via handleChange
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  return (
    <Pressable onPress={handleDocumentUpload}>
      <View>
        <View
          className={`${
            fileName ? "p-[12px]" : "p-[24px]"
          } rounded-[4px]  border-[1px] border-[#a5a5a5]  flex flex-col items-center`}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#0086C9" />
          ) : fileName ? (
            <View className="flex flex-col items-center w-full">
              <FontAwesome name="file-pdf-o" size={32} color="#FF0000" />
              <Text
                numberOfLines={1}
                className="text-[12px] leading-[20px] text-[#272757] mt-[8px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                {fileName}
              </Text>
              <Pressable
                onPress={() => {
                  setFileName(null);
                  handleChange(fieldName, null);
                }}
              >
                <Text
                  className="font-600 text-[10px] leading-[10px] text-[#FF0000] py-2 mt-2"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Remove File
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex flex-col items-center">
              <FontAwesome name="file-pdf-o" size={24} color="#a5a5a5" />
              <View className="flex flex-col items-center mt-[12px]">
                <Text
                  className="text-[12px] leading-[20px] text-[#272757]"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Upload PDF here
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

export const CustomDropdown = ({
  label,
  items,
  value,
  onValueChange,
  placeholder = "Select an option",
}: CustomDropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);

  return (
    <View style={{ marginBottom: 20 }}>
      {label && (
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>
          {label}
        </Text>
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
              <Text
                style={{
                  fontSize: 16,
                  color: value ? "black" : "gray",
                }}
              >
                {value
                  ? items.find((item) => item.value === value)?.label
                  : placeholder}
              </Text>
            </TouchableOpacity>
          }
        >
          <View style={{ width: menuWidth }}>
            <FlatList
              nestedScrollEnabled
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
        <Pressable
          className="flex flex-col items-center"
          onPress={() => {
            router.push("/walletHistory");
          }}
        >
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Image
            source={piocoinSymbol}
            style={{ width: 7.7, height: 14 }}
            resizeMode="contain"
          />
          <Text
            className="font-[400] text-[24px] leading-[100%] text-[#FFFFF0]"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {typeof balance === "number" ? balance.toLocaleString() : balance}
          </Text>
        </View>
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
export const Stat = ({
  text,
  serve,
  onPress,
}: {
  text: string;
  serve?: number;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-[4px] border-[#A5A5A566] border-[1px] px-[16px] py-[8px] flex flex-row gap-[16px] items-center bg-white justify-between w-1/2"
      style={[styles.shadowProp]}
    >
      <View className="flex flex-col gap-[8px]">
        <Text
          className="text-[#030319] text-[14px] leading-[150%]  "
          style={{ fontFamily: "Inter_500Medium" }}
        >
          {text}
        </Text>
        <Text
          className="text-[#000000] text-[14px] leading-[150%]  "
          style={{ fontFamily: "Inter_500Medium" }}
        >
          {serve}
        </Text>
      </View>
    </Pressable>
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
          onPress={() => router.push("/appDataSubscription")}
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
      </View>
    </View>
  );
};
export function formatNumberToThousands(number: any) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Permission denied");

  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};
// components/CustomFlatList.tsx

type CustomFlatListProps<T> = {
  data: T[];
  renderItem: FlatListProps<T>["renderItem"];
  keyExtractor?: (item: T, index: number) => string;
  ListEmptyComponent?: React.ComponentType<any> | null;
  ListHeaderComponent?: React.ComponentType<any> | null;
  ListFooterComponent?: React.ComponentType<any> | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  horizontal?: boolean;
  numColumns?: number;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
};

export function CustomFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing,
  onRefresh,
  onEndReached,
  horizontal = false,
  numColumns = 1,
  showsHorizontalScrollIndicator = true,
  showsVerticalScrollIndicator = true,
}: CustomFlatListProps<T>) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor ?? ((_, index) => index.toString())}
      ListEmptyComponent={
        ListEmptyComponent ??
        (() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data available.</Text>
          </View>
        ))
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      horizontal={horizontal}
      numColumns={horizontal ? 1 : numColumns}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={data?.length === 0 && styles.flatListContainer}
    />
  );
}
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  // Options for month abbreviation, day, year, hour, minute, AM/PM
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
interface CustomPickerProp {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
}
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
            items={items || []}
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
export const CustomPickerTwo: React.FC<CustomPickerProp> = ({
  value,
  onChange,
  label,
  error,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {
      label: "Client",
      value: "client",
      labelStyle: { color: "green" },
    },
    {
      label: "Medical Practitioner",
      value: "medical_practitioner",
      labelStyle: { color: "black" },
    },
    {
      label: "Emergency Services",
      value: "emergency_services",
      labelStyle: { color: "black" },
    },
    {
      label: "Pharmacy Services",
      value: "pharmacy_services",
      labelStyle: { color: "black" },
    },
    {
      label: "Medical Laboratory Services",
      value: "medical_lab_services",
      labelStyle: { color: "black" },
    },
  ]);

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
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue =
            typeof callback === "function" ? callback(value) : callback;
          onChange(newValue);
        }}
        setItems={setItems}
        listMode="SCROLLVIEW"
        placeholderStyle={{ color: "#A5A5A5" }}
        placeholder={placeholder}
        style={{ borderColor: "#a5a5a5" }}
        textStyle={{ fontSize: 16 }}
        dropDownContainerStyle={{ borderColor: "#a5a5a5" }}
      />

      <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
        {error}
      </Text>
    </View>
  );
};

export default CustomPicker;

export function replaceUnderscoresWithSpaces(text: string): string {
  return text.replace(/_/g, " ");
}
type EmergencyCustomEvent = {
  type: "custom";
  data: {
    type: "emergency_request";
    incidentLocation: { latitude: number; longitude: number };
    distance: number;
  };
};
const STREAM_API_KEY = "fvct7vwrd7ps"; // safer than hardcoding
const chatClient = StreamChat.getInstance(STREAM_API_KEY);
export function useStreamProvider(providerId: string, providerToken: string) {
  useEffect(() => {
    if (!providerId || !providerToken) return;
    let unsubscribe: (() => void) | undefined;

    async function connect() {
      try {
        await chatClient.connectUser(
          {
            id: providerId,
            name: "Provider Name", // optional
          },
          providerToken
        );
        console.log("Stream user connected:", providerId);
        chatClient.on("*", (event) => {
          console.log("Stream event received:", event);
        });

        const listener = chatClient.on("custom", (event) => {
          const customEvent = event as unknown as EmergencyCustomEvent;

          if (customEvent.data?.type === "emergency_request") {
            console.log("🚨 Emergency received:", customEvent.data);
          }
        });

        unsubscribe = listener.unsubscribe;
      } catch (error) {
        console.error("Failed to connect to Stream:", error);
      }
    }

    connect();

    return () => {
      unsubscribe?.();
      chatClient.disconnectUser();
    };
  }, [providerId, providerToken]);
}

export async function generateCallId(doctorId: string, userId: string) {
  // Add randomness (or timestamp) to make it unique per session
  const sessionKey = `${doctorId}_${userId}_${Date.now()}_${Math.random()}`;

  // Hash it for consistent length + uniqueness
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    sessionKey
  );

  return hash.slice(0, 16); // shorten for readability
}

// Example usage
