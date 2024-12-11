import { colors } from '@/constants/colors';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export const showToast = (type: string, text1: string, text2: string) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2
  });
}

export const commonToastStyle = {
  width: "92%",
  backgroundColor: colors.background,
  paddingHorizontal: 0,
  marginHorizontal: 0,
};

export const defaultText1Style = {
  fontFamily: "ReadexPro_400Regular",
  fontSize: 16,
  fontWeight: "400",
  flexWrap: 'wrap',
};
export const defaultText2Style = {
  fontFamily: "ReadexPro_400Regular",
  fontSize: 14,
  fontWeight: "400",
  flexWrap: 'wrap'
}


