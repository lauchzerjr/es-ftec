import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../hooks/useAppTheme";

interface CUserPhotoProps {
  photoURL: string;
  isPostPhoto?: boolean;
}

export function CUserProfilePhoto({
  photoURL,
  isPostPhoto = false,
}: CUserPhotoProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        width: isPostPhoto ? 50 : 135,
        height: isPostPhoto ? 50 : 135,
        backgroundColor: colors.gray4,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.bluePrimary,
        position: "relative",
      }}
    >
      {!isPostPhoto && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            position: "absolute",
            backgroundColor: colors.bluePrimary,
            zIndex: 9,
            right: 0,
            bottom: 0,
            borderRadius: 25,
            padding: 8,
          }}
        >
          <MaterialIcons name="mode-edit" size={20} color={colors.grayWhite} />
        </TouchableOpacity>
      )}
      {photoURL ? (
        <Image
          source={{ uri: photoURL }}
          style={{
            width: isPostPhoto ? 50 : 130,
            height: isPostPhoto ? 50 : 130,
            borderRadius: 100,
          }}
        />
      ) : (
        <FontAwesome5
          name="user-graduate"
          size={isPostPhoto ? 30 : 70}
          color={colors.bluePrimary}
        />
      )}
    </View>
  );
}
