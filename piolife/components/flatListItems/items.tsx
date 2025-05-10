import { router } from "expo-router";
import { View, Text, Pressable, Image } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { HealthIssueType } from "@/services/core/types";
const estateView = require("../../assets/images/Rectangle 12-2.png");
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
        {item.name === "General Practice" ? (
          <Text
            className={`text-[14px] leading-[150%] text-[#272757] `}
            style={{ fontFamily: "Inter_500Medium" }}
          >
            {item.name}
          </Text>
        ) : (
          <Image
            className="h-[32px] w-[32px]"
            source={
              typeof item.image === "string" ? { uri: item.image } : item.image
            }
          />
        )}
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
