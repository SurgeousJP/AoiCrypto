import React from 'react'
import { Pressable, Text } from 'react-native'

interface TagProps{
  label: string,
  count: number,
  backgroundStyle: string,
  textStyle: string
}

const Tag: React.FC<TagProps> = (props) => {
  return (
    <Pressable className={`w-fit p-2 items-center justify-center ${props.backgroundStyle} rounded-lg`}>
      <Text className={`font-readexRegular text-sm ${props.textStyle}`}>{props.label} ({props.count})</Text>
    </Pressable>
  )
}

export default Tag