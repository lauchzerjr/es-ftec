import React from "react";
import { CBox } from "../CBox/CBox";
import { CText } from "../CText/CText";
import { Comment } from "../../services/Comment/models/commentModels";
import { CUserProfilePhoto } from "../CUserProfilePhoto/CUserProfilePhoto";

interface CPostCommentItemProps {
  item: Comment;
}

export function CPostCommentItem({ item }: CPostCommentItemProps) {
  return (
    <CBox p="s8">
      <CBox alignItems="center" flexDirection="row">
        <CUserProfilePhoto photoURL={item?.user?.userPhoto} isPostPhoto />
        <CBox ml="s10">
          <CText fontWeight="bold" color="bluePrimary">
            {item?.user?.name}
          </CText>
          <CText fontSize={10}>postado a uma hora</CText>
          <CText>{item?.text}</CText>
        </CBox>
      </CBox>
    </CBox>
  );
}