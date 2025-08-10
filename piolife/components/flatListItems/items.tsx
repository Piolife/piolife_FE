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
export const DrugSold = ({ amount, percentage }: DrugSoldType) => {
  return (
    <View className=" border-[#DADADA80] border-b-[1px] p-[16px] flex flex-row gap-[16px] items-center mb-2">
      <View className="flex flex-row gap-[8px] items-center justify-between w-full">
        <View className="flex flex-row items-center gap-2">
          <Image source={piocoin} style={{ width: 10, height: 20 }} />
          <Text
            className="text-[#272757] text-[16px] leading-[20px]  uppercase"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {formatNumberToThousands(amount)}
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
const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
