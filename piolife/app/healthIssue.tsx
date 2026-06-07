import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { router } from "expo-router";
import { SelectSickness } from "@/components/flatListItems/items";
import { useFetchData } from "@/services/api/request";
import { HealthIssueType } from "@/services/core/types";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";

const HealthIssue = () => {
  const [selectedId, setSelectedId] = useState<string>("English");
  const [callType, setCallType] = useState<"video" | "voice">("video");

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      { id: "English", label: "English", value: "English" },
      { id: "Yoruba", label: "Yoruba", value: "Yoruba" },
      { id: "Igbo", label: "Igbo", value: "Igbo" },
      { id: "Hausa", label: "Hausa", value: "Hausa" },
    ],
    []
  );

  const handlePrevious = () => {
    router.back();
  };

  const {
    data: newdata,
    loading: isloading,
  } = useFetchData<any>(`${API_URL}/api/v12/medical-issues`);

  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [othersText, setOthersText] = useState("");
  const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
  const isDisabled = !Object.values(selectedItems).some((value) => value);

  const selectedIds = Object.keys(selectedItems).filter((id) => selectedItems[id]);
  const selectedCount = selectedIds.length;

  const totalCost = selectedIds.reduce((sum, id) => {
    const item = newdata?.find((item: any) => item._id === id);
    return item ? sum + item.price : sum;
  }, 0);

  const handleNext = () => {
    const selectedArray = newdata?.filter(
      (item: HealthIssueType) => selectedItems[item._id]
    );
    const issueNames = selectedArray?.map((item: HealthIssueType) =>
      item.name === "Others" && othersText.trim()
        ? `Others (${othersText.trim()})`
        : item.name
    );
    const issueIds = selectedArray?.map((item: HealthIssueType) => item._id);

    router.push(
      `/pay4Consultation?issues=${encodeURIComponent(
        JSON.stringify(issueNames)
      )}&issueIds=${encodeURIComponent(
        JSON.stringify(issueIds)
      )}&callType=${callType}&language=${selectedId}`
    );
  };

  const toggleSelect = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  if (isloading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0E16FF" />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#fffff0" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 28 : 12,
          paddingBottom: 28,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Pressable onPress={handlePrevious} style={{ marginBottom: 16 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 24,
            color: "#fffff0",
          }}
        >
          What's the issue?
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          Select all that apply — multiple allowed
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Language selection */}
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#272757",
              marginBottom: 10,
            }}
          >
            Preferred Language
          </Text>
          <RadioGroup
            layout="row"
            containerStyle={{ flexWrap: "wrap", rowGap: 8 }}
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
          />
        </View>

        {/* Call type toggle */}
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#272757",
              marginBottom: 10,
            }}
          >
            Call Type
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={() => setCallType("video")}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: callType === "video" ? "#0E16FF" : "#fff",
                borderWidth: 1.5,
                borderColor: callType === "video" ? "#0E16FF" : "#E0E0E0",
              }}
            >
              <Feather
                name="video"
                size={18}
                color={callType === "video" ? "#fffff0" : "#272757"}
              />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: callType === "video" ? "#fffff0" : "#272757",
                }}
              >
                Video
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setCallType("voice")}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: callType === "voice" ? "#0E16FF" : "#fff",
                borderWidth: 1.5,
                borderColor: callType === "voice" ? "#0E16FF" : "#E0E0E0",
              }}
            >
              <Feather
                name="phone"
                size={18}
                color={callType === "voice" ? "#fffff0" : "#272757"}
              />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: callType === "voice" ? "#fffff0" : "#272757",
                }}
              >
                Voice
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Selection count + cost bar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "#666",
            }}
          >
            {selectedCount} selected
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Image source={piocoin} style={{ width: 10, height: 20 }} />
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: "#272757",
              }}
            >
              {formatNumberToThousands(totalCost)}
            </Text>
          </View>
        </View>

        {/* Issues list */}
        <FlatList
          data={newdata}
          renderItem={({ item }) => (
            <SelectSickness
              item={item}
              selected={!!(item._id && selectedItems[item._id])}
              onPress={() => item._id && toggleSelect(item._id)}
              othersText={item.name === "Others" ? othersText : undefined}
              onOthersTextChange={item.name === "Others" ? setOthersText : undefined}
            />
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginHorizontal: 4,
            columnGap: 12,
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Pressable
              disabled={isDisabled}
              style={{
                height: 56,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 16,
                marginBottom: 24,
                backgroundColor: isDisabled ? "#aaaaaa" : "#0E16FF",
                shadowColor: "#0E16FF",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDisabled ? 0 : 0.25,
                shadowRadius: 10,
                elevation: isDisabled ? 0 : 5,
              }}
              onPress={handleNext}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 16,
                  color: "#fffff0",
                }}
              >
                Next →
              </Text>
            </Pressable>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffff0",
  },
});

export default HealthIssue;
