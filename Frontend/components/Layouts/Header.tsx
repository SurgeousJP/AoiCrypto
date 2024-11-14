import React from 'react'
import { View, Image, Text } from 'react-native'
import AoiCryptoLogo from '@/assets/logos/AoiCryptoLogo.svg'
import Setting from '@/assets/icons/system-icons-svg/Setting.svg';
import Profile from '@/assets/icons/system-icons-svg/Profile.svg'
import { colors } from '@/constants/Colors';
const Header = () => {
  return (
    <View className='flex flex-row justify-between items-center'>
      <Profile stroke={colors.secondary}/>
      <AoiCryptoLogo />
      <Setting fill={colors.secondary}/>
    </View>
  )
}
export default Header