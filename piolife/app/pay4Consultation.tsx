import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  FlatList,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { router } from "expo-router";
import { StateSelect, SelectedAilment } from "@/components/flatListItems/items";
import { CustomPicker, CustomTextInput } from "@/components/reusables";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
const statesWithStatus = [
  { state: "General Practice", status: "available" },
  { state: "Pediatric/children", status: "available" },
];

const Pay4Consultation = () => {
  const handlePrevious = () => {
    router.back();
  };
  const { selected } = useLocalSearchParams();

  const selectedItems = (() => {
    const param = Array.isArray(selected) ? selected[0] : selected;
    try {
      return param ? JSON.parse(decodeURIComponent(param)) : [];
    } catch {
      return [];
    }
  })();
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    role: "",
  });
  const handleChange = (name: any, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [selectedId, setSelectedId] = useState<string | undefined>("english");
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "english",
        label: "English",
        value: "english",
      },
      {
        id: "yoruba",
        label: "Yoruba",
        value: "yoruba",
      },
      {
        id: "igbo",
        label: "Igbo",
        value: "igbo",
      },
      {
        id: "hausa",
        label: "Hausa",
        value: "hausa",
      },
    ],
    []
  );
  const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className=" flex flex-col justify-between px-[4%]">
        <View className="py-[16px]  gap-[24px]">
          <Pressable
            className="flex flex-row items-center gap-[16px] mt-2"
            onPress={handlePrevious}
          >
            <FontAwesome name="angle-left" size={24} color="black" />
            <Text
              className="text-[#272757] text-[16px] leading-[20px] text-center"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Back
            </Text>
          </Pressable>
          <View className="flex flex-col gap-[24px]">
            <View className="py-[4px] flex flex-col gap-[16px]">
              <Text
                className="text-[#030319] text-[16px] leading-[24px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                ({selectedItems?.length} Selected)
              </Text>
              <View className=" ">
                <FlatList
                  data={selectedItems}
                  renderItem={({ item }) => <SelectedAilment item={item} />}
                  horizontal={true}
                  keyExtractor={(item) => item._id}

                  // ListFooterComponent={<View style={{ height: 200 }} />}
                />
              </View>
            </View>
          </View>
        </View>
        <ScrollView>
          <View className="flex flex-col gap-[16px]">
            <View>
              <Text
                className="text-[#424242] text-[14px] leading-[17px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                For pediatric/children related issues, please fill the form
                below.
              </Text>
            </View>
            <CustomTextInput
              label="Child’s Name"
              value={""}
              onChangeText={(value) => handleChange("name", value)}
              placeholder="Child’s Name"
              placeholderTextColor={"#BABABA"}
              keyboardType="default"
              errorMessage={""}
            />
            <CustomTextInput
              label="Age"
              value={""}
              onChangeText={(value) => handleChange("age", value)}
              placeholder="Enter Age"
              placeholderTextColor={"#BABABA"}
              keyboardType="numeric"
              errorMessage={""}
            />
            <CustomPicker
              label="Gender"
              value={formData.gender || ""}
              onValueChange={(value) => handleChange("gender", value)}
              items={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
              placeholder="Select your gender"
            />
          </View>
          <View className="flex flex-col gap-[16px]">
            <View className="flex flex-row justify-between items-center py-[8px] border-[#DADADA] border-b-[1px]">
              <Text
                className="text-[#030319] text-[18px]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Total:
              </Text>
              <View className="flex flex-row items-center gap-[4px]">
                <Image source={piocoin} className="h-[33px] w-[16px]" />

                <Text
                  className="text-[#030319] text-[18px]"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  Total:
                </Text>
              </View>
            </View>
            <Text
              className="text-[#424242] text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              NB: The total amount will automatically be deducted from your
              wallet
            </Text>
          </View>
          <Pressable
            className="px-[32px] h-[56px] bg-[#0e16ff] rounded-[8px] flex items-center justify-center mb-[12px] mt-4"
            onPress={() => {
              router.push("/availableConsultant");
            }}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Confirm Payment
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Pay4Consultation;
