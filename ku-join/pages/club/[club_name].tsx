import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  WrapButton,
} from '../../components/main/main-style';

import { Input } from '../../components/signup-form/signup-form-style';
import Modal from 'react-modal';

import { BsFillMicFill, BsPlusLg, BsFillMicMuteFill } from 'react-icons/bs';
import { MdHeadset, MdHeadsetOff } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';
import { AiFillCloseSquare } from 'react-icons/ai'
import { check } from 'prettier';

type ClubDetailInfoItem = {
  club_id: number;
  club_name: string;
  club_img: string;
  club_description: string;
  category: string;
  opened: boolean;
  club_URL: null;
  leader_id: string;
}

type UserClubAll = {
  contents: Array<UserClubListItem>
}

type UserClubListItem = {
  club_id: number;
  club_name: string;
  leader: boolean;
};

type UserClubListItemEmpty = {
  club_id: [];
}


type FeedAll = {
  contents: Array<FeedItem>
}


type FeedItem = {
  feed_uploader: string;
  feed_img: string;
  feed_contents: string;
  time: string;
}

type CheckMemberLeaderAll = {
  contents: Array<CheckMemberLeader>
}

type CheckMemberLeader = {
  member: boolean;
  leader: boolean;
}

type FriendListItem = {
  email : string;
  nickname : string;
  state : string;
}

const Club_PR: NextPage = () => {
  const queryClient = useQueryClient()
  queryClient.invalidateQueries(['ClubDetailInfo'])
  queryClient.invalidateQueries(['UsersclubList'])
  queryClient.invalidateQueries(['ClubFeed'])
  queryClient.invalidateQueries(['UsersClubListEmpty'])
  queryClient.invalidateQueries(['MemberLeader'])
  queryClient.invalidateQueries(['friends'])

  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const { club_name, club_id } = router.query;

  let clubname = club_name as string;
  let clubidUnknown = club_id as unknown;
  let clubid = clubidUnknown as number
  let clubID = club_id as string


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
    router.push('../main');
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

  const onclick = (club_name: string, club_id: number) => {
    router.push(
      {
        pathname: './manage/[club_name]',
        query: {
          club_name: club_name,
          club_id: club_id
        },
      },
      './manage/[club_name]'
    );
  };

/*
  if (typeof window !== 'undefined') 
 
  if (typeof sessionStorage.getItem('clubID') == 'string') {
    let clubID = sessionStorage.getItem('clubID') as string
    console.log(clubID)
*/

  const JoinClubClick = () => {
    console.log("클릭중")
    const userID = sessionStorage.getItem('id');
    const ClubID = sessionStorage.getItem('clubID');

    fetch(API_URL + '/club-service/club-apply', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_URL,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        club_id: ClubID,
        user_id: userID
      })
    })
    .then((response) => {
      response.status === 201 ? alert("동아리 가입신청이 완료되었습니다. 동아리장이 가입 승인을 하면 채팅채널에 입장 가능합니다.") : alert("가입실패")
    })
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  
  const getClubDetailInfo = async (): Promise<ClubDetailInfoItem> => {
    const ClubID = sessionStorage.getItem('clubID');
    return await (await fetch(API_URL + '/club-service/club-information/' + ClubID)).json();
  }

