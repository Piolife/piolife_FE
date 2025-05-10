import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  UIManager,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { doctorSignupFormData } from "@/services/core/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CountryPicker,
  CustomTextInput,
  ProfileImagePlaceholder,
} from "@/components/reusables";
import { CustomPicker } from "@/components/reusables";
import { CustomDatePicker } from "@/components/reusables";
import { ReusableImageUpload } from "@/components/reusables";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { usePostData } from "@/services/api/request";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { validateDoctorForm } from "@/hooks/auth";
import { uploadImageToCloudinary } from "@/components/cloudinary";
import allcountry from "../countries.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
const errorImage = require("../assets/images/error.png");
interface signupResponse {
  otp: string;
  token: string;
}
const DoctorSignup = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoad, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [countries, setCountries] = useState<any>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Partial<doctorSignupFormData>>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [step, setStep] = useState(1);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "English",
  ]);

  const languages = ["English", "Igbo", "Yoruba", "Hausa", "Others"];

  const toggleCheckbox = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language]
    );

    setFormData((prevData) => ({
      ...prevData,
      languageProficiency: selectedLanguages.includes(language)
        ? selectedLanguages.filter((lang) => lang !== language) // Remove from list
        : [...selectedLanguages, language], // Add to list
    }));
  };

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
  const totalSteps = 5;

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [formData, setFormData] = useState<doctorSignupFormData>({
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
    degreeCertificate: "",
    currentPracticeLicense: "",
    specialty: "",
    languageProficiency: [],
    role: "medical_practitioner",
    otherLanguage: "",
    bankDetails: {
      confirmAccountNumber: "",
      accountName: "",
      bankName: "",
      accountNumber: "",
    },
  });

  const handleChange = (name: any, value: any) => {
    const validationErrors = validateDoctorForm(formData);
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

    const validationErrors = validateDoctorForm(formData);
    setErrors(validationErrors);
  };

  const handleDateChange = (fieldName: string, date: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleSignup = async () => {
    const {
      confirmEmail,
      confirmPassword,
      confirmPhoneNumber,
      bankDetails,
      otherLanguage,
      ...filteredData
    } = formData;
    // Safely clone and remove confirmAccountNumber from bankDetails
    const filteredBankDetails = { ...bankDetails };
    delete filteredBankDetails.confirmAccountNumber;
    let updatedLanguageProficiency = [...formData.languageProficiency];
    if (otherLanguage.trim() !== "") {
      updatedLanguageProficiency.push(otherLanguage.trim());
    }
    const payload = {
      ...filteredData,
      languageProficiency: updatedLanguageProficiency,
      bankDetails: filteredBankDetails,
    };
    try {
      const response = (await postData(payload)) as signupResponse;

      if (response) {
        console.log("Signup successful", response);
        await AsyncStorage.setItem("verificationToken", response?.token);
        router.push("/otp");
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
    const validationErrors = validateDoctorForm(formData);
    setErrors(validationErrors);
    if (
      step === 1 &&
      !validationErrors.profilePicture &&
      !validationErrors.firstName &&
      !validationErrors.lastName &&
      !validationErrors.otherName &&
      !validationErrors.gender &&
      !validationErrors.maritalStatus
    ) {
      setStep((prevStep) => prevStep + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    if (
      step === 2 &&
      !validationErrors.dateOfBirth &&
      !validationErrors.countryOfOrigin &&
      !validationErrors.countryOfResidence &&
      !validationErrors.stateOfOrigin &&
      !validationErrors.stateOfResidence
    ) {
      setStep((prevStep) => prevStep + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
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
      setStep((prevStep) => prevStep + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    if (
      step === 4 &&
      !validationErrors.degreeCertificate &&
      !validationErrors.currentPracticeLicense &&
      !validationErrors.specialty
    ) {
      setStep((prevStep) => prevStep + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    if (
      step === 5 &&
      !validationErrors.bankDetails?.accountNumber &&
      !validationErrors.bankDetails?.confirmAccountNumber &&
      !validationErrors.bankDetails?.accountName &&
      !validationErrors.bankDetails?.bankName &&
      validateSelection()
    ) {
      handleSignup();
      console.log("formdata", formData);
    }
  };
  const {
    data: register,
    loading: isLoading,

    postData,
  } = usePostData("https://piolife-be.onrender.com/api/v12/users/create");

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
  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImageToCloudinary(setLoading);
      setImageUri(imageUrl);

      setFormData((prevData) => ({
        ...prevData,
        profilePicture: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
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

    setFormData((prevData) => ({
      ...prevData,
      countryOfOrigin: defaultCountry,
      countryOfResidence: defaultCountry,
    }));
  }, []);
  return (
    <SafeAreaView
      className="flex flex-1 bg-[#fffff0] "
      style={{ paddingTop: Platform.OS === "android" ? 20 : 0 }}
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
                  imageUri={formData.profilePicture}
                />
                {errors.profilePicture && (
                  <View>
                    <Text className="font-600 text-[10px] leading-[10px] text-[#FF0000] mt-1">
                      {errors.profilePicture}
                    </Text>
                  </View>
                )}
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
                  </View>
                )}
                {step === 2 && (
                  <View className="flex flex-col gap-[16px]">
                    <CustomDatePicker
                      label="Date of Birth"
                      selectedDate={new Date(formData.dateOfBirth)}
                      showDatePicker={showDatePicker}
                      toggleDatePicker={toggleDatePicker}
                      errorMessage={errors.dateOfBirth}
                      placeholder="Select Date of Birth"
                      onDateSelected={(date) =>
                        handleDateChange("dateOfBirth", date)
                      }
                    />
                    <CountryPicker
                      label="Country of Origin"
                      value={formData.countryOfOrigin || ""}
                      onValueChange={(value) =>
                        handleChange("countryOrigin", value)
                      }
                      items={countries}
                      placeholder="Select your Country of Origin"
                      error={errors.countryOfOrigin}
                    />
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
                    <CustomTextInput
                      label="State of Origin"
                      value={formData.stateOfOrigin}
                      onChangeText={(value) =>
                        handleChange("stateOfOrigin", value)
                      }
                      placeholder="Enter Your state Of Origin"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.stateOfOrigin}
                    />

                    <CustomTextInput
                      label="State/Province/County of Residence"
                      value={formData.stateOfResidence}
                      onChangeText={(value) =>
                        handleChange("stateOfResidence", value)
                      }
                      placeholder="Enter Your state of Residence"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.stateOfResidence}
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
                    <CustomTextInput
                      label="Phone No"
                      value={formData.phoneNumber}
                      onChangeText={(value) =>
                        handleChange("phoneNumber", value)
                      }
                      placeholder="Enter Your phone number"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.phoneNumber}
                    />
                    <CustomTextInput
                      label="Confirm Phone No"
                      value={formData.confirmPhoneNumber}
                      onChangeText={(value) =>
                        handleChange("confirmPhoneNumber", value)
                      }
                      placeholder="Enter Your phone number"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="numeric"
                      errorMessage={errors.confirmPhoneNumber}
                    />
                    <CustomTextInput
                      label="Create Password"
                      value={formData.password}
                      onChangeText={(value) => handleChange("password", value)}
                      placeholder="Enter Your Password"
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
                      placeholder="Enter Your Password"
                      placeholderTextColor={"#BABABA"}
                      keyboardType="default"
                      errorMessage={errors.confirmPassword}
                    />
                  </View>
                )}
                {step === 4 && (
                  <View className="flex flex-col gap-[16px] ">
                    <View className="flex flex-col gap-[12px] ">
                      <Text
                        className="text-[14px] leading-[22px] text-[#030319]"
                        style={{ fontFamily: "Inter_300Light" }}
                      >
                        Degree certificate
                      </Text>
                      <ReusableImageUpload
                        fieldName="degreeCertificate"
                        handleChange={handleChange}
                        errorMessage={errors.degreeCertificate}
                      />
                    </View>
                    <View className="flex flex-col gap-[12px] ">
                      <Text
                        className="text-[14px] leading-[22px] text-[#030319]"
                        style={{ fontFamily: "Inter_300Light" }}
                      >
                        Current Praticing license
                      </Text>
                      <ReusableImageUpload
                        fieldName="currentPracticeLicense"
                        handleChange={handleChange}
                        errorMessage={errors.currentPracticeLicense}
                      />
                    </View>
                    <View className="flex flex-col gap-[16px]">
                      <View className="flex flex-col gap-[12px]">
                        <Text
                          className="text-[14px] leading-[22px] text-[#030319]"
                          style={{ fontFamily: "Inter_300Light" }}
                        >
                          Specialty (If general medicine, kindly Indicate)
                        </Text>
                        <CustomPicker
                          label=""
                          value={formData.specialty || ""}
                          onValueChange={(value) =>
                            handleChange("specialty", value)
                          }
                          items={[
                            { label: "surgeon", value: "surgeon" },
                            { label: "Eye ", value: "Eye" },
                            { label: "Nose ", value: "nose" },
                          ]}
                          placeholder="Select your Specialty"
                          error={errors.specialty}
                        />
                      </View>
                      <View className="flex flex-col gap-[8px] w-full">
                        <Text
                          className="text-[14px] leading-[22px] text-[#030319]"
                          style={{ fontFamily: "Inter_300Light" }}
                        >
                          Language Proficiency
                        </Text>
                        <View className="flex flex-row flex-wrap gap-[16px]">
                          {languages.map((language) => (
                            <View
                              key={language}
                              className="py-[8px] px-[4px] flex flex-row gap-[16px] items-center"
                            >
                              <Text
                                className="text-[14px] leading-[22px] text-[#030319]"
                                style={{ fontFamily: "Inter_400Regular" }}
                              >
                                {language}
                              </Text>
                              <Checkbox
                                value={selectedLanguages.includes(language)}
                                onValueChange={() => toggleCheckbox(language)}
                                color={
                                  selectedLanguages.includes(language)
                                    ? "#272757"
                                    : "#777777"
                                }
                              />
                            </View>
                          ))}
                        </View>
                      </View>

                      <CustomTextInput
                        label="Others (Specify)"
                        value={formData.otherLanguage}
                        onChangeText={(value) =>
                          handleChange("otherLanguage", value)
                        }
                        placeholder="Enter Your other Language if applicable"
                        placeholderTextColor={"#BABABA"}
                        keyboardType="default"
                      />
                    </View>
                  </View>
                )}
                {step === 5 && (
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
                className={`px-[32px] h-[56px] bg-[#0e16ff] w-[283px] rounded-[8px] flex items-center justify-center`}
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

export default DoctorSignup;
