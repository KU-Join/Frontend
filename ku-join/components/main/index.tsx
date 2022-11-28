import React, { useEffect, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
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
  WrapTitle,
} from './main-style';

import { Input } from '../signup-form/signup-form-style';
import Modal from 'react-modal';

import { BsFillMicFill, BsPlusLg, BsFillMicMuteFill } from 'react-icons/bs';
import { MdHeadset, MdHeadsetOff } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';
import { AiFillCloseSquare } from 'react-icons/ai'

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
};

type ClubItem = {
  club_name: string;
  club_id: number;
  club_img: string;
  club_description: string;
  opened: boolean;
  club_URL: string;
};

type UserClubAll = {
  contents: Array<UserClubListItem>
}

type UserClubListItem = {
  club_id: number;
  club_name: string;
  leader: boolean;
};

type UserClubListItemEmpty = {
  contents: {
    club_id: [];
  }
    
}

type FriendListItem = {
  email : string;
  nickname : string;
  state : string;
}

const MainLayout = () => {
  //확인했을 때 참여 중인 동아리가 0개일 때는 없다고 띄워주기 & 친구도 (+길어지면 스크롤)
  //마이크, 스피커 on/off에 따라 다른 아이콘
  //axios 활용해보기

  //닉네임을 메인에 두고 싶으니까 여기서 user의 닉네임에 접근할 수 있도록 GET를 하면 좋겠다.

  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [friendID, setFriendID] = useState({
    friendid: '',
  });

  const [MICIsOn, setMICIsOn] = useState(true);
  const [MICIsOff, setMICISOff] = useState(false);
  const [HeadsetIsOn, setHeadsetIsOn] = useState(true);
  const [HeadsetIsOff, setHeadsetIsOff] = useState(false);

  const Username: any = () => {
    if (typeof window !== 'undefined') {
      const userToken = sessionStorage.getItem('token');
      const userID = sessionStorage.getItem('id');

      //로그인 없이 main 접근 시 index 화면으로 이동
      if (userID == null) {
        router.push('./');
      }

      return <UserName>{userID}</UserName>;
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    window.location.reload();
  };

  const MakeClubClick = (e: any) => {
    e.preventDefault();
    router.push('./makeclub');
  };

  const handleFriendIDInputChange = (e: any) => {
    setFriendID({ ...friendID, [e.target.name]: e.target.value});
  };

  const friendRequestSubmit = (e:any) => {
    e.preventDefault();
    const userID = sessionStorage.getItem('id');

    fetch(API_URL + "/member-service/friends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_URL,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        email: userID + "@konkuk.ac.kr",
        friendEmail: friendID.friendid + "@konkuk.ac.kr"
      })
    })
    .then((response) => {
      response.status == 200 ? alert("요청 성공") : alert("요청 실패")
    })
  }


  const getFriendList = async (): Promise<FriendListItem[]> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/member-service/friends?email=' + userID + '@konkuk.ac.kr')
    ).json();
};

