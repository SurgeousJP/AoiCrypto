import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAddressToLS = async (address: string) => {
  try {
    console.log(address);
    await AsyncStorage.setItem('address', address);
  } catch (e) {
    console.log("Set address to LS failed");
  }
};


export const getAddressFromLS = async () => {
  try {
    const address = await AsyncStorage.getItem('address');
    if (address !== null) {
      return address;
    }
  } catch (e) {
    // error reading value
  }
};

export const setConnectedStateToLS = async (isConnected: boolean) => {
  try {
    await AsyncStorage.setItem('isConnected', isConnected ? "true" : "false");
  } catch (e) {
    console.log("Set connected state to LS failed");
  }
};


export const getConnectedStateFromLS = async () => {
  try {
    const isConnected = await AsyncStorage.getItem('isConnected');
    if (isConnected !== null) {
      return isConnected === "true";
    }
  } catch (e) {
    // error reading value
  }
};

export const clearAsyncStorage = async() => {
  AsyncStorage.clear();
}
