import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { CustomTextInput } from "./reusables";

const windowHeight = Dimensions.get("window").height;
interface AddFundsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAmountChange: (amount: number) => void;
  onSubmit: (amount: number) => void;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isVisible,
  onClose,
  onAmountChange,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<number>(0);

  const handleChange = (value: string) => {
    const numericValue = Number(value);
    setAmount(numericValue);
    onAmountChange(numericValue); // Pass the amount to the parent whenever it changes
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.bottomSheet,
          {
            height:
              Platform.OS === "ios" ? windowHeight * 0.9 : windowHeight * 0.5,
          },
        ]}
      >
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{ fontFamily: "Inter_500Medium" }}
            className="text-[20px] leading-[30px] text-[#000000]"
          >
            Select a Payment Method
          </Text>
          <Pressable
            onPress={onClose}
            className="w-[32.92px] h-[32.92px] rounded-full bg-[#74748014] flex flex-row justify-center items-center"
          >
            <AntDesign name="close" size={20} color="#3C3C4399" />
          </Pressable>
        </View>
        <View className="mt-8 ">
          <CustomTextInput
            label="Enter amount to proceed"
            value={amount}
            onChangeText={(value) => handleChange(value)}
            placeholder="Enter amount"
            placeholderTextColor={"#BABABA"}
            keyboardType="numeric"
          />
          <Pressable
            disabled={amount < 1000}
            onPress={() => onSubmit(amount)}
            className={`px-[32px] h-[56px] bg-[#0e16ff] ${
              amount < 1000 ? "bg-[#aaaaaa] " : "bg-[#0e16ff] "
            } w-full rounded-[8px] flex items-center justify-center mt-4`}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Submit
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    bottom: 0,
  },
});

export default AddFundsModal;
