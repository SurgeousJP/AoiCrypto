import React from 'react'
import { View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

const Container = ({children}) => {
  return (
    <View className='w-full h-fit rounded-lg' style={{elevation: 2}}>
      {children}
    </View>
  )
}

export default Container