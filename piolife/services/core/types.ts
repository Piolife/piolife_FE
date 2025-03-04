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
  items: PickerItem[];
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
