import React, { Component } from "react";
import { Alert, Platform } from "react-native";
//import NetInfo from "@react-native-community/netinfo";

export class CheckInternet {

    /*static CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    Alert.alert("You are online!");
                    return true;
                } else {
                    Alert.alert("You are offline!");
                    return false;
                }
            });
        } else {
            // For iOS devices
            NetInfo.isConnected.addEventListener(
                "connectionChange",
                this.handleFirstConnectivityChange
            );
        }
    };

    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
        );

        if (isConnected === false) {
            Alert.alert("You are offline!");
            return false;
        } else {
            Alert.alert("You are online!");
            return true;
        }
    };*/
}