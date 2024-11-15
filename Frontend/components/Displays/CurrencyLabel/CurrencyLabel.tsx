import React from 'react'
import { Text, View } from 'react-native'

interface CurrencyLabelProps{
  backgroundColor: string,
  textColor: string,
  content: string
}

const CurrencyLabel: React.FC<CurrencyLabelProps> = (props) => {
  return (
    <View className={`w-[46px] h-fit flex flex-row ${props.backgroundColor}  shadow-lg rounded-lg`}>
      <Text className={`mx-auto my-auto text-sm font-readexRegular ${props.textColor}`}>{props.content}</Text>
    </View>
  )
}

export default CurrencyLabel