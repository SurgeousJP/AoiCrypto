import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import DividerLine from "@/components/Displays/Divider/DividerLine";
import NotFound from "@/components/Displays/Results/SearchResult/NotFound";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import TokenRow from "@/components/Items/Token/TokenRow";
import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { GET_TOKENS } from "@/queries/token";
import { useQuery } from "@apollo/client";
import { Link } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TokenScreen() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  const { chainId, address } = useContext(AuthContext);

  const {
    loading: isTokenLoading,
    error,
    data: tokenQueryData,
  } = useQuery(GET_TOKENS, {
    variables: { address: address },
    skip: !address,
  });

  const [searchText, setSearchText] = useState("");
  const tokens = tokenQueryData?.tokens;
  const searchTokens = tokens?.filter(
    (token) =>
      token.address.includes(searchText) ||
      token.name.includes(searchText) ||
      token.symbol.includes(searchText)
  );
  const displayTokens = searchText.length <= 0 ? tokens : searchTokens;

  if (loading || isTokenLoading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background ">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pb-2 bg-background">
      <View className="bg-surface mb-2">
        <Pressable className="flex flex-row justify-between items-center bg-surface px-2 space-x-2 border-b-[0.5px] border-border py-2 pb-3">
          <Searchbar
            placeholder={"Search by name or address"}
            value={searchText}
            onChange={setSearchText}
            onPerformSearch={() => {}}
          />
          <TouchableOpacity>
            <Link href={"/settings"}>
              <Setting fill={colors.secondary} width={24} height={24} />
            </Link>
          </TouchableOpacity>
        </Pressable>
      </View>

      {!isTokenLoading &&
      tokenQueryData &&
      displayTokens !== undefined &&
      displayTokens.length > 0 ? (
        <FlatList
          style={{ paddingHorizontal: 0 }}
          contentContainerStyle={{
            overflow: "hidden",
          }}
          numColumns={1}
          data={displayTokens}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
              return (
                <View>
                  {item.index === 0 && <DividerLine />}
                  <TokenRow
                    name={item.item.name}
                    symbol={item.item.symbol}
                    totalSupply={(
                      item.item.maxTotalSupply / BIGINT_CONVERSION_FACTOR
                    ).toString()}
                    address={item.item.address}
                    initialSupply={(
                      item.item.initialSupply / BIGINT_CONVERSION_FACTOR
                    ).toString()}
                    ownerAddress={address}
                    chainId={chainId}
                    displayMintIcon={false}
                  />
                  {item.index < displayTokens.length && <DividerLine />}
                </View>
              );
          }}
        />
      ) : (
        <NotFound
          heading={"No tokens found"}
          detail={
            "If this is your first time, please try creating a new token, otherwise please readjusting the query."
          }
        />
      )}
    </View>
  );
}
