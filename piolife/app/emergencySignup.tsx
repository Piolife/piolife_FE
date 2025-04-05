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
import { emergencySignupFormData, FormData } from "@/services/core/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CustomTextInput,
  ProfileImagePlaceholder,
} from "@/components/reusables";
import { CustomPicker } from "@/components/reusables";
import { CustomDatePicker } from "@/components/reusables";
import { ReusableImageUpload } from "@/components/reusables";
import { getUserToken } from "@/components/reusables";

import { router } from "expo-router";

const EmergencySignup = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<emergencySignupFormData>>({});
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

  const validateForm = (
    formData: emergencySignupFormData
  ): Partial<emergencySignupFormData> => {
    const newErrors: Partial<emergencySignupFormData> = {};

    if (!formData.accountName)
      newErrors.accountName = "Account Name is required";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account Number is required";
    if (!formData.alternativePhone)
      newErrors.alternativePhone = "Alternative Phone is required";
    if (!formData.bankName) newErrors.bankName = "Bank Name is required";
    if (!formData.confirmAccountNumber)
      newErrors.confirmAccountNumber = "confirm Account Number is required";
    if (formData.confirmAccountNumber !== formData.accountNumber)
      newErrors.confirmAccountNumber =
        "confirm Account Number must be same as account number";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "confirm Password is required";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "confirm Password must be same as password";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.facility) newErrors.facility = "Facility name is required";
    if (!formData.lga) newErrors.lga = "LGA is required";
    if (!formData.officer) newErrors.officer = "Full Name is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.state) newErrors.state = "Business Reg. Number is required";
    if (!formData.ward) newErrors.ward = "Ward is required";

    return newErrors;
  };

  const [formData, setFormData] = useState<emergencySignupFormData>({
    facility: "",
    officer: "",
    phone: "",
    alternativePhone: "",
    state: "",
    lga: "",
    ward: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountName: "",
    bankName: "",
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

  const Submit = async (formData: any) => {};

  const handleNext = async () => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (
      step === 1
      // &&
      // !validationErrors.facility &&
      // !validationErrors.officer &&
      // !validationErrors.phone &&
      // !validationErrors.alternativePhone
    ) {
      setStep((prevStep) => prevStep + 1);
    }
    if (
      step === 2
      // &&
      // !validationErrors.state &&
      // !validationErrors.lga &&
      // !validationErrors.ward &&
      // !validationErrors.email &&
      // !validationErrors.password &&
      // !validationErrors.confirmPassword
    ) {
      setStep((prevStep) => prevStep + 1);
    }

    if (
      step === 3 &&
      !validationErrors.accountNumber &&
      !validationErrors.confirmAccountNumber &&
      !validationErrors.accountName &&
      !validationErrors.bankName
    ) {
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
    <SafeAreaView className="flex flex-1 bg-[#fffff0] ">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fffff0" }}
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
            <ProfileImagePlaceholder
              imageUri={require("../assets/images/ertg6.png")}
              showBorder={false}
            />
          </View>

          <ScrollView
            className="h-[60%]"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
          >
            <View className="   bg-[#fffff0] h-screen">
              <View className=" mt-8">
                {step === 1 && (
                  <View className="flex flex-col gap-[16px]">
                    <CustomTextInput
                      label="Hospital/Health Facility Name"
                      value={formData.facility}
                      onChangeText={(value) => handleChange("facility", value)}
                      placeholder="Enter Facility name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.facility}
                    />

                    <CustomTextInput
                      label="MD/Officer in Charge"
                      value={formData.officer}
                      onChangeText={(value) => handleChange("officer", value)}
                      placeholder="Enter Officer Name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.officer}
                    />
                    <CustomTextInput
                      label="Mobile Number"
                      value={formData.phone}
                      onChangeText={(value) => handleChange("phone", value)}
                      placeholder="Enter Phone number"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.phone}
                    />
                    <CustomTextInput
                      label="Alternative Mobile Number"
                      value={formData.alternativePhone}
                      onChangeText={(value) =>
                        handleChange("alternativePhone", value)
                      }
                      placeholder=" Enter alternate phone number"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.alternativePhone}
                    />
                  </View>
                )}
                {step === 2 && (
                  <View className="flex flex-col gap-[16px]">
                    <CustomPicker
                      label="State"
                      value={formData.state || ""}
                      onValueChange={(value) => handleChange("state", value)}
                      items={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                      ]}
                      placeholder="Select your State"
                      error={errors.state}
                    />

                    <CustomTextInput
                      label="LGA"
                      value={formData.lga}
                      onChangeText={(value) => handleChange("lga", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.lga}
                    />

                    <CustomTextInput
                      label="Ward"
                      value={formData.ward}
                      onChangeText={(value) => handleChange("ward", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.ward}
                    />
                    <CustomTextInput
                      label="Email"
                      value={formData.email}
                      onChangeText={(value) => handleChange("email", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.email}
                    />
                    <CustomTextInput
                      label="Create Password"
                      value={formData.password}
                      onChangeText={(value) => handleChange("password", value)}
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.password}
                    />
                    <CustomTextInput
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChangeText={(value) =>
                        handleChange("confirmPassword", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.confirmPassword}
                    />
                  </View>
                )}
                {step === 3 && (
                  <View className="flex flex-col gap-[16px]">
                    <Text
                      className="text-[#272757] text-[16px] leading-[20px] mb-6 "
                      style={{ fontFamily: "Inter_500Medium" }}
                    >
                      Bank Details
                    </Text>
                    <CustomTextInput
                      label="Account Number"
                      value={formData.accountNumber}
                      onChangeText={(value) =>
                        handleChange("accountNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.accountNumber}
                    />
                    <CustomTextInput
                      label="Confirm Account Number"
                      value={formData.confirmAccountNumber}
                      onChangeText={(value) =>
                        handleChange("confirmAccountNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.confirmAccountNumber}
                    />
                    <CustomTextInput
                      label="Account Name"
                      value={formData.accountName}
                      onChangeText={(value) =>
                        handleChange("accountName", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.accountName}
                    />
                    <CustomTextInput
                      label="Bank Name"
                      value={formData.bankName}
                      onChangeText={(value) => handleChange("bankName", value)}
                      placeholder="Enter Your bank Name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.bankName}
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
