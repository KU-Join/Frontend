import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
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
  WrapButton,
} from '../../components/main/main-style';

import { Input } from '../../components/signup-form/signup-form-style';
import Modal from 'react-modal';

import { BsFillMicFill, BsPlusLg } from 'react-icons/bs';
import { MdHeadset } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';
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

type UserClubListItem = {
  club_id: number;
  club_name: string;
  leader: boolean;
};

type UserClubListItemEmpty = {
  club_id: [];
}

type FeedItem = {
  feed_uploader: string;
  feed_img: string;
  feed_contents: string;
  time: string;
}

type CheckMemberLeader = {
  member: boolean;
  leader: boolean;
}

const Club_PR: NextPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const { club_name, club_id } = router.query;

  let clubname = club_name as string;
  let clubidUnknown = club_id as unknown;
  let clubid = clubidUnknown as number
  let clubID = club_id as string
 

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
    router.push('./');
  };

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

  const JoinClubClick = () => {
    console.log("클릭중")
    const userID = sessionStorage.getItem('id');

    fetch(API_URL + '/club-service/club-apply', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_URL,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        club_id: clubID,
        user_id: userID
      })
    })
    .then((response) => {
      response.status === 201 ? alert("동아리 가입신청이 완료되었습니다. 동아리장이 가입 승인을 하면 채팅채널에 입장 가능합니다.") : alert("가입실패")
    })
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getUsersClubList = async (): Promise<UserClubListItem[]> => {
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
    return await (await fetch(API_URL + '/club-service/club-information/' + clubID)).json();
  }

  const getClubFeed = async (): Promise<FeedItem[]> => {
    return await (await fetch(API_URL + '/club-service/club-feed/' + clubID)).json();
  }

  const getCheckMemberLeader = async (): Promise<CheckMemberLeader> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID + '/' + clubID)).json();
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

  if (isLoading1) return <div>'Loading...'</div>;

  if (isLoading2) return <div>'Loading...'</div>;

  if (isLoading3) return <div>'Loading...'</div>;

  if (isLoading4) return <div>'Loading...'</div>;

  if (isLoading5) return <div>'Loading...'</div>

  if (error1) return <div>'Error..'</div>;

  if (error2) return <div>'Error..'</div>;
  
  if (error3) return <div>'Error..'</div>;

  if (error4) return <div>'Error..'</div>;

  if (error5) return <div>'Error..'</div>;

  if (((((data1 != undefined) && (data2 != undefined)) && (data3 != undefined)) && (data5 != undefined)) && (data4?.club_id == undefined)) {
    /*data5의 경우의 수 - A 동아리의 리더(멤버O) / 리더X(멤버O) / 멤버X */
    /*data4?.club_id의 경우의 수 -undefined: 뭐라도 하나 속한 동아리가 있음. !undefined: 아무 곳에도 속한 동아리가 없음. 고로 A 동아리의 리더이거나 멤버일 수 없음. 무조건 멤버X암*/

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
                >
                  가입불가
                </button>
        )
      }
    }
  
    let usersClubListName: JSX.Element[];
    usersClubListName = data2.map((club: UserClubListItem) => (
      <JoinedClub key={club.club_id}>
        <JoinedClubImg />
        <JoinedClubName>{club.club_name}</JoinedClubName>
      </JoinedClub>
    ));

    let feedList: JSX.Element[];
    feedList = data3.map((feed: FeedItem) => (
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
    ))

    if (data5.leader == true) {

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
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '50px',
                    }}
                  >
                    <button onClick={() => setModalIsOpen(false)}>
                      (임시)닫는 버튼
                    </button>
                    <p style={{ color: '#b72929', textAlign: 'left' }}>
                      친구로 추가할 분의 아이디를 입력해주세요.
                    </p>
                    <input
                      type="text"
                      id="verify_code"
                      name="verify_code"
                      placeholder=""
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'none',
                        width: '250px',
                      }}
                    ></input>
                    <Input
                      type="button"
                      value="제출"
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#F1EEEE',
                        border: 'none',
                        borderRadius: '20px',
                      }}
                    ></Input>
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
                    style={{ color: 'black' }}
                    onClick={() => {
                      setModalIsOpen(true);
                    }}
                  />
                </WrapFriendListTitle>
                <Friend>김아무개</Friend>
                <Friend>이아무개</Friend>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <div>{usersClubListName}</div>
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
                  onClick={() => alert(clubname+'의 동아리원입니다. 채팅 채널로 입장 가능합니다.')}>
                  입장하기
                </button>
              </div>
            </WrapButton>
            <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
              {data1.club_description}
        </p>
            <div>
              <ScrollContainer style={{ height: '80vw' }} vertical={false}>
                  {feedList}
              </ScrollContainer>
            </div>
          </Contents>
        </Container>
      );
    }

    if ((data5.leader == false) && (data5.member == true)) {

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
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '50px',
                    }}
                  >
                    <button onClick={() => setModalIsOpen(false)}>
                      (임시)닫는 버튼
                    </button>
                    <p style={{ color: '#b72929', textAlign: 'left' }}>
                      친구로 추가할 분의 아이디를 입력해주세요.
                    </p>
                    <input
                      type="text"
                      id="verify_code"
                      name="verify_code"
                      placeholder=""
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'none',
                        width: '250px',
                      }}
                    ></input>
                    <Input
                      type="button"
                      value="제출"
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#F1EEEE',
                        border: 'none',
                        borderRadius: '20px',
                      }}
                    ></Input>
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
                    style={{ color: 'black' }}
                    onClick={() => {
                      setModalIsOpen(true);
                    }}
                  />
                </WrapFriendListTitle>
                <Friend>김아무개</Friend>
                <Friend>이아무개</Friend>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <div>{usersClubListName}</div>
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
                  onClick={() => alert(clubname+'의 동아리원입니다. 채팅 채널로 입장 가능합니다.')}>
                  입장하기
                </button>
              </div>
            </WrapButton>
            <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }} key={data1.club_id}>
              {data1.club_description}
        </p>
            <div>
              <ScrollContainer style={{ height: '80vw' }} vertical={false}>
                  {feedList}
              </ScrollContainer>
            </div>
          </Contents>
        </Container>
      );
    }

    if (data5.member == false) {

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
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '50px',
                    }}
                  >
                    <button onClick={() => setModalIsOpen(false)}>
                      (임시)닫는 버튼
                    </button>
                    <p style={{ color: '#b72929', textAlign: 'left' }}>
                      친구로 추가할 분의 아이디를 입력해주세요.
                    </p>
                    <input
                      type="text"
                      id="verify_code"
                      name="verify_code"
                      placeholder=""
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'none',
                        width: '250px',
                      }}
                    ></input>
                    <Input
                      type="button"
                      value="제출"
                      style={{
                        cursor: 'pointer',
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#F1EEEE',
                        border: 'none',
                        borderRadius: '20px',
                      }}
                    ></Input>
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
                    style={{ color: 'black' }}
                    onClick={() => {
                      setModalIsOpen(true);
                    }}
                  />
                </WrapFriendListTitle>
                <Friend>김아무개</Friend>
                <Friend>이아무개</Friend>
              </WrapFriendList>
              <WrapJoinedClub>
                <ContentTitle>내가 참여 중인 동아리</ContentTitle>
                <div>{usersClubListName}</div>
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
              <ScrollContainer style={{ height: '80vw' }} vertical={false}>
                  {feedList}
              </ScrollContainer>
            </div>
          </Contents>
        </Container>
      );
    }

    
  }

  if (((((data1 != undefined) && (data2 != undefined)) && (data3 != undefined)) && (data5 != undefined)) && (data4?.club_id != undefined)) {

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
                >
                  가입불가
                </button>
        )
      }
    }

    let feedList: JSX.Element[];
    feedList = data3.map((feed: FeedItem) => (
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
    ))

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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '50px',
                  }}
                >
                  <button onClick={() => setModalIsOpen(false)}>
                    (임시)닫는 버튼
                  </button>
                  <p style={{ color: '#b72929', textAlign: 'left' }}>
                    친구로 추가할 분의 아이디를 입력해주세요.
                  </p>
                  <input
                    type="text"
                    id="verify_code"
                    name="verify_code"
                    placeholder=""
                    style={{
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                      backgroundColor: 'none',
                      width: '250px',
                    }}
                  ></input>
                  <Input
                    type="button"
                    value="제출"
                    style={{
                      cursor: 'pointer',
                      width: '150px',
                      height: '45px',
                      backgroundColor: '#F1EEEE',
                      border: 'none',
                      borderRadius: '20px',
                    }}
                  ></Input>
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
                  style={{ color: 'black' }}
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                />
              </WrapFriendListTitle>
              <Friend>김아무개</Friend>
              <Friend>이아무개</Friend>
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
              <BsFillMicFill style={{ color: '#B9BBBE' }} />
              <MdHeadset style={{ color: '#B9BBBE' }} />
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
            <ScrollContainer style={{ height: '80vw' }} vertical={false}>
                {feedList}
            </ScrollContainer>
          </div>
        </Contents>
      </Container>
    );

  }

  return <div>data is undefined</div>;
};

export default Club_PR;
