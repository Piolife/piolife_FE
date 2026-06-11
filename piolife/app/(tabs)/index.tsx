import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import {
  ClientMenu,
  ClientScreen,
  DoctorScreen,
  Stat,
  formatNumberToThousands,
} from "@/components/reusables";
import { useFetchData } from "@/services/api/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, wallet } from "@/services/core/types";
import { API_URL } from "@/constants/api";

const Index = () => {
  const [user, SetUser] = useState<User>();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        SetUser(parsed);
      }
    };
    loadUser();
    AsyncStorage.setItem("hasLaunched", "launched");
  }, []);

  const token = user?.token;

  const { data, loading, error } = useFetchData<User>(
    user ? `${API_URL}/api/v12/users/${user.id}` : "",
    { token }
  );

  const {
    data: walletData,
    loading: isLoading,
  } = useFetchData<wallet>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

  const { data: emergencyData } = useFetchData<any>(
    user?.role === "emergency_services"
      ? `${API_URL}/api/v12/emergency-stock/emergencies/${user.id}`
      : "",
    { token }
  );

  // Fetch real consultations for doctors
  const { data: consultations } = useFetchData<any[]>(
    user?.role === "medical_practitioner"
      ? `${API_URL}/api/v12/sessions/consultations/practitioner/${user.id}`
      : "",
    { token }
  );

  // Fetch recent consultations for clients
  const { data: clientConsultations } = useFetchData<any[]>(
    user?.role === "client"
      ? `${API_URL}/api/v12/sessions/consultations/user/${user.id}`
      : "",
    { token }
  );

  if (error) {
    Alert.alert(String(error));
  }

  if (loading || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0E16FF" />
      </View>
    );
  }

  const isProvider =
    user?.role &&
    ["medical_practitioner", "emergency_services", "pharmacy_services", "medical_lab_services"].includes(user.role);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingHorizontal: "4%", paddingTop: 24, gap: 24 }}>
          {/* Top bar: greeting + notification */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
              {data ? (
                <Image
                  source={{
                    uri: ["emergency_services", "pharmacy_services", "medical_lab_services"].includes(data?.role ?? "")
                      ? data?.logo
                      : data?.profilePicture,
                  }}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                />
              ) : (
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: "#EEF0FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome name="user" size={28} color="#0E16FF" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontFamily: "Inter_500Medium", fontSize: 16, color: "#030319" }}
                >
                  Hi,{" "}
                  {data?.role === "pharmacy_services"
                    ? data?.pharmacyName
                    : data?.role === "medical_lab_services"
                    ? data?.medicalLabName
                    : data?.firstName ?? "there"}
                </Text>
                <Text
                  style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#666" }}
                >
                  ID: {data?.username}
                </Text>
              </View>
            </View>
            <Pressable
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "rgba(39,39,87,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Octicons name="bell" size={20} color="#272757" />
            </Pressable>
          </View>

          {/* Client: quick action bar */}
          {user?.role === "client" && (
            <>
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 18, color: "#272757" }}>
                Actions
              </Text>
              <ClientScreen />
            </>
          )}

          {/* Provider: wallet card */}
          {isProvider && (
            <DoctorScreen balance={formatNumberToThousands(walletData?.balance ?? 0)} />
          )}

          {/* Doctor: stats + dashboard shortcut */}
          {user?.role === "medical_practitioner" && (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Stat
                  text="Consultations"
                  serve={consultations?.length ?? 0}
                />
                <Pressable
                  onPress={() => router.push("/doctorDashboard")}
                  style={({ pressed }) => ({
                    flex: 1,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "rgba(165,165,165,0.4)",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    opacity: pressed ? 0.85 : 1,
                    shadowColor: "#171717",
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 2,
                  })}
                >
                  <View style={{ gap: 4 }}>
                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#030319" }}>
                      Full Dashboard
                    </Text>
                    <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#888" }}>
                      Reports & earnings
                    </Text>
                  </View>
                  <Feather name="arrow-right" size={18} color="#0E16FF" />
                </Pressable>
              </View>
            </View>
          )}

          {/* Pharmacy: action buttons */}
          {user?.role === "pharmacy_services" && (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {[
                  { label: "Services", route: "/pharmServices" },
                  { label: "Drugs", route: "/drugs" },
                  { label: "Add Drug", route: "/addDrug" },
                ].map((btn) => (
                  <Pressable
                    key={btn.route}
                    onPress={() => router.push(btn.route as any)}
                    style={({ pressed }) => ({
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#0E16FF",
                      height: 40,
                      paddingHorizontal: 16,
                      backgroundColor: "#0E16FF",
                      width: "30%",
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Text
                      style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#fff" }}
                    >
                      {btn.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Stat text="Served" serve={data?.consultationCount} />
            </View>
          )}

          {/* Medical lab: action buttons */}
          {user?.role === "medical_lab_services" && (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {[
                  { label: "Services", route: "/medlabServices" },
                  { label: "Tests", route: "/tests" },
                  { label: "Add Test", route: "/addTest" },
                ].map((btn) => (
                  <Pressable
                    key={btn.route}
                    onPress={() => router.push(btn.route as any)}
                    style={({ pressed }) => ({
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#0E16FF",
                      height: 40,
                      paddingHorizontal: 16,
                      backgroundColor: "#0E16FF",
                      width: "30%",
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Text
                      style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#fff" }}
                    >
                      {btn.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Stat text="Served" serve={data?.consultationCount ?? 0} />
            </View>
          )}

          {/* Emergency services */}
          {user?.role === "emergency_services" && (
            <View style={{ flexDirection: "row" }}>
              <Stat
                text="Served"
                serve={emergencyData?.length}
                onPress={() => router.push("/emergencyServices")}
              />
            </View>
          )}

          {/* Client: activity menu */}
          {user?.role === "client" && <ClientMenu />}

          {/* Client: recent consultations */}
          {user?.role === "client" && (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 18, color: "#272757" }}>
                  Recent Consultations
                </Text>
                <Pressable onPress={() => router.push("/recentConsultations")}>
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#0E16FF" }}>
                    View all
                  </Text>
                </Pressable>
              </View>
              {!clientConsultations || clientConsultations.length === 0 ? (
                <Pressable
                  onPress={() => router.push("/recentConsultations")}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 20,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#E8E8E8",
                  }}
                >
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#888" }}>
                    No consultations yet
                  </Text>
                </Pressable>
              ) : (
                clientConsultations.slice(0, 3).map((item: any) => (
                  <Pressable
                    key={item._id}
                    onPress={() => router.push("/recentConsultations")}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: "#E8E8E8",
                    }}
                  >
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#272757" }}>
                        {item.issues?.join(", ") ?? "Consultation"}
                      </Text>
                      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#888" }}>
                        {item.callType === "video" ? "📹 Video" : "📞 Voice"} · {item.language ?? "English"}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 4 }}>
                      <View style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 20,
                        backgroundColor: item.status === "completed" ? "#DCFCE7" : "#FEF9C3",
                      }}>
                        <Text style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 11,
                          color: item.status === "completed" ? "#16A34A" : "#CA8A04",
                        }}>
                          {item.status === "completed" ? "Done" : "Pending"}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={16} color="#0E16FF" />
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {/* Doctor: recent consultations from API */}
          {user?.role === "medical_practitioner" && (
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 18, color: "#272757" }}>
                  Recent Consultations
                </Text>
                <Pressable onPress={() => router.push("/doctorDashboard")}>
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#0E16FF" }}>
                    View all
                  </Text>
                </Pressable>
              </View>
              {!consultations || consultations.length === 0 ? (
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 20,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#888" }}>
                    No consultations yet
                  </Text>
                </View>
              ) : (
                <FlatList
                  scrollEnabled={false}
                  data={consultations.slice(0, 5)}
                  keyExtractor={(item) => item._id ?? String(Math.random())}
                  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[
                        {
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: "rgba(218,218,218,0.5)",
                          padding: 16,
                          flexDirection: "row",
                          gap: 16,
                          alignItems: "center",
                          backgroundColor: "#fff",
                          justifyContent: "space-between",
                        },
                        styles.shadowProp,
                      ]}
                    >
                      <View style={{ gap: 4 }}>
                        <Text
                          style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#272757" }}
                        >
                          {item.patientName ?? item.userId ?? "Patient"}
                        </Text>
                        <Text
                          style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#888" }}
                        >
                          {item.callType === "video" ? "📹 Video call" : "📞 Audio call"}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={20} color="#0E16FF" />
                    </Pressable>
                  )}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default Index;