/*
  const getUsersClubList = async (): Promise<UserClubListItem[]> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID)
    ).json();
  };
*/

  const getUsersClubList = async (): Promise<UserClubAll> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID)
    ).json();
  };


  const getUsersClubListEmpty = async (): Promise<UserClubListItemEmpty> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID)
    ).json();
  };

  const getProducts = async (): Promise<ClubMain> => {
    return await (await fetch(API_URL + '/club-service/club-list')).json();
  };

  const onclick = (
    club_name: string,
    club_id: number
  ) => {
    let club_id_unknown = club_id as unknown;
    let clubID = club_id_unknown as string;
    if (sessionStorage.getItem('clubID')) {
      sessionStorage.removeItem('clubID')
      sessionStorage.setItem('clubID', clubID)
    }
    else {
      sessionStorage.setItem('clubID', clubID)
    }

    if (sessionStorage.getItem('clubName')) {
      sessionStorage.removeItem('clubName')
      sessionStorage.setItem('clubName', club_name)
    }
    else {
      sessionStorage.setItem('clubName', club_name)
    }
    
    router.push(
      {
        pathname: './club/[club_name]',
        query: {
          club_name: club_name,
          club_id: club_id
        },
      },
      './club/[club_name]'
    );
  };

  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useQuery(['products'], getProducts);
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery(['UsersclubList'], getUsersClubList);

  const {
    data: data3,
    isLoading: isLoading3,
    error: error3,
  } = useQuery(['UsersClubListEmpty'], getUsersClubListEmpty);

  const {data: data4, isLoading: isLoading4, error: error4} = useQuery(['friends'], getFriendList)

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

  if (isLoading3) {
    return (
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"}}>
        <Image src={LoadingSpinner}/>
        <div>Loading...</div>
      </div>
      )
  }

  if (isLoading4) {
    return (
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"}}>
        <Image src={LoadingSpinner}/>
        <div>Loading...</div>
      </div>
      )
  }

  if (error1) return <div>'Error..'</div>;

  if (error2) return <div>'Error..'</div>;

  if (error3) return <div>'Error..'</div>;

  if (error4) return <div>'Error..'</div>;

  /*
  if ((data1 != undefined) && (data2 != undefined) && (data3?.club_id == undefined) && (data4 != undefined)) {
    return (
      <div>
        { data1 && data1.구기체육분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                { data1 && data1.레저무예분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
        { data2 && data2.contents.map((club: UserClubListItem) => {
        return (<JoinedClub key={club.club_id}>
        <JoinedClubImg />
        <JoinedClubName>{club.club_name}</JoinedClubName>
      </JoinedClub>)
      })}

      </div>
      
    )
  }
  */

  if ((((data1 != undefined) && (data2 != undefined)) && (data3?.contents.club_id == undefined)) && (data4 != undefined)) {

    console.log(data4)

    if (data4.length == 0) {

      return (
        <Container>
          <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            style={{
              overlay: {
                margin: 'auto',
                width: '700px',
                height: '500px',
                backgroundColor: 'white',
                borderRadius: '20px',
              },
            }}
            contentElement={(props, children) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '700px',
                  height: '500px',
                }}
              >
                <form>
                  <div style={{display: 'flex', justifyContent: "right", width: "500px"}}>
                    <AiFillCloseSquare onClick={() => setModalIsOpen(false)} style={{cursor: "pointer", width: "50px", height: "50px"}}/>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '50px',
                    }}
                  >
                    <p style={{ color: '#b72929', textAlign: 'left' }}>
                      친구로 추가할 분의 아이디를 입력해주세요.
                    </p>
                    <input
                      type="text"
                      id="friendid"
                      name="friendid"
                      placeholder=""
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'none',
                        width: '250px',
                      }}
                      value={friendID.friendid}
                      onChange={handleFriendIDInputChange}
                    ></input>
                    <button
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#F1EEEE',
                        border: 'none',
                        borderRadius: '20px',
                      }}
                      onClick={(e) => {friendRequestSubmit(e)}}
                    >제출</button>
                  </div>
                </form>
              </div>
            )}
          ></Modal>
          <WrapContents>
            <UserInfo>
              <Logo>
                <LogoTitle onClick={handleClick}>KU:</LogoTitle>
                <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                  JOIN
                </LogoTitle>
              </Logo>
              <WrapFriendList>
                <WrapFriendListTitle>
                  <ContentTitle>친구</ContentTitle>
                  <BsPlusLg
                    style={{ color: 'black', cursor: 'pointer' }}
                    onClick={() => {
                      setModalIsOpen(true);
                    }}
                  />
                </WrapFriendListTitle>
                <div style={{marginTop: "20px"}}>친구 목록이 존재하지 않습니다.</div>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <div style={{marginTop: "10px"}}>{ data2 && data2.contents.map((club: UserClubListItem) => {
                return (<JoinedClub key={club.club_id}>
                <JoinedClubImg />
                <JoinedClubName>{club.club_name}</JoinedClubName>
              </JoinedClub>)
              })}</div>
              </WrapJoinedClub>
            </UserInfo>
            <WrapUserStatus>
              <UserProfile>
                <UserImg />
                <Username />
              </UserProfile>
              <UserStatus>
                {MICIsOn && <BsFillMicFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {MICIsOff && <BsFillMicMuteFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOn && <MdHeadset style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOff && <MdHeadsetOff style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                <RiSettings2Fill
                  style={{ color: '#B9BBBE', cursor: 'pointer' }}
                  onClick={() => router.push('./setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <Contents>
            <WrapTitle>
              <MainTitle>동아리 살펴보기</MainTitle>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#F1EEEE',
                  borderRadius: '20px',
                }}
                onClick={MakeClubClick}
              >
                동아리 만들기
              </button>
            </WrapTitle>
            <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
              <WrapClubTypes
                style={{ display: 'flex', maxHeight: '400px', gap: '10px' }}
              >
                <WrapClubType>
                  <ClubType>구기체육분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.구기체육분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>레저무예분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.레저무예분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>봉사분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.봉사분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>어학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.어학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>연행예술분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.연행예술분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>인문사회분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.인문사회분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>자연과학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.자연과학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>종교분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.종교분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>창작비평분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.창작비평분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>가등록</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.가등록.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
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

    else {

      return (
        <Container>
          <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            style={{
              overlay: {
                margin: 'auto',
                width: '700px',
                height: '500px',
                backgroundColor: 'white',
                borderRadius: '20px',
              },
            }}
            contentElement={(props, children) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '700px',
                  height: '500px',
                }}
              >
                <form>
                  <div style={{display: 'flex', justifyContent: "right", width: "500px"}}>
                    <AiFillCloseSquare onClick={() => setModalIsOpen(false)} style={{cursor: "pointer", width: "50px", height: "50px"}}/>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '50px',
                    }}
                  >
                    <p style={{ color: '#b72929', textAlign: 'left' }}>
                      친구로 추가할 분의 아이디를 입력해주세요.
                    </p>
                    <input
                      type="text"
                      id="friendid"
                      name="friendid"
                      placeholder=""
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'none',
                        width: '250px',
                      }}
                      value={friendID.friendid}
                      onChange={handleFriendIDInputChange}
                    ></input>
                    <button
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#F1EEEE',
                        border: 'none',
                        borderRadius: '20px',
                      }}
                      onClick={(e) => {friendRequestSubmit(e)}}
                    >제출</button>
                  </div>
                </form>
              </div>
            )}
          ></Modal>
          <WrapContents>
            <UserInfo>
              <Logo>
                <LogoTitle onClick={handleClick}>KU:</LogoTitle>
                <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                  JOIN
                </LogoTitle>
              </Logo>
              <WrapFriendList>
                <WrapFriendListTitle>
                  <ContentTitle>친구</ContentTitle>
                  <BsPlusLg
                    style={{ color: 'black', cursor: 'pointer' }}
                    onClick={() => {
                      setModalIsOpen(true);
                    }}
                  />
                </WrapFriendListTitle>
                <div>
                {data4 && data4.map((Friends: FriendListItem) => {
                  return (
                    <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
                  )
                })}
                </div>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <div style={{marginTop: "10px"}}>{ data2 && data2.contents.map((club: UserClubListItem) => {
                return (<JoinedClub key={club.club_id}>
                <JoinedClubImg />
                <JoinedClubName>{club.club_name}</JoinedClubName>
              </JoinedClub>)
              })}</div>
              </WrapJoinedClub>
            </UserInfo>
            <WrapUserStatus>
              <UserProfile>
                <UserImg />
                <Username />
              </UserProfile>
              <UserStatus>
                {MICIsOn && <BsFillMicFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {MICIsOff && <BsFillMicMuteFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOn && <MdHeadset style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOff && <MdHeadsetOff style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                <RiSettings2Fill
                  style={{ color: '#B9BBBE', cursor: 'pointer' }}
                  onClick={() => router.push('./setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <Contents>
            <WrapTitle>
              <MainTitle>동아리 살펴보기</MainTitle>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#F1EEEE',
                  borderRadius: '20px',
                }}
                onClick={MakeClubClick}
              >
                동아리 만들기
              </button>
            </WrapTitle>
            <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
              <WrapClubTypes
                style={{ display: 'flex', maxHeight: '400px', gap: '10px' }}
              >
                <WrapClubType>
                  <ClubType>구기체육분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.구기체육분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>레저무예분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.레저무예분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>봉사분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.봉사분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>어학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.어학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>연행예술분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.연행예술분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>인문사회분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.인문사회분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>자연과학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.자연과학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>종교분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.종교분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>창작비평분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.창작비평분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>가등록</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.가등록.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
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

    
  }

  if((((data1 != undefined) && (data2 != undefined)) && (data3?.contents.club_id != undefined)) && (data4 != undefined)) {

    console.log(data4)

    if (data4.length == 0) {
      return (
        <Container>
          <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            style={{
              overlay: {
                margin: 'auto',
                width: '700px',
                height: '500px',
                backgroundColor: 'white',
                borderRadius: '20px',
              },
            }}
            contentElement={(props, children) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '700px',
                  height: '500px',
                }}
              >
                <form>
                  <div style={{display: 'flex', justifyContent: "right", width: "500px"}}>
                    <AiFillCloseSquare onClick={() => setModalIsOpen(false)} style={{cursor: "pointer", width: "50px", height: "50px"}}/>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '50px',
                    }}
                  >
                    <p style={{ color: '#b72929', textAlign: 'left' }}>
                      친구로 추가할 분의 아이디를 입력해주세요.
                    </p>
                    <input
                      type="text"
                      id="friendid"
                      name="friendid"
                      placeholder=""
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'none',
                        width: '250px',
                      }}
                      value={friendID.friendid}
                      onChange={handleFriendIDInputChange}
                    ></input>
                    <button
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#F1EEEE',
                        border: 'none',
                        borderRadius: '20px',
                      }}
                      onClick={(e) => {friendRequestSubmit(e)}}
                    >제출</button>
                  </div>
                </form>
              </div>
            )}
          ></Modal>
          <WrapContents>
            <UserInfo>
              <Logo>
                <LogoTitle onClick={handleClick}>KU:</LogoTitle>
                <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                  JOIN
                </LogoTitle>
              </Logo>
              <WrapFriendList>
                <WrapFriendListTitle>
                  <ContentTitle>친구</ContentTitle>
                  <BsPlusLg
                    style={{ color: 'black', cursor: 'pointer' }}
                    onClick={() => {
                      setModalIsOpen(true);
                    }}
                  />
                </WrapFriendListTitle>
                <div style={{marginTop: "20px"}}>친구 목록이 존재하지 않습니다.</div>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <div style={{marginTop: "20px"}}>가입한 동아리가 없습니다.</div>
              </WrapJoinedClub>
            </UserInfo>
            <WrapUserStatus>
              <UserProfile>
                <UserImg />
                <Username />
              </UserProfile>
              <UserStatus>
                {MICIsOn && <BsFillMicFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {MICIsOff && <BsFillMicMuteFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOn && <MdHeadset style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOff && <MdHeadsetOff style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                <RiSettings2Fill
                  style={{ color: '#B9BBBE', cursor: 'pointer' }}
                  onClick={() => router.push('./setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <Contents>
            <WrapTitle>
              <MainTitle>동아리 살펴보기</MainTitle>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#F1EEEE',
                  borderRadius: '20px',
                }}
                onClick={MakeClubClick}
              >
                동아리 만들기
              </button>
            </WrapTitle>
            <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
              <WrapClubTypes
                style={{ display: 'flex', maxHeight: '400px', gap: '10px' }}
              >
                <WrapClubType>
                  <ClubType>구기체육분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.구기체육분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>레저무예분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.레저무예분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>봉사분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.봉사분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>어학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.어학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>연행예술분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.연행예술분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>인문사회분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.인문사회분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>자연과학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.자연과학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>종교분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.종교분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>창작비평분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.창작비평분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>가등록</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.가등록.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
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

    else {

      return (
        <Container>
          <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            style={{
              overlay: {
                margin: 'auto',
                width: '700px',
                height: '500px',
                backgroundColor: 'white',
                borderRadius: '20px',
              },
            }}
            contentElement={(props, children) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '700px',
                  height: '500px',
                }}
              >
                <form>
                  <div style={{display: 'flex', justifyContent: "right", width: "500px"}}>
                    <AiFillCloseSquare onClick={() => setModalIsOpen(false)} style={{cursor: "pointer", width: "50px", height: "50px"}}/>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '50px',
                    }}
                  >
                    <p style={{ color: '#b72929', textAlign: 'left' }}>
                      친구로 추가할 분의 아이디를 입력해주세요.
                    </p>
                    <input
                      type="text"
                      id="friendid"
                      name="friendid"
                      placeholder=""
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'none',
                        width: '250px',
                      }}
                      value={friendID.friendid}
                      onChange={handleFriendIDInputChange}
                    ></input>
                    <button
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#F1EEEE',
                        border: 'none',
                        borderRadius: '20px',
                      }}
                      onClick={(e) => {friendRequestSubmit(e)}}
                    >제출</button>
                  </div>
                </form>
              </div>
            )}
          ></Modal>
          <WrapContents>
            <UserInfo>
              <Logo>
                <LogoTitle onClick={handleClick}>KU:</LogoTitle>
                <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                  JOIN
                </LogoTitle>
              </Logo>
              <WrapFriendList>
                <WrapFriendListTitle>
                  <ContentTitle>친구</ContentTitle>
                  <BsPlusLg
                    style={{ color: 'black', cursor: 'pointer' }}
                    onClick={() => {
                      setModalIsOpen(true);
                    }}
                  />
                </WrapFriendListTitle>
                <div>
                {data4 && data4.map((Friends: FriendListItem) => {
                  return (
                    <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
                  )
                })}
                </div>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <div style={{marginTop: "20px"}}>가입한 동아리가 없습니다.</div>
              </WrapJoinedClub>
            </UserInfo>
            <WrapUserStatus>
              <UserProfile>
                <UserImg />
                <Username />
              </UserProfile>
              <UserStatus>
                {MICIsOn && <BsFillMicFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {MICIsOff && <BsFillMicMuteFill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setMICIsOn((e) => !e), setMICISOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOn && <MdHeadset style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                {HeadsetIsOff && <MdHeadsetOff style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => {setHeadsetIsOn((e) => !e), setHeadsetIsOff((e) => !e), alert("추후 구현 예정")}}/>}
                <RiSettings2Fill
                  style={{ color: '#B9BBBE', cursor: 'pointer' }}
                  onClick={() => router.push('./setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <Contents>
            <WrapTitle>
              <MainTitle>동아리 살펴보기</MainTitle>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#F1EEEE',
                  borderRadius: '20px',
                }}
                onClick={MakeClubClick}
              >
                동아리 만들기
              </button>
            </WrapTitle>
            <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
              <WrapClubTypes
                style={{ display: 'flex', maxHeight: '400px', gap: '10px' }}
              >
                <WrapClubType>
                  <ClubType>구기체육분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.구기체육분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>레저무예분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.레저무예분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>봉사분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.봉사분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>어학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.어학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>연행예술분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.연행예술분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>인문사회분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.인문사회분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>자연과학분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.자연과학분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>종교분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.종교분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>창작비평분과</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.창작비평분과.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
                      </div>
                    </ScrollContainer>
                  </WrapClub>
                </WrapClubType>
                <WrapClubType>
                  <ClubType>가등록</ClubType>
                  <WrapClub>
                    <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                      <div
                        style={{ display: 'flex', maxWidth: '50px', gap: '50px' }}
                      >
                        { data1 && data1.가등록.map((club: ClubItem) => {
          return (
            <div
            style={{
              width: '300px',
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
            key={club.club_name}
          >
            <img
              src={club.club_img}
              style={{
                width: '300px',
                height: '150px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {club.club_name}
              </span>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                }}
                onClick={() =>
                  onclick(club.club_name, club.club_id)
                }
              >
                자세히 보기
              </button>
            </div>
          </div>
          )
        })}
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

    
  }


  return <div>data is undefined</div>;
};

export default MainLayout;
