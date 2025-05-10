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
  hospitalName: string;
  officerInCharge: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  stateOfResidence: string;
  localGovernmentArea: string;
  ward: string;
  email: string;
  password: string;
  confirmPassword: string;
  bankDetails: {
    accountNumber: string;
    confirmAccountNumber: string;
    accountName: string;
    bankName: string;
  };
};
export type clientSignupFormData = {
  firstName: string;
  lastName: string;
  otherName: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
  countryOfOrigin: string;
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
  countryOfOrigin: string;
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
  languageProficiency: string[];
  profilePicture?: string | null;
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
  selectedDate: Date;
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
export interface LoginFormProps {
  role: string;
  email: string;
  password: string;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  isVerified: boolean;
  dateOfBirth: string;
  profilePicture: string;
  username: string;
}
export interface wallet {
  balance: number;
  loanBalance: number;
}
export interface eligibility {
  loanEligibility: number;
  walletBalance: number;
  userId: number;
}
export interface HealthIssueType {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  __v: number;
}
