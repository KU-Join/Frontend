import React from "react";
import {NextPage} from "next";
import {useRouter} from 'next/router';
import ScrollContainer from 'react-indiana-drag-scroll';

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
    WrapTitle,
    WrapButton
  } from '../../components/main/main-style'
  
  import { BsFillMicFill, BsPlusLg } from 'react-icons/bs';
  import { MdHeadset } from 'react-icons/md';
  import { RiSettings2Fill } from 'react-icons/ri';

const Club_PR: NextPage = () => {
    const router = useRouter();

    const {club_name, club_description, club_img} = router.query

    let clubImg = club_img as string
    let clubname = club_name as string

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

      const onclick = (club_name:string) => {
        router.push({
            pathname: './manage/management',
            query: {
                club_name: club_name,
            },
        },
        './manage/'
        );
      }

    return (
        <Container>
          <WrapContents>
            <UserInfo>
              <Logo>
                <LogoTitle onClick={handleClick}>KU:</LogoTitle>
                <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>JOIN</LogoTitle>
              </Logo>
              <WrapFriendList>
                <WrapFriendListTitle>
                    <ContentTitle>친구</ContentTitle>
                    <BsPlusLg style={{color: "black"}}/>
                </WrapFriendListTitle>
                <Friend>김아무개</Friend>
                <Friend>이아무개</Friend>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <JoinedClub>
                  <JoinedClubImg />
                  <JoinedClubName>unsigned</JoinedClubName>
                </JoinedClub>
              </WrapJoinedClub>
            </UserInfo>
            <WrapUserStatus>
              <UserProfile>
                <UserImg />
                <Username />
              </UserProfile>
              <UserStatus>
                <BsFillMicFill style={{ color: '#B9BBBE' }} />
                <MdHeadset style={{ color: '#B9BBBE' }} />
                <RiSettings2Fill style={{ color: '#B9BBBE' }} />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <Contents>
            <WrapButton style={{width: "70vw"}}>
              <div style={{display: "flex", gap: "10px"}}>
                <MainTitle>{club_name}</MainTitle>
                <button style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#333333", border: "none", borderRadius: "20px", fontWeight: "bold", color: "white"}} onClick={() => onclick(clubname)}>동아리 관리</button>
              </div>
              <div style={{display: "flex", gap: "10px"}}>
                <button style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F0D2D2", border: "none", borderRadius: "20px", fontWeight: "bold"}}>가입하기</button>
                <button style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#DDEAEF", border: "none", borderRadius: "20px", fontWeight: "bold"}}>입장하기</button>
              </div>
            </WrapButton>
            <p style={{color: "white", textAlign: "left", margin: "20px 0"}}>{club_description}</p>
            <div>
              <ScrollContainer style={{height: "80vw"}} vertical={false}>
                <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white", textAlign: "center", margin: "20px auto"}}>
                    <img src={clubImg} style={{width: "300px", height: "400px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", objectFit: "cover"}} alt=""/>
                    <div style={{textAlign: "left", padding: "10px"}}>
                        <p style={{fontSize: "16px", marginBottom: "5px"}}>{club_description}</p>
                        <p style={{fontSize: "8px", color: "#333333"}}>10월 30일</p>
                    </div>
                </div>
                <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white", textAlign: "center", margin: "20px auto"}}>
                    <img src={clubImg} style={{width: "300px", height: "400px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", objectFit: "cover"}} alt=""/>
                    <div style={{textAlign: "left", padding: "10px"}}>
                        <p style={{fontSize: "16px", marginBottom: "5px"}}>{club_description}</p>
                        <p style={{fontSize: "8px", color: "#333333"}}>10월 30일</p>
                    </div>
                </div>
              </ScrollContainer>
            </div>
          </Contents>
        </Container>
      );
}

export default Club_PR;