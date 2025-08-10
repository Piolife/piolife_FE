import { NewPasswordForm } from "@/app/resetPassword";
import {
  AddDrugFormProps,
  AddTestFormProps,
  callEmergencyFormData,
  clientSignupFormData,
  doctorSignupFormData,
  emergencySignupFormData,
  LoginFormProps,
  medLabSignupFormData,
  pharmacySignupFormData,
  ResetPasswordFormProps,
} from "@/services/core/types";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateForgetPasswordForm = (
  formData: ResetPasswordFormProps
): Partial<ResetPasswordFormProps> => {
  const newErrors: Partial<ResetPasswordFormProps> = {};

  const trimmedEmail = formData.email?.trim();

  if (!formData.role) {
    newErrors.role = "Role is required";
  }

  if (!trimmedEmail) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(trimmedEmail)) {
    newErrors.email = "Invalid email format";
  }

  return newErrors;
};
export const NewPasswordValidate = (
  formData: NewPasswordForm
): Partial<NewPasswordForm> => {
  const newErrors: Partial<NewPasswordForm> = {};

  const trimmedConfirmPassword = formData.confirmPassword?.trim();
  const trimmedPassword = formData.password?.trim();

  if (!trimmedConfirmPassword) {
    newErrors.confirmPassword = "Confirm Password is required";
  }

  if (!trimmedPassword) {
    newErrors.password = "Password is required";
  }
  if (trimmedConfirmPassword !== trimmedPassword)
    newErrors.confirmPassword = "Cofirm Password must be same as password";
  return newErrors;
};

export const validateAddTestsForm = (
  formData: AddTestFormProps
): Partial<AddTestFormProps> => {
  const newErrors: Partial<AddTestFormProps> = {};

  if (!formData.name) {
    newErrors.name = "Name is required";
  }

  if (!formData.price) {
    newErrors.price = "Price is required";
  }
  return newErrors;
};
export const validateAddDrugsForm = (
  formData: AddDrugFormProps
): Partial<AddDrugFormProps> => {
  const newErrors: Partial<AddDrugFormProps> = {};

  if (!formData.description) {
    newErrors.description = "Description is required";
  }

  if (!formData.name) {
    newErrors.name = "Name is required";
  }

  if (!formData.price) {
    newErrors.price = "Price is required";
  }
  if (!formData.quantity) {
    newErrors.quantity = "Quantity is required";
  }

  return newErrors;
};
export const validateLoginForm = (
  formData: LoginFormProps
): Partial<LoginFormProps> => {
  const newErrors: Partial<LoginFormProps> = {};

  const trimmedEmail = formData.email?.trim();
  const trimmedPassword = formData.password?.trim();

  if (!formData.role) {
    newErrors.role = "Role is required";
  }

  if (!trimmedEmail) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(trimmedEmail)) {
    newErrors.email = "Invalid email format";
  }

  if (!trimmedPassword) {
    newErrors.password = "Password is required";
  }

  return newErrors;
};
export const validateClientForm = (
  formData: clientSignupFormData
): Partial<clientSignupFormData> => {
  const newErrors: Partial<clientSignupFormData> = {};

  if (!formData.profilePicture)
    newErrors.profilePicture = "Profile Image is required";
  if (!formData.firstName) newErrors.firstName = "First Name is required";
  if (!formData.lastName) newErrors.lastName = "Last Name is required";

  if (!formData.gender) newErrors.gender = "Gender is required";
  if (!formData.maritalStatus) newErrors.maritalStatus = "Status is required";
  if (!formData.dateOfBirth)
    newErrors.dateOfBirth = "Date Of Birth is required";
  if (!formData.countryOfOrigin)
    newErrors.countryOfOrigin = "Country Of Origin is required";
  if (!formData.countryOfResidence)
    newErrors.countryOfResidence = "Country Of Residence is required";
  if (!formData.stateOfOrigin)
    newErrors.stateOfOrigin = "State Of Origin is required";

  if (!formData.stateOfResidence)
    newErrors.stateOfResidence = "State of Residence is required";
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email.trim())) {
    newErrors.email = "Invalid email format";
  }

  if (!formData.confirmEmail) {
    newErrors.confirmEmail = "Confirm Email is required";
  } else if (!emailRegex.test(formData.confirmEmail)) {
    newErrors.confirmEmail = "Invalid email format";
  } else if (formData.confirmEmail !== formData.email) {
    newErrors.confirmEmail = "Confirm email must be same as email";
  }
  if (!formData.confirmPhoneNumber)
    newErrors.confirmPhoneNumber = "Confirm Phone Number is required";
  if (!formData.confirmPassword)
    newErrors.confirmPassword = "Confirm Password is required";
  if (formData.confirmPhoneNumber !== formData.phoneNumber)
    newErrors.confirmPhoneNumber =
      "Cofirm Phone Number must be same as Phone Number";
  if (formData.confirmPassword !== formData.password)
    newErrors.confirmPassword = "Cofirm Password must be same as password";
  if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
  if (!formData.password) newErrors.password = "Password is required";

  return newErrors;
};
export const validateCallEmergency = (
  formData: callEmergencyFormData
): Partial<callEmergencyFormData> => {
  const newErrors: Partial<callEmergencyFormData> = {};

  if (!formData.address) newErrors.address = "Address is required";
  if (!formData.lga) newErrors.lga = "lga is required";
  // if (!formData.name) newErrors.name = "Name of caller is required";
  if (!formData.natureOfIncident)
    newErrors.natureOfIncident = "Nature Of Incident of caller is required";
  if (!formData.state)
    newErrors.state = "State Of Incident of caller is required";
  if (!formData.ward) newErrors.ward = "Ward Of Incident of caller is required";

  return newErrors;
};

