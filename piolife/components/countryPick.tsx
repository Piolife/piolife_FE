import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

type PhoneInputProps = {
  value: string;
  onChangeText: (fullPhoneNumber: string) => void;
  errorMessage?: string;
  placeholder?: string;
  label: string;
};

const PhoneInputWithCountryPicker: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  errorMessage,
  placeholder,
  label,
}) => {
  const [countryCode, setCountryCode] = useState<CountryCode>("NG");
  const [dialCode, setDialCode] = useState("234");
  const [localNumber, setLocalNumber] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);

  const onSelect = (country: Country) => {
    const code = country.callingCode?.[0] || "234";
    setDialCode(code);
    setCountryCode(country.cca2);
    setPickerVisible(false);

    const fullPhone = `+${code}${localNumber}`;
    onChangeText(fullPhone);
  };

  const handlePhoneChange = (number: string) => {
    setLocalNumber(number);
    const fullPhone = `+${dialCode}${number}`;
    onChangeText(fullPhone);
  };

  return (
    <View className="flex flex-col gap-[12px]">
      <Text
        className="text-[14px] leading-[25px] text-[#030319]"
        style={{ fontFamily: "Inter_300Light" }}
      >
        {label}
      </Text>
      <View>
        <View className="flex-row items-center px-[10px] border-[#a5a5a5] border-[1px] rounded-[8px] text-[14px] leading-[15px] h-[45px]">
          <TouchableOpacity
            onPress={() => setPickerVisible(true)}
            className="mr-2 flex-row items-center"
          >
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withEmoji
              withAlphaFilter
              onSelect={onSelect}
              visible={isPickerVisible}
              onClose={() => setPickerVisible(false)}
            />
            <Text className="text-black">+{dialCode}</Text>
          </TouchableOpacity>

          <TextInput
            keyboardType="phone-pad"
            value={localNumber}
            onChangeText={handlePhoneChange}
            placeholder={placeholder}
            placeholderTextColor="#BABABA"
            className="flex-1 text-black"
          />
        </View>

        {errorMessage ? (
          <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default PhoneInputWithCountryPicker;
