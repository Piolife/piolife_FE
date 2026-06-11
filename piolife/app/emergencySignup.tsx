import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  UIManager,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { emergencySignupFormData, FormData } from "@/services/core/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CustomTextInput,
  ProfileImagePlaceholder,
} from "@/components/reusables";
import { CustomPicker } from "@/components/reusables";
import { validateFormEmergencyForm } from "@/hooks/auth";
import { usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation } from "@/components/reusables";
import { router } from "expo-router";
import { uploadImageToCloudinary } from "@/components/cloudinary";
import Toast from "react-native-toast-message";
import PhoneInputWithCountryPicker from "@/components/countryPick";

interface signupResponse {
  otp: string;
  token: string;
}
const EmergencySignup = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<emergencySignupFormData>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [step, setStep] = useState(1);
  const [nigeriaData, setNigeriaData] = useState<any>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  useEffect(() => {
    fetch("https://temikeezy.github.io/nigeria-geojson-data/data/full.json")
      .then((res) => res.json())
      .then(setNigeriaData)
      .catch(console.error);
  }, []);
  const totalSteps = 3;
  const {
    data: register,
    loading: isLoading,

    postData,
  } = usePostData(`${API_URL}/api/v12/users/create`);

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [formData, setFormData] = useState<emergencySignupFormData>({
    longitude: location?.longitude ?? 0,
    latitude: location?.latitude ?? 0,
    hospitalName: "",
    officerInCharge: "",
    logo: "",
    profilePicture: "string",
    phoneNumber: "",
    alternativePhoneNumber: "",
    stateOfResidence: "",
    localGovernmentArea: "",
    role: "emergency_services",
    ward: "",
    email: "",
    password: "",
    confirmPassword: "",
    bankDetails: {
      accountNumber: "",
      confirmAccountNumber: "",
      accountName: "",
      bankName: "",
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const coords = await getCurrentLocation();
        setLocation(coords);
      } catch (err: any) {
        setError(err.message || "Location error");
        Toast.show({
          type: "error",
          text2: err.message || "Location error",
        });
      }
    })();
  }, []);
  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    }
  }, [location]);
  const handleChange = (name: any, value: any) => {
    const validationErrors = validateFormEmergencyForm(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async (formData: any) => {
    const { confirmPassword, bankDetails, ...filteredData } = formData;

    const { confirmAccountNumber, ...filteredBankDetails } = bankDetails || {};

    const payload = {
      ...filteredData,
      bankDetails: [filteredBankDetails],
    };
    console.log("payload", payload);
    try {
      const response = (await postData(payload)) as signupResponse;

      if (response?.token) {
        try {
          await AsyncStorage.setItem("verificationToken", response.token);
        } catch (e) {
          console.error("Error saving token:", e);
        }

        router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        console.error("No token in signup response");
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text2: err.message || "Signup failed",
      });
    }
  };

  const handleNext = async () => {
    const validationErrors = validateFormEmergencyForm(formData);
    setErrors(validationErrors);
    if (
      step === 1 &&
      !validationErrors.hospitalName &&
      !validationErrors.officerInCharge &&
      !validationErrors.phoneNumber &&
      !validationErrors.alternativePhoneNumber
    ) {
      setStep((prevStep) => prevStep + 1);
    }
    if (
      step === 2 &&
      !validationErrors.stateOfResidence &&
      !validationErrors.localGovernmentArea &&
      !validationErrors.ward &&
      !validationErrors.email &&
      !validationErrors.password &&
      !validationErrors.confirmPassword
    ) {
      setStep((prevStep) => prevStep + 1);
    }

    if (step === 3) {
      if (
        !validationErrors.bankDetails?.accountNumber &&
        !validationErrors.bankDetails?.confirmAccountNumber &&
        !validationErrors.bankDetails?.accountName &&
        !validationErrors.bankDetails?.bankName
      ) {
        handleSignup(formData);
      } else {
        Toast.show({
          type: "error",
          text2: "Please fill in all bank details correctly",
        });
      }
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
  const handleNestedChange = (path: string, value: any) => {
    setFormData((prevData) => {
      const keys = path.split(".");
      const updatedData: any = { ...prevData };
      let current = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return updatedData;
    });

    const validationErrors = validateFormEmergencyForm(formData);
    setErrors(validationErrors);
  };
  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImageToCloudinary(setLoading);
      setImageUri(imageUrl);

      setFormData((prevData) => ({
        ...prevData,
        logo: imageUrl || "",
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const stateOptions = nigeriaData?.map((item: any) => ({
    label: item.state,
    value: item.state,
  }));

  const selectedState = nigeriaData?.find(
    (s: any) => s.state === formData.stateOfResidence
  );

  const lgaOptions = selectedState?.lgas.map((lga: any) => ({
    label: lga.name,
    value: lga.name,
  }));

  // For Ward options
  const selectedLga = selectedState?.lgas.find(
    (lga: any) => lga.name === formData.localGovernmentArea
  );

  const wardOptions = selectedLga?.wards.map((ward: any) => ({
    label: ward.name,
    value: ward.name,
  }));
  return (
    <SafeAreaView
      className="flex flex-1 bg-[#fffff0] "
      >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fffff0" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className=""
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
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
            {step <= 3 && (
              <View className="flex flex-col items-center mt-6 pb-2">
                <ProfileImagePlaceholder
                  showBorder={true}
                  upload={handleImageUpload}
                  imageUri={formData.logo}
                />
                {errors.profilePicture && (
                  <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
                    {errors.profilePicture}
                  </Text>
                )}
                <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
                  Upload Logo
                </Text>
              </View>
            )}

            <View className="   bg-[#fffff0] ">
              <View className=" mt-8">
                {step === 1 && (
                  <View className="flex flex-col gap-[16px]">
                    <CustomTextInput
                      label="Hospital/Health Facility Name"
                      value={formData.hospitalName}
                      onChangeText={(value) =>
                        handleChange("hospitalName", value)
                      }
                      placeholder="Enter Facility name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.hospitalName}
                    />

                    <CustomTextInput
                      label="MD/Officer in Charge"
                      value={formData.officerInCharge}
                      onChangeText={(value) =>
                        handleChange("officerInCharge", value)
                      }
                      placeholder="Enter Officer Name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.officerInCharge}
                    />
                    <PhoneInputWithCountryPicker
                      label="Phone Numnber"
                      value={formData.phoneNumber}
                      onChangeText={(value) =>
                        handleChange("phoneNumber", value)
                      }
                      placeholder="Enter Your phone number"
                      errorMessage={errors.phoneNumber}
                    />
                    <PhoneInputWithCountryPicker
                      label="Alternative Phone Numnber"
                      value={formData.alternativePhoneNumber}
                      onChangeText={(value) =>
                        handleChange("alternativePhoneNumber", value)
                      }
                      placeholder="Enter Your alternate phone number"
                      errorMessage={errors.alternativePhoneNumber}
                    />
                  </View>
                )}
                {step === 2 && (
                  <View className="flex flex-col gap-[16px]">
                    {stateOptions?.length > 0 && (
                      <CustomPicker
                        label="State"
                        value={formData.stateOfResidence}
                        onValueChange={(value) => {
                          if (typeof value === "string") {
                            setFormData((prev) => ({
                              ...prev,
                              stateOfResidence: value,
                              localGovernmentArea: "",
                              ward: "",
                            }));
                          }
                        }}
                        items={stateOptions}
                        error={errors.stateOfResidence}
                      />
                    )}

                    {formData.stateOfResidence && (
                      <CustomPicker
                        label="Local Government Area"
                        value={formData.localGovernmentArea}
                        onValueChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            localGovernmentArea: value ?? "",
                            ward: "",
                          }));
                        }}
                        items={lgaOptions}
                        error={errors.localGovernmentArea}
                      />
                    )}

                    {formData.stateOfResidence &&
                      formData.localGovernmentArea && (
                        <CustomPicker
                          label="Ward"
                          value={formData.ward}
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              ward: value ?? "",
                            }));
                          }}
                          items={wardOptions}
                          error={errors.localGovernmentArea}
                        />
                      )}
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
                      secureTextEntry={true}
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
                      secureTextEntry={true}
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
                      value={formData.bankDetails.accountNumber}
                      onChangeText={(value) =>
                        handleNestedChange("bankDetails.accountNumber", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.bankDetails?.accountNumber}
                    />
                    <CustomTextInput
                      label="Confirm Account Number"
                      value={formData.bankDetails.confirmAccountNumber}
                      onChangeText={(value) =>
                        handleNestedChange(
                          "bankDetails.confirmAccountNumber",
                          value
                        )
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.bankDetails?.confirmAccountNumber}
                    />
                    <CustomTextInput
                      label="Account Name"
                      value={formData.bankDetails.accountName}
                      onChangeText={(value) =>
                        handleNestedChange("bankDetails.accountName", value)
                      }
                      placeholder=""
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.bankDetails?.accountName}
                    />
                    <CustomTextInput
                      label="Bank Name"
                      value={formData.bankDetails.bankName}
                      onChangeText={(value) =>
                        handleNestedChange("bankDetails.bankName", value)
                      }
                      placeholder="Enter Your bank Name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.bankDetails?.bankName}
                    />
                  </View>
                )}
              </View>
            </View>

            <View className="flex-col flex items-center justify-center my-8  gap-[16px]">
              <Pressable
                onPress={handleNext}
                className={`px-[32px] h-[56px] bg-[#0e16ff] w-full rounded-[8px] flex items-center justify-center`}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmergencySignup;
