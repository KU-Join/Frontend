import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import ScrollContainer from 'react-indiana-drag-scroll';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import LoadingSpinner from '../../public/Spinner.gif';
import Image from 'next/image';

import {
  Container,
  WrapContents,
  WrapUserStatus,
  Logo,
  LogoTitle,
  ContentTitle,
  UserProfile,
  UserImg,
  UserName,
  UserStatus,
} from '../main/main-style';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { MdHeadset, MdHeadsetOff } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';
import { MemberName } from '../manage/manage-style';

type ClubMemberAll = {
  contents: Array<ClubMemberItem>;
};

type ClubMemberItem = {
  user_id: string;
  leader: boolean;
};

type ChatAll = {
  chatData: Array<ChatContent>;
};

type ChatContent = {
  id: number;
  userName: string;
  clubName: string;
  content: string;
  createdAt: string;
};

const ChattingChannelLayout = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const { club_name } = router.query;

  const [userData, setUserData] = useState({
    content: '',
  });

  const [MICIsOn, setMICIsOn] = useState(true);
  const [MICIsOff, setMICISOff] = useState(false);
  const [HeadsetIsOn, setHeadsetIsOn] = useState(true);
  const [HeadsetIsOff, setHeadsetIsOff] = useState(false);

  const [publicChats, setpublicChats] = useState<any>([]);

  var stompClient: any = null;

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

  const [noticeIsOpen, setNoticeIsOpen] = useState(true);

  const [ImgIsoOpen, setImgIsOpen] = useState(false);

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push('./');
  };

  const getClubMemberList = async (): Promise<ClubMemberAll> => {
    const ClubID = sessionStorage.getItem('clubID');
    return await (
      await fetch(API_URL + '/club-service/club-member/' + ClubID)
    ).json();
  };

  const getChatContent = async (): Promise<ChatAll> => {
    const ClubName = sessionStorage.getItem('clubName');
    return await (await fetch(API_URL + '/chat-service/' + ClubName)).json();
  };

  let Sock = new SockJS('http://52.79.246.49:8000/chat-service/chatting');
  stompClient = Stomp.over(Sock);

  stompClient.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
  stompClient.heartbeat.incoming = 0;
  const onConnected = () => {
    console.log('연결 성공');
    const ClubName = sessionStorage.getItem('clubName');
    stompClient.subscribe('/topic/' + ClubName, onPublicMessageReceived);
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const onPublicMessageReceived = (payload: any) => {
    alert(payload);
    let payloadData = JSON.parse(payload.body);
    publicChats.push(payloadData);
    setpublicChats([...publicChats]);
    console.log(publicChats);
  };

  //주소를 env에 숨겨서 넣으면 인식 못함.
  stompClient.connect({}, onConnected, onError);

  const sendPublicMessage = () => {
    const ClubName = sessionStorage.getItem('clubName');
    const userID = sessionStorage.getItem('id') as string;
    if (stompClient) {
      let chatMessage = {
        userName: userID,
        content: userData.content,
        clubName: ClubName,
      };
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, content: '' });
    }
  };

  const handleMessage = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useQuery(['ClubMember'], getClubMemberList);

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery(['Chat'], getChatContent);

  if (isLoading1) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
        }}
      >
        <Image src={LoadingSpinner} />
        <div>Loading...</div>
      </div>
    );
  }

  if (isLoading2) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
        }}
      >
        <Image src={LoadingSpinner} />
        <div>Loading...</div>
      </div>
    );
  }

  if (error1) return <div>'Error..</div>;

  if (error2) return <div>'Error..</div>;

  if (data1 != undefined && data2 != undefined) {
    if (data2.chatData.length == 0) {
      return (
        <Container>
          <WrapContents style={{ backgroundColor: '#2F3136', zIndex: '5' }}>
            <Logo>
              <LogoTitle style={{ color: 'white' }} onClick={handleClick}>
                KU:
              </LogoTitle>
              <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                JOIN
              </LogoTitle>
            </Logo>
            <ContentTitle style={{ color: 'white' }}>
              {club_name} 동아리원 목록
            </ContentTitle>
            <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'center',
                  paddingTop: '20px',
                }}
              >
                {data1 &&
                  data1.contents.map((Member: ClubMemberItem) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                        }}
                        key={Member.user_id}
                      >
                        <UserImg />
                        <MemberName>{Member.user_id}</MemberName>
                      </div>
                    );
                  })}
              </div>
            </ScrollContainer>
            <WrapUserStatus>
              <UserProfile>
                <UserImg />
                <Username />
              </UserProfile>
              <UserStatus>
                {MICIsOn && (
                  <BsFillMicFill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setMICIsOn((e) => !e),
                        setMICISOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                {MICIsOff && (
                  <BsFillMicMuteFill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setMICIsOn((e) => !e),
                        setMICISOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                {HeadsetIsOn && (
                  <MdHeadset
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setHeadsetIsOn((e) => !e),
                        setHeadsetIsOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                {HeadsetIsOff && (
                  <MdHeadsetOff
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setHeadsetIsOn((e) => !e),
                        setHeadsetIsOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                <RiSettings2Fill
                  style={{ color: '#B9BBBE', cursor: 'pointer' }}
                  onClick={() => router.push('../setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <div
            style={{
              width: '80vw',
              height: '100vh',
              paddingLeft: '20vw',
              backgroundColor: '#36393F',
              position: 'absolute',
              zIndex: '3',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '90vh' }}>
              <div
                style={{
                  backgroundColor: '#202225',
                  fontSize: '1.5rem',
                  padding: '10px',
                  textAlign: 'left',
                  color: 'gray',
                }}
              >
                # {club_name} 채팅방
              </div>
              <ScrollContainer style={{ height: '85vh' }} horizontal={false}>
                <div style={{ color: '#878A8F', paddingTop: '30px' }}>
                  채팅 내역이 없습니다.
                </div>
              </ScrollContainer>
            </div>
            <div
              style={{
                color: 'white',
                height: '7vh',
                padding: '10px',
                display: 'flex',
                gap: '10px',
              }}
            >
              <input
                type="text"
                name="content"
                style={{
                  backgroundColor: '#40444B',
                  borderRadius: '5px',
                  padding: '10px',
                  color: 'white',
                  width: '70vw',
                }}
                value={userData.content}
                onChange={handleMessage}
              ></input>
              <button
                style={{ width: '10vw', borderRadius: '5px' }}
                onClick={() => {
                  sendPublicMessage();
                }}
              >
                보내기
              </button>
            </div>
          </div>
          <div
            style={{
              width: '100vw',
              height: '100vh',
              paddingLeft: '80vw',
              backgroundColor: 'white',
              color: 'black',
              position: 'absolute',
              zIndex: '1',
            }}
          >
            <ContentTitle style={{ paddingTop: '20px' }}>
              {club_name} 게시판
            </ContentTitle>
            {noticeIsOpen && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    padding: '20px 0',
                  }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                      borderBottom: '1px solid black',
                    }}
                  >
                    공지
                  </p>
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setNoticeIsOpen((e) => !e), setImgIsOpen((e) => !e);
                    }}
                  >
                    사진
                  </p>
                </div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                </ScrollContainer>
                <button
                  style={{
                    width: '10vw',
                    height: '7vh',
                    borderRadius: '5px',
                    padding: '10px',
                  }}
                  onClick={() => alert('추후 구현 예정')}
                >
                  글쓰기
                </button>
              </div>
            )}
            {ImgIsoOpen && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    padding: '20px 0',
                  }}
                >
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setNoticeIsOpen((e) => !e), setImgIsOpen((e) => !e);
                    }}
                  >
                    공지
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold',
                      borderBottom: '1px solid black',
                    }}
                  >
                    사진
                  </p>
                </div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                </ScrollContainer>
                <button
                  style={{
                    width: '10vw',
                    height: '7vh',
                    borderRadius: '5px',
                    padding: '10px',
                  }}
                  onClick={() => alert('추후 구현 예정')}
                >
                  글쓰기
                </button>
              </div>
            )}
          </div>
        </Container>
      );
    } else {
      const userID = sessionStorage.getItem('id') as string;

      let ChatList: JSX.Element[];
      ChatList = data2.chatData.map((Chat: ChatContent) => (
        <div key={Chat.id} style={{ padding: '10px' }}>
          {Chat.userName !== userID && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <div
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {Chat.userName}
              </div>
              <div style={{ textAlign: 'left', color: '#878A8F' }}>
                {Chat.content}
              </div>
            </div>
          )}
          {Chat.userName == userID && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <div
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {Chat.userName} [나]
              </div>
              <div style={{ textAlign: 'left', color: '#878A8F' }}>
                {Chat.content}
              </div>
            </div>
          )}
        </div>
      ));

      return (
        <Container>
          <WrapContents style={{ backgroundColor: '#2F3136', zIndex: '5' }}>
            <Logo>
              <LogoTitle style={{ color: 'white' }} onClick={handleClick}>
                KU:
              </LogoTitle>
              <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                JOIN
              </LogoTitle>
            </Logo>
            <ContentTitle style={{ color: 'white' }}>
              {club_name} 동아리원 목록
            </ContentTitle>
            <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'center',
                  paddingTop: '20px',
                }}
              >
                {data1 &&
                  data1.contents.map((Member: ClubMemberItem) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                        }}
                        key={Member.user_id}
                      >
                        <UserImg />
                        <MemberName>{Member.user_id}</MemberName>
                      </div>
                    );
                  })}
              </div>
            </ScrollContainer>
            <WrapUserStatus>
              <UserProfile>
                <UserImg />
                <Username />
              </UserProfile>
              <UserStatus>
                {MICIsOn && (
                  <BsFillMicFill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setMICIsOn((e) => !e),
                        setMICISOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                {MICIsOff && (
                  <BsFillMicMuteFill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setMICIsOn((e) => !e),
                        setMICISOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                {HeadsetIsOn && (
                  <MdHeadset
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setHeadsetIsOn((e) => !e),
                        setHeadsetIsOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                {HeadsetIsOff && (
                  <MdHeadsetOff
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => {
                      setHeadsetIsOn((e) => !e),
                        setHeadsetIsOff((e) => !e),
                        alert('추후 구현 예정');
                    }}
                  />
                )}
                <RiSettings2Fill
                  style={{ color: '#B9BBBE', cursor: 'pointer' }}
                  onClick={() => router.push('../setup')}
                />
              </UserStatus>
            </WrapUserStatus>
          </WrapContents>
          <div
            style={{
              width: '80vw',
              height: '100vh',
              paddingLeft: '20vw',
              backgroundColor: '#36393F',
              position: 'absolute',
              zIndex: '3',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '90vh' }}>
              <div
                style={{
                  backgroundColor: '#202225',
                  fontSize: '1.5rem',
                  padding: '10px',
                  textAlign: 'left',
                  color: 'gray',
                }}
              >
                # {club_name} 채팅방
              </div>
              <ScrollContainer style={{ height: '85vh' }} horizontal={false}>
                <div>{ChatList}</div>
              </ScrollContainer>
            </div>
            <div
              style={{
                color: 'white',
                height: '7vh',
                padding: '10px',
                display: 'flex',
                gap: '10px',
              }}
            >
              <input
                type="text"
                name="content"
                style={{
                  backgroundColor: '#40444B',
                  borderRadius: '5px',
                  padding: '10px',
                  color: 'white',
                  width: '70vw',
                }}
                value={userData.content}
                onChange={handleMessage}
              ></input>
              <button
                style={{ width: '10vw', borderRadius: '5px' }}
                onClick={() => {
                  sendPublicMessage();
                }}
              >
                보내기
              </button>
            </div>
          </div>
          <div
            style={{
              width: '100vw',
              height: '100vh',
              paddingLeft: '80vw',
              backgroundColor: 'white',
              color: 'black',
              position: 'absolute',
              zIndex: '1',
            }}
          >
            <ContentTitle style={{ paddingTop: '20px' }}>
              {club_name} 게시판
            </ContentTitle>
            {noticeIsOpen && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    padding: '20px 0',
                  }}
                >
                  <p style={{ fontWeight: 'bold' }}>공지</p>
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setNoticeIsOpen((e) => !e), setImgIsOpen((e) => !e);
                    }}
                  >
                    사진
                  </p>
                </div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.25rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      동아리장
                    </p>
                    <br />
                    <p style={{ textAlign: 'left' }}>
                      곧 파트 연습 시간 공지하겠습니다. <br /> 해당 시간에는
                      동방에 출입을 자제하여주시기 바랍니다.
                    </p>
                  </div>
                </ScrollContainer>
                <button
                  style={{
                    width: '10vw',
                    height: '7vh',
                    borderRadius: '5px',
                    padding: '10px',
                  }}
                  onClick={() => alert('추후 구현 예정')}
                >
                  글쓰기
                </button>
              </div>
            )}
            {ImgIsoOpen && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    padding: '20px 0',
                  }}
                >
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setNoticeIsOpen((e) => !e), setImgIsOpen((e) => !e);
                    }}
                  >
                    공지
                  </p>
                  <p style={{ fontWeight: 'bold' }}>사진</p>
                </div>
                <ScrollContainer style={{ height: '80vh' }} horizontal={false}>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '300px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      margin: '20px auto',
                      border: '1px solid gray',
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios/200/null/window-settings.png"
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
                        사진제목
                      </p>
                      <p style={{ fontSize: '8px', color: '#333333' }}>
                        사진설명
                      </p>
                    </div>
                  </div>
                </ScrollContainer>
                <button
                  style={{
                    width: '10vw',
                    height: '7vh',
                    borderRadius: '5px',
                    padding: '10px',
                  }}
                  onClick={() => alert('추후 구현 예정')}
                >
                  글쓰기
                </button>
              </div>
            )}
          </div>
        </Container>
      );
    }
  } else {
    return <div>Data is undefined</div>;
  }
};

export default ChattingChannelLayout;
