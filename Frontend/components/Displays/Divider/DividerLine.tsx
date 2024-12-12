import React from "react";
import { View } from "react-native";

interface Props {
  color?: string;
  width?: number;
}

const DividerLine:React.FC<Props> = ({color, width}) => {
  return (
    <View style = {{
      borderBottomColor: "#ebe5ec", 
      borderBottomWidth: 1, 
      alignSelf:'stretch',
      width: "100%",
    }}></View>
  );
};

export default DividerLine;