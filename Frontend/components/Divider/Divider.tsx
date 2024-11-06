import React from 'react'
import { View, Text } from 'react-native'
import DividerLine from '@/components/Divider/DividerLine'

interface DividerProps{
  content: string;
}

const Divider:React.FC<DividerProps> = (props) => {
  return (
    <View className='w-full flex flex-row items-center'>
      <DividerLine />
      <Text className='font-readexRegular text-md mx-0 px-2'>{props.content}</Text>
      <DividerLine />
    </View>
  )
}

export default Divider