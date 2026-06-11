import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  UIManager,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { medLabSignupFormData } from "@/services/core/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CustomPicker,
  CustomTextInput,
  ProfileImagePlaceholder,
} from "@/components/reusables";
import { router } from "expo-router";
import { usePostData } from "@/services/api/request";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { validateMedLabForm } from "@/hooks/auth";
import { uploadImageToCloudinary } from "@/components/cloudinary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInputWithCountryPicker from "@/components/countryPick";
import { getCurrentLocation } from "@/components/reusables";
import { API_URL } from "@/constants/api";
import Toast from "react-native-toast-message";
const errorImage = require("../assets/images/error.png");
interface signupResponse {
  otp: string;
  token: string;
}
const LabSignup = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoad, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [errors, setErrors] = useState<Partial<medLabSignupFormData>>({});
  const [step, setStep] = useState(1);
  const [nigeriaData, setNigeriaData] = useState<any>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const coords = await getCurrentLocation();

        setLocation(coords);
      } catch (err: any) {
        setError(err.message || "Location error");
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

  useEffect(() => {
    fetch("https://temikeezy.github.io/nigeria-geojson-data/data/full.json")
      .then((res) => res.json())
      .then(setNigeriaData)
      .catch(console.error);
  }, []);
  //   Bw0fHAAfyda4SAoNnkvaTS0I3FzQJ4rBXYxCDedZ626d410d
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "yes",
        label: "Yes",
        value: "yes",
      },
      {
        id: "no",
        label: "No",
        value: "no",
      },
    ],
    []
  );
  const totalSteps = 3;

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const [formData, setFormData] = useState<medLabSignupFormData>({
    longitude: location?.longitude ?? 0,
    latitude: location?.latitude ?? 0,
    medicalLabName: "",
    logo: "",
    // profilePicture: "string",
    officerInCharge: "",
    phoneNumber: "",
    alternativePhoneNumber: "",
    stateOfResidence: "",
    ward: "",
    localGovernmentArea: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "medical_lab_services",
    bankDetails: {
      confirmAccountNumber: "",
      accountName: "",
      bankName: "",
      accountNumber: "",
    },
  });

  const handleChange = (name: any, value: any) => {
    const validationErrors = validateMedLabForm(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

    const validationErrors = validateMedLabForm(formData);
    setErrors(validationErrors);
  };

  const handleSignup = async () => {
    const { confirmPassword, bankDetails, ...filteredData } = formData;
    // Safely clone and remove confirmAccountNumber from bankDetails
    const filteredBankDetails = { ...bankDetails };
    delete filteredBankDetails.confirmAccountNumber;
    const payload = {
      ...filteredData,
      bankDetails: [filteredBankDetails],
    };
    try {
      const response = (await postData(payload)) as signupResponse;

      if (response) {
        await AsyncStorage.setItem("verificationToken", response?.token);
        router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      alert("Signup failed: " + err.message);
    }
  };
  const validateSelection = () => {
    if (selectedId !== "yes") {
      Alert.alert("You must agree to our policy"); // Show alert if no radio button is selected
      return false;
    }
    return true;
  };
  const handleNext = async () => {
    const validationErrors = validateMedLabForm(formData);
    setErrors(validationErrors);
    if (
      step === 1 &&
      !validationErrors.medicalLabName &&
      !validationErrors.officerInCharge &&
      !validationErrors.stateOfResidence &&
      !validationErrors.ward &&
      !validationErrors.localGovernmentArea
    ) {
      setStep((prevStep) => prevStep + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    if (
      step === 2 &&
      !validationErrors.email &&
      !validationErrors.phoneNumber &&
      !validationErrors.alternativePhoneNumber &&
      !validationErrors.password &&
      !validationErrors.confirmPassword
    ) {
      setStep((prevStep) => prevStep + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    if (step === 3) {
      if (
        !validationErrors.bankDetails?.accountNumber &&
        !validationErrors.bankDetails?.confirmAccountNumber &&
        !validationErrors.bankDetails?.accountName &&
        !validationErrors.bankDetails?.bankName &&
        validateSelection()
      ) {
        handleSignup();
      } else if (
        validationErrors.bankDetails?.accountNumber ||
        validationErrors.bankDetails?.confirmAccountNumber ||
        validationErrors.bankDetails?.accountName ||
        validationErrors.bankDetails?.bankName
      ) {
        Toast.show({
          type: "error",
          text2: "Please fill in all bank details correctly",
        });
      }
    }
  };
  const {
    data: register,
    loading: isLoading,

    postData,
  } = usePostData(`${API_URL}/api/v12/users/create`);

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
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
          ref={scrollRef}
          className={``}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-col  px-[4%] pt-12">
            {step > 1 && (
              <Pressable
                className="flex flex-row items-center gap-[16px] "
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
                className="text-[#272757] text-[18px] leading-[24px] text-center "
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
                {errors.logo && (
                  <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
                    {errors.logo}
                  </Text>
                )}
                <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
                  Add Logo
                </Text>
              </View>
            )}

            <View className="   bg-[#fffff0]">
              <View className=" mt-8">
                {step === 1 && (
                  <View className="flex flex-col gap-[16px]">
                    <Text
                      className="text-[#030319] text-[14px] leading-[17px] text-center mb-2 "
                      style={{ fontFamily: "Inter_400Regular" }}
                    >
                      Kindly fill Names as on official documents & license
                    </Text>

                    <CustomTextInput
                      label="Medical Laboratory Facility Name"
                      value={formData.medicalLabName}
                      onChangeText={(value) =>
                        handleChange("medicalLabName", value)
                      }
                      placeholder="Enter facility Name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.medicalLabName}
                    />
                    <CustomTextInput
                      label="Laboratory technician in charge"
                      value={formData.officerInCharge}
                      onChangeText={(value) =>
                        handleChange("officerInCharge", value)
                      }
                      placeholder="Enter name of officer incharge"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.officerInCharge}
                    />
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
                  </View>
                )}
                {step === 2 && (
                  <View className="flex flex-col gap-[16px]">
                    <CustomTextInput
                      label="Email"
                      value={formData.email}
                      onChangeText={(value) => handleChange("email", value)}
                      placeholder="Enter Your Email"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.email}
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
                      label="Confirm Phone Numnber"
                      value={formData.alternativePhoneNumber}
                      onChangeText={(value) =>
                        handleChange("alternativePhoneNumber", value)
                      }
                      placeholder="Enter Your phone number"
                      errorMessage={errors.alternativePhoneNumber}
                    />
                    <CustomTextInput
                      label="Create Password"
                      value={formData.password}
                      onChangeText={(value) => handleChange("password", value)}
                      placeholder="Enter Your Password"
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
                      placeholder="Enter Your Password"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.confirmPassword}
                      secureTextEntry={true}
                    />
                  </View>
                )}

                {step === 3 && (
                  <View className="flex flex-col gap-[16px]">
                    <View className="flex flex-col gap-[24px]">
                      <Text
                        className="text-[16px] leading-[22px] text-[#272757]"
                        style={{ fontFamily: "Inter_500Medium" }}
                      >
                        Bank Details
                      </Text>
                      <View className="flex flex-col gap-[16px]">
                        <CustomTextInput
                          label="Account Number"
                          value={formData.bankDetails?.accountNumber}
                          onChangeText={(value) =>
                            handleNestedChange(
                              "bankDetails.accountNumber",
                              value
                            )
                          }
                          placeholder="Enter Your Account Number"
                          placeholderTextColor={"#BABABA"}
                          keyboardType="number-pad"
                          errorMessage={errors.bankDetails?.accountNumber}
                        />
                        <CustomTextInput
                          label="Confirm Account Number"
                          value={formData.bankDetails?.confirmAccountNumber}
                          onChangeText={(value) =>
                            handleNestedChange(
                              "bankDetails.confirmAccountNumber",
                              value
                            )
                          }
                          placeholder="Enter Your confirm Account Number"
                          placeholderTextColor={"#BABABA"}
                          keyboardType="number-pad"
                          errorMessage={
                            errors.bankDetails?.confirmAccountNumber
                          }
                        />
                        <CustomTextInput
                          label="Account Name"
                          value={formData.bankDetails?.accountName}
                          onChangeText={(value) =>
                            handleNestedChange("bankDetails.accountName", value)
                          }
                          placeholder="Enter Your account Name"
                          placeholderTextColor={"#BABABA"}
                          keyboardType="default"
                          errorMessage={errors.bankDetails?.accountName}
                        />
                        <CustomTextInput
                          label="Bank Name"
                          value={formData.bankDetails?.bankName}
                          onChangeText={(value) =>
                            handleNestedChange("bankDetails.bankName", value)
                          }
                          placeholder="Enter Your bank Name"
                          placeholderTextColor={"#BABABA"}
                          keyboardType="default"
                          errorMessage={errors.bankDetails?.bankName}
                        />
                      </View>
                    </View>
                    <View className="flex flex-col gap-[24px] w-full">
                      <Text
                        className="text-[16px] leading-[22px] text-[#272757]"
                        style={{ fontFamily: "Inter_500Medium" }}
                      >
                        Policy Agreement
                      </Text>
                      <View className="p-[16px] rounded-[8px] bg-[#F0F8FF66] flex flex-row gap-[16px] items-center w-full">
                        <Image
                          source={errorImage}
                          className="w-[24px] h-[24px]"
                        />
                        <Text
                          className="text-[10px] leading-[14px] text-[#272757]  flex-1"
                          style={{ fontFamily: "Inter_400Regular" }}
                        >
                          Do not exchange contact (phone number, email, etc)
                          with the client, this is an offense to Piolife Limited
                          and an infringement to the right of use of this app,
                          as such is a chargeable offense. You are being
                          monitored.
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-col gap-[16px]">
                      <Text
                        className="text-[16px] leading-[22px] text-[#272757]"
                        style={{ fontFamily: "Inter_500Medium" }}
                      >
                        Do you agree to our policy?
                      </Text>
                      <RadioGroup
                        containerStyle={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                        radioButtons={radioButtons}
                        onPress={setSelectedId}
                        selectedId={selectedId}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View className="flex-col flex items-center justify-center my-4  gap-[16px]">
              <Pressable
                onPress={handleNext}
                disabled={isLoading}
                className={`px-[32px] h-[56px] bg-[#0e16ff] w-full rounded-[8px] flex items-center justify-center`}
              >
                <Text
                  className="text-white text-[16px]"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  {isLoading
                    ? "Loading..."
                    : step < totalSteps
                    ? "Next"
                    : "Done"}
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

export default LabSignup;
