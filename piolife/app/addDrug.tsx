import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CustomTextInput } from "@/components/reusables";
import { AddDrugFormProps } from "@/services/core/types";
import { validateAddDrugsForm } from "@/hooks/auth";
import { usePatchData, usePostData } from "@/services/api/request";
import Toast, { BaseToastProps } from "react-native-toast-message";
import { ErrorToast } from "react-native-toast-message";
import { API_URL } from "@/constants/api";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

export const toastConfig = {
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: "#fff",
        borderLeftColor: "red",
        zIndex: 9999,
        elevation: 9999,
        position: "absolute",
        top: 120,
      }}
      text1Style={{ color: "black", fontWeight: "bold" }}
      text2Style={{ color: "black" }}
    />
  ),
};
const AddDrug = () => {
  const { _id } = useLocalSearchParams();
  const drugId = Array.isArray(_id) ? _id[0] : _id;
  console.log();
  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/pharmacy-stock`, true);
  const { data, loading, patchData } = usePatchData(
    `${API_URL}/api/v12/pharmacy-stock/${drugId}`
  );

  const [errors, setErrors] = useState<Partial<AddDrugFormProps>>({});
  const [formData, setFormData] = useState<AddDrugFormProps>({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const handleChange = (name: any, value: any) => {
    const validationErrors = validateAddDrugsForm(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddDrug = async () => {
    const trimmedData: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price.trim()),
      quantity: Number(formData.quantity.trim()),
    };

    const validationErrors = validateAddDrugsForm(trimmedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      let response;
      if (drugId) {
        response = await patchData(trimmedData);
      } else {
        response = await postData(trimmedData);
      }

      if (response) {
        router.push("/(tabs)");
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text2: err.message,
        position: "top",
        topOffset: 80,
      });
    }
  };

  const handlePrevious = () => {
    router.back();
  };
  useEffect(() => {
    const fetchDrug = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v12/pharmacy-stock/${drugId}`
        );
        const drug = response.data;

        setFormData({
          name: drug.name || "",
          description: drug.description || "",
          price: String(drug.price) || "",
          quantity: String(drug.quantity) || "",
        });
      } catch (err: any) {
        Toast.show({
          type: "error",
          text2: "Failed to load drug details",
          position: "top",
          topOffset: 80,
        });
      }
    };

    if (drugId) {
      fetchDrug();
    }
  }, [drugId]);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      >
      <StatusBar style="dark" backgroundColor="#ffffff" />

      <View className="py-[16px] px-[4%] gap-[32px]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mt-10"
          onPress={handlePrevious}
        >
          <FontAwesome name="angle-left" size={24} color="black" />
          <Text
            className="text-[#272757] text-[16px] leading-[20px] text-center "
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Back
          </Text>
        </Pressable>

        <Text
          className="text-[#272757] text-[16px] leading-[22px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Kindly input drug details
        </Text>
        <View className="flex flex-col ">
          <CustomTextInput
            label="Name"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            placeholder="Enter Name"
            placeholderTextColor={"#BABABA"}
            keyboardType="default"
            errorMessage={errors.name}
          />
          <CustomTextInput
            label="Brand Name"
            value={formData.description}
            onChangeText={(value) => handleChange("description", value)}
            placeholder="Enter Brand Name"
            placeholderTextColor={"#BABABA"}
            keyboardType="default"
            errorMessage={errors.description}
          />
          <CustomTextInput
            label="Price"
            value={formData.price}
            onChangeText={(value) => handleChange("price", value)}
            placeholder="Enter Price"
            placeholderTextColor={"#BABABA"}
            keyboardType="numeric"
            errorMessage={errors.price}
          />
          <CustomTextInput
            label="Quantity"
            value={formData.quantity}
            onChangeText={(value) => handleChange("quantity", value)}
            placeholder="Enter Quantity"
            placeholderTextColor={"#BABABA"}
            keyboardType="default"
            errorMessage={errors.quantity}
          />
        </View>
        <View className="flex-col flex items-center justify-center mt-4  gap-[16px]">
          <Pressable
            disabled={isLoading}
            onPress={handleAddDrug}
            className={`px-[32px] h-[56px] bg-[#0e16ff] w-full rounded-[8px] flex items-center justify-center`}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              {isLoading
                ? "Submitting..."
                : drugId
                ? "Update Drug"
                : "Add Drug"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddDrug;
