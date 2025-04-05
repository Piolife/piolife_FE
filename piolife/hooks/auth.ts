import {
  clientSignupFormData,
  doctorSignupFormData,
} from "@/services/core/types";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateClientForm = (
  formData: clientSignupFormData
): Partial<clientSignupFormData> => {
  const newErrors: Partial<clientSignupFormData> = {};

  if (!formData.profilePicture)
    newErrors.profilePicture = "Profile Image is required";
  if (!formData.firstName) newErrors.firstName = "First Name is required";
  if (!formData.lastName) newErrors.lastName = "Last Name is required";
  if (!formData.otherName) newErrors.otherName = "Other Name is required";
  if (!formData.gender) newErrors.gender = "Gender is required";
  if (!formData.maritalStatus) newErrors.maritalStatus = "Status is required";
  if (!formData.dateOfBirth)
    newErrors.dateOfBirth = "Date Of Birth is required";
  if (!formData.countryOrigin)
    newErrors.countryOrigin = "Country Of Origin is required";
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
  if (!formData.profileImage)
    newErrors.profileImage = "Profile Image is required";
  if (!formData.firstName) newErrors.firstName = "First Name is required";
  if (!formData.lastName) newErrors.lastName = "Last Name is required";
  if (!formData.otherName) newErrors.otherName = "Other Name is required";
  if (!formData.gender) newErrors.gender = "Gender is required";
  if (!formData.maritalStatus) newErrors.maritalStatus = "Status is required";
  if (!formData.dateOfBirth)
    newErrors.dateOfBirth = "Date Of Birth is required";
  if (!formData.countryOrigin)
    newErrors.countryOrigin = "Country Of Origin is required";
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
