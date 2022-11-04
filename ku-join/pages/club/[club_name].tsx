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


type FeedItem = {
  feed_uploader: string;
  feed_img: string;
  feed_contents: string;
  time: string;
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

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getUsersClubList = async (): Promise<UserClubListItem[]> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID)
    ).json();
  };

  const getClubDetailInfo = async (): Promise<ClubDetailInfoItem> => {
    return await (await fetch(API_URL + '/club-service/club-information/' + clubID)).json();
  }

  const getClubFeed = async (): Promise<FeedItem[]> => {
    return await (await fetch(API_URL + '/club-service//club-feed/' + clubID)).json();
  }

  const {data: data1, isLoading: isLoading1, error: error1} = useQuery(['ClubDetailInfo'], getClubDetailInfo)

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery(['UsersclubList'], getUsersClubList);

  const {data: data3, isLoading: isLoading3, error: error3} = useQuery(['ClubFeed'], getClubFeed)

  if (isLoading1) return <div>'Loading...'</div>;

  if (isLoading2) return <div>'Loading...'</div>;

  if (isLoading3) return <div>'Loading...'</div>;

  if (error1) return <div>'Error..'</div>;

  if (error2) return <div>'Error..'</div>;
  
  if (error3) return <div>'Error..'</div>;

  if (((data1 != undefined) && (data2 != undefined)) && (data3 != undefined)) {
  

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
              >
                가입하기
              </button>
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
              >
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
