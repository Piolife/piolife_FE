import { router } from "expo-router";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  DrugItemType,
  DrugSoldType,
  HealthIssueType,
  HistoryWalletType,
  TestItemType,
} from "@/services/core/types";
import {
  formatDateTime,
  formatNumberToThousands,
  replaceUnderscoresWithSpaces,
} from "../reusables";
import React from "react";
import { Feather } from "@expo/vector-icons";

const estateView = require("../../assets/images/Rectangle 12-2.png");
const piocoin = require("../../assets/images/piocoin_symbol-removebg-preview 1.png");
export const StateSelect = ({
  item,
  onPress,
}: {
  item: { state: string; status: string };
  onPress?: () => void;
}) => {
  const isAvailable = item.status === "available";

  return (
    <Pressable
      onPress={onPress}
      disabled={!isAvailable}
      className="w-[48%] my-[8px] "
    >
      <View
        className={`px-[16px] rounded-[8px] items-center justify-center h-[53px] ${
          isAvailable
            ? "bg-[#FFFFFF] shadow-md border border-gray-200"
            : "bg-[#0E16FF]"
        }`}
      >
        <Text
          className={`text-[14px] leading-[150%] ${
            isAvailable ? "text-[#272757]" : "text-[#ffffff]"
          }`}
          style={{ fontFamily: "Inter_500Medium" }}
        >
          {item.state}
        </Text>
      </View>
    </Pressable>
  );
};
export const SelectSickness = ({
  item,
  onPress,
  selected,
}: {
  item: HealthIssueType;
  selected?: boolean;
  onPress?: () => void;
}) => {
  return (
    <Pressable onPress={onPress} className="w-[48%] my-[8px]">
      <View
        className={`px-[16px] h-[64px] rounded-[8px] items-center justify-center py-[16px] ${
          selected
            ? "bg-[#0E16FF]"
            : "bg-[#FFFFFF] shadow-md border border-gray-200 "
        }`}
      >
        <Image
          source={{
            uri: item.image,
          }}
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
        <View className="flex flex-row items-center gap-2 mt-1">
          <Image source={piocoin} style={{ width: 10, height: 20 }} />
          <Text
            className={`text-[10px] font-[700] ${
              selected ? "text-[#ffffff]" : "text-[#272757] "
            }`}
            style={{ fontFamily: "Inter_500Medium" }}
          >
            {formatNumberToThousands(item.price)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
export const EstateSelect = ({
  item,
  onPress,
}: {
  item: { state: string; status: string };
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={() => {
        router.push("/estateFeatures");
      }}
      className="flex-1 mb-[8px] w-full"
    >
      <View
        className={`p-[16px] rounded-[8px] items-center  bg-[#FFFFF0]  border-[#DADADA80] border-[1px] flex flex-row gap-[12px] w-full`}
      >
        <Image
          source={estateView}
          className="h-[89px] w-[89px] rounded-[8px]"
        />
        <View className="flex flex-col gap-[8px] flex-1">
          <Text
            className={`text-[16px] leading-[96%] text-[#272757] `}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Woodland Estate
          </Text>
          <Text
            className={`text-[12px] leading-[100%] text-[#777777] w-full`}
            style={{ fontFamily: "Inter_500Medium" }}
          >
            1011 Ocean avanue, Benin city, Edo state
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
export const Features = ({ item }: { item: string; onPress?: () => void }) => {
  return (
    <View className={`  items-center    flex flex-row gap-[16px] w-full`}>
      <MaterialCommunityIcons name="check-all" size={24} color="black" />
      <Text
        className={`text-[16px] leading-[100%] text-[#030319] w-full`}
        style={{ fontFamily: "Inter_400Regular" }}
      >
        {item}
      </Text>
    </View>
  );
};
export const SelectedAilment = ({
  item,
  onPress,
}: {
  item: HealthIssueType;
  onPress?: () => void;
}) => {
  return (
    <View
      className={`px-[16px] rounded-[16px] py-[8px] my-[8px] mr-[8px] items-center justify-center  bg-[#FFFFFF]  border-[#DADADA] border-[1px]`}
    >
      <Text
        className={`text-[14px] leading-[150%] text-[#272757] `}
        style={{ fontFamily: "Inter_500Medium" }}
      >
        {item.name}
      </Text>
    </View>
  );
};
export const DrugList = ({ _id, name, description, price }: DrugItemType) => {
  return (
    <Pressable
      className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-row gap-[16px] items-center mb-2"
      onPress={() => {
        router.push({
          pathname: "/addDrug",
          params: { _id }, // 👈 pass id here
        });
        console.log("id", _id);
      }}
    >
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-col gap-[8px]">
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {name}
          </Text>
          <Text
            className="text-[#272757] text-[14px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {description}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Image source={piocoin} style={{ width: 10, height: 20 }} />

          <Text
            className="text-[#272757] text-[12px] leading-[20px]  "
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {formatNumberToThousands(price)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
export const TestList = ({ _id, name, price }: TestItemType) => {
  return (
    <Pressable
      className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-row gap-[16px] items-center mb-2"
      onPress={() => {
        router.push({
          pathname: "/addTest",
          params: { _id }, // 👈 pass id here
        });
        console.log("id", _id);
      }}
    >
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-col gap-[8px]">
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {name}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Image source={piocoin} style={{ width: 10, height: 20 }} />

          <Text
            className="text-[#272757] text-[12px] leading-[20px]  "
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {formatNumberToThousands(price)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
export const DrugSold = ({ totalAmount, percentage }: DrugSoldType) => {
  return (
    <View className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-row gap-[16px] items-center mb-2">
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-row items-center gap-2">
          <Image source={piocoin} style={{ width: 10, height: 20 }} />
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {formatNumberToThousands(totalAmount)}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Text
            className="text-[#272757] text-[12px] leading-[20px]  "
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
};
export const HistoryWallet = ({
  timestamp,
  amount,
  type,
}: HistoryWalletType) => {
  return (
    <View className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-row gap-[16px] items-center mb-2">
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-col gap-[8px]">
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {replaceUnderscoresWithSpaces(type)}
          </Text>
          <Text
            className="text-[#272757] text-[14px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {formatDateTime(timestamp)}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Image source={piocoin} style={{ width: 10, height: 20 }} />

          <Text
            className="text-[#272757] text-[12px] leading-[20px]  "
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {formatNumberToThousands(amount)}
          </Text>
        </View>
      </View>
    </View>
  );
};
export const ConsultationHistory = ({ timestamp, amount, type }: any) => {
  return (
    <View className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-col gap-[16px] items-center mb-2">
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-col gap-[8px]">
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {type}
          </Text>
          <Text
            className="text-[#272757] text-[14px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {formatDateTime(timestamp)}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Text
            className="text-[#272757] text-[14px] leading-[20px]  "
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {amount}
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between  w-full">
        <Pressable
          onPress={() => {
            router.push("/nearbyMedlab");
          }}
          className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[48%]"
        >
          <Text
            className="text-[#ffffff] text-[12px] leading-[17px] "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Medical Lab
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push("/nearbyPharmacy");
          }}
          className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[48%]"
        >
          <Text
            className="text-[#ffffff] text-[12px] leading-[17px] "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Pharmacy
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export const NearbyMeds = ({
  medicalLabName,
  officerInCharge,
  onPress,
}: {
  medicalLabName: string;
  officerInCharge: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-col gap-[16px] items-center mb-2"
    >
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-col gap-[8px]">
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {medicalLabName}
          </Text>
          <Text
            className="text-[#272757] text-[14px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {officerInCharge}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
export const NearbyPharms = ({
  medicalLabName,
  officerInCharge,
  onPress,
}: {
  medicalLabName: string;
  officerInCharge: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-col gap-[16px] items-center mb-2"
    >
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-col gap-[8px]">
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {medicalLabName}
          </Text>
          <Text
            className="text-[#272757] text-[14px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {officerInCharge}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
export const AvailableDoc = ({
  name,
  hasMatch,
  specialtyId,
  doctors,
}: {
  name: string;
  specialtyId: string;
  doctors: any;
  hasMatch: boolean;
}) => {
  return (
    <Pressable
      disabled={!hasMatch}
      className="rounded-[4px] border-[#DADADA80] border-[1px]  flex flex-row gap-[16px] items-center bg-[#fffff0] mt-3"
      onPress={() => {
        router.push(
          `/callDoctor?doctors=${doctors}&specialtyId=${specialtyId}&name=${name}`
        );
      }}
      style={[styles.shadowProp]}
    >
      <View className="flex flex-col gap-[8px] flex-1">
        <View className="flex items-end">
          <View
            className={`py-[4px] px-[16px] rounded-bl-[8px]  ${
              hasMatch ? "bg-[#4CB050]" : "bg-[#FF2121]"
            }`}
          >
            <Text
              className="text-[#ffffff] text-[12px] leading-[150%]  "
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {hasMatch ? "Available" : "Unavailable"}
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-[8px] px-[16px] pb-[16px]">
          <View className=" border-[#dadada80] border-b pb-2 flex w-full">
            <Text
              className="text-[#030319] text-[14px]   "
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {name}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-[12px]">
            <View className="flex flex-row items-center gap-[4px]">
              <View className="w-[4px] h-[4px] bg-[#424242] rounded-full"></View>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Diagnosis
              </Text>
            </View>
            <View className="flex flex-row items-center gap-[4px]">
              <View className="w-[4px] h-[4px] bg-[#424242] rounded-full"></View>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Prescriptions
              </Text>
            </View>
            <View className="flex flex-row items-center gap-[4px]">
              <View className="w-[4px] h-[4px] bg-[#424242] rounded-full"></View>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Counselling
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export const CallDoc = ({
  username,
  profilePicture,
  languageProficiency,
  doctorId,
  specialtyId,
}: {
  specialtyId: string;
  username: string;
  profilePicture: string;
  doctorId: string;
  languageProficiency: string[];
}) => {
  return (
    <Pressable
      className="border-[#DADADA80] border-[1px] p-[16px] rounded-[4px] bg-[#fffff0]"
      style={[styles.shadowProp]}
    >
      <View className=" flex flex-row gap-[16px] items-center ">
        <Image source={{ uri: profilePicture }} className="h-[80px] w-[80px]" />
        <View className="flex flex-col gap-[8px] flex-1">
          <View className=" border-[#dadada80] border-b pb-2 flex w-full ">
            <Text
              className="text-[#272757] text-[14px] leading-[20px]  capitalize"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              DR{username}
            </Text>
          </View>
          <View className="flex-row">
            {languageProficiency.map((tag, index) => (
              <React.Fragment key={index}>
                <Text className="text-[#272757] text-[12px] leading-[20px]">
                  {tag}
                </Text>
                {index < languageProficiency.length - 1 && (
                  <View className="w-px bg-gray-400 mx-2" />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
      <View className="flex items-end">
        <View className="py-[10px] border-[#dadada] border-[1px] rounded-[8px] px-[16px] gap-[16px] flex flex-row">
          <Pressable
            className="p-[8px] rounded-full bg-[##0E16FF]"
            onPress={() =>
              router.push(
                `/call?doctorId=${doctorId}&specialtyId=${specialtyId}&type=audio`
              )
            }
          >
            <Feather name="phone" size={16} color="white" />
          </Pressable>
          <View className="w-[1px] bg-[#DADADA80]"></View>
          <Pressable
            className="p-[8px] rounded-full bg-[##0E16FF] "
            onPress={() =>
              router.push(
                `/call?doctorId=${doctorId}&specialtyId=${specialtyId}&type=video`
              )
            }
          >
            <Feather name="video" size={16} color="white" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};
