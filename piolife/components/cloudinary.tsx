import * as ImagePicker from "expo-image-picker";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diwozc824/upload";

export const uploadImageToCloudinary = async (
  setLoading: (loading: boolean) => void
): Promise<string | null> => {
  try {
    setLoading(true);

    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraStatus.status !== "granted") {
      alert("Camera permissions are required to select an image");
      setLoading(false);
      return null;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

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
