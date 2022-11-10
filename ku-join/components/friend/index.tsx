import React, {useState} from 'react';
import LoadingSpinner from '../../public/Spinner.gif';
import Image from 'next/image'

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

  type FriendListItem = {
    email : string;
    nickname : string;
    state : string;
  }

const FriendLayout = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

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
      router.push("./main");
    }

    const AcceptFriendRequest = (FriendEmail:string) => {
        const userID = sessionStorage.getItem('id');

        fetch(API_URL + "/member-service/friends/accept", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Origin": API_URL,
              "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({
              email: userID + "@konkuk.ac.kr",
              friendEmail: FriendEmail
            })
          })
          .then((response) => {
            response.status == 200 ? alert("수락 성공") : alert("수락 실패")
        })
    }

    const getFriendList = async (): Promise<FriendListItem[]> => {
        const userID = sessionStorage.getItem('id');
        return await (
          await fetch(API_URL + '/member-service/friends?email=' + userID + '@konkuk.ac.kr')
        ).json();
    };

    const getRequestFriendList = async (): Promise<FriendListItem[]> => {
        const userID = sessionStorage.getItem('id');
        return await (
          await fetch(API_URL + '/member-service/friends/request?email=' + userID + '@konkuk.ac.kr')
        ).json();
    }

    const {data: data1, isLoading: isLoading1, error: error1} = useQuery(['friends'], getFriendList)
    const {data: data2, isLoading: isLoading2, error: error2} = useQuery(['friendrequest'], getRequestFriendList)

    if (isLoading1) {
        return (
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"}}>
              <Image src={LoadingSpinner}/>
              <div>Loading...</div>
            </div>
        )    
    }

    if (isLoading2) {
        return (
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"}}>
              <Image src={LoadingSpinner}/>
              <div>Loading...</div>
            </div>
        )
    }

    if (error1) return <div>'error..'</div>

    if (error2) return <div>'error..'</div>

    if ((data1 != undefined) && (data2 != undefined)) {
        if (data1.length == 0) {
            if (data2.length == 0) {
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
                            <p style={{color: "white"}}>등록된 친구가 없습니다.</p>
                        </WrapTab>
                        <WrapTab>
                            <TabTitle style={{marginBottom: "20px"}}>친구 요청</TabTitle>
                            <p style={{color: "white"}}>친구 요청이 없습니다.</p>
                        </WrapTab>
                    </Contents>
                    </Container>
                );
            }

            else {
                let RequestList: JSX.Element[];
                RequestList = data2.map((Request: FriendListItem) => (
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}} key={Request.email}>
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                            <UserImg />
                            <MemberName>{Request.nickname}</MemberName>
                        </div>
                        <Button onClick={() => {AcceptFriendRequest(Request.email)}}>승인</Button>
                    </div>
                ))  

                
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
                            <p style={{color: "white"}}>등록된 친구가 없습니다.</p>
                        </WrapTab>
                        <WrapTab>
                            <TabTitle style={{marginBottom: "20px"}}>친구 요청</TabTitle>
                            <div>{RequestList}</div>
                        </WrapTab>
                    </Contents>
                    </Container>
                );
            }
        }

        else {
            let FriendList: JSX.Element[];
                FriendList = data1.map((Friend: FriendListItem) => (
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}} key={Friend.email}>
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                            <UserImg />
                            <MemberName>{Friend.nickname}</MemberName>
                        </div>
                        {Friend.state == "ACCEPT" && <p style={{color: "#B72929"}}>승인 완료</p>}
                        {Friend.state == "WAITING" && <p style={{color: "#2ABF4B"}}>승인 대기</p>}
                    </div>   
                ));

            if (data2.length == 0) {
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
                            <div>{FriendList}</div>
                        </WrapTab>
                        <WrapTab>
                            <TabTitle style={{marginBottom: "20px"}}>친구 요청</TabTitle>
                            <p style={{color: "white"}}>친구 요청이 없습니다.</p>
                        </WrapTab>
                    </Contents>
                    </Container>
                );

            }

            else {

                let RequestList: JSX.Element[];
                RequestList = data2.map((Request: FriendListItem) => (
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}} key={Request.email}>
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                            <UserImg />
                            <MemberName>{Request.nickname}</MemberName>
                        </div>
                        <Button onClick={() => {AcceptFriendRequest}}>승인</Button>
                    </div>
                ))  

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
                            <div>{FriendList}</div>
                        </WrapTab>
                        <WrapTab>
                            <TabTitle style={{marginBottom: "20px"}}>친구 요청</TabTitle>
                            <div>{RequestList}</div>
                        </WrapTab>
                    </Contents>
                    </Container>
                );
            }
        }
    }

    
    return <div>data is undefined</div>;
}

export default FriendLayout;