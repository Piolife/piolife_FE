import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  UIManager,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { clientSignupFormData } from "@/services/core/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CountryPicker,
  CustomTextInput,
  ProfileImagePlaceholder,
} from "@/components/reusables";
import { CustomPicker } from "@/components/reusables";
import { CustomDatePicker } from "@/components/reusables";
import { usePostData } from "@/services/api/request";
import { router } from "expo-router";
import { validateClientForm } from "@/hooks/auth";
import { uploadImageToCloudinary } from "@/components/cloudinary";
import allcountry from "../countries.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInputWithCountryPicker from "@/components/countryPick";
import { API_URL } from "@/constants/api";
interface signupResponse {
  otp: string;
  token: string;
}
const ClientSignup = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [countries, setCountries] = useState<any>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Partial<clientSignupFormData>>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [step, setStep] = useState(1);
  const [isLoad, setLoading] = useState<boolean>(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const [imageUri, setImageUri] = useState<string>("");
  const [defaultCountry, setDefaultCountry] = useState<string>("");
  const [nigeriaData, setNigeriaData] = useState<any>(null);

  useEffect(() => {
    fetch("https://temikeezy.github.io/nigeria-geojson-data/data/full.json")
      .then((res) => res.json())
      .then(setNigeriaData)
      .catch(console.error);
  }, []);

  const {
    data: register,
    loading: isLoading,

    postData,
  } = usePostData(`${API_URL}/api/v12/users/create`);

  const totalSteps = 3;

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [formData, setFormData] = useState<clientSignupFormData>({
    firstName: "",
    lastName: "",
    otherName: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    countryOfOrigin: "",
    countryOfResidence: "",
    stateOfOrigin: "",
    stateOfResidence: "",
    email: "",
    confirmEmail: "",
    phoneNumber: "",
    confirmPhoneNumber: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
    referralCode: "",
    role: "client",
  });
  const handleChange = (name: any, value: any) => {
    const validationErrors = validateClientForm(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSignup = async () => {
    const {
      confirmEmail,
      confirmPassword,
      confirmPhoneNumber,
      ...filteredData
    } = formData;
    try {
      const response = (await postData(filteredData)) as signupResponse;

      if (response) {
        console.log("Signup successful", response);
        await AsyncStorage.setItem("verificationToken", response?.token);
        router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      Alert.alert("Signup failed: " + err.message);
    }
  };

  const handleDateChange = (fieldName: string, date: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));

    const validationErrors = validateClientForm({
      ...formData,
      [fieldName]: date,
    });
    setErrors(validationErrors);
  };

  const handleNext = async () => {
    const validationErrors = validateClientForm(formData);
    setErrors(validationErrors);

    if (
      step === 1 &&
      !validationErrors.profilePicture &&
      !validationErrors.firstName &&
      !validationErrors.lastName &&
      !validationErrors.gender &&
      !validationErrors.maritalStatus
    ) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setStep((prevStep) => prevStep + 1);
    }

    if (
      step === 2 &&
      !validationErrors.dateOfBirth &&
      !validationErrors.countryOfOrigin &&
      !validationErrors.countryOfResidence &&
      !validationErrors.stateOfOrigin &&
      !validationErrors.stateOfResidence
    ) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setStep((prevStep) => prevStep + 1);
    }

    if (
      step === 3 &&
      !validationErrors.email &&
      !validationErrors.confirmEmail &&
      !validationErrors.phoneNumber &&
      !validationErrors.confirmPhoneNumber &&
      !validationErrors.password &&
      !validationErrors.confirmPassword
    ) {
      handleSignup();
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const showMode = (currentMode: any) => {
    const today = new Date();

    DateTimePickerAndroid.open({
      value: selectedDate || new Date(),
      onChange: (event, date) => {
        if (event.type === "set" && date) {
          const formattedDate = date.toISOString().split("T")[0];

          setFormData((prevState) => ({
            ...prevState,
            dateOfBirth: formattedDate,
          }));
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

  useEffect(() => {
    const countryList = allcountry.map((country: any) => ({
      label: country.name,
      value: country.name,
      key: country.code,
    }));

    setCountries(countryList);

    const nigeria = countryList.find(
      (country) => country.label.toLowerCase() === "nigeria"
    );
    const nigeriaExists = !!nigeria;

    const defaultCountry = nigeriaExists
      ? nigeria.value
      : countryList[0]?.value || "";
    setDefaultCountry(defaultCountry);
    setFormData((prevData) => ({
      ...prevData,
      countryOfOrigin: defaultCountry,
      countryOfResidence: defaultCountry,
    }));
  }, []);
  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImageToCloudinary(setLoading);
      setImageUri(imageUrl || "");

      setFormData((prevData) => ({
        ...prevData,
        profilePicture: imageUrl || "",
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const stateOptions = nigeriaData?.map((item: any) => ({
    label: item.state,
    value: item.state,
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
          ref={scrollRef}
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
            <View className="flex flex-col items-center mt-6 pb-2">
              <ProfileImagePlaceholder
                showBorder={true}
                upload={handleImageUpload}
                imageUri={imageUri}
              />
              <Text className="font-600 text-[10px] leading-[10px] text-[#000000] mt-1">
                Use your real Image
              </Text>
              {errors.profilePicture && (
                <View>
                  <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
                    {errors.profilePicture}
                  </Text>
                </View>
              )}
            </View>

            <View className="   bg-[#fffff0] ">
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
                      label="First Name"
                      value={formData.firstName}
                      onChangeText={(value) => handleChange("firstName", value)}
                      placeholder="Enter FirstName"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.firstName}
                    />

                    <CustomTextInput
                      label="Last Name (Surname)"
                      value={formData.lastName}
                      onChangeText={(value) => handleChange("lastName", value)}
                      placeholder="Enter LastName"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.lastName}
                    />
                    <CustomTextInput
                      label="Other Names"
                      value={formData.otherName}
                      onChangeText={(value) => handleChange("otherName", value)}
                      placeholder="Enter Middle Name"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.otherName}
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
                      error={errors.gender}
                    />
                    <CustomPicker
                      label="Status"
                      value={formData.maritalStatus || ""}
                      onValueChange={(value) =>
                        handleChange("maritalStatus", value)
                      }
                      items={[
                        { label: "Married", value: "married" },
                        { label: "Single", value: "single" },
                      ]}
                      placeholder="Select your marital status"
                      error={errors.maritalStatus}
                    />
                    <CustomTextInput
                      label="Referral Code"
                      value={formData.referralCode}
                      onChangeText={(value) =>
                        handleChange("referralCode", value)
                      }
                      placeholder="Enter Referral Code if available"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.referralCode}
                    />
                  </View>
                )}
                {step === 2 && (
                  <View className="flex flex-col gap-[16px]">
                    <CustomDatePicker
                      label="Date of Birth"
                      selectedDate={tempDate}
                      showDatePicker={showDatePicker}
                      toggleDatePicker={toggleDatePicker}
                      errorMessage={errors.dateOfBirth}
                      placeholder="Select Date of Birth"
                      onDateSelected={(dateStr) => {
                        console.log("dude", dateStr);
                        handleDateChange("dateOfBirth", dateStr); // update form string
                        setTempDate(new Date(dateStr)); // update tempDate
                      }}
                    />

                    {formData.countryOfResidence === defaultCountry && (
                      <CustomPicker
                        label="State/Province/County of Origin"
                        value={formData.stateOfOrigin}
                        onValueChange={(value) => {
                          if (typeof value === "string") {
                            setFormData((prev) => ({
                              ...prev,
                              stateOfOrigin: value,
                            }));
                          }
                        }}
                        items={stateOptions}
                        error={errors.stateOfOrigin}
                      />
                    )}
                    {formData.countryOfResidence !== defaultCountry && (
                      <CustomTextInput
                        label="State/Province/County of Origin"
                        value={formData.stateOfOrigin}
                        onChangeText={(value) =>
                          handleChange("stateOfOrigin", value)
                        }
                        placeholder="Enter Your State of Origin"
                        placeholderTextColor={"#BABABA"}
                        keyboardType="default"
                        errorMessage={errors.stateOfOrigin}
                      />
                    )}
                    <CountryPicker
                      label="Country of Origin"
                      value={formData.countryOfOrigin || ""}
                      onValueChange={(value) =>
                        handleChange("countryOfOrigin", value)
                      }
                      items={countries}
                      placeholder="Select your Country of Origin"
                      error={errors.countryOfOrigin}
                    />

                    {formData.countryOfResidence === defaultCountry && (
                      <CustomPicker
                        label="State/Province/County of Residence"
                        value={formData.stateOfResidence}
                        onValueChange={(value) => {
                          if (typeof value === "string") {
                            setFormData((prev) => ({
                              ...prev,
                              stateOfResidence: value,
                            }));
                          }
                        }}
                        items={stateOptions}
                        error={errors.stateOfResidence}
                      />
                    )}
                    {formData.countryOfResidence !== defaultCountry && (
                      <CustomTextInput
                        label="State/Province/County of Residence"
                        value={formData.stateOfResidence}
                        onChangeText={(value) =>
                          handleChange("stateOfResidence", value)
                        }
                        placeholder="Enter Your State of Residence"
                        placeholderTextColor={"#BABABA"}
                        keyboardType="default"
                        errorMessage={errors.stateOfResidence}
                      />
                    )}
                    <CountryPicker
                      label="Country of Residence"
                      value={formData.countryOfResidence || ""}
                      onValueChange={(value) =>
                        handleChange("countryOfResidence", value)
                      }
                      items={countries}
                      placeholder="Select your Country of Residence"
                      error={errors.countryOfResidence}
                    />
                  </View>
                )}
                {step === 3 && (
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
                    <CustomTextInput
                      label="Confirm Email"
                      value={formData.confirmEmail}
                      onChangeText={(value) =>
                        handleChange("confirmEmail", value)
                      }
                      placeholder="Enter Your Email"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.confirmEmail}
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
                      value={formData.confirmPhoneNumber}
                      onChangeText={(value) =>
                        handleChange("confirmPhoneNumber", value)
                      }
                      placeholder="Enter Your phone number"
                      errorMessage={errors.confirmPhoneNumber}
                    />

                    <CustomTextInput
                      label="Create Password"
                      value={formData.password}
                      onChangeText={(value) => handleChange("password", value)}
                      placeholder="Enter Your password"
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
                      placeholder="Enter Your password"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.confirmPassword}
                      secureTextEntry={true}
                    />
                  </View>
                )}
              </View>
            </View>

            <View className="flex-col flex items-center justify-center  gap-[16px] my-2">
              <Pressable
                disabled={isLoading}
                onPress={handleNext}
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
              <Pressable
                onPress={() => {
                  router.push("/login");
                }}
              >
                <Text
                  className="text-[16px] leading-[22px]"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Already have an account? Log in
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ClientSignup;
