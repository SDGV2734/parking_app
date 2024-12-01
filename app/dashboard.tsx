// import { View, Text, StyleSheet } from 'react-native';

// export default function DetailsScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>Dashboard</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });


import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const AdminDashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const router = useRouter();

  const getUserFromToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { username: payload.username };
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const user = await getUserFromToken();
      if (user?.username) {
        setUsername(user.username);
      }
    })();
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const navigate = (path: string) => {
    router.push("/dashboard");
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <ScrollView style={styles.sidebar}>
        <Text style={styles.title}>Admin Panel</Text>
        {[
          { label: "Dashboard", icon: "layout", route: "/dashboard" },
          { label: "Create User", icon: "user-plus", route: "/user" },
          { label: "Parking Detail", icon: "car", route: "/parking-detail" },
          { label: "Dzongkhag", icon: "map-pin", route: "/dzongkhag" },
          { label: "Parking Area", icon: "parking-circle", route: "/parking-area" },
          { label: "Parking Slot", icon: "rectangle-vertical", route: "/parking-slot" },
          { label: "Notifications", icon: "bell", route: "/notifications" },
        ].map(({ label, icon, route }) => (
          <TouchableOpacity key={route} style={styles.navButton} onPress={() => navigate(route)}>
            <Feather ICON={icon} size={20} style={styles.icon} />
            <Text style={styles.navText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.header}>Welcome to the Dashboard</Text>
        <Text style={styles.subHeader}>
          {username ? `Logged in as: ${username}` : ""}
        </Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation */}
      {showLogoutConfirmation && (
        <View style={styles.logoutModal}>
          <Text style={styles.modalText}>Are you sure you want to logout?</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalButton} onPress={cancelLogout}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
              <Text style={styles.confirmText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: { width: "30%", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  navButton: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  icon: { marginRight: 10 },
  navText: { fontSize: 16 },
  mainContent: { flex: 1, padding: 20 },
  header: { fontSize: 28, fontWeight: "bold" },
  subHeader: { fontSize: 16, marginVertical: 10 },
  logoutButton: { marginTop: 20, padding: 10, backgroundColor: "#f00", borderRadius: 5 },
  logoutText: { color: "#fff", textAlign: "center" },
  logoutModal: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalText: { fontSize: 20, color: "#fff", marginBottom: 20 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", width: "50%" },
  modalButton: { padding: 10, backgroundColor: "#fff", marginHorizontal: 5 },
  cancelText: { color: "#000" },
  confirmText: { color: "#f00" },
});
