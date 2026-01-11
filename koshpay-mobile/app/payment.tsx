import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  ScrollView,
  Image,
  ImageSourcePropType,
  Alert,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWallet, Asset } from "../context/WalletContext";
import * as Linking from 'expo-linking';
import { 
  generateDappKeypair, 
  buildConnectUrl, 
  decryptConnectResponse, 
  encryptPayload, 
  buildSignTransactionUrl,
  decryptPayload,
  PhantomSession,
  getStoredPhantomSession,
  setStoredPhantomSession,
  buildSignAndSendUrl
} from '../utils/phantom';
import { Connection, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

interface WalletOption {
  id: string;
  name: string;
  type: "koshpay" | "external";
  balance?: number;
  icon: string;
}

export default function PaymentScreen() {
  const { isDarkMode, theme } = useTheme();
  const { assets } = useWallet();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const recipient = {
    name: (params.name as string) || "Priya Sharma",
    bankingName: (params.bankingName as string) || "PRIYA SHARMA",
    phone: (params.phone as string) || "+91 98765 43210",
    koshpayId: (params.koshpayId as string) || "priya.sharma",
  };

  const [amount, setAmount] = useState("");
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Asset | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);

  // Removed static walletOptions, now defined dynamically


  // Blinking Cursor Component
  const BlinkingCursor = () => {
    const opacity = useSharedValue(1);

    useEffect(() => {
      opacity.value = withRepeat(
        withTiming(0, { duration: 530 }),
        -1,
        true
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        style={[
          styles.cursor,
          { backgroundColor: theme.text },
          animatedStyle,
        ]}
      />
    );
  };

  const handleNumberPress = (num: string) => {
    if (num === "backspace") {
      setAmount(amount.slice(0, -1));
    } else if (num === ".") {
      if (!amount.includes(".")) {
        setAmount(amount + ".");
      }
    } else {
      // Prevent leading zeros
      if (amount === "0" && num !== ".") {
        setAmount(num);
      } else {
        setAmount(amount + num);
      }
    }
  };

  const calculateCryptoAmount = () => {
    if (!amount || !selectedCrypto) return "0";
    const amountInr = parseFloat(amount);
    if (isNaN(amountInr)) return "0";
    const cryptoAmount = amountInr / selectedCrypto.priceInr;
    return cryptoAmount.toFixed(8);
  };

  const handleClose = () => {
    router.back();
  };

  const handleProceedToPay = () => {
    setShowWalletModal(true);
  };

  // State for Phantom Session
  const [phantomSession, setPhantomSession] = useState<PhantomSession | null>(getStoredPhantomSession());
  const [dappKeyPair] = useState(generateDappKeypair());
  
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  const walletOptions: WalletOption[] = [
    {
      id: "1",
      name: "KoshPay Wallet",
      type: "koshpay",
      balance: selectedCrypto ? selectedCrypto.balance : 0,
      icon: "wallet",
    },
    { 
      id: "2", 
      name: phantomSession ? `Phantom (${phantomSession.walletPublicKey?.slice(0,4)}...${phantomSession.walletPublicKey?.slice(-4)})` : "Phantom", 
      type: "external", 
      icon: "wallet-outline" 
    }, 
    { id: "3", name: "Solflare", type: "external", icon: "flash" },
    { id: "4", name: "Backpack", type: "external", icon: "briefcase" },
  ];

  // Helper to perform the actual transaction
  const performSolanaPayment = async (session: PhantomSession, currentAmount: string, currentCrypto: Asset) => {
      try {
           setIsLoading(true);
           console.log("=== STARTING PAYMENT FLOW ===");
           console.log(`Amount: ${currentAmount}, Crypto: ${currentCrypto.symbol}`);

           if (!session || !session.session) {
               throw new Error("Invalid Session: Please reconnect Phantom.");
           }

           // Explicitly name this connection to avoid scope conflicts if any
           const paymentConnection = new Connection('https://api.devnet.solana.com', 'confirmed');
           console.log("Connected to Solana Devnet");

           // 1. Calculate Amounts
           const RECIPIENT_PUBKEY = new PublicKey("4mv5hDBDKJT7dwd9DsKqRQdGewkShhUmk5AP8arA484k"); 
           
           const amountInr = parseFloat(currentAmount);
           const cryptoAmount = amountInr / currentCrypto.priceInr;
           const lamports = Math.floor(cryptoAmount * LAMPORTS_PER_SOL);

           console.log("Calculated Lamports:", lamports);

           if (lamports <= 0) {
               throw new Error("Invalid amount calculated (0 or negative).");
           }

           // 2. Balance Check
           // Use the WALLET Key, not the Encryption Key
           const userWallet = new PublicKey(session.walletPublicKey!); 
           
           try {
               const balance = await paymentConnection.getBalance(userWallet);
               console.log(`Wallet Balance (${session.walletPublicKey}): ${balance} lamports`);
               
               if (balance < lamports + 5000) {
                   Alert.alert("Caution", `You may have insufficient funds on Devnet.\nBalance: ${(balance/LAMPORTS_PER_SOL).toFixed(5)} SOL\nNeeded: ~${((lamports+5000)/LAMPORTS_PER_SOL).toFixed(5)} SOL`);
               }
           } catch (netErr) {
               console.warn("Could not fetch balance:", netErr);
               // Don't throw, just warn
           }

           // 3. Construct Transaction
           const transaction = new Transaction().add(
               SystemProgram.transfer({
                   fromPubkey: userWallet, 
                   toPubkey: RECIPIENT_PUBKEY,
                   lamports: lamports, 
               })
           );
           
           console.log("Fetching Blockhash (finalized)...");
           const blockhashObj = await paymentConnection.getLatestBlockhash('finalized');
           transaction.recentBlockhash = blockhashObj.blockhash;
           transaction.feePayer = userWallet;
           console.log("Blockhash fetched:", blockhashObj.blockhash);

           // 4. Serialize
           const serializedTransaction = transaction.serialize({
               requireAllSignatures: false,
               verifySignatures: false
           });

           // 5. Encrypt Payload
           const payload = {
               transaction: bs58.encode(serializedTransaction),
               session: session.session, 
           };

           const { nonce, payload: encryptedPayload } = encryptPayload(
               payload, 
               session.sharedSecret!
           );

           // 6. Init Deep Link
           const redirectLink = Linking.createURL('/payment'); // Map to existing route
           console.log("Redirect Link:", redirectLink);

           const url = buildSignTransactionUrl(
               session.appPublicKey, 
               nonce,
               encryptedPayload,
               session.session!,
               redirectLink
           );

           console.log("Opening Phantom URL...");
           await Linking.openURL(url);
           // NOTE: Keep loading true. We rely on useEffect logic to continue.

      } catch (error: any) {
          console.error("FATAL PAYMENT ERROR:", error);
          Alert.alert("Payment Error", error.message || "Unknown Failure");
          setIsLoading(false);
      }
  };

  // Handle Deep Links
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log("Deep Link Received:", url);
      const params = new URL(url).searchParams;

      // Check if it's a Connect Response (has phantom_encryption_public_key)
      if (params.get('phantom_encryption_public_key')) {
          const phantomEncryptionKey = params.get('phantom_encryption_public_key');
          const nonce = params.get('nonce');
          const data = params.get('data');

          if (phantomEncryptionKey && nonce && data) {
            try {
              const { payload, sharedSecret } = decryptConnectResponse(
                phantomEncryptionKey,
                nonce,
                data,
                dappKeyPair.secretKey
              );
              
              const newSession: PhantomSession = {
                appPublicKey: dappKeyPair.publicKey,
                appSecretKey: dappKeyPair.secretKey,
                sharedSecret,
                phantomPublicKey: phantomEncryptionKey, 
                walletPublicKey: payload.public_key,    
                session: payload.session,
              };

              setPhantomSession(newSession);
              setStoredPhantomSession(newSession); 

              // Note: We don't alert "Connected" anymore if it's integrated smoothly, 
              // instead we might just proceed or show a toast.
              // For now simpler:
              // Alert.alert("Connected", "Wallet connected!");
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "Failed to connect to Phantom");
            }
          }
      }

      // Check if it's a SignTransaction Response (has nonce, data, but NO phantom_encryption_public_key)
      else if (params.get('nonce') && params.get('data')) {
        // We are back from Phantom!
        console.log("SignTransaction response detected. Resuming flow...");
        setIsLoading(true); // Force loading state in case of app reload
        
        const nonce = params.get('nonce');
        const data = params.get('data');
        const errorCode = params.get('errorCode');
        const errorMessage = params.get('errorMessage');

        if (errorCode) {
             console.error("Phantom Error:", errorCode, errorMessage);
             Alert.alert("Payment Failed", errorMessage || `Error Code: ${errorCode}`);
             setIsLoading(false);
             return;
        }

        if (nonce && data && phantomSession) {
            try {
                // Decrypt
                const decryptedData = decryptPayload(
                    data, 
                    nonce, 
                    phantomSession.sharedSecret!
                );
                
                const signedTransactionStr = decryptedData.transaction;
                
                // Submit
                // Submit with Retry Strategy
                console.log("Submitting transaction...");
                const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
                const signedTransaction = bs58.decode(signedTransactionStr);
                
                let signature = '';
                let attempts = 0;
                const maxRetries = 3;

                while (attempts < maxRetries) {
                    try {
                        attempts++;
                        console.log(`Submission Attempt ${attempts}...`);
                        signature = await connection.sendRawTransaction(signedTransaction, {
                            skipPreflight: false,
                            preflightCommitment: 'confirmed'
                        });
                        break; // Success!
                    } catch (submitErr) {
                        console.warn(`Attempt ${attempts} failed:`, submitErr);
                        if (attempts === maxRetries) throw submitErr; // Throw on last failure
                        // Wait 1s before retry
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                
                console.log("Transaction Sent! Signature:", signature);
                
                // Confirm
                const confirmation = await connection.confirmTransaction(signature, 'confirmed');
                
                setIsLoading(false); // Done!

                if (confirmation.value.err) {
                    Alert.alert("Error", "Transaction failed on chain");
                } else {
                    router.push({
                        pathname: '/payment-success',
                        params: {
                            amount: amount, // Pass full input string (e.g. "500")
                            symbol: 'INR',  // Display INR
                            txSignature: signature,
                            recipientName: recipient.name // Pass recipient name
                        }
                    });
                }

            } catch (err: any) {
                console.error("Submission Error:", err);
                Alert.alert("Error", "Failed to submit: " + (err.message || "Network Error"));
                setIsLoading(false);
            }
        } else {
             // User might have cancelled or weird state
             setIsLoading(false);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, [dappKeyPair, amount, selectedCrypto, phantomSession]);

  const handleWalletSelectionAndPay = async (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setShowWalletModal(false);

    if (!selectedCrypto || !amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter amount");
      return;
    }

    // Logic for Phantom
    if (wallet.name.includes("Phantom")) { // Check purely string match as we modified name
       try {
           if (!phantomSession) {
               // 1. Connect first
               const redirectLink = Linking.createURL('/payment'); // Map to existing route
               const url = buildConnectUrl(dappKeyPair.publicKey, redirectLink);
               try {
                   await Linking.openURL(url);
               } catch (err) {
                   Alert.alert("Error", "Phantom Wallet not installed");
               }
               // We return here. The 'onConnect' handler in useEffect will trigger performSolanaPayment
               // Actually we need the user to click "Pay" again after connecting for security/UX flow,
               // or we can auto-trigger. The user said: "once it is done it should have the page wallet connected... and then... loading thing"
               // So let's just Connect first.
               return; 
           }

           // 2. If already connected, pay directly
           if (selectedCrypto && amount) {
               performSolanaPayment(phantomSession, amount, selectedCrypto);
           } else {
               Alert.alert("Error", "Please select crypto and enter amount");
           }

       } catch (error) {
           console.error(error);
           Alert.alert("Error", "Payment initiation failed");
           setIsLoading(false);
       }
       return;
    }

    // ... KoshPay Wallet logic ...
    const cryptoAmount = calculateCryptoAmount();
    router.push({
      pathname: "/payment-confirmation",
      params: {
        amount: cryptoAmount,
        inrAmount: amount,
        crypto: selectedCrypto.symbol,
        recipientName: recipient.name,
        // ... params
        wallet: wallet.name,
        walletType: wallet.type,
      },
    });
  };

  const canProceed = amount && parseFloat(amount) > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={{ paddingTop: insets.top }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Recipient Info */}
        <View style={styles.recipientSection}>
          <View style={[styles.recipientAvatar, { backgroundColor: theme.card }]}>
            <Ionicons name="person" size={40} color={theme.textSecondary} />
          </View>
          <Text style={[styles.recipientName, { color: theme.text }]}>
            Paying {recipient.name}
          </Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={[styles.bankingName, { color: theme.textSecondary }]}>
              Banking name: {recipient.bankingName}
            </Text>
          </View>
          {recipient.phone ? (
            <Text style={[styles.phone, { color: theme.textSecondary }]}>
              {recipient.phone}
            </Text>
          ) : null}
        </View>

        {/* Choose Crypto Button */}
        <TouchableOpacity
          style={[styles.chooseCryptoButton, { backgroundColor: theme.card }]}
          onPress={() => setShowCryptoModal(true)}
        >
          {selectedCrypto ? (
            <View style={styles.selectedCryptoContent}>
              <Image source={selectedCrypto.icon} style={styles.cryptoIcon} />
              <Text style={[styles.selectedCryptoText, { color: theme.text }]}>
                Pay with {selectedCrypto.name}
              </Text>
            </View>
          ) : (
            <Text style={[styles.chooseCryptoText, { color: theme.text }]}>
              Choose Cryptocurrency
            </Text>
          )}
          <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Amount Display */}
        {selectedCrypto && (
          <View style={styles.amountSection}>
            <View style={styles.amountDisplay}>
              <Text style={[styles.rupeeSymbol, { color: theme.text }]}>₹</Text>
              {amount ? (
                <>
                  <Text style={[styles.amountText, { color: theme.text }]}>
                    {amount}
                  </Text>
                  <BlinkingCursor />
                </>
              ) : (
                <>
                  <BlinkingCursor />
                  <Text style={[styles.amountPlaceholder, { color: theme.textSecondary }]}>
                    0
                  </Text>
                </>
              )}
            </View>
            {amount && parseFloat(amount) > 0 && (
              <Text style={[styles.cryptoAmount, { color: theme.textSecondary }]}>
                ≈ {calculateCryptoAmount()} {selectedCrypto.symbol}
              </Text>
            )}
          </View>
        )}

        {/* Add Note */}
        {selectedCrypto && (
          <TouchableOpacity style={styles.addNoteButton}>
            <Text style={[styles.addNoteText, { color: theme.textSecondary }]}>
              Add note
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Custom Numpad + Pay Button */}
      {selectedCrypto && (
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom }]}>
          {/* Custom Numpad */}
          <View style={styles.numpad}>
            {/* Row 1 */}
            <View style={styles.numpadRow}>
              {["1", "2", "3"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numpadButton, { backgroundColor: theme.card }]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View style={styles.numpadRow}>
              {["4", "5", "6"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numpadButton, { backgroundColor: theme.card }]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 3 */}
            <View style={styles.numpadRow}>
              {["7", "8", "9"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numpadButton, { backgroundColor: theme.card }]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 4 */}
            <View style={styles.numpadRow}>
              <TouchableOpacity
                style={[styles.numpadButton, { backgroundColor: theme.card }]}
                onPress={() => handleNumberPress(".")}
                activeOpacity={0.7}
              >
                <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                  .
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.numpadButton, { backgroundColor: theme.card }]}
                onPress={() => handleNumberPress("0")}
                activeOpacity={0.7}
              >
                <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                  0
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.numpadButton, { backgroundColor: theme.card }]}
                onPress={() => handleNumberPress("backspace")}
                activeOpacity={0.7}
              >
                <Ionicons name="backspace-outline" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pay Button */}
          <View style={styles.payButtonContainer}>
            <TouchableOpacity
              style={[
                styles.payButton,
                {
                  backgroundColor: canProceed ? theme.primary : theme.card,
                },
              ]}
              onPress={handleProceedToPay}
              disabled={!canProceed}
            >
              <Text
                style={[
                  styles.payButtonText,
                  {
                    color: canProceed ? "#FFFFFF" : theme.textSecondary,
                  },
                ]}
              >
                Proceed to Pay
              </Text>
            </TouchableOpacity>
            <View style={styles.poweredBy}>
              <Text style={[styles.poweredByText, { color: theme.textSecondary }]}>
                POWERED BY
              </Text>
              <Text style={[styles.koshpayText, { color: theme.text }]}>
                KOSHPAY
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Crypto Modal */}
      <Modal
        visible={showCryptoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCryptoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => setShowCryptoModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: theme.card, paddingBottom: insets.bottom + 20 }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Choose Crypto Currency
            </Text>
            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
            {assets.map((crypto) => (
              <TouchableOpacity
                key={crypto.id}
                style={styles.cryptoOption}
                onPress={() => {
                  setSelectedCrypto(crypto);
                  setShowCryptoModal(false);
                }}
              >
                <View style={styles.cryptoOptionLeft}>
                  <Image source={crypto.icon} style={styles.cryptoIcon} />
                  <View>
                    <Text style={[styles.cryptoName, { color: theme.text }]}>
                      {crypto.name}
                    </Text>
                    <Text style={[styles.cryptoSymbol, { color: theme.textSecondary }]}>
                      {crypto.symbol}
                    </Text>
                  </View>
                </View>
                {selectedCrypto?.id === crypto.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        visible={showWalletModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWalletModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => setShowWalletModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: theme.card, paddingBottom: insets.bottom + 20 }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Choose wallet to pay with
            </Text>
            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
            {walletOptions.map((wallet) => (
              <TouchableOpacity
                key={wallet.id}
                style={styles.walletOption}
                onPress={() => handleWalletSelectionAndPay(wallet)}
              >
                <View style={styles.walletOptionLeft}>
                  <View
                    style={[
                      styles.walletIconContainer,
                      {
                        backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5",
                        borderStyle: wallet.type === "koshpay" ? "solid" : "dashed",
                        borderWidth: wallet.type === "koshpay" ? 0 : 2,
                        borderColor: theme.border,
                       },
                    ]}
                  >
                    <Ionicons name={wallet.icon as any} size={28} color={theme.primary} />
                  </View>
                  <View>
                    <Text style={[styles.walletName, { color: theme.text }]}>
                      {wallet.name}
                    </Text>
                    {wallet.type === "koshpay" ? (
                      <Text style={[styles.walletType, { color: theme.textSecondary }]}>
                        Balance: {wallet.balance} {selectedCrypto?.symbol}
                      </Text>
                    ) : (
                      <Text style={[styles.walletType, { color: theme.textSecondary }]}>
                        External wallet
                      </Text>
                    )}
                  </View>
                </View>
                {selectedWallet?.id === wallet.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
            <View style={[styles.loadingContainer, { backgroundColor: theme.card }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.text }]}>
                    Processing Payment...
                </Text>
                <Text style={[styles.loadingSubText, { color: theme.textSecondary }]}>
                    Please check your Phantom wallet to approve.
                </Text>
            </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
  },
  closeButton: { padding: scale(4) },
  moreButton: { padding: scale(4) },
  recipientSection: {
    alignItems: "center",
    paddingBottom: isSmallDevice ? verticalScale(12) : verticalScale(24),
  },
  recipientAvatar: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
  },
  recipientName: {
    fontSize: scaleFont(18),
    fontWeight: "600",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: verticalScale(4),
  },
  bankingName: { fontSize: scaleFont(13) },
  phone: { fontSize: scaleFont(14), marginTop: verticalScale(4) },
  amountSection: {
    alignItems: "center",
    paddingVertical: isSmallDevice ? verticalScale(12) : verticalScale(24),
  },
  amountDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContainer: {
    padding: scale(20),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    width: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  loadingSubText: {
      marginTop: verticalScale(8),
      fontSize: scaleFont(14),
      textAlign: 'center',
  },
  rupeeSymbol: { 
    fontSize: scaleFont(40), 
    fontWeight: "600", 
    marginRight: scale(8) 
  },
  amountText: { 
    fontSize: scaleFont(56), 
    fontWeight: "600",
  },
  amountPlaceholder: {
    fontSize: scaleFont(56), 
    fontWeight: "600",
  },
  cursor: {
    width: scale(3),
    height: scaleFont(50),
    marginLeft: scale(4),
    borderRadius: moderateScale(2),
  },
  cryptoAmount: { 
    fontSize: scaleFont(16), 
    marginTop: verticalScale(8), 
    fontWeight: "600" 
  },
  addNoteButton: { 
    alignItems: "center", 
    paddingVertical: verticalScale(16) 
  },
  addNoteText: { fontSize: scaleFont(16) },
  chooseCryptoButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: scale(20),
    padding: scale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  selectedCryptoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  selectedCryptoText: { 
    fontSize: scaleFont(16), 
    fontWeight: "600" 
  },
  chooseCryptoText: { fontSize: scaleFont(16) },
  bottomContainer: {},
  numpad: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  numpadRow: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  numpadButton: {
    flex: 1,
    aspectRatio: isSmallDevice ? 3 : 2.5,
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  numpadButtonText: {
    fontSize: scaleFont(28),
    fontWeight: "600",
  },
  payButtonContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(20),
  },
  payButton: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(28),
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  payButtonText: { 
    fontSize: scaleFont(18), 
    fontWeight: "700" 
  },
  poweredBy: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(6),
  },
  poweredByText: { fontSize: scaleFont(11) },
  koshpayText: { 
    fontSize: scaleFont(11), 
    fontWeight: "700" 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalOverlayTouch: { flex: 1 },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    padding: scale(20),
    maxHeight: "80%",
  },
  modalTitle: { 
    fontSize: scaleFont(20), 
    fontWeight: "600", 
    marginBottom: verticalScale(20) 
  },
  cryptoOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  cryptoOptionLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: scale(16) 
  },
  cryptoIcon: {
    width: scale(32),
    height: scale(32),
  },
  cryptoName: { 
    fontSize: scaleFont(16), 
    fontWeight: "600" 
  },
  cryptoSymbol: { 
    fontSize: scaleFont(13), 
    marginTop: verticalScale(2) 
  },
  walletOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  walletOptionLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: scale(16) 
  },
  walletIconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  walletName: { 
    fontSize: scaleFont(16), 
    fontWeight: "600" 
  },
  walletType: { 
    fontSize: scaleFont(13), 
    marginTop: verticalScale(2) 
  },
});
