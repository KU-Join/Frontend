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

type UserClubListItem = {
  club_id: number;
  club_name: string;
  leader: boolean;
};

const Club_PR: NextPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const { club_name, club_description, club_img } = router.query;

  let clubImg = club_img as string;
  let clubname = club_name as string;

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

  const onclick = (club_name: string) => {
    router.push(
      {
        pathname: './manage/management',
        query: {
          club_name: club_name,
        },
      },
      './manage/'
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getUsersClubList = async (): Promise<UserClubListItem[]> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID)
    ).json();
  };

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery(['UsersclubList'], getUsersClubList);

  if (isLoading2) return <div>'Loading...'</div>;

  if (error2) return <div>'Error..'</div>;

  if (data2 != undefined) {
    let usersClubListName: JSX.Element[];
    usersClubListName = data2.map((club: UserClubListItem) => (
      <JoinedClub>
        <JoinedClubImg />
        <JoinedClubName key={club.club_id}>{club.club_name}</JoinedClubName>
      </JoinedClub>
    ));

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
                onClick={() => onclick(clubname)}
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
          <p style={{ color: 'white', textAlign: 'left', margin: '20px 0' }}>
            {club_description}
          </p>
          <div>
            <ScrollContainer style={{ height: '80vw' }} vertical={false}>
              <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
              >
                <img
                  src={clubImg}
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
                    {club_description}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>10월 30일</p>
                </div>
              </div>
              <div
                style={{
                  width: '300px',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  margin: '20px auto',
                }}
              >
                <img
                  src={clubImg}
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
                    {club_description}
                  </p>
                  <p style={{ fontSize: '8px', color: '#333333' }}>10월 30일</p>
                </div>
              </div>
            </ScrollContainer>
          </div>
        </Contents>
      </Container>
    );
  }

  return <div>data is undefined</div>;
};

export default Club_PR;