/*
  const getClubFeed = async (): Promise<FeedItem[]> => {
    return await (await fetch(API_URL + '/club-service/club-feed/' + clubID)).json();
  }
*/

  
  const getClubFeed = async (): Promise<FeedAll> => {
    const ClubID = sessionStorage.getItem('clubID');
    return await (await fetch(API_URL + '/club-service/club-feed/' + ClubID)).json();
  }
  

  const getCheckMemberLeader = async (): Promise<CheckMemberLeader> => {
    const userID = sessionStorage.getItem('id');
    const ClubID = sessionStorage.getItem('clubID');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID + '/' + ClubID)).json();
  }

  const {data: data1, isLoading: isLoading1, error: error1} = useQuery(['ClubDetailInfo'], getClubDetailInfo)

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery(['UsersclubList'], getUsersClubList);

  const {data: data3, isLoading: isLoading3, error: error3} = useQuery(['ClubFeed'], getClubFeed)

  const {data: data4, isLoading: isLoading4, error: error4} = useQuery(['UsersClubListEmpty'], getUsersClubListEmpty);

  const {data: data5, isLoading: isLoading5, error: error5} = useQuery(['MemberLeader'], getCheckMemberLeader);

  const {data: data6, isLoading: isLoading6, error: error6} = useQuery(['friends'], getFriendList)


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

  if (isLoading5) {
    return (
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"}}>
        <Image src={LoadingSpinner}/>
        <div>Loading...</div>
      </div>
    )
  }

  if (isLoading6) {
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

  if (error5) return <div>'Error..'</div>;

  if (error6) return <div>'Error..'</div>;

  if (((((data1 != undefined) && (data2 != undefined)) && (data3 != undefined)) && (data5 != undefined)) && (data4 != undefined) && (data6 != undefined)) {
    /*data5의 경우의 수 - A 동아리의 리더(멤버O) / 리더X(멤버O) / 멤버X */
    /*data4?.club_id의 경우의 수 -undefined: 뭐라도 하나 속한 동아리가 있음. !undefined: 아무 곳에도 속한 동아리가 없음. 고로 A 동아리의 리더이거나 멤버일 수 없음. 무조건 멤버X암*/

    console.log(data2)
    
    const RecruitState: any = () => {
      if (data1.opened == true) {
        return (
          <button
                  style={{
                    width: '150px',
                    height: '45px',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  모집중
                </button>
        )
      }

      else {
        return (
          <button
                  style={{
                    width: '150px',
                    height: '45px',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  모집종료
                </button>
        )
      }
    }

    const JoinState: any = () => {
      if (data1.opened == true) {
        //현우님 수정 확인 후 let count = 0 만들어서 1되면 승인 대기로 바꿔주자
        return (
          <button
                  style={{
                    cursor: 'pointer',
                    width: '150px',
                    height: '45px',
                    backgroundColor: '#F0D2D2',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                onClick={() => JoinClubClick()}>
                  가입하기
                </button>
        )
      }

      else {
        return (
          <button
                  style={{
                    width: '150px',
                    height: '45px',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                onClick={() => alert("현재는 모집기간이 아닙니다.")}>
                  가입불가
                </button>
        )
      }
    }

    if (data5.leader == true) {

      if (data6.length == 0) {

        return(
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
                    <LogoTitle
                      style={{ color: '#2ABF4B', cursor: 'pointer' }}
                      onClick={handleClick}
                    >
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
                      onClick={() => router.push('../setup')}
                    />
                  </UserStatus>
                </WrapUserStatus>
              </WrapContents>
              <Contents>
                <WrapButton style={{ width: '70vw' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <MainTitle>{club_name}</MainTitle>
                    <button
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '45px',
                      backgroundColor: '#333333',
                      border: 'none',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                    onClick={() => onclick(clubname, clubid)}
                  >
                    동아리 관리
                  </button>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <RecruitState/>
                    <button
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#DDEAEF',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                      }}
                      onClick={() => router.push(
                        {
                          pathname: './chat/[club_name]',
                          query: {
                            club_name: club_name,
                            club_id: club_id
                          },
                        },
                        './chat/[club_name]'
                      )}>
                      입장하기
                    </button>
                  </div>
                </WrapButton>
                <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
                  {data1.club_description}
            </p>
                <div>
                  <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                  {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

                  </ScrollContainer>
                </div>
              </Contents>
            </Container>
          );

      }

      else {

        return(
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
                    <LogoTitle
                      style={{ color: '#2ABF4B', cursor: 'pointer' }}
                      onClick={handleClick}
                    >
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
                    <div>{data6 && data6.map((Friends: FriendListItem) => {
                  return (
                    <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
                  )
                })}</div>
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
                      onClick={() => router.push('../setup')}
                    />
                  </UserStatus>
                </WrapUserStatus>
              </WrapContents>
              <Contents>
                <WrapButton style={{ width: '70vw' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <MainTitle>{club_name}</MainTitle>
                    <button
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '45px',
                      backgroundColor: '#333333',
                      border: 'none',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                    onClick={() => onclick(clubname, clubid)}
                  >
                    동아리 관리
                  </button>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <RecruitState/>
                    <button
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#DDEAEF',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                      }}
                      onClick={() => router.push(
                        {
                          pathname: './chat/[club_name]',
                          query: {
                            club_name: club_name,
                            club_id: club_id
                          },
                        },
                        './chat/[club_name]'
                      )}>
                      입장하기
                    </button>
                  </div>
                </WrapButton>
                <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
                  {data1.club_description}
            </p>
                <div>
                  <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                  {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

                  </ScrollContainer>
                </div>
              </Contents>
            </Container>
          );

      }

      
    }

    if ((data5.leader == false) && (data5.member == true)) {

      if (data6.length == 0) {

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
                  <LogoTitle
                    style={{ color: '#2ABF4B', cursor: 'pointer' }}
                    onClick={handleClick}
                  >
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
                    onClick={() => router.push('../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <WrapButton style={{ width: '70vw' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MainTitle>{club_name}</MainTitle>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '45px',
                      backgroundColor: '#DDEAEF',
                      border: 'none',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => router.push(
                      {
                        pathname: './chat/[club_name]',
                        query: {
                          club_name: club_name,
                          club_id: club_id
                        },
                      },
                      './chat/[club_name]'
                    )}>
                    입장하기
                  </button>
                </div>
              </WrapButton>
              <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
                {data1.club_description}
          </p>
              <div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

                </ScrollContainer>
              </div>
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
                  <LogoTitle
                    style={{ color: '#2ABF4B', cursor: 'pointer' }}
                    onClick={handleClick}
                  >
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
                  <div>{data6 && data6.map((Friends: FriendListItem) => {
                  return (
                    <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
                  )
                })}</div>
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
                    onClick={() => router.push('../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <WrapButton style={{ width: '70vw' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MainTitle>{club_name}</MainTitle>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '45px',
                      backgroundColor: '#DDEAEF',
                      border: 'none',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => router.push(
                      {
                        pathname: './chat/[club_name]',
                        query: {
                          club_name: club_name,
                          club_id: club_id
                        },
                      },
                      './chat/[club_name]'
                    )}>
                    입장하기
                  </button>
                </div>
              </WrapButton>
              <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
                {data1.club_description}
          </p>
              <div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

                </ScrollContainer>
              </div>
            </Contents>
          </Container>
        );

      }
    }

    if (data5.member == false) {

      if (data6.length == 0) {

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
                  <LogoTitle
                    style={{ color: '#2ABF4B', cursor: 'pointer' }}
                    onClick={handleClick}
                  >
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
                    onClick={() => router.push('../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <WrapButton style={{ width: '70vw' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MainTitle>{club_name}</MainTitle>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <JoinState/>
                  <button
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '45px',
                      backgroundColor: '#DDEAEF',
                      border: 'none',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => alert(clubname+'의 동아리원이 아닙니다. 입장을 원하시면 가입을 해주십시오.')}>
                    입장하기
                  </button>
                </div>
              </WrapButton>
              <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
                {data1.club_description}
          </p>
              <div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

                </ScrollContainer>
              </div>
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
                  <LogoTitle
                    style={{ color: '#2ABF4B', cursor: 'pointer' }}
                    onClick={handleClick}
                  >
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
                  <div>{data6 && data6.map((Friends: FriendListItem) => {
                  return (
                    <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
                  )
                })}</div>
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
                    onClick={() => router.push('../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <WrapButton style={{ width: '70vw' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MainTitle>{club_name}</MainTitle>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <JoinState/>
                  <button
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '45px',
                      backgroundColor: '#DDEAEF',
                      border: 'none',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => alert(clubname+'의 동아리원이 아닙니다. 입장을 원하시면 가입을 해주십시오.')}>
                    입장하기
                  </button>
                </div>
              </WrapButton>
              <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
                {data1.club_description}
          </p>
              <div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

                </ScrollContainer>
              </div>
            </Contents>
          </Container>
        );

      }
      
    }

  }

  /*
  if (((((data1 != undefined) && (data2 != undefined)) && (data3 != undefined)) && (data5 != undefined)) && (data4 != undefined) && (data6 != undefined)) {

    console.log(data4)
    console.log("hey")

    const JoinState: any = () => {
      if (data1.opened == true) {
        return (
          <button
                  style={{
                    cursor: 'pointer',
                    width: '150px',
                    height: '45px',
                    backgroundColor: '#F0D2D2',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                onClick={() => JoinClubClick()}>
                  가입하기
                </button>
        )
      }

      else {
        return (
          <button
                  style={{
                    width: '150px',
                    height: '45px',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                  onClick={() => alert("현재는 모집기간이 아닙니다.")}>
                  가입불가
                </button>
        )
      }
    }

    if (data6.length == 0) {
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
                <LogoTitle
                  style={{ color: '#2ABF4B', cursor: 'pointer' }}
                  onClick={handleClick}
                >
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
                  onClick={() => router.push('../setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <Contents>
            <WrapButton style={{ width: '70vw' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MainTitle>{club_name}</MainTitle>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <JoinState/>
                <button
                  style={{
                    cursor: 'pointer',
                    width: '150px',
                    height: '45px',
                    backgroundColor: '#DDEAEF',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                onClick={() => alert(clubname+'의 동아리원이 아닙니다. 입장을 원하시면 가입을 해주십시오.')}>
                  입장하기
                </button>
              </div>
            </WrapButton>
            <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
              {data1.club_description}
        </p>
            <div>
              <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
              {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

              </ScrollContainer>
            </div>
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
                <LogoTitle
                  style={{ color: '#2ABF4B', cursor: 'pointer' }}
                  onClick={handleClick}
                >
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
                <div>{data6 && data6.map((Friends: FriendListItem) => {
                  return (
                    <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
                  )
                })}</div>
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
                  onClick={() => router.push('../setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <Contents>
            <WrapButton style={{ width: '70vw' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MainTitle>{club_name}</MainTitle>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <JoinState/>
                <button
                  style={{
                    cursor: 'pointer',
                    width: '150px',
                    height: '45px',
                    backgroundColor: '#DDEAEF',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }}
                onClick={() => alert(clubname+'의 동아리원이 아닙니다. 입장을 원하시면 가입을 해주십시오.')}>
                  입장하기
                </button>
              </div>
            </WrapButton>
            <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
              {data1.club_description}
        </p>
            <div>
              <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                
              {data3 && data3.contents.map((feed: FeedItem) => {
      return (
        <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
                key={feed.time}
              >
                <img
                  src={feed.feed_img}
                  style={{
                    width: '300px',
                    height: '400px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    objectFit: 'cover',
                  }}
                  alt=""
                />
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {feed.feed_contents}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>{feed.time}</p>
                </div>
              </div>
      )
    })}

              </ScrollContainer>
            </div>
          </Contents>
        </Container>
      );
    }
    
  }
  */
  
  return <div>data is undefined</div>;
}

export default Club_PR;
