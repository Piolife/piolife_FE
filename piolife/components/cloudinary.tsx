import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diwozc824/upload";
const CLOUDINARY_RAW_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/diwozc824/raw/upload";

const pickImageSource = (): Promise<"camera" | "library" | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        { text: "Take Photo", onPress: () => resolve("camera") },
        { text: "Choose from Library", onPress: () => resolve("library") },
        { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
};

export const uploadImageToCloudinary = async (
  setLoading: (loading: boolean) => void
): Promise<string | null> => {
  try {
    const source = await pickImageSource();

    if (!source) {
      return null;
    }

    setLoading(true);

    const pickerOptions: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    };

    let pickerResult;
    if (source === "camera") {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      if (cameraStatus.status !== "granted") {
        alert("Camera permissions are required to take a photo");
        setLoading(false);
        return null;
      }

      pickerResult = await ImagePicker.launchCameraAsync(pickerOptions);
    } else {
      const libraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (libraryStatus.status !== "granted") {
        alert("Media library permissions are required to select an image");
        setLoading(false);
        return null;
      }

      pickerResult = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    }

    if (pickerResult.canceled) {
      setLoading(false);
      return null;
    }

    const fileSize = pickerResult.assets[0].fileSize;
    const maxSizeInBytes = 10 * 1024 * 1024;

    if (fileSize && fileSize > maxSizeInBytes) {
      alert("File size exceeds the maximum limit of 10MB");
      setLoading(false);
      return null;
    }

    const base64Img = `data:image/jpg;base64,${pickerResult.assets[0].base64}`;
    const data = {
      file: base64Img,
      upload_preset: "qbxh6ddv",
    };

    const response = await fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    const result = await response.json();
    setLoading(false);

    if (result && result.secure_url) {
      return result.secure_url; // Return the Cloudinary image URL
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error uploading image:", error);
    setLoading(false);
    return null;
  }
};

export const uploadPdfToCloudinary = async (
  setLoading: (loading: boolean) => void
): Promise<{ url: string; name: string } | null> => {
  try {
    setLoading(true);

    const pickerResult = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (pickerResult.canceled || !pickerResult.assets?.length) {
      setLoading(false);
      return null;
    }

    const file = pickerResult.assets[0];
    const maxSizeInBytes = 10 * 1024 * 1024;

    if (file.size && file.size > maxSizeInBytes) {
      alert("File size exceeds the maximum limit of 10MB");
      setLoading(false);
      return null;
    }

    const base64File = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const data = {
      file: `data:application/pdf;base64,${base64File}`,
      upload_preset: "qbxh6ddv",
    };

    const response = await fetch(CLOUDINARY_RAW_UPLOAD_URL, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    const result = await response.json();
    setLoading(false);

    if (result && result.secure_url) {
      return { url: result.secure_url, name: file.name };
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error uploading document:", error);
    setLoading(false);
    return null;
  }
};
