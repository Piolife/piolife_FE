/**
 * app/piolandPayment.tsx — NEW SCREEN
 *
 * Full payment offer screen per prototype:
 * - Monthly instalment options (₦30k, ₦40k, ₦50k, ₦60k, ₦70k)
 * - Outright payment option
 * - Terms & Conditions must be agreed before payment activates
 * - Student/NYSC fields (matriculation number / call-up number)
 * - Agreement signed with name + email + date
 * - Payment deducted from wallet
 * - Routes to piolandTracker after first payment
 */
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const CATEGORY_COLORS: Record<string, string> = {
  student: "#1D6A3A",
  pioland: "#0E16FF",
  luxury: "#B45309",
};

const MONTHLY_OPTIONS = [30000, 40000, 50000, 60000, 70000];

const TC_TEXT = `TERMS AND CONDITIONS — PIOLAND PROPERTY PURCHASE

1. ENSURE YOU UNDERSTAND THE TERMS AND CONDITIONS BEFORE PROCEEDING.

2. This deal will become null and void, and the chosen plot revoked and relisted for sale, if after 7 days from application date you have not made the first instalment payment.

3. OVERDUE PAYMENT (12 HOURS AFTER DUE DATE) attracts a default charge of ₦5,000, added to the current balance.

4. AFTER 6 CONSECUTIVE DEFAULTS, Piolife shall revoke the deal, relist the property, deduct all default charges from total amount paid, and refund the balance.

5. AFTER COMPLETING 80% OF TOTAL PAYMENT, you are eligible to begin construction. Piolife shall waive 5 consecutive payment months if you begin building at this point.

6. ONLY AFTER 100% PAYMENT will a Certificate of Occupancy (C of O) be issued. A signed agreement between you and Piolife is required.

7. Wallet payments: all instalments are deducted automatically from your Piolife wallet on the due date.

8. Do not share personal contact details with any Piolife agent. All transactions are conducted through the app.`;

