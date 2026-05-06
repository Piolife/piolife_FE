import React, { useEffect, useMemo, useState } from "react";
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
import { router } from "expo-router";
import { StateSelect, SelectedAilment } from "@/components/flatListItems/items";
import {
  CustomPicker,
  CustomTextInput,
  formatNumberToThousands,
} from "@/components/reusables";
import { useLocalSearchParams } from "expo-router";
import Checkbox from "expo-checkbox";
import { usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import Toast from "react-native-toast-message";
import { LoginResponse } from "./login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Pay4Consultation = () => {
  const handlePrevious = () => {
    router.back();
  };
  const { selected, selectedId, cost } = useLocalSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUserId(parsed.id);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    fetchUser();
  }, []);
  let specialties: string[] = [];

  if (typeof selected === "string") {
    try {
      const parsed = JSON.parse(selected);
      console.log("parsed", parsed);
      // this is now an array
      if (Array.isArray(parsed)) {
        specialties = parsed.map((item) => item._id);
      }
    } catch (e) {
      console.error("Failed to parse specialties", e);
    }
  }

  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/sessions/practitioners`);
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

  const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");

  const [checked, setChecked] = useState(false);
  const handleConsult = async () => {
    const trimmedData: any = {
      specialty: specialties,
      languageProficiency: [selectedId],
      userId: userId,
    };

    try {
      const response = (await postData(trimmedData)) as any;

      if (response) {
        const encoded = encodeURIComponent(JSON.stringify(response));

        router.push(
          `/availableConsultant?selected=${selected}&selectedId=${selectedId}&doctors=${encoded}`
        );
      }
    } catch (err: any) {
      console.log("error", err);
      Toast.show({
        type: "error",
        text2: err.message,
        position: "top",
        topOffset: 80,
      });
    }
  };
  const dataForForm = checked
    ? [
        {
          key: "pediatricInfo",
          type: "info",
          text: "For pediatric/children related issues, please fill the form below.",
        },
        {
          key: "childName",
          type: "input",
          label: "Child’s Name",
          placeholder: "Child’s Name",
          keyboardType: "default",
          value: formData.name,
          fieldName: "name",
        },
        {
          key: "age",
          type: "input",
          label: "Age",
          placeholder: "Enter Age",
          keyboardType: "numeric",
          value: formData.age,
          fieldName: "age",
        },
        {
          key: "gender",
          type: "picker",
          label: "Gender",
          value: formData.gender || "",
          fieldName: "gender",
          items: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ],
        },
        {
          key: "summary",
          type: "summary",
        },
      ]
    : [];
  const renderFormItem = ({ item }: any) => {
    switch (item.type) {
      case "info":
        return (
          <Text
            className="text-[#424242] text-[14px] leading-[17px]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {item.text}
          </Text>
        );

      case "input":
        return (
          <CustomTextInput
            label={item.label}
            value={item.value}
            onChangeText={(value) => handleChange(item.fieldName, value)}
            placeholder={item.placeholder}
            placeholderTextColor="#BABABA"
            keyboardType={item.keyboardType}
            errorMessage=""
          />
        );

      case "picker":
        return (
          <CustomPicker
            label={item.label}
            value={item.value}
            onValueChange={(value) => handleChange(item.fieldName, value)}
            items={item.items}
            placeholder="Select your gender"
          />
        );

      default:
        return null;
    }
  };
  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />

      <FlatList
        ListHeaderComponent={
          <View className="flex flex-col justify-between px-[4%] pt-12">
            <View className="py-[16px] gap-[24px]">
              <Pressable
                className="flex flex-row items-center gap-[16px]"
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

              <View className="py-[4px] flex flex-col gap-[16px]">
                <Text
                  className="text-[#030319] text-[16px] leading-[24px]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  ({selectedItems?.length} Selected)
                </Text>

                <FlatList
                  data={selectedItems}
                  renderItem={({ item }) => <SelectedAilment item={item} />}
                  horizontal
                  keyExtractor={(item) => item._id}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>

            {/* The checkbox */}
            <Pressable
              onPress={() => setChecked(!checked)}
              className="py-[8px] px-[4px] flex flex-row gap-[16px] items-center"
            >
              <Checkbox
                value={checked}
                onValueChange={() => setChecked(!checked)}
              />
              <Text
                className="text-[14px] leading-[22px] text-[#030319]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Pediatrics
              </Text>
            </Pressable>
          </View>
        }
        data={dataForForm}
        renderItem={renderFormItem}
        keyExtractor={(item) => item.key}
        ListFooterComponent={
          <View>
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
                    Total: {formatNumberToThousands(cost)}
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
              onPress={handleConsult}
            >
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {isLoading ? "Loading...." : "Confirm Payment"}
              </Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={{
          paddingHorizontal: "4%",
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Pay4Consultation;
