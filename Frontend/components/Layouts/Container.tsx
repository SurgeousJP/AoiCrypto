import React from 'react'
import { Shadow } from 'react-native-shadow-2'

const Container = ({children}) => {
  return (
    <Shadow stretch={true} startColor="#2F66F61F" distance={2} offset={[1,1]} paintInside={true} containerStyle={{width: '100%', height: 'auto'}} style={{margin: 1, borderRadius: 8}}>
      {children}
    </Shadow>
  )
}

export default Container