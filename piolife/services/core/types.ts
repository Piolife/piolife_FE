import { TextInputProps, Animated, KeyboardTypeOptions } from "react-native";

export interface CustomTextInputProps extends TextInputProps {
  value: any;
  onChangeText: (value: any) => void;
  placeholder: string;
  className?: string;
  fadeAnim?: Animated.Value;
  errorMessage?: string;
  label: string;
  placeholderTextColor: string;
  keyboardType: KeyboardTypeOptions;
}
interface PickerItem {
  label: string;
  value: string;
}
export interface CustomPickerProps {
  label?: string | null;
  value: string;
  onValueChange: (value: string | null) => void;
  items: any;
  placeholder?: string;
  fadeAnim?: Animated.Value;
  error?: string;
}
export type FormData = {
  phoneNumber: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  nin: string;
  bvn: string;
  idCardPhoto: string;
  userHoldingIdCardPhoto: string;
  idType: string;
  fullName: string;
  dateOfIncorporation: string;
  businessRegNumber: string;
  businessRegDocuments: string;
};
export type emergencySignupFormData = {
  facility: string;
  officer: string;
  phone: string;
  alternativePhone: string;
  state: string;
  lga: string;
  ward: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountName: string;
  bankName: string;
};
export type clientSignupFormData = {
  firstName: string;
  lastName: string;
  otherName: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
  countryOrigin: string;
  countryOfResidence: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  email: string;
  confirmEmail: string;
  phoneNumber: string;
  confirmPhoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  profilePicture: string;
};
export type doctorSignupFormData = {
  otherLanguage: string;
  firstName: string;
  lastName: string;
  otherName: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
  countryOrigin: string;
  countryOfResidence: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  email: string;
  confirmEmail: string;
  phoneNumber: string;
  confirmPhoneNumber: string;
  password: string;
  confirmPassword: string;
  degreeCertificate: string;
  currentPracticeLicense: string;
  specialty: string;
  language: string[];
  profileImage?: string | null;
  role: string;
  bankDetails?: {
    accountNumber: string;
    confirmAccountNumber: string;
    accountName: string;
    bankName: string;
  };
};
export interface CustomDatePickerProps {
  label: string;
  selectedDate: Date | null;
  showDatePicker: boolean;
  toggleDatePicker: () => void;
  errorMessage?: string;
  placeholder?: string;
  // fadeAnim: Animated.Value;
  maximumDate?: Date;
  onDateSelected: (date: string) => void; // Expecting a date string (YYYY-MM-DD)
  // fieldName: string; // Field name to identify the date field
}
export interface ApiConfig {
  headers: {
    Authorization: string;
    "Content-Type"?: string;
  };
}
export interface ReusableImageUploadProps {
  fieldName: string;
  handleChange: (name: string, value: string | null) => void;
  errorMessage?: string;
}
