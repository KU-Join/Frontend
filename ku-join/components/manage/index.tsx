import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import ScrollContainer from 'react-indiana-drag-scroll';
import LoadingSpinner from '../../public/Spinner.gif';
import Image from 'next/image';
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
  WrapFriendList,
  WrapFriendListTitle,
  Friend,
  WrapTitle,
} from '../main/main-style';

import {
  InputFind,
  FindLabelMainImage,
  InputMainImage,
} from '../makeclub-form/makeclub-form-style';

import {
  LeaderWithClubName,
  TabTitle,
  TabSubTitle,
  MemberName,
  Button,
  WrapTab,
  WrapSubTab,
  WrapForm,
  LabelMainImage2,
  FindLabelMainImage2,
  InputFind2,
  InputMainImage2,
  LabelDescription2,
  InputDescription2,
} from './manage-style';
import { Input } from '../signup-form/signup-form-style';
import Modal from 'react-modal';

import { BsFillMicFill, BsPlusLg, BsFillMicMuteFill } from 'react-icons/bs';
import { MdHeadset, MdHeadsetOff } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';
import { AiFillCloseSquare } from 'react-icons/ai';

type ClubDetailInfoItem = {
  club_id: number;
  club_name: string;
  club_img: string;
  club_description: string;
  category: string;
  opened: boolean;
  club_URL: null;
  leader_id: string;
};

type UserClubAll = {
  contents: Array<UserClubListItem>;
};

type UserClubListItem = {
  club_id: number;
  club_name: string;
  leader: boolean;
};

type FeedAll = {
  contents: Array<FeedItem>;
};

type FeedItem = {
  feed_uploader: string;
  feed_img: string;
  feed_contents: string;
  time: string;
};

type JoinPersonAll = {
  contents: Array<JoinPersonItem>;
};

type JoinPersonItem = {
  apply_id: string;
  club_name: string;
  club_id: string;
  user_id: string;
};

type JoinPersonItemEmpty = {
  contents: {
    club_id: [];
  };
};

type ClubMemberAll = {
  contents: Array<ClubMemberItem>;
};

type ClubMemberItem = {
  user_id: string;
  leader: boolean;
};

type FriendListItem = {
  email: string;
  nickname: string;
  state: string;
};

