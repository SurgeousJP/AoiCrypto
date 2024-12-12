import React from 'react'
import { View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

const Container = ({children}) => {
  return (
    <View className='w-full  border-border border-[0.25px]' style={{elevation: 0}}>
      {children}
    </View>
  )
}

export default Container