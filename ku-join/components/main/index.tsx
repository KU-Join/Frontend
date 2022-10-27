import React, {useEffect} from 'react';
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
  WrapTitle
} from './main-style';

import { BsFillMicFill, BsPlusLg } from 'react-icons/bs';
import { MdHeadset } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';

import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

type ClubMain = {
    구기체육분과: Array<ClubItem>;
    레저무예분과: Array<ClubItem>;
    봉사분과: Array<ClubItem>;
    어학분과: Array<ClubItem>;
    연행예술분과: Array<ClubItem>;
    인문사회분과: Array<ClubItem>;
    자연과학분과: Array<ClubItem>;
    종교분과: Array<ClubItem>;
    창작비평분과: Array<ClubItem>;
    가등록: Array<ClubItem>;
}

type ClubItem = {
    club_name: string;
    club_id: number;
    club_img: string;
    club_description: string;
    opened: boolean;
    club_URL: string;
};


const MainLayout = () => {
  //확인했을 때 참여 중인 동아리가 0개일 때는 없다고 띄워주기 & 친구도 (+길어지면 스크롤)
  //마이크, 스피커 on/off에 따라 다른 아이콘
  //axios 활용해보기

  //닉네임을 메인에 두고 싶으니까 여기서 user의 닉네임에 접근할 수 있도록 GET를 하면 좋겠다.

  const router = useRouter();

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

  const MakeClubClick = (e:any) => {
    e.preventDefault();
    router.push("./makeclub")
  }

  const getProducts = async (): Promise<ClubMain> => {
    return await (await fetch('https://kujoin.herokuapp.com/http://35.170.94.193/club-list')).json();
  };
  
  
    const { data, isLoading, error } = useQuery(['products'], getProducts);
  
    if (isLoading) return <div>'Loading...'</div>;
  
    if (error) return <div>'Error..'</div>;
  
    if (data != undefined) {

      let sports: JSX.Element[];
      sports = data.구기체육분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));
      
      let leisure: JSX.Element[];
      leisure = data.레저무예분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));

      let volunteer_work: JSX.Element[];
      volunteer_work = data.봉사분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));
      
      let language: JSX.Element[];
      language = data.어학분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));

      let art: JSX.Element[];
      art = data.연행예술분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));

      let humanities: JSX.Element[];
      humanities = data.인문사회분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));

      let science: JSX.Element[];
      science = data.자연과학분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));

      let religion: JSX.Element[];
      religion = data.종교분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));

      let creation: JSX.Element[];
      creation = data.창작비평분과.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));

      let provisional_registration: JSX.Element[];
      provisional_registration = data.가등록.map((club: ClubItem) => (
        <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white"}}
        key={club.club_name}
        >
            <img src={club.club_img} style={{width: "300px", height: "150px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}>{club.club_name}</span>
                <button style={{padding: "10px", backgroundColor: "#D9D9D9", borderRadius: "20px"}}>자세히 보기</button>
            </div>
        </div>
      ));
      
      
  
    

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
        <WrapTitle>
            <MainTitle>동아리 살펴보기</MainTitle>
            <button style={{padding: "10px", backgroundColor: "#F1EEEE", borderRadius: "20px"}} onClick={MakeClubClick}>동아리 만들기</button>
        </WrapTitle>
        <ScrollContainer style={{height: "100vh"}} horizontal={false}>
            <WrapClubTypes style={{display: "flex", maxHeight: "400px", gap: "10px"}}>
                <WrapClubType>
                    <ClubType>구기체육분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "50px"}}>
                                {sports}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>레저무예분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {leisure}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>봉사분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {volunteer_work}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>어학분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {language}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>연행예술분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {art}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>인문사회분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {humanities}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>자연과학분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {science}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>종교분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {religion}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>창작비평분과</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {creation}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
                <WrapClubType>
                    <ClubType>가등록</ClubType>
                    <WrapClub>
                        <ScrollContainer style={{width: "70vw"}} vertical={false}>
                            <div style={{display: "flex", maxWidth: "50px", gap: "10px"}}>
                                {provisional_registration}
                            </div>
                        </ScrollContainer>
                    </WrapClub>
                </WrapClubType>
            </WrapClubTypes>
        </ScrollContainer>
      </Contents>
    </Container>
  );
    }

    return (
        <div>data is undefined</div>
    )
};

export default MainLayout;
