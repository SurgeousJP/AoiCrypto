import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export const showToast = (type: string, text1: string, text2: string) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2
  });
}

