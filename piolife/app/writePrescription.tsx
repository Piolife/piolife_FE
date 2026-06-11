/**
 * app/writePrescription.tsx — NEW SCREEN
 *
 * Doctor fills: Complaint, Diagnosis, Prescription, Prognosis, Referral
 * after a consultation. Per prototype: "doctors report will appear on screen"
 * This is also accessible to patients to VIEW their report.
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { usePostData, useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  readOnly = false,
}: any) => (
  <View style={{ marginBottom: 16 }}>
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
      multiline={multiline}
      editable={!readOnly}
      style={{
        borderWidth: 1.5,
        borderColor: readOnly ? "#F0F0F0" : "#E0E0E0",
        borderRadius: 12,
        backgroundColor: readOnly ? "#FAFAFA" : "#fff",
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontFamily: "Inter_400Regular",
        fontSize: 15,
        color: "#272757",
        minHeight: multiline ? 80 : 48,
        textAlignVertical: multiline ? "top" : "center",
      }}
    />
  </View>
);

const WritePrescription = () => {
  const { consultationId, patientId } = useLocalSearchParams<{
    consultationId: string;
    patientId: string;
  }>();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    complaint: "",
    diagnosis: "",
    prescription: "",
    prognosis: "",
    referral: "",
  });

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;
  const isDoctor = user?.role === "medical_practitioner";

  // Fetch existing prescription if already written
  const { data: existing, loading: loadingExisting } = useFetchData<any>(
    user
      ? `${API_URL}/api/v12/sessions/prescriptions/user/${patientId ?? user.id}`
      : "",
    { token }
  );

  useEffect(() => {
    if (existing && Array.isArray(existing) && existing.length > 0) {
      // Find the one for this consultation
      const match =
        existing.find((p: any) => p.consultationId === consultationId) ??
        existing[existing.length - 1];
      if (match) {
        setForm({
          complaint: match.complaint ?? "",
          diagnosis: match.diagnosis ?? "",
          prescription: match.prescription ?? "",
          prognosis: match.prognosis ?? "",
          referral: match.referral ?? "",
        });
      }
    }
  }, [existing]);

  const { loading: submitting, postData } = usePostData(
    `${API_URL}/api/v12/sessions/prescriptions`
  );

  const handleSubmit = async () => {
    if (!form.complaint || !form.diagnosis || !form.prescription) {
      Toast.show({
        type: "error",
        text1: "Fill required fields",
        text2: "Clerk (History Taking) and Prescription are required.",
        position: "bottom",
      });
      return;
    }
    try {
      await postData({
        ...form,
        consultationId,
        patientId,
        practitionerId: user?.id,
      });
      Toast.show({
        type: "success",
        text1: "Report saved!",
        text2: "Prescription stored in patient's medical history.",
        position: "bottom",
      });
      setTimeout(() => router.back(), 1200);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed to save",
        text2: err?.message,
        position: "bottom",
      });
    }
  };

  if (loadingExisting) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0E16FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <Toast />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#272757",
            paddingTop: Platform.OS === "android" ? 30 : 16,
            paddingBottom: 28,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
            <Feather name="arrow-left" size={24} color="#fffff0" />
          </Pressable>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 22,
              color: "#fffff0",
            }}
          >
            {isDoctor ? "Consultation Report" : "My Prescription"}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "rgba(255,255,240,0.65)",
              marginTop: 4,
            }}
          >
            {isDoctor
              ? "Fill in patient's report below"
              : "Report from your doctor"}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
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
              label="Clerk (History Taking) *"
              value={form.complaint}
              onChangeText={(v: string) =>
                setForm((p) => ({ ...p, complaint: v }))
              }
              placeholder="Patient's history and presenting complaints..."
              multiline
              readOnly={!isDoctor}
            />
            <Field
              label="Investigation"
              value={form.diagnosis}
              onChangeText={(v: string) =>
                setForm((p) => ({ ...p, diagnosis: v }))
              }
              placeholder="Investigations ordered and findings..."
              multiline
              readOnly={!isDoctor}
            />
            <Field
              label="Prescription *"
              value={form.prescription}
              onChangeText={(v: string) =>
                setForm((p) => ({ ...p, prescription: v }))
              }
              placeholder="Prescribed medications and dosage..."
              multiline
              readOnly={!isDoctor}
            />
            <Field
              label="Advice"
              value={form.prognosis}
              onChangeText={(v: string) =>
                setForm((p) => ({ ...p, prognosis: v }))
              }
              placeholder="Advice and follow-up instructions..."
              multiline
              readOnly={!isDoctor}
            />
            <Field
              label="Referral"
              value={form.referral}
              onChangeText={(v: string) =>
                setForm((p) => ({ ...p, referral: v }))
              }
              placeholder="Referral to specialist or facility..."
              multiline
              readOnly={!isDoctor}
            />

            {isDoctor && (
              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                style={({ pressed }) => ({
                  backgroundColor: submitting ? "#7B83FF" : "#0E16FF",
                  borderRadius: 14,
                  height: 56,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.9 : 1,
                  marginTop: 8,
                  shadowColor: "#0E16FF",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                })}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 16,
                    color: "#fffff0",
                  }}
                >
                  {submitting ? "Saving…" : "Submit Report"}
                </Text>
              </Pressable>
            )}

            {/* Patient action buttons — go to pharmacy/lab after viewing prescription */}
            {!isDoctor && (
              <View style={{ gap: 12, marginTop: 16 }}>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    color: "#272757",
                    marginBottom: 4,
                  }}
                >
                  Next Steps
                </Text>
                <Pressable
                  onPress={() => router.push("/nearbyPharmacy")}
                  style={{
                    backgroundColor: "#0E16FF",
                    borderRadius: 12,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#fffff0",
                    }}
                  >
                    💊 Get Medication at Pharmacy
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push("/nearbyMedlab")}
                  style={{
                    backgroundColor: "#272757",
                    borderRadius: 12,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#fffff0",
                    }}
                  >
                    🔬 Book Diagnostic Tests
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WritePrescription;