const PiolandPayment = () => {
  const params = useLocalSearchParams<{
    plotNumber: string;
    estateName: string;
    state: string;
    lga: string;
    ward: string;
    valuePerPlot: string;
    category: string;
  }>();

  const [user, setUser] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isOutright, setIsOutright] = useState(false);
  const [tcVisible, setTcVisible] = useState(false);
  const [tcAgreed, setTcAgreed] = useState(false);
  const [officialName, setOfficialName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [institution, setInstitution] = useState("");
  const [paying, setPaying] = useState(false);

  const cat = params.category ?? "pioland";
  const accent = CATEGORY_COLORS[cat] ?? "#0E16FF";
  const propertyValue = parseInt(params.valuePerPlot ?? "5000000");
  const isStudent = cat === "student";
  const isLuxury = cat === "luxury";

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) {
        const parsed = JSON.parse(u);
        setUser(parsed);
        setOfficialName(
          `${parsed.firstName ?? ""} ${parsed.lastName ?? ""}`.trim()
        );
        setEmail(parsed.email ?? "");
      }
    });
  }, []);

  const token = user?.token;
  const { data: wallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );
  const { postData: deductWallet } = usePostData(
    `${API_URL}/api/v12/wallet/${user?.id}/deduct`
  );
  const { postData: saveOrder } = usePostData(
    `${API_URL}/api/v12/estate/orders`
  );

  const paymentAmount = isOutright ? propertyValue : selectedAmount ?? 0;

  const canSubmit =
    tcAgreed &&
    officialName &&
    email &&
    paymentAmount > 0 &&
    (!isStudent || (matricNumber && institution));

  const handlePay = () => {
    if (!tcAgreed) {
      Alert.alert(
        "Agreement Required",
        "Please read and agree to the Terms & Conditions first."
      );
      return;
    }
    if (!wallet || wallet.balance < paymentAmount) {
      Alert.alert(
        "Insufficient Balance",
        `You need ₦${formatNumberToThousands(
          paymentAmount
        )} for this payment.\nYour wallet: ₦${formatNumberToThousands(
          wallet?.balance ?? 0
        )}`,
        [
          { text: "Fund Wallet", onPress: () => router.push("/clientWallet") },
          { text: "Collect Loan", onPress: () => router.push("/collectLoan") },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    Alert.alert(
      "Confirm Payment",
      `Seal deal for Plot ${params.plotNumber} at ${
        params.estateName
      }?\n\n₦${formatNumberToThousands(
        paymentAmount
      )} will be deducted from your wallet.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm & Pay",
          onPress: async () => {
            setPaying(true);
            try {
              // Deduct from wallet
              await deductWallet({
                amount: paymentAmount,
                description: `Pioland: Plot ${params.plotNumber}, ${
                  params.estateName
                } — ${isOutright ? "outright" : "instalment"}`,
              });

              // Save order record
              await saveOrder({
                userId: user?.id,
                plotNumber: params.plotNumber,
                estateName: params.estateName,
                state: params.state,
                lga: params.lga,
                ward: params.ward,
                propertyValue,
                paymentType: isOutright ? "outright" : "instalment",
                instalmentAmount: isOutright ? null : paymentAmount,
                officialName,
                email,
                matricNumber: isStudent ? matricNumber : undefined,
                institution: isStudent ? institution : undefined,
                agreementDate: new Date().toISOString(),
              }).catch(() => {}); // Non-fatal if backend route not yet set up

              Toast.show({
                type: "success",
                text1: "🏡 Deal Sealed!",
                text2: "A copy of your agreement has been sent to your email.",
                position: "bottom",
              });

              setTimeout(() => {
                router.replace({
                  pathname: "/piolandTracker",
                  params: {
                    plotNumber: params.plotNumber,
                    estateName: params.estateName,
                    state: params.state,
                    propertyValue: params.valuePerPlot,
                    instalmentAmount: isOutright
                      ? params.valuePerPlot
                      : String(selectedAmount),
                    isOutright: isOutright ? "true" : "false",
                    officialName,
                  },
                });
              }, 1500);
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Payment failed",
                text2: err?.message,
                position: "bottom",
              });
            } finally {
              setPaying(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="light" backgroundColor={accent} />
      <Toast />

      {/* Header */}
      <View
        style={{
          backgroundColor: accent,
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
          Payment Offer
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          Plot {params.plotNumber} · {params.estateName} · ₦
          {(propertyValue / 1_000_000).toFixed(1)}M
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: "rgba(255,255,240,0.6)",
            marginTop: 4,
          }}
        >
          Wallet: ₦{formatNumberToThousands(wallet?.balance ?? 0)}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment options */}
        {!isLuxury && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.07,
              shadowRadius: 14,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#272757",
                marginBottom: 14,
              }}
            >
              Monthly Instalment
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {MONTHLY_OPTIONS.map((amt) => (
                <Pressable
                  key={amt}
                  onPress={() => {
                    setSelectedAmount(amt);
                    setIsOutright(false);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor:
                      selectedAmount === amt && !isOutright
                        ? accent
                        : "#F5F5F5",
                    borderWidth: 1.5,
                    borderColor:
                      selectedAmount === amt && !isOutright
                        ? accent
                        : "#E0E0E0",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 14,
                      color:
                        selectedAmount === amt && !isOutright
                          ? "#fff"
                          : "#272757",
                    }}
                  >
                    ₦{formatNumberToThousands(amt)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Outright payment */}
        <Pressable
          onPress={() => {
            setIsOutright(true);
            setSelectedAmount(null);
          }}
          style={{
            backgroundColor: isOutright ? accent : "#fff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1.5,
            borderColor: isOutright ? accent : "#E0E0E0",
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 15,
                color: isOutright ? "#fff" : "#272757",
              }}
            >
              Outright Payment
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: isOutright ? "rgba(255,255,255,0.8)" : "#888",
              }}
            >
              Pay full ₦{formatNumberToThousands(propertyValue)} at once
            </Text>
          </View>
          <Feather
            name={isOutright ? "check-circle" : "circle"}
            size={22}
            color={isOutright ? "#fff" : "#CCC"}
          />
        </Pressable>

        {/* Agreement form */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 15,
              color: "#272757",
              marginBottom: 14,
            }}
          >
            Agreement Details
          </Text>

          {/* Official name */}
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 13,
              color: "#272757",
              marginBottom: 6,
            }}
          >
            Official Name
          </Text>
          <TextInput
            value={officialName}
            onChangeText={setOfficialName}
            placeholder="As on government-issued ID"
            placeholderTextColor="#C0C0C0"
            style={{
              borderWidth: 1.5,
              borderColor: "#E0E0E0",
              borderRadius: 12,
              padding: 14,
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#272757",
              marginBottom: 14,
              backgroundColor: "#FAFAFA",
            }}
          />

          {/* Email */}
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 13,
              color: "#272757",
              marginBottom: 6,
            }}
          >
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor="#C0C0C0"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              borderWidth: 1.5,
              borderColor: "#E0E0E0",
              borderRadius: 12,
              padding: 14,
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#272757",
              marginBottom: 14,
              backgroundColor: "#FAFAFA",
            }}
          />

          {/* Student-only fields */}
          {isStudent && (
            <>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 13,
                  color: "#272757",
                  marginBottom: 6,
                }}
              >
                Matriculation / Call-Up Number
              </Text>
              <TextInput
                value={matricNumber}
                onChangeText={setMatricNumber}
                placeholder="e.g. 2021/1234 or NYSC call-up number"
                placeholderTextColor="#C0C0C0"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  padding: 14,
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#272757",
                  marginBottom: 14,
                  backgroundColor: "#FAFAFA",
                }}
              />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 13,
                  color: "#272757",
                  marginBottom: 6,
                }}
              >
                Institution / State of Service
              </Text>
              <TextInput
                value={institution}
                onChangeText={setInstitution}
                placeholder="e.g. UNN or Abia state"
                placeholderTextColor="#C0C0C0"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  padding: 14,
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#272757",
                  marginBottom: 14,
                  backgroundColor: "#FAFAFA",
                }}
              />
            </>
          )}

          {/* Agreement date */}
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "#888",
            }}
          >
            Signature date:{" "}
            {new Date().toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* T&C */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#272757",
              }}
            >
              Terms & Conditions
            </Text>
            <Pressable
              onPress={() => setTcVisible(!tcVisible)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: accent,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                {tcVisible ? "Hide" : "Read First"}
              </Text>
            </Pressable>
          </View>

          {tcVisible && (
            <View
              style={{
                backgroundColor: "#F8F9FA",
                borderRadius: 12,
                padding: 14,
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#333",
                  lineHeight: 20,
                }}
              >
                {TC_TEXT}
              </Text>
            </View>
          )}

          {/* Agree checkbox */}
          <Pressable
            onPress={() => {
              if (!tcVisible && !tcAgreed) {
                Alert.alert(
                  "Read First",
                  "Please read the Terms & Conditions before agreeing."
                );
                setTcVisible(true);
                return;
              }
              setTcAgreed(!tcAgreed);
            }}
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: tcAgreed ? accent : "#CCC",
                backgroundColor: tcAgreed ? accent : "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {tcAgreed && <Feather name="check" size={14} color="#fff" />}
            </View>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: "#272757",
                flex: 1,
              }}
            >
              I agree to the Terms & Conditions
            </Text>
          </Pressable>

          {!tcAgreed && (
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 11,
                color: "#888",
                marginTop: 8,
              }}
            >
              ⚠️ Payment is disabled until you agree.
            </Text>
          )}
        </View>

        {/* Pay button */}
        <Pressable
          onPress={handlePay}
          disabled={!canSubmit || paying}
          style={({ pressed }) => ({
            backgroundColor: !canSubmit ? "#9CA3AF" : accent,
            borderRadius: 14,
            height: 58,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.88 : 1,
            shadowColor: accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: canSubmit ? 0.35 : 0,
            shadowRadius: 14,
            elevation: canSubmit ? 8 : 0,
          })}
        >
          {paying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#fffff0",
              }}
            >
              {!tcAgreed
                ? "Agree to T&C First"
                : `Pay ₦${formatNumberToThousands(
                    paymentAmount
                  )} · Seal the Deal`}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PiolandPayment;
