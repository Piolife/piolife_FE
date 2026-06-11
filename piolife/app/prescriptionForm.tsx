// app/prescriptionForm.tsx — Doctor fills consultation form after call (PRD spec)
import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import Toast from "react-native-toast-message";

const PrescriptionForm = () => {
  const { patientId, sessionId, medicalIssueId } = useLocalSearchParams<any>();
  const [form, setForm] = useState({
    complaint: "",
    diagnosis: "",
    prescription: "",
    advice: "",
    referral: "",
  });
  const { postData, loading } = usePostData(
    `${API_URL}/api/v12/sessions/prescriptions`,
    true
  );

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.complaint.trim() || !form.prescription.trim()) {
      Toast.show({
        type: "error",
        text1: "Required",
        text2: "Fill in Clerk (History Taking) and Prescription fields",
        position: "bottom",
      });
      return;
    }
    try {
      await postData({
        consultationId: sessionId,
        patientId,
        medicalIssueId,
        complaint: form.complaint,
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        advice: form.advice,
        referral: form.referral,
      });
      Toast.show({
        type: "success",
        text1: "Submitted!",
        text2: "Consultation saved to patient history",
        position: "bottom",
      });
      setTimeout(() => router.back(), 1200);
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message,
        position: "bottom",
      });
    }
  };

  const Field = ({
    label,
    value,
    onChangeText,
    placeholder,
    lines = 1,
  }: any) => (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          fontFamily: "Inter_500Medium",
          fontSize: 13,
          color: "#272757",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C0C0C0"
        multiline={lines > 1}
        numberOfLines={lines}
        style={{
          borderWidth: 1.5,
          borderColor: "#E0E0E0",
          borderRadius: 12,
          padding: 14,
          fontFamily: "Inter_400Regular",
          fontSize: 14,
          color: "#272757",
          minHeight: lines > 1 ? 80 : 52,
          textAlignVertical: lines > 1 ? "top" : "center",
          backgroundColor: "#fff",
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" />
      <Toast />

      <View
        style={{
          backgroundColor: "#272757",
          paddingTop: Platform.OS === "android" ? 28 : 12,
          paddingBottom: 36,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          Consultation Form
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.65)",
            marginTop: 6,
          }}
        >
          Submit report after call — stored in patient medical history
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 60,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          <Field
            label="Clerk (History Taking)"
            value={form.complaint}
            onChangeText={(v: string) => set("complaint", v)}
            placeholder="Patient's history and presenting complaints..."
            lines={4}
          />
          <Field
            label="Investigation"
            value={form.diagnosis}
            onChangeText={(v: string) => set("diagnosis", v)}
            placeholder="Investigations ordered and findings..."
            lines={3}
          />
          <Field
            label="Prescription"
            value={form.prescription}
            onChangeText={(v: string) => set("prescription", v)}
            placeholder="Drugs, dosage, frequency..."
            lines={4}
          />
          <Field
            label="Advice"
            value={form.advice}
            onChangeText={(v: string) => set("advice", v)}
            placeholder="Advice and follow-up instructions..."
            lines={3}
          />
          <Field
            label="Referral"
            value={form.referral}
            onChangeText={(v: string) => set("referral", v)}
            placeholder="Refer to specialist or facility..."
            lines={2}
          />

          <View
            style={{
              backgroundColor: "#FFF8E7",
              borderRadius: 10,
              padding: 12,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "#B45309",
              }}
            >
              ⚠️ Do not include patient personal contact info. NB: your doctor
              ID will be attached to this record automatically.
            </Text>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: "#272757",
              borderRadius: 14,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed || loading ? 0.85 : 1,
            })}
          >
            {loading ? (
              <ActivityIndicator color="#fffff0" />
            ) : (
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 16,
                  color: "#fffff0",
                }}
              >
                Submit Report
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrescriptionForm;