const ManagementLayout = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const { club_name, club_id } = router.query;

  let clubID = club_id as string;

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

      //????????? ?????? main ?????? ??? index ???????????? ??????
      if (userID == null) {
        router.push('./');
      }

      return <UserName>{userID}</UserName>;
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push('../../main');
  };

  const handleFriendIDInputChange = (e: any) => {
    setFriendID({ ...friendID, [e.target.name]: e.target.value });
  };

  const friendRequestSubmit = (e: any) => {
    e.preventDefault();
    const userID = sessionStorage.getItem('id');

    fetch(API_URL + '/member-service/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: API_URL,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        email: userID + '@konkuk.ac.kr',
        friendEmail: friendID.friendid + '@konkuk.ac.kr',
      }),
    }).then((response) => {
      response.status == 200 ? alert('?????? ??????') : alert('?????? ??????');
    });
  };

  const [files, setFiles] = useState<any>([]);

  const SaveFileImage = (e: any) => {
    inputRef.current.placeholder = e.target.files[0].name;
    setFiles([...files, e.target.files[0]]);
  };

  const inputRef = useRef<any>();

  const [feedFiles, setFeedFiles] = useState<any>([]);

  const SaveFeedFileImage = (e: any) => {
    inputRef2.current.placeholder = e.target.files[0].name;
    setFeedFiles([...feedFiles, e.target.files[0]]);
  };

  const inputRef2 = useRef<any>();

  const [introduction, setIntroduction] = useState({
    comment: '',
  });

  const handleInputChange = (e: any) => {
    setIntroduction({ ...introduction, [e.target.name]: e.target.value });
  };

  const inputRef3 = useRef<any>();

  const [feed, setFeed] = useState({
    feed_comment: '',
  });

  const handleFeedInputChange = (e: any) => {
    setFeed({ ...feed, [e.target.name]: e.target.value });
  };

  const handleFeedSubmit = (e: any) => {
    const ClubID = sessionStorage.getItem('clubID') as string;
    const userID = sessionStorage.getItem('id');
    const userid = userID as string;

    if (inputRef2.current.placeholder == '?????? ??????') {
      e.preventDefault();
      alert('?????? ???????????? ??????????????????.');
      return false;
    }

    if (feed.feed_comment.length == 0) {
      e.preventDefault();
      alert('?????? ????????? ??????????????????.');
      return false;
    }

    const formData = new FormData();

    formData.append('club_id', ClubID);
    formData.append('feed_uploader', userid);
    formData.append('feed_contents', feed.feed_comment);
    formData.append('feed_image', feedFiles[0]);

    fetch(API_URL + '/club-service/club-feed/' + clubID, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      response.status == 201 ? SuccessFeedSubmit() : alert('?????? ????????????');
    });
  };

  const SuccessFeedSubmit = () => {
    alert('?????? ????????????');
    setClubFeedModalIsOpen(false);
  };

  const ApproveJoinclub = (ApplyID: string) => {
    const ClubID = sessionStorage.getItem('clubID') as string;
    const userID = sessionStorage.getItem('id') as string;
    fetch(API_URL + '/club-service/club-apply/' + ClubID, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Origin: API_URL,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        user_id: userID,
        apply_id: ApplyID,
        accept: true,
      }),
    });
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [clubFeedModalIsOpen, setClubFeedModalIsOpen] = useState(false);

  const [RecruitIsOpen, setRecruitIsOpen] = useState(true);

  const [RecruitIsOpen2, setRecruitIsOpen2] = useState(false);

  const getFriendList = async (): Promise<FriendListItem[]> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(
        API_URL + '/member-service/friends?email=' + userID + '@konkuk.ac.kr'
      )
    ).json();
  };

  const getUsersClubList = async (): Promise<UserClubAll> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/club-service/registered/' + userID)
    ).json();
  };

  const getClubDetailInfo = async (): Promise<ClubDetailInfoItem> => {
    const ClubID = sessionStorage.getItem('clubID');
    return await (
      await fetch(API_URL + '/club-service/club-information/' + ClubID)
    ).json();
  };

  const getClubFeed = async (): Promise<FeedAll> => {
    const ClubID = sessionStorage.getItem('clubID');
    return await (
      await fetch(API_URL + '/club-service/club-feed/' + ClubID)
    ).json();
  };

  const getClubFeedEmpty = async (): Promise<any> => {
    const ClubID = sessionStorage.getItem('clubID');
    return await (
      await fetch(API_URL + '/club-service/club-feed/' + ClubID)
    ).json();
  };

  const getJoinList = async (): Promise<JoinPersonAll> => {
    const ClubID = sessionStorage.getItem('clubID');
    const userID = sessionStorage.getItem('id') as string;
    return await (
      await fetch(
        API_URL + '/club-service/club-apply/' + ClubID + '?user_id=' + userID
      )
    ).json();
  };

  const getJoinListEmpty = async (): Promise<JoinPersonItemEmpty> => {
    const ClubID = sessionStorage.getItem('clubID');
    const userID = sessionStorage.getItem('id') as string;
    return await (
      await fetch(
        API_URL + '/club-service/club-apply/' + ClubID + '?user_id=' + userID
      )
    ).json();
  };

  const getClubMemberList = async (): Promise<ClubMemberAll> => {
    const ClubID = sessionStorage.getItem('clubID');
    return await (
      await fetch(API_URL + '/club-service/club-member/' + ClubID)
    ).json();
  };

  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useQuery(['ClubDetailInfo'], getClubDetailInfo);

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery(['UsersclubList'], getUsersClubList);

  const {
    data: data3,
    isLoading: isLoading3,
    error: error3,
  } = useQuery(['ClubFeed'], getClubFeed);

  const {
    data: data4,
    isLoading: isLoading4,
    error: error4,
  } = useQuery(['ClubFeedEmpty'], getClubFeedEmpty);

  const {
    data: data5,
    isLoading: isLoading5,
    error: error5,
  } = useQuery(['JoinList'], getJoinList);

  const {
    data: data6,
    isLoading: isLoading6,
    error: error6,
  } = useQuery(['JoinListEmpty'], getJoinListEmpty);

  const {
    data: data7,
    isLoading: isLoading7,
    error: error7,
  } = useQuery(['ClubMember'], getClubMemberList);

  const {
    data: data8,
    isLoading: isLoading8,
    error: error8,
  } = useQuery(['friends'], getFriendList);

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

  if (isLoading3) {
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

  if (isLoading4) {
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

  if (isLoading5) {
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

  if (isLoading6) {
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

  if (isLoading7) {
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

  if (isLoading8) {
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

  if (error1) return <div>'Error..'</div>;

  if (error2) return <div>'Error..'</div>;

  if (error3) return <div>'Error..'</div>;

  if (error4) return <div>'Error..'</div>;

  if (error5) return <div>'Error..'</div>;

  if (error6) return <div>'Error..'</div>;

  if (error7) return <div>'Error..'</div>;

  if (error8) return <div>'Error..'</div>;

  if (
    data1 != undefined &&
    data2 != undefined &&
    data3 != undefined &&
    data5 != undefined &&
    data7 != undefined &&
    data6?.contents.club_id == undefined &&
    data8 != undefined
  ) {
    const userID = sessionStorage.getItem('id') as string;

    if (data1.opened == true) {
      const EditClubInfo = () => {
        const formData = new FormData();

        formData.append('club_name', data1.club_name);

        if (introduction.comment == '') {
          formData.append('club_description', data1.club_description); //?????? ??????
        } else {
          formData.append('club_description', introduction.comment); //?????? ??????
        }

        formData.append('category', data1.category);
        formData.append('leader_id', data1.leader_id);

        if (RecruitIsOpen == true) {
          formData.append('opened', 'true');
        } else {
          formData.append('opened', 'false');
        }

        if (files[0] != undefined) {
          formData.append('club_img', files[0]); // ?????? ??????
        }

        let ClubID = sessionStorage.getItem('clubID') as string;
        fetch(API_URL + '/club-service/update-club-form/' + ClubID, {
          method: 'POST',
          body: formData,
        }).then((response) => {
          response.status == 200
            ? alert('????????? ?????? ?????? ??????')
            : alert('????????? ?????? ?????? ??????');
        });
      };

      if (data8.length == 0) {
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div style={{ marginTop: '20px' }}>
                    ?????? ????????? ???????????? ????????????.
                  </div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>
                      {RecruitIsOpen ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data5 &&
                        data5.contents.map((Person: JoinPersonItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Person.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Person.user_id}</MemberName>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <Button
                                  onClick={() =>
                                    ApproveJoinclub(Person.apply_id)
                                  }
                                >
                                  ??????
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      } else {
        let FriendList: JSX.Element[];
        FriendList = data8.map((Friends: FriendListItem) => (
          <div>
            {Friends.state == 'ACCEPT' && (
              <Friend key={Friends.email}>{Friends.nickname}</Friend>
            )}
          </div>
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div>{FriendList}</div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>
                      {RecruitIsOpen ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data5 &&
                        data5.contents.map((Person: JoinPersonItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Person.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Person.user_id}</MemberName>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <Button
                                  onClick={() =>
                                    ApproveJoinclub(Person.apply_id)
                                  }
                                >
                                  ??????
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      }
    } else {
      const EditClubInfo = () => {
        const formData = new FormData();

        formData.append('club_name', data1.club_name);

        if (introduction.comment == '') {
          formData.append('club_description', data1.club_description); //?????? ??????
        } else {
          formData.append('club_description', introduction.comment); //?????? ??????
        }

        formData.append('category', data1.category);
        formData.append('leader_id', data1.leader_id);

        if (RecruitIsOpen == true) {
          formData.append('opened', 'true');
        } else {
          formData.append('opened', 'false');
        }

        if (files[0] != undefined) {
          formData.append('club_img', files[0]); // ?????? ??????
        }

        let ClubID = sessionStorage.getItem('clubID') as string;

        fetch(API_URL + '/club-service/update-club-form/' + ClubID, {
          method: 'POST',
          body: formData,
        }).then((response) => {
          response.status == 200
            ? alert('????????? ?????? ?????? ??????')
            : alert('????????? ?????? ?????? ??????');
        });
      };

      if (data8.length == 0) {
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div style={{ marginTop: '20px' }}>
                    ?????? ????????? ???????????? ????????????.
                  </div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen2((e) => !e)}>
                      {RecruitIsOpen2 ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data5 &&
                        data5.contents.map((Person: JoinPersonItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Person.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Person.user_id}</MemberName>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <Button
                                  onClick={() =>
                                    ApproveJoinclub(Person.apply_id)
                                  }
                                >
                                  ??????
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      } else {
        let FriendList: JSX.Element[];
        FriendList = data8.map((Friends: FriendListItem) => (
          <div>
            {Friends.state == 'ACCEPT' && (
              <Friend key={Friends.email}>{Friends.nickname}</Friend>
            )}
          </div>
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div>{FriendList}</div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen2((e) => !e)}>
                      {RecruitIsOpen2 ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data5 &&
                        data5.contents.map((Person: JoinPersonItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Person.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Person.user_id}</MemberName>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <Button
                                  onClick={() =>
                                    ApproveJoinclub(Person.apply_id)
                                  }
                                >
                                  ??????
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      }
    }
  }

  if (
    data1 != undefined &&
    data2 != undefined &&
    data3 != undefined &&
    data5 != undefined &&
    data7 != undefined &&
    data6?.contents.club_id != undefined &&
    data8 != undefined
  ) {
    const userID = sessionStorage.getItem('id') as string;

    if (data1.opened == true) {
      const EditClubInfo = () => {
        const formData = new FormData();

        formData.append('club_name', data1.club_name);

        if (introduction.comment == '') {
          formData.append('club_description', data1.club_description); //?????? ??????
        } else {
          formData.append('club_description', introduction.comment); //?????? ??????
        }

        formData.append('category', data1.category);
        formData.append('leader_id', data1.leader_id);

        if (RecruitIsOpen == true) {
          formData.append('opened', 'true');
        } else {
          formData.append('opened', 'false');
        }

        if (files[0] != undefined) {
          formData.append('club_img', files[0]); // ?????? ??????
        }

        let ClubID = sessionStorage.getItem('clubID') as string;

        fetch(API_URL + '/club-service/update-club-form/' + ClubID, {
          method: 'POST',
          body: formData,
        }).then((response) => {
          response.status == 200
            ? alert('????????? ?????? ?????? ??????')
            : alert('????????? ?????? ?????? ??????');
        });
      };

      if (data8.length == 0) {
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div style={{ marginTop: '20px' }}>
                    ?????? ????????? ???????????? ????????????.
                  </div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>
                      {RecruitIsOpen ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div style={{ color: 'white' }}>
                      ????????? ????????? ????????? ????????????.
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      } else {
        let FriendList: JSX.Element[];
        FriendList = data8.map((Friends: FriendListItem) => (
          <div>
            {Friends.state == 'ACCEPT' && (
              <Friend key={Friends.email}>{Friends.nickname}</Friend>
            )}
          </div>
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div>{FriendList}</div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>
                      {RecruitIsOpen ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div style={{ color: 'white' }}>
                      ????????? ????????? ????????? ????????????.
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      }
    } else {
      const EditClubInfo = () => {
        const formData = new FormData();

        formData.append('club_name', data1.club_name);

        if (introduction.comment == '') {
          formData.append('club_description', data1.club_description); //?????? ??????
        } else {
          formData.append('club_description', introduction.comment); //?????? ??????
        }

        formData.append('category', data1.category);
        formData.append('leader_id', data1.leader_id);

        if (RecruitIsOpen == true) {
          formData.append('opened', 'true');
        } else {
          formData.append('opened', 'false');
        }

        if (files[0] != undefined) {
          formData.append('club_img', files[0]); // ?????? ??????
        }

        let ClubID = sessionStorage.getItem('clubID') as string;

        fetch(API_URL + '/club-service/update-club-form/' + ClubID, {
          method: 'POST',
          body: formData,
        }).then((response) => {
          response.status == 200
            ? alert('????????? ?????? ?????? ??????')
            : alert('????????? ?????? ?????? ??????');
        });
      };

      if (data8.length == 0) {
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div style={{ marginTop: '20px' }}>
                    ?????? ????????? ???????????? ????????????.
                  </div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen2((e) => !e)}>
                      {RecruitIsOpen2 ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div style={{ color: 'white' }}>
                      ????????? ????????? ????????? ????????????.
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      } else {
        let FriendList: JSX.Element[];
        FriendList = data8.map((Friends: FriendListItem) => (
          <div>
            {Friends.state == 'ACCEPT' && (
              <Friend key={Friends.email}>{Friends.nickname}</Friend>
            )}
          </div>
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                        ????????? ????????? ?????? ???????????? ??????????????????.
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
                        onClick={(e) => {
                          friendRequestSubmit(e);
                        }}
                      >
                        ??????
                      </button>
                    </div>
                  </form>
                </div>
              )}
            ></Modal>
            <Modal
              isOpen={clubFeedModalIsOpen}
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
                        justifyContent: 'right',
                        width: '500px',
                      }}
                    >
                      <AiFillCloseSquare
                        onClick={() => setClubFeedModalIsOpen(false)}
                        style={{
                          cursor: 'pointer',
                          width: '50px',
                          height: '50px',
                        }}
                      />
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
                      <p
                        style={{
                          color: 'black',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                      >
                        ?????? ??????
                      </p>
                      <WrapForm>
                        <LabelMainImage2>?????? ?????????</LabelMainImage2>
                        <InputFind2
                          ref={inputRef2}
                          placeholder="?????? ??????"
                          disabled={true}
                        ></InputFind2>
                        <FindLabelMainImage2
                          htmlFor="feedfile"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '12px',
                            paddingTop: '8px',
                            textAlign: 'center',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage2>
                        <InputMainImage2
                          type="file"
                          id="feedfile"
                          accept="image/*"
                          onChange={SaveFeedFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage2>
                        <LabelDescription2
                          htmlFor="feed_comment"
                          id="feed_comment_label"
                        >
                          ?????? ??????
                        </LabelDescription2>
                        <InputDescription2
                          type="text"
                          maxLength={30}
                          id="feed_comment"
                          name="feed_comment"
                          value={feed.feed_comment}
                          onChange={handleFeedInputChange}
                          ref={inputRef3}
                        ></InputDescription2>
                      </WrapForm>
                      <Input
                        type="button"
                        value="??????"
                        style={{
                          cursor: 'pointer',
                          width: '150px',
                          height: '45px',
                          backgroundColor: '#F1EEEE',
                          border: 'none',
                          borderRadius: '20px',
                        }}
                        onClick={handleFeedSubmit}
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
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <WrapFriendList>
                  <WrapFriendListTitle>
                    <ContentTitle>??????</ContentTitle>
                    <BsPlusLg
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        setModalIsOpen(true);
                      }}
                    />
                  </WrapFriendListTitle>
                  <div>{FriendList}</div>
                </WrapFriendList>
                <WrapJoinedClub>
                  <ContentTitle>?????? ?????? ?????? ?????????</ContentTitle>
                  <div style={{ marginTop: '10px' }}>
                    {data2 &&
                      data2.contents.map((club: UserClubListItem) => {
                        return (
                          <JoinedClub key={club.club_id}>
                            <JoinedClubImg />
                            <JoinedClubName>{club.club_name}</JoinedClubName>
                          </JoinedClub>
                        );
                      })}
                  </div>
                </WrapJoinedClub>
              </UserInfo>
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
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {MICIsOff && (
                    <BsFillMicMuteFill
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setMICIsOn((e) => !e),
                          setMICISOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOn && (
                    <MdHeadset
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  {HeadsetIsOff && (
                    <MdHeadsetOff
                      style={{ color: '#B9BBBE', cursor: 'pointer' }}
                      onClick={() => {
                        setHeadsetIsOn((e) => !e),
                          setHeadsetIsOff((e) => !e),
                          alert('?????? ?????? ??????');
                      }}
                    />
                  )}
                  <RiSettings2Fill
                    style={{ color: '#B9BBBE', cursor: 'pointer' }}
                    onClick={() => router.push('../../setup')}
                  />
                </UserStatus>
              </WrapUserStatus>
            </WrapContents>
            <Contents>
              <ScrollContainer
                style={{ height: '85vh' }}
                horizontal={false}
                ignoreElements="input"
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '400px',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <WrapTitle>
                    <MainTitle>????????? ??????</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} ?????? ?????? {club_name}??? ?????????????????????.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>????????? ?????? ?????????</TabTitle>
                    <Button onClick={() => setRecruitIsOpen2((e) => !e)}>
                      {RecruitIsOpen2 ? '??????????????????' : '???????????????'}
                    </Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <div style={{ color: 'white' }}>
                      {data5 &&
                        data5.contents.map((Person: JoinPersonItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Person.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Person.user_id}</MemberName>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <Button
                                  onClick={() =>
                                    ApproveJoinclub(Person.apply_id)
                                  }
                                >
                                  ??????
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ???????????? ??????
                    </TabTitle>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {data7 &&
                        data7.contents.map((Member: ClubMemberItem) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                              key={Member.user_id}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <UserImg />
                                <MemberName>{Member.user_id}</MemberName>
                              </div>
                              <Button>??????</Button>
                            </div>
                          );
                        })}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      ????????? ?????? ??????
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>?????? ?????????</TabSubTitle>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InputFind
                          ref={inputRef}
                          placeholder={data1.club_img}
                          disabled={true}
                          style={{ width: '300px' }}
                        ></InputFind>
                        <FindLabelMainImage
                          htmlFor="file"
                          style={{
                            width: '100px',
                            height: '30px',
                            backgroundColor: '#F1EEEE',
                            border: 'none',
                            borderRadius: '20px',
                            paddingTop: '6px',
                          }}
                        >
                          ????????????
                        </FindLabelMainImage>
                        <InputMainImage
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={SaveFileImage}
                          style={{ display: 'none' }}
                        ></InputMainImage>
                      </div>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={introduction.comment}
                        onChange={handleInputChange}
                        placeholder={data1.club_description}
                        style={{ width: '400px' }}
                        maxLength={30}
                      ></input>
                    </WrapSubTab>
                    <WrapSubTab>
                      <TabSubTitle>??????</TabSubTitle>
                      <div>
                        <ScrollContainer
                          style={{ width: '70vw' }}
                          vertical={false}
                        >
                          <div
                            style={{
                              display: 'flex',
                              maxWidth: '50px',
                              gap: '50px',
                            }}
                          >
                            {data3 &&
                              data3.contents.map((feed: FeedItem) => {
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
                                    <div
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '16px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {feed.feed_contents}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '8px',
                                          color: '#333333',
                                        }}
                                      >
                                        {feed.time}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </ScrollContainer>
                      </div>
                      <Button
                        onClick={() => {
                          setClubFeedModalIsOpen(true);
                        }}
                      >
                        ?????? ??????
                      </Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button
                      style={{ padding: '10px' }}
                      onClick={() => {
                        EditClubInfo();
                      }}
                    >
                      ??????
                    </Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );
      }
    }
  }
};

export default ManagementLayout;