export const validateDoctorForm = (
  formData: doctorSignupFormData
): Partial<doctorSignupFormData> => {
  const newErrors: Partial<doctorSignupFormData> = {};
  if (!newErrors.bankDetails) {
    newErrors.bankDetails = {
      accountNumber: "",
      confirmAccountNumber: "",
      accountName: "",
      bankName: "",
    };
  }
  if (!formData.profilePicture)
    newErrors.profilePicture = "Profile Image is required";
  if (!formData.firstName) newErrors.firstName = "First Name is required";
  if (!formData.lastName) newErrors.lastName = "Last Name is required";

  if (!formData.gender) newErrors.gender = "Gender is required";
  if (!formData.maritalStatus) newErrors.maritalStatus = "Status is required";
  if (!formData.dateOfBirth)
    newErrors.dateOfBirth = "Date Of Birth is required";
  if (!formData.countryOfOrigin)
    newErrors.countryOfOrigin = "Country Of Origin is required";
  if (!formData.countryOfResidence)
    newErrors.countryOfResidence = "Country Of Residence is required";
  if (!formData.stateOfOrigin)
    newErrors.stateOfOrigin = "State Of Origin is required";

  if (!formData.stateOfResidence)
    newErrors.stateOfResidence = "State of Residence is required";
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email.trim())) {
    newErrors.email = "Invalid email format";
  }

  if (!formData.confirmEmail) {
    newErrors.confirmEmail = "Confirm Email is required";
  } else if (!emailRegex.test(formData.confirmEmail)) {
    newErrors.confirmEmail = "Invalid email format";
  } else if (formData.confirmEmail !== formData.email) {
    newErrors.confirmEmail = "Confirm email must be same as email";
  }
  if (!formData.confirmPhoneNumber)
    newErrors.confirmPhoneNumber = "Confirm Phone Number is required";
  if (!formData.confirmPassword)
    newErrors.confirmPassword = "Confirm Password is required";
  if (formData.confirmPhoneNumber !== formData.phoneNumber)
    newErrors.confirmPhoneNumber =
      "Cofirm Phone Number must be same as Phone Number";
  if (formData.confirmPassword !== formData.password)
    newErrors.confirmPassword = "Cofirm Password must be same as password";
  if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData.degreeCertificate)
    newErrors.degreeCertificate = "Degree Certificate is required";
  if (!formData.currentPracticeLicense)
    newErrors.currentPracticeLicense = "Current Practicing License is required";
  if (!formData.specialty) newErrors.specialty = "Specialty is required";

  if (!formData?.bankDetails?.accountNumber)
    newErrors.bankDetails.accountNumber = "Account Number is required";
  if (!formData?.bankDetails?.confirmAccountNumber)
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number is required";
  if (
    formData?.bankDetails?.confirmAccountNumber !==
    formData?.bankDetails?.accountNumber
  )
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number must be same as Account number ";
  if (!formData?.bankDetails?.accountName)
    newErrors.bankDetails.accountName = "Account name is required";
  if (!formData?.bankDetails?.bankName)
    newErrors.bankDetails.bankName = "Bank name is required";
  return newErrors;
};
export const validatePharmacyForm = (
  formData: pharmacySignupFormData
): Partial<pharmacySignupFormData> => {
  const newErrors: Partial<pharmacySignupFormData> = {};
  if (!newErrors.bankDetails) {
    newErrors.bankDetails = {
      accountNumber: "",
      confirmAccountNumber: "",
      accountName: "",
      bankName: "",
    };
  }
  // if (!formData.logo)
  //   newErrors.logo = "Logo is required";
  if (!formData.pharmacyName)
    newErrors.pharmacyName = "Facility Name is required";
  if (!formData.officerInCharge)
    newErrors.officerInCharge = "Name of Officer in charge is required";
  if (!formData.stateOfResidence)
    newErrors.stateOfResidence = "State Of residence is required";
  if (!formData.localGovernmentArea)
    newErrors.localGovernmentArea = "lga is required";
  if (!formData.ward) newErrors.ward = "State Of Origin is required";

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email.trim())) {
    newErrors.email = "Invalid email format";
  }

  if (!formData.confirmPassword)
    newErrors.confirmPassword = "Confirm Password is required";
  if (formData.confirmPassword !== formData.password)
    newErrors.confirmPassword = "Cofirm Password must be same as password";
  if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
  if (!formData.alternativePhoneNumber)
    newErrors.alternativePhoneNumber = "Alternative Phone Number is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData?.bankDetails?.accountNumber)
    newErrors.bankDetails.accountNumber = "Account Number is required";
  if (!formData?.bankDetails?.confirmAccountNumber)
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number is required";
  if (
    formData?.bankDetails?.confirmAccountNumber !==
    formData?.bankDetails?.accountNumber
  )
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number must be same as Account number ";
  if (!formData?.bankDetails?.accountName)
    newErrors.bankDetails.accountName = "Account name is required";
  if (!formData?.bankDetails?.bankName)
    newErrors.bankDetails.bankName = "Bank name is required";
  return newErrors;
};
export const validateMedLabForm = (
  formData: medLabSignupFormData
): Partial<medLabSignupFormData> => {
  const newErrors: Partial<medLabSignupFormData> = {};
  if (!newErrors.bankDetails) {
    newErrors.bankDetails = {
      accountNumber: "",
      confirmAccountNumber: "",
      accountName: "",
      bankName: "",
    };
  }
  // if (!formData.logo)
  //   newErrors.logo = "Logo is required";
  if (!formData.medicalLabName)
    newErrors.medicalLabName = "Facility Name is required";
  if (!formData.officerInCharge)
    newErrors.officerInCharge = "Name of Officer in charge is required";
  if (!formData.stateOfResidence)
    newErrors.stateOfResidence = "State Of Origin is required";
  if (!formData.localGovernmentArea)
    newErrors.localGovernmentArea = "lga Of Origin is required";
  if (!formData.ward) newErrors.ward = "lga Of Origin is required";

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email.trim())) {
    newErrors.email = "Invalid email format";
  }

  if (!formData.confirmPassword)
    newErrors.confirmPassword = "Confirm Password is required";
  if (formData.confirmPassword !== formData.password)
    newErrors.confirmPassword = "Cofirm Password must be same as password";
  if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
  if (!formData.alternativePhoneNumber)
    newErrors.alternativePhoneNumber = "Alternative Phone Number is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData?.bankDetails?.accountNumber)
    newErrors.bankDetails.accountNumber = "Account Number is required";
  if (!formData?.bankDetails?.confirmAccountNumber)
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number is required";
  if (
    formData?.bankDetails?.confirmAccountNumber !==
    formData?.bankDetails?.accountNumber
  )
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number must be same as Account number ";
  if (!formData?.bankDetails?.accountName)
    newErrors.bankDetails.accountName = "Account name is required";
  if (!formData?.bankDetails?.bankName)
    newErrors.bankDetails.bankName = "Bank name is required";
  return newErrors;
};
export const validateFormEmergencyForm = (
  formData: emergencySignupFormData
): Partial<emergencySignupFormData> => {
  const newErrors: Partial<emergencySignupFormData> = {};
  if (!newErrors.bankDetails) {
    newErrors.bankDetails = {
      accountNumber: "",
      confirmAccountNumber: "",
      accountName: "",
      bankName: "",
    };
  }
  if (!formData?.bankDetails?.accountName)
    newErrors.bankDetails.accountName = "Account Name is required";
  if (!formData.bankDetails.accountNumber)
    newErrors.bankDetails.accountNumber = "Account Number is required";
  if (!formData.alternativePhoneNumber)
    newErrors.alternativePhoneNumber = "Alternative Phone is required";
  if (!formData.bankDetails.bankName)
    newErrors.bankDetails.bankName = "Bank Name is required";
  if (!formData.bankDetails.confirmAccountNumber)
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number is required";
  if (
    formData.bankDetails.confirmAccountNumber !==
    formData.bankDetails.accountNumber
  )
    newErrors.bankDetails.confirmAccountNumber =
      "confirm Account Number must be same as account number";
  if (!formData.confirmPassword)
    newErrors.confirmPassword = "confirm Password is required";
  if (formData.confirmPassword !== formData.password)
    newErrors.confirmPassword = "confirm Password must be same as password";
  if (!formData.email) newErrors.email = "Email is required";
  if (!formData.hospitalName)
    newErrors.hospitalName = "Facility name is required";
  if (!formData.localGovernmentArea)
    newErrors.localGovernmentArea = "LGA is required";
  if (!formData.officerInCharge)
    newErrors.officerInCharge = "officer In Charge is required";
  if (!formData.password) {
    newErrors.password = "Password is required";
  }
  if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
  if (!formData.stateOfResidence)
    newErrors.stateOfResidence = "State of Residence is required";
  if (!formData.ward) newErrors.ward = "Ward is required";

  return newErrors;
};
