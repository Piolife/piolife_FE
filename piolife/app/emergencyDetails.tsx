import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { CustomPicker, CustomTextInput } from "@/components/reusables";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView, Platform } from "react-native";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { callEmergencyFormData } from "@/services/core/types";
import { validateCallEmergency } from "@/hooks/auth";
const EmergencyDetails = () => {
  const handlePrevious = () => {
    router.back();
  };
  useEffect(() => {
    fetch("https://temikeezy.github.io/nigeria-geojson-data/data/full.json")
      .then((res) => res.json())
      .then(setNigeriaData)
      .catch(console.error);
  }, []);
  const [errors, setErrors] = useState<Partial<callEmergencyFormData>>({});
  const [nigeriaData, setNigeriaData] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string>("Yes");
  const [selected, setSelected] = useState<string>("Yes");
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "Yes",
        label: "Yes",
        value: "Yes",
      },
      {
        id: "No",
        label: "No",
        value: "No",
      },
    ],
    []
  );
  const radioOptions: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "Fire",
        label: "Fire",
        value: "Fire",
      },
      {
        id: "Acid",
        label: "Acid",
        value: "Acid",
      },
      {
        id: "Drawn",
        label: "Drawn",
        value: "Drawn",
      },
      {
        id: "Auto Crash",
        label: "Auto Crash",
        value: "Auto Crash",
      },
      {
        id: "Others",
        label: "Others",
        value: "Others",
      },
    ],
    []
  );
  const [formData, setFormData] = useState<callEmergencyFormData>({
    // name: "",
    state: "",
    lga: "",
    ward: "",
    address: "",
    natureOfIncident: "",
    others: "",
  });
  const handleChange = (name: any, value: any) => {
    const validationErrors = validateCallEmergency(formData);
    setErrors(validationErrors);
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const stateOptions = nigeriaData?.map((item: any) => ({
    label: item.state,
    value: item.state,
  }));

  const selectedState = nigeriaData?.find(
    (s: any) => s.state === formData.state
  );

  const lgaOptions = selectedState?.lgas.map((lga: any) => ({
    label: lga.name,
    value: lga.name,
  }));

  // For Ward options
  const selectedLga = selectedState?.lgas.find(
    (lga: any) => lga.name === formData.lga
  );

  const wardOptions = selectedLga?.wards.map((ward: any) => ({
    label: ward.name,
    value: ward.name,
  }));
  const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View className="flex-1 flex-col justify-between px-[4%]">
          {/* Top Section */}
          <View className="py-[16px] gap-[24px]">
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
          </View>

          {/* Scrollable Form Section */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex flex-col gap-[16px] pb-4">
              <Text
                className="text-[#030319] text-[16px] leading-[17px]"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Are you at the scene of the emergency?
              </Text>
              <RadioGroup
                layout="column"
                containerStyle={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  rowGap: 16,
                }}
                radioButtons={radioButtons}
                onPress={setSelectedId}
                selectedId={selectedId}
              />
              {selectedId === "No" && (
                <View className="flex flex-col gap-[8px]">
                  <Text
                    className="text-[#424242] text-[14px] leading-[17px]"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    Kindly fill out this form with the appropriate information
                  </Text>

                  {/* <CustomTextInput
                    label="Name of caller"
                    value={formData.name}
                    onChangeText={(value) => handleChange("name", value)}
                    placeholder="Enter callers Name"
                    placeholderTextColor={"#BABABA"}
                    keyboardType="default"
                    errorMessage={""}
                  /> */}
                  {stateOptions?.length > 0 && (
                    <CustomPicker
                      label="State"
                      value={formData.state}
                      onValueChange={(value) => {
                        if (typeof value === "string") {
                          setFormData((prev: any) => ({
                            ...prev,
                            state: value,
                            lga: "",
                            ward: "",
                          }));
                        }
                      }}
                      items={stateOptions}
                      error={""}
                      placeholder="Select  State"
                    />
                  )}

                  <CustomPicker
                    label="Local Government Area"
                    value={formData.lga}
                    onValueChange={(value) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        lga: value ?? "",
                        ward: "",
                      }));
                    }}
                    items={lgaOptions}
                    error={""}
                    placeholder="Select a LGA"
                  />

                  <CustomPicker
                    label="Ward"
                    value={formData.ward}
                    onValueChange={(value) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        ward: value ?? "",
                      }));
                    }}
                    items={wardOptions}
                    error={""}
                    placeholder="Select a Ward"
                  />
                  <CustomTextInput
                    label="Address of incident"
                    value={formData.address}
                    onChangeText={(value) => handleChange("address", value)}
                    placeholder="Enter callers Name"
                    placeholderTextColor={"#BABABA"}
                    keyboardType="default"
                    errorMessage={""}
                  />
                  <View>
                    <Text
                      className="text-[#030319] text-[14px] leading-[17px] mb-2"
                      style={{ fontFamily: "Inter_400Regular" }}
                    >
                      Nature of incident
                    </Text>
                    <RadioGroup
                      layout="column"
                      containerStyle={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        rowGap: 16,
                      }}
                      radioButtons={radioOptions}
                      onPress={setSelected}
                      selectedId={selected}
                    />
                  </View>
                  {selected === "Others" && (
                    <CustomTextInput
                      label="Name of caller"
                      value={formData.others}
                      onChangeText={(value) => handleChange("others", value)}
                      placeholder="Enter callers Name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={""}
                    />
                  )}
                </View>
              )}
            </View>
          </ScrollView>
          {selectedId === "Yes" && (
            <Pressable
              className="px-[32px] h-[56px] bg-[#0e16ff] rounded-[8px] flex items-center justify-center mb-[12px] mt-4"
              onPress={() => {
                router.push("/call");
              }}
            >
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Proceed
              </Text>
            </Pressable>
          )}
          {selectedId === "No" && (
            <Pressable className="px-[32px] h-[56px] bg-[#0e16ff] rounded-[8px] flex items-center justify-center mb-[12px] mt-4">
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Proceed
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmergencyDetails;
