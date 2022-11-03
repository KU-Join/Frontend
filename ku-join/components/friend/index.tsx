import React, {useState} from 'react';

import {
    Container,
    WrapContents,
    UserInfo,
    Contents,
    WrapUserStatus,
    Logo,
    LogoTitle,
    WrapJoinedClub,
    ContentTitle,
    JoinedClubImg,
    JoinedClubName,
    JoinedClub,
    UserProfile,
    UserImg,
    UserName,
    UserStatus,
    MainTitle,
    WrapClubTypes,
    WrapClubType,
    ClubType,
    WrapClub,
    Club,
    WrapFriendList,
    WrapFriendListTitle,
    Friend,
    WrapTitle
  } from '../main/main-style';

  import {
    WrapTab,
    TabTitle,
    MemberName,
    Button

  } from '../manage/manage-style'
  
  import { Input } from "../signup-form/signup-form-style";
  import Modal from 'react-modal'
  
  import { BsFillMicFill, BsPlusLg } from 'react-icons/bs';
  import { MdHeadset } from 'react-icons/md';
  import { RiSettings2Fill } from 'react-icons/ri';
  
  import { useRouter } from 'next/router';
  import { useQuery } from '@tanstack/react-query';

const FriendLayout = () => {
    const router = useRouter();
          
    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const Username:any = () => {
  
      if (typeof window !== "undefined") {
          const userToken = sessionStorage.getItem('token')
          const userID = sessionStorage.getItem('id')
          
  
          //로그인 없이 main 접근 시 index 화면으로 이동
          if(userID == null) {
              router.push("./");
          }
      
        return (
          <UserName>{userID}</UserName>
          )
      }
    }
  
    const handleClick = (e:any) => {
      e.preventDefault();
      router.push("./");
    }

    return(
        <Container>
        <WrapContents>
            <UserInfo>
            <Logo>
                <LogoTitle onClick={handleClick}>KU:</LogoTitle>
                <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>JOIN</LogoTitle>
            </Logo>
            <WrapFriendList>
                <WrapFriendListTitle>
                    <ContentTitle>친구 관리</ContentTitle>
                </WrapFriendListTitle>
            </WrapFriendList>
            </UserInfo>
        </WrapContents>
        <Contents style={{width: "85vw"}}>
            <WrapTitle>
                <MainTitle>친구 관리</MainTitle>
            </WrapTitle>
            <WrapTab>
                <TabTitle style={{marginBottom: "20px"}}>친구 목록</TabTitle>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
                    <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                        <UserImg />
                        <MemberName>김아무개</MemberName>
                    </div>
                    <p style={{color: "#B72929"}}>승인 완료</p>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
                    <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                        <UserImg />
                        <MemberName>이아무개</MemberName>
                    </div>
                    <p style={{color: "#2ABF4B"}}>승인 대기</p>
                </div>
            </WrapTab>
            <WrapTab>
                <TabTitle style={{marginBottom: "20px"}}>친구 요청</TabTitle>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
                    <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                        <UserImg />
                        <MemberName>김아무개</MemberName>
                    </div>
                    <Button>승인</Button>
                </div>
            </WrapTab>
        </Contents>
        </Container>
    );
}

export default FriendLayout;