import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  UIManager,
  Animated,
  Button,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { FormData } from "@/services/core/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CustomTextInput,
  ProfileImagePlaceholder,
} from "@/components/reusables";
import { CustomPicker } from "@/components/reusables";
import { CustomDatePicker } from "@/components/reusables";
import { ReusableImageUpload } from "@/components/reusables";
import { getUserToken } from "@/components/reusables";
import { submitKyc } from "@/services/api/request";
import { router } from "expo-router";

const EmergencySignup = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [step, setStep] = useState(1);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [userType, setUserType] = useState("user");

  const totalSteps = 3;

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const validateForm = (formData: FormData): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};

    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.nin) newErrors.nin = "NIN is required";
    if (!formData.bvn) newErrors.bvn = "BVN is required";
    if (!formData.idCardPhoto)
      newErrors.idCardPhoto = "ID Card Photo is required";
    if (!formData.userHoldingIdCardPhoto)
      newErrors.userHoldingIdCardPhoto =
        "User Holding ID Card Photo is required";
    if (!formData.idType) newErrors.idType = "ID Type is required";
    // if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.fullName || formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Please enter your full name (first and last name).";
    }
    if (!formData.dateOfIncorporation)
      newErrors.dateOfIncorporation = "Date Of Incorporation is required";
    if (!formData.businessRegNumber)
      newErrors.businessRegNumber = "Business Reg. Number is required";
    if (!formData.businessRegDocuments)
      newErrors.businessRegDocuments = "business Reg. Documents is required";

    return newErrors;
  };
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    nin: "",
    bvn: "",
    idCardPhoto: "",
    userHoldingIdCardPhoto: "",
    idType: "",
    fullName: "",
    dateOfIncorporation: "",
    businessRegNumber: "",
    businessRegDocuments: "",
  });
  const handleChange = (name: any, value: any) => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (fieldName: string, date: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const Submit = async (formData: any) => {
    try {
      setLoading(true);
      const token = await getUserToken();
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      const response = await submitKyc(filteredFormData, token);

      if (response.status === 201) {
        const responseData = await response.data.message;

        Alert.alert(responseData);
      } else {
        const errorData = await response.data.message;

        Alert.alert(errorData);
        // Log parsed response data
      }
    } catch (error: any) {
      Alert.alert(error.response.data.message);
    }
    setLoading(false);
  };

  const handleNext = async () => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (step < totalSteps) {
      setStep((prevStep) => prevStep + 1);
    }

    if (step === 3) {
      Submit(formData);
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const showMode = (currentMode: any) => {
    const today = new Date();
    DateTimePickerAndroid.open({
      value: selectedDate,

      onChange: () => {
        if (selectedDate) {
          // Convert the Date object to a string (you can choose the format)
          const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
          // setValue("dateOfBirth", formattedDate); // Now it's a string
        }
      },
      mode: currentMode,
      is24Hour: true,
      maximumDate: today,
    });
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const toggleDatePicker = () => {
    if (Platform.OS === "android") {
      showDatepicker();
    }

    if (Platform.OS === "ios") {
      setShowDatePicker(!showDatePicker);
    }
  };

  return (
    <SafeAreaView className="flex flex-1 bg-[#FFFFFF] ">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "white" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex flex-col  px-[4%]">
          {step > 1 && (
            <Pressable
              className="flex flex-row items-center gap-[16px] mt-2"
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
          )}
          {step === 1 && (
            <Text
              className="text-[#272757] text-[18px] leading-[24px] text-center mt-4"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Create Your Account
            </Text>
          )}
          <View className="flex flex-col items-center mt-6 pb-2">
            <ProfileImagePlaceholder />
          </View>

          <ScrollView className="h-[60%]" alwaysBounceVertical={false}>
            <View className="   bg-white h-screen">
              <View className=" mt-8">
                {step === 1 && (
                  <View className="flex flex-col">
                    <CustomTextInput
                      label="Hospital/Health Facility Name"
                      value={formData.phoneNumber}
                      onChangeText={(value) =>
                        handleChange("phoneNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="phone-pad"
                      errorMessage={errors.phoneNumber}
                    />

                    <CustomTextInput
                      label="MD/Officer in Charge"
                      value={formData.fullName}
                      onChangeText={(value) => handleChange("fullName", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.fullName}
                    />
                    <CustomTextInput
                      label="Mobile Number"
                      value={formData.address}
                      onChangeText={(value) => handleChange("address", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.address}
                    />
                    <CustomTextInput
                      label="Alternative Mobile Number"
                      value={formData.address}
                      onChangeText={(value) => handleChange("address", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.address}
                    />
                  </View>
                )}
                {step === 2 && (
                  <View className="flex flex-col">
                    <CustomPicker
                      label="State"
                      value={formData.gender || ""}
                      onValueChange={(value) => handleChange("gender", value)}
                      items={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                      ]}
                      placeholder="Select your State"
                      error={errors.gender}
                    />

                    <CustomTextInput
                      label="LGA"
                      value={formData.bvn}
                      onChangeText={(value) => handleChange("bvn", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.bvn}
                    />

                    <CustomTextInput
                      label="Ward"
                      value={formData.businessRegNumber}
                      onChangeText={(value) =>
                        handleChange("businessRegNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.businessRegNumber}
                    />
                    <CustomTextInput
                      label="Email"
                      value={formData.businessRegNumber}
                      onChangeText={(value) =>
                        handleChange("businessRegNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.businessRegNumber}
                    />
                    <CustomTextInput
                      label="Create Password"
                      value={formData.businessRegNumber}
                      onChangeText={(value) =>
                        handleChange("businessRegNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.businessRegNumber}
                    />
                    <CustomTextInput
                      label="Create Password"
                      value={formData.businessRegNumber}
                      onChangeText={(value) =>
                        handleChange("businessRegNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.businessRegNumber}
                    />
                  </View>
                )}
                {step === 3 && (
                  <View className="flex flex-col">
                    <Text
                      className="text-[#272757] text-[16px] leading-[20px] mb-6 "
                      style={{ fontFamily: "Inter_500Medium" }}
                    >
                      Bank Details
                    </Text>
                    <CustomTextInput
                      label="Account Number"
                      value={formData.bvn}
                      onChangeText={(value) => handleChange("bvn", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.bvn}
                    />
                    <CustomTextInput
                      label="Confirm Account Number"
                      value={formData.bvn}
                      onChangeText={(value) => handleChange("bvn", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.bvn}
                    />
                    <CustomTextInput
                      label="Account Name"
                      value={formData.bvn}
                      onChangeText={(value) => handleChange("bvn", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.bvn}
                    />
                    <CustomTextInput
                      label="Bank Name"
                      value={formData.bvn}
                      onChangeText={(value) => handleChange("bvn", value)}
                      placeholder="Enter Your BVN"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.bvn}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          <View className="flex-col flex items-center justify-center mt-8  gap-[16px]">
            <Pressable
              onPress={handleNext}
              className={`px-[32px] h-[56px] bg-[#0e16ff] w-[283px] rounded-[8px] flex items-center justify-center`}
            >
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {step < totalSteps ? "Next" : "Done"}
              </Text>
            </Pressable>
            <Text
              onPress={() => {
                router.push("/login");
              }}
              className="text-[16px] leading-[22px]"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Already have an account? Log in
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmergencySignup;
