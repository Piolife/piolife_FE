import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import Toast from "react-native-toast-message";

const Field = ({
  label,
  value,
  onChangeText,
  secure = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
}) => {
  const [show, setShow] = useState(false);
  return (
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
      <View style={{ position: "relative" }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !show}
          style={{
            borderWidth: 1.5,
            borderColor: "#E0E0E0",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 13,
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            color: "#272757",
            backgroundColor: "#fff",
            paddingRight: secure ? 48 : 14,
          }}
        />
        {secure && (
          <Pressable
            onPress={() => setShow((s) => !s)}
            style={{
              position: "absolute",
              right: 14,
              top: 14,
            }}
          >
            <Feather name={show ? "eye-off" : "eye"} size={18} color="#888" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const LoginSettings = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState<any>(null);
  React.useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const { postData, loading } = usePostData(
    `${API_URL}/api/v12/users/change-password`
  );

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      Toast.show({ type: "error", text1: "Fill all fields", position: "bottom" });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match", position: "bottom" });
      return;
    }
    if (form.newPassword.length < 6) {
      Toast.show({ type: "error", text1: "Password must be at least 6 characters", position: "bottom" });
      return;
    }
    try {
      await postData({
        userId: user?.id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      Toast.show({ type: "success", text1: "Password changed successfully", position: "bottom" });
      setTimeout(() => router.back(), 1200);
    } catch (err: any) {
      Toast.show({ type: "error", text1: err?.message ?? "Failed to change password", position: "bottom" });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fffff0"
        }}
    >
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
            paddingTop: Platform.OS === "android" ? 28 : 16,
            paddingBottom: 32,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
            <Feather name="arrow-left" size={24} color="#fffff0" />
          </Pressable>
          <Text
            style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: "#fffff0" }}
          >
            Login Settings
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "rgba(255,255,240,0.65)",
              marginTop: 4,
            }}
          >
            Change your account password
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
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
              label="Current Password"
              value={form.currentPassword}
              onChangeText={(v) => setForm((p) => ({ ...p, currentPassword: v }))}
              secure
            />
            <Field
              label="New Password"
              value={form.newPassword}
              onChangeText={(v) => setForm((p) => ({ ...p, newPassword: v }))}
              secure
            />
            <Field
              label="Confirm New Password"
              value={form.confirmPassword}
              onChangeText={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
              secure
            />

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: loading ? "#7B83FF" : "#0E16FF",
                borderRadius: 14,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              {loading ? (
                <ActivityIndicator color="#fffff0" />
              ) : (
                <Text
                  style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: "#fffff0" }}
                >
                  Save Password
                </Text>
              )}
            </Pressable>
          </View>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "#888",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Forgot your password? Use "Forgot Password" on the login screen.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginSettings;
