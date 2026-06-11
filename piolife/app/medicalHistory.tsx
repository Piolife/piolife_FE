/**
 * app/medicalHistory.tsx — REWRITTEN
 *
 * Per prototype: History arranged by year (green = has records, grey = none).
 * Clicking year shows months with records. Clicking month shows full details.
 * Doctor's report accessible to lab within 2hrs (access logic on backend).
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const groupByYear = (records: any[]) => {
  const map: Record<number, Record<number, any[]>> = {};
  records.forEach((r) => {
    const d = new Date(r.createdAt);
    const yr = d.getFullYear();
    const mo = d.getMonth();
    if (!map[yr]) map[yr] = {};
    if (!map[yr][mo]) map[yr][mo] = [];
    map[yr][mo].push(r);
  });
  return map;
};

const MedicalHistory = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;
  const { data, loading } = useFetchData<any[]>(
    user ? `${API_URL}/api/v12/sessions/prescriptions/user/${user.id}` : "",
    { token }
  );

  const grouped = data ? groupByYear(data) : {};
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);
  const currentYear = new Date().getFullYear();
  const allYears = Array.from(
    new Set([...years, currentYear, currentYear - 1, currentYear - 2])
  ).sort((a, b) => b - a);

  const monthsForYear = selectedYear ? grouped[selectedYear] ?? {} : {};
  const recordsForMonth =
    selectedYear !== null && selectedMonth !== null
      ? grouped[selectedYear]?.[selectedMonth] ?? []
      : [];

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0E16FF" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 32,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Pressable
          onPress={() =>
            selectedRecord
              ? setSelectedRecord(null)
              : selectedMonth !== null
              ? setSelectedMonth(null)
              : selectedYear
              ? setSelectedYear(null)
              : router.back()
          }
          style={{ marginBottom: 20 }}
        >
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 24,
            color: "#fffff0",
          }}
        >
          Medical History
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.65)",
            marginTop: 4,
          }}
        >
          Your consultation and prescription records
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* LEVEL 1: Year grid */}
        {!selectedYear && (
          <>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#272757",
                marginBottom: 16,
              }}
            >
              Select a Year
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {allYears.map((yr) => {
                const hasData = !!grouped[yr];
                return (
                  <Pressable
                    key={yr}
                    disabled={!hasData}
                    onPress={() => {
                      setSelectedYear(yr);
                      setSelectedMonth(null);
                    }}
                    style={({ pressed }) => ({
                      width: "30%",
                      height: 52,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: hasData ? "#0E16FF" : "#E5E5E5",
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 15,
                        color: hasData ? "#fffff0" : "#999",
                      }}
                    >
                      {yr}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {years.length === 0 && (
              <View style={{ marginTop: 40, alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 15,
                    color: "#888",
                  }}
                >
                  No medical history found.
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 13,
                    color: "#AAA",
                    marginTop: 6,
                  }}
                >
                  Your consultation records will appear here.
                </Text>
              </View>
            )}
          </>
        )}

        {/* LEVEL 2: Months for selected year */}
        {selectedYear && selectedMonth === null && (
          <>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#272757",
                marginBottom: 16,
              }}
            >
              {selectedYear} — Select a Month
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {MONTHS.map((mo, idx) => {
                const hasData = !!monthsForYear[idx];
                return (
                  <Pressable
                    key={idx}
                    disabled={!hasData}
                    onPress={() => setSelectedMonth(idx)}
                    style={({ pressed }) => ({
                      width: "30%",
                      height: 44,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: hasData ? "#272757" : "#E5E5E5",
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: hasData ? "#fffff0" : "#999",
                      }}
                    >
                      {mo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* LEVEL 3: Records for selected month */}
        {selectedYear !== null && selectedMonth !== null && !selectedRecord && (
          <>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#272757",
                marginBottom: 16,
              }}
            >
              {MONTHS[selectedMonth]} {selectedYear} — Records
            </Text>
            {recordsForMonth.length === 0 ? (
              <Text style={{ fontFamily: "Inter_400Regular", color: "#888" }}>
                No records this month.
              </Text>
            ) : (
              recordsForMonth.map((r: any, i: number) => (
                <Pressable
                  key={r._id ?? i}
                  onPress={() => setSelectedRecord(r)}
                  style={({ pressed }) => ({
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    shadowColor: "#272757",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                    opacity: pressed ? 0.92 : 1,
                  })}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 15,
                      color: "#272757",
                    }}
                  >
                    {new Date(r.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                    })}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      color: "#666",
                      marginTop: 4,
                    }}
                  >
                    Diagnosis: {r.diagnosis ?? "—"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginTop: 6,
                    }}
                  >
                    <Feather name="chevron-right" size={16} color="#0E16FF" />
                  </View>
                </Pressable>
              ))
            )}
          </>
        )}

        {/* LEVEL 4: Full record detail */}
        {selectedRecord && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 17,
                color: "#272757",
                marginBottom: 16,
              }}
            >
              {new Date(selectedRecord.createdAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            {[
              { label: "Complaint", value: selectedRecord.complaint },
              { label: "Diagnosis", value: selectedRecord.diagnosis },
              { label: "Prescription", value: selectedRecord.prescription },
              { label: "Prognosis", value: selectedRecord.prognosis },
              { label: "Referral", value: selectedRecord.referral },
            ].map(({ label, value }) =>
              value ? (
                <View key={label} style={{ marginBottom: 14 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 12,
                      color: "#888",
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                    }}
                  >
                    {label}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: "#272757",
                      lineHeight: 20,
                    }}
                  >
                    {value}
                  </Text>
                </View>
              ) : null
            )}
            {/* Post-consultation actions */}
            <View style={{ gap: 10, marginTop: 16 }}>
              <Pressable
                onPress={() => router.push("/nearbyPharmacy")}
                style={{
                  backgroundColor: "#0E16FF",
                  borderRadius: 12,
                  height: 46,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 13,
                    color: "#fffff0",
                  }}
                >
                  💊 Get Prescription at Pharmacy
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/nearbyMedlab")}
                style={{
                  backgroundColor: "#272757",
                  borderRadius: 12,
                  height: 46,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 13,
                    color: "#fffff0",
                  }}
                >
                  🔬 Book Diagnostic Test
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicalHistory;
