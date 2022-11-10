import React, { useState, useRef, useEffect} from 'react';
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
  WrapForm, LabelMainImage2, FindLabelMainImage2, InputFind2, InputMainImage2, LabelDescription2, InputDescription2
} from './manage-style';
import { Input } from '../signup-form/signup-form-style';
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

type JoinPersonItem = {
    apply_id: string;
    club_name: string;
    club_id: string;
    user_id: string;
}

type JoinPersonItemEmpty = {
  club_id: [];
}

type ClubMemberItem = {
  user_id: string;
  leader: boolean;
}

type FriendListItem = {
  email : string;
  nickname : string;
  state : string;
}


const ManagementLayout = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const { club_name, club_id } = router.query;

  let clubID = club_id as string;

  const userID = sessionStorage.getItem('id');

  const userid = userID as string;

  const [friendID, setFriendID] = useState({
    friendid: '',
  });

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
    feed_comment: ''
  });

  const handleFeedInputChange = (e: any) => {
    setFeed({ ...feed, [e.target.name]: e.target.value});
  }

  const handleFeedSubmit = (e:any) => {
    if(inputRef2.current.placeholder == '파일 이름') {
        e.preventDefault();
        alert("피드 이미지를 등록해주세요.")
        return false;
    }

    if(feed.feed_comment.length == 0) {
        e.preventDefault();
        alert("피드 내용을 입력해주세요.");
        return false;
    }

    const formData = new FormData();
        formData.append("club_id", clubID);
        formData.append("feed_uploader", userid);
        formData.append("feed_contents", feed.feed_comment);
        formData.append("feed_image", feedFiles[0]);

        fetch(API_URL + '/club-service/club-feed/' + clubID, {
            method: "POST",
            body: formData
        })
        .then((response) => {
            response.status == 201 ? SuccessFeedSubmit() : alert("피드 등록실패")
        })
  }

  const SuccessFeedSubmit = () => {
    alert("피드 등록성공");
    setClubFeedModalIsOpen(false)
  }

  const ApproveJoinclub = (ApplyID:string) => {
    fetch(API_URL + "/club-service/club-apply/" + clubID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_URL,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        user_id: userid,
        apply_id: ApplyID,
        accept: true
      })
    })
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [clubFeedModalIsOpen, setClubFeedModalIsOpen] = useState(false);

  const [RecruitIsOpen, setRecruitIsOpen] = useState(true);

  const [RecruitIsOpen2, setRecruitIsOpen2] = useState(false);

  const getFriendList = async (): Promise<FriendListItem[]> => {
    const userID = sessionStorage.getItem('id');
    return await (
      await fetch(API_URL + '/member-service/friends?email=' + userID + '@konkuk.ac.kr')
    ).json();
};

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
    return await (await fetch(API_URL + '/club-service/club-feed/' + clubID)).json();
  }

  const getClubFeedEmpty = async (): Promise<any> => {
    return await (await fetch(API_URL + '/club-service/club-feed/' + clubID)).json();
  }

  const getJoinList = async (): Promise<JoinPersonItem[]> => {
    return await (await fetch(API_URL + '/club-service/club-apply/' + clubID + '?user_id=' + userID)).json();
  }

  const getJoinListEmpty = async (): Promise<JoinPersonItemEmpty> => {
    return await (await fetch(API_URL + '/club-service/club-apply/' + clubID + '?user_id=' + userID)).json();
  }

  const getClubMemberList = async (): Promise<ClubMemberItem[]> => {
    return await (await fetch(API_URL + '/club-service/club-member/' + clubID)).json();
  }

  const {data: data1, isLoading: isLoading1, error: error1} = useQuery(['ClubDetailInfo'], getClubDetailInfo)

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery(['UsersclubList'], getUsersClubList);

  const {data: data3, isLoading: isLoading3, error: error3} = useQuery(['ClubFeed'], getClubFeed)

  const {data: data4, isLoading: isLoading4, error: error4} = useQuery(['ClubFeedEmpty'], getClubFeedEmpty)

  const {data: data5, isLoading: isLoading5, error: error5} = useQuery(['JoinList'], getJoinList)

  const {data: data6, isLoading: isLoading6, error: error6} = useQuery(['JoinListEmpty'], getJoinListEmpty);

  const {data: data7, isLoading: isLoading7, error: error7} = useQuery(['ClubMember'], getClubMemberList);

  const {data: data8, isLoading: isLoading8, error: error8} = useQuery(['friends'], getFriendList)

  if (isLoading1) return <div>'Loading...'</div>;

  if (isLoading2) return <div>'Loading...'</div>;

  if (isLoading3) return <div>'Loading...'</div>;

  if (isLoading4) return <div>'Loading...'</div>;

  if (isLoading5) return <div>'Loading...'</div>;

  if (isLoading6) return <div>'Loading...'</div>;

  if (isLoading7) return <div>'Loading...'</div>;

  if (isLoading8) return <div>'Loading...'</div>;

  if (error1) return <div>'Error..'</div>;

  if (error2) return <div>'Error..'</div>;

  if (error3) return <div>'Error..'</div>;

  if (error4) return <div>'Error..'</div>;

  if (error5) return <div>'Error..'</div>;

  if (error6) return <div>'Error..'</div>;

  if (error7) return <div>'Error..'</div>;

  if (error8) return <div>'Error..'</div>;

  /* 동아리 만들자마자 리더는 동아리에 가입이 된 상태이기 때문에 가입된 동아리 목록이 0개로 뜰 수 없기에 삭제. 
  구분해야하는 것은 피드가 0개 일 때 추가해주고(data4) 동아리 신청자 목록 0개일 때(data6) 아닐 때(data5) 구분해서 추가해주고. 동아리원 목록(data7)은 리더가 있기 때문에 따로 구분할 필요 없음*/
  //data4는 우선 제외. 홍보게시판에서도 큰 오류없이 넘어감.



  if ((((data1 != undefined) && (data2 != undefined)) && (data3 != undefined) && (data5 != undefined) && (data7 != undefined)) && (data6?.club_id == undefined) && (data8 != undefined)) {

    if (data1.opened == true) {
      const EditClubInfo = () => {

        const formData = new FormData();
        formData.append("club_name", data1.club_name);
        formData.append("club_description", introduction.comment) //수정 가능
        formData.append("category", data1.category)
        formData.append("leader_id", data1.leader_id);
        formData.append("club_img", files[0]); // 수정 가능
  
        if (RecruitIsOpen == true) {
          formData.append("opened", "true")
        }
        
        else {
          formData.append("opened", "false")
        }
  
        
    
        fetch(API_URL + "/club-service/update-club-form/" + clubID, {
          method: "POST",
          body: formData
        })
        .then((response) => {
          response.status == 200 ? alert("동아리 정보 수정 완료") : alert("동아리 정보 수정 실패")
        })
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
  
      let JoinPersonList: JSX.Element[];
      JoinPersonList = data5.map((Person: JoinPersonItem) => (
        <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  key={Person.user_id}>
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
                      <Button onClick={() => ApproveJoinclub(Person.apply_id)}>승인</Button>
                    </div>
                  </div>
      ))
  
      let MemberList: JSX.Element[];
      MemberList = data7.map((Member: ClubMemberItem) => (
        <div style={{display: "flex", justifyContent: 'space-between' }} key={Member.user_id}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center'}}>
              <UserImg />
              <MemberName>{Member.user_id}</MemberName>
          </div>
          <Button>탈퇴</Button>
        </div>
      ))

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
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '50px',
                      }}
                    >
                      <button onClick={() => setClubFeedModalIsOpen(false)}>
                        (임시)닫는 버튼
                      </button>
                      <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                        피드 추가
                      </p>
                      <WrapForm>
                        <LabelMainImage2>피드 이미지</LabelMainImage2>
                        <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                        <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                        <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                        <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                        <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                      </WrapForm>
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
                    <MainTitle>동아리 관리</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} 님은 현재 {club_name}의 동아리장입니다.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>동아리 가입 활성화</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>{RecruitIsOpen ? "비활성화하기" : "활성화하기"}</Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 가입 승인
                    </TabTitle>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                    >
                      {JoinPersonList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리원 관리
                    </TabTitle>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}>
                      {MemberList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 홍보 관리
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>대표 이미지</TabSubTitle>
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
                          파일찾기
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
                      <TabSubTitle>소개</TabSubTitle>
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
                      <TabSubTitle>피드</TabSubTitle>
                      <div>
                        <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                            {feedList}
                        </ScrollContainer>
                      </div>
                      <Button onClick={() => {
                        setClubFeedModalIsOpen(true);
                      }}>피드 추가</Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );

      }

      else {

        let FriendList: JSX.Element[];
                FriendList = data8.map((Friends: FriendListItem) => (
                      <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
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
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '50px',
                      }}
                    >
                      <button onClick={() => setClubFeedModalIsOpen(false)}>
                        (임시)닫는 버튼
                      </button>
                      <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                        피드 추가
                      </p>
                      <WrapForm>
                        <LabelMainImage2>피드 이미지</LabelMainImage2>
                        <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                        <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                        <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                        <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                        <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                      </WrapForm>
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
                    <ContentTitle>친구</ContentTitle>
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
                    <MainTitle>동아리 관리</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} 님은 현재 {club_name}의 동아리장입니다.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>동아리 가입 활성화</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>{RecruitIsOpen ? "비활성화하기" : "활성화하기"}</Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 가입 승인
                    </TabTitle>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                    >
                      {JoinPersonList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리원 관리
                    </TabTitle>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}>
                      {MemberList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 홍보 관리
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>대표 이미지</TabSubTitle>
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
                          파일찾기
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
                      <TabSubTitle>소개</TabSubTitle>
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
                      <TabSubTitle>피드</TabSubTitle>
                      <div>
                        <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                            {feedList}
                        </ScrollContainer>
                      </div>
                      <Button onClick={() => {
                        setClubFeedModalIsOpen(true);
                      }}>피드 추가</Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );

      }
  
    }

    else {

      const EditClubInfo = () => {

        const formData = new FormData();
        formData.append("club_name", data1.club_name);
        formData.append("club_description", introduction.comment) //수정 가능
        formData.append("category", data1.category)
        formData.append("leader_id", data1.leader_id);
        formData.append("club_img", files[0]); // 수정 가능
  
        if (RecruitIsOpen2 == true) {
          formData.append("opened", "true")
        }
        
        else {
          formData.append("opened", "false")
        }
  
        
    
        fetch(API_URL + "/club-service/update-club-form/" + clubID, {
          method: "POST",
          body: formData
        })
        .then((response) => {
          response.status == 200 ? alert("동아리 정보 수정 완료") : alert("동아리 정보 수정 실패")
        })
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
  
      let JoinPersonList: JSX.Element[];
      JoinPersonList = data5.map((Person: JoinPersonItem) => (
        <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  key={Person.user_id}>
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
                      <Button onClick={() => ApproveJoinclub(Person.apply_id)}>승인</Button>
                    </div>
                  </div>
      ))
  
      let MemberList: JSX.Element[];
      MemberList = data7.map((Member: ClubMemberItem) => (
        <div style={{display: "flex", justifyContent: 'space-between' }} key={Member.user_id}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center'}}>
              <UserImg />
              <MemberName>{Member.user_id}</MemberName>
          </div>
          <Button>탈퇴</Button>
        </div>
      ))

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
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '50px',
                      }}
                    >
                      <button onClick={() => setClubFeedModalIsOpen(false)}>
                        (임시)닫는 버튼
                      </button>
                      <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                        피드 추가
                      </p>
                      <WrapForm>
                        <LabelMainImage2>피드 이미지</LabelMainImage2>
                        <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                        <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                        <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                        <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                        <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                      </WrapForm>
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
                    <MainTitle>동아리 관리</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} 님은 현재 {club_name}의 동아리장입니다.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>동아리 가입 활성화</TabTitle>
                    <Button onClick={() => setRecruitIsOpen2((e) => !e)}>{RecruitIsOpen2 ? "비활성화하기" : "활성화하기"}</Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 가입 승인
                    </TabTitle>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                    >
                      {JoinPersonList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리원 관리
                    </TabTitle>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}>
                      {MemberList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 홍보 관리
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>대표 이미지</TabSubTitle>
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
                          파일찾기
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
                      <TabSubTitle>소개</TabSubTitle>
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
                      <TabSubTitle>피드</TabSubTitle>
                      <div>
                        <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                            {feedList}
                        </ScrollContainer>
                      </div>
                      <Button onClick={() => {
                        setClubFeedModalIsOpen(true);
                      }}>피드 추가</Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );

      }

      else {

        let FriendList: JSX.Element[];
                FriendList = data8.map((Friends: FriendListItem) => (
                      <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
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
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '50px',
                              }}
                            >
                              <button onClick={() => setClubFeedModalIsOpen(false)}>
                                (임시)닫는 버튼
                              </button>
                              <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                                피드 추가
                              </p>
                              <WrapForm>
                                <LabelMainImage2>피드 이미지</LabelMainImage2>
                                <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                                <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                                <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                                <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                                <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                              </WrapForm>
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
                            <ContentTitle>친구</ContentTitle>
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
                            <MainTitle>동아리 관리</MainTitle>
                          </WrapTitle>
                          <LeaderWithClubName>
                            {userID} 님은 현재 {club_name}의 동아리장입니다.
                          </LeaderWithClubName>
                          <WrapTab
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <TabTitle>동아리 가입 활성화</TabTitle>
                            <Button onClick={() => setRecruitIsOpen2((e) => !e)}>{RecruitIsOpen2 ? "비활성화하기" : "활성화하기"}</Button>
                          </WrapTab>
                          <WrapTab>
                            <TabTitle style={{ marginBottom: '20px' }}>
                              동아리 가입 승인
                            </TabTitle>
                            <div
                              style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                            >
                              {JoinPersonList}
                            </div>
                          </WrapTab>
                          <WrapTab>
                            <TabTitle style={{ marginBottom: '20px' }}>
                              동아리원 관리
                            </TabTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}>
                              {MemberList}
                            </div>
                          </WrapTab>
                          <WrapTab>
                            <TabTitle style={{ marginBottom: '20px' }}>
                              동아리 홍보 관리
                            </TabTitle>
                            <WrapSubTab>
                              <TabSubTitle>대표 이미지</TabSubTitle>
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
                                  파일찾기
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
                              <TabSubTitle>소개</TabSubTitle>
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
                              <TabSubTitle>피드</TabSubTitle>
                              <div>
                                <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                                    {feedList}
                                </ScrollContainer>
                              </div>
                              <Button onClick={() => {
                                setClubFeedModalIsOpen(true);
                              }}>피드 추가</Button>
                            </WrapSubTab>
                          </WrapTab>
                          <WrapTab>
                            <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
                          </WrapTab>
                        </div>
                      </ScrollContainer>
                    </Contents>
                  </Container>
                );
          
      }
      
    }
    
  }

  if ((((data1 != undefined) && (data2 != undefined)) && (data3 != undefined) && (data5 != undefined) && (data7 != undefined)) && (data6?.club_id != undefined) && (data8 != undefined)) {

    if (data1.opened == true) {
      const EditClubInfo = () => {

        const formData = new FormData();
        formData.append("club_name", data1.club_name);
        formData.append("club_description", introduction.comment) //수정 가능
        formData.append("category", data1.category)
        formData.append("leader_id", data1.leader_id);
        formData.append("club_img", files[0]); // 수정 가능
  
        if (RecruitIsOpen == true) {
          formData.append("opened", "true")
        }
        
        else {
          formData.append("opened", "false")
        }
  
    
        fetch(API_URL + "/club-service/update-club-form/" + clubID, {
          method: "POST",
          body: formData
        })
        .then((response) => {
          response.status == 200 ? alert("동아리 정보 수정 완료") : alert("동아리 정보 수정 실패")
        })
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
  
      let MemberList: JSX.Element[];
      MemberList = data7.map((Member: ClubMemberItem) => (
        <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  key={Member.user_id}>
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
                    <Button>탈퇴</Button>
                  </div>
      ))

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
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '50px',
                      }}
                    >
                      <button onClick={() => setClubFeedModalIsOpen(false)}>
                        (임시)닫는 버튼
                      </button>
                      <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                        피드 추가
                      </p>
                      <WrapForm>
                        <LabelMainImage2>피드 이미지</LabelMainImage2>
                        <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                        <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                        <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                        <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                        <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                      </WrapForm>
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
                    <MainTitle>동아리 관리</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} 님은 현재 {club_name}의 동아리장입니다.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>동아리 가입 활성화</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>{RecruitIsOpen ? "비활성화하기" : "활성화하기"}</Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 가입 승인
                    </TabTitle>
                    <div style={{color: "white"}}>가입을 신청한 사람이 없습니다.</div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리원 관리
                    </TabTitle>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                    >
                      {MemberList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 홍보 관리
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>대표 이미지</TabSubTitle>
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
                          파일찾기
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
                      <TabSubTitle>소개</TabSubTitle>
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
                      <TabSubTitle>피드</TabSubTitle>
                      <div>
                        <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                            {feedList}
                        </ScrollContainer>
                      </div>
                      <Button onClick={() => {
                        setClubFeedModalIsOpen(true);
                      }}>피드 추가</Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );

      }

      else {
        let FriendList: JSX.Element[];
                FriendList = data8.map((Friends: FriendListItem) => (
                      <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
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
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '50px',
                      }}
                    >
                      <button onClick={() => setClubFeedModalIsOpen(false)}>
                        (임시)닫는 버튼
                      </button>
                      <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                        피드 추가
                      </p>
                      <WrapForm>
                        <LabelMainImage2>피드 이미지</LabelMainImage2>
                        <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                        <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                        <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                        <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                        <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                      </WrapForm>
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
                    <ContentTitle>친구</ContentTitle>
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
                    <MainTitle>동아리 관리</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} 님은 현재 {club_name}의 동아리장입니다.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>동아리 가입 활성화</TabTitle>
                    <Button onClick={() => setRecruitIsOpen((e) => !e)}>{RecruitIsOpen ? "비활성화하기" : "활성화하기"}</Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 가입 승인
                    </TabTitle>
                    <div style={{color: "white"}}>가입을 신청한 사람이 없습니다.</div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리원 관리
                    </TabTitle>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                    >
                      {MemberList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 홍보 관리
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>대표 이미지</TabSubTitle>
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
                          파일찾기
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
                      <TabSubTitle>소개</TabSubTitle>
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
                      <TabSubTitle>피드</TabSubTitle>
                      <div>
                        <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                            {feedList}
                        </ScrollContainer>
                      </div>
                      <Button onClick={() => {
                        setClubFeedModalIsOpen(true);
                      }}>피드 추가</Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );

      }
  
      
    }

    else {
      const EditClubInfo = () => {

        const formData = new FormData();
        formData.append("club_name", data1.club_name);
        formData.append("club_description", introduction.comment) //수정 가능
        formData.append("category", data1.category)
        formData.append("leader_id", data1.leader_id);
        formData.append("club_img", files[0]); // 수정 가능
  
        if (RecruitIsOpen2 == true) {
          formData.append("opened", "true")
        }
        
        else {
          formData.append("opened", "false")
        }
  
    
        fetch(API_URL + "/club-service/update-club-form/" + clubID, {
          method: "POST",
          body: formData
        })
        .then((response) => {
          response.status == 200 ? alert("동아리 정보 수정 완료") : alert("동아리 정보 수정 실패")
        })
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
  
      let MemberList: JSX.Element[];
      MemberList = data7.map((Member: ClubMemberItem) => (
        <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  key={Member.user_id}>
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
                    <Button>탈퇴</Button>
                  </div>
      ))

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
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '50px',
                      }}
                    >
                      <button onClick={() => setClubFeedModalIsOpen(false)}>
                        (임시)닫는 버튼
                      </button>
                      <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                        피드 추가
                      </p>
                      <WrapForm>
                        <LabelMainImage2>피드 이미지</LabelMainImage2>
                        <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                        <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                        <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                        <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                        <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                      </WrapForm>
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
                    <MainTitle>동아리 관리</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} 님은 현재 {club_name}의 동아리장입니다.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>동아리 가입 활성화</TabTitle>
                    <Button onClick={() => setRecruitIsOpen2((e) => !e)}>{RecruitIsOpen2 ? "비활성화하기" : "활성화하기"}</Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 가입 승인
                    </TabTitle>
                    <div style={{color: "white"}}>가입을 신청한 사람이 없습니다.</div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리원 관리
                    </TabTitle>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                    >
                      {MemberList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 홍보 관리
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>대표 이미지</TabSubTitle>
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
                          파일찾기
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
                      <TabSubTitle>소개</TabSubTitle>
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
                      <TabSubTitle>피드</TabSubTitle>
                      <div>
                        <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                            {feedList}
                        </ScrollContainer>
                      </div>
                      <Button onClick={() => {
                        setClubFeedModalIsOpen(true);
                      }}>피드 추가</Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
                  </WrapTab>
                </div>
              </ScrollContainer>
            </Contents>
          </Container>
        );

      }

      else {

        let FriendList: JSX.Element[];
                FriendList = data8.map((Friends: FriendListItem) => (
                      <div>{Friends.state == "ACCEPT" && <Friend key={Friends.email}>{Friends.nickname}</Friend>}</div>
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
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '50px',
                      }}
                    >
                      <button onClick={() => setClubFeedModalIsOpen(false)}>
                        (임시)닫는 버튼
                      </button>
                      <p style={{ color: 'black', textAlign: 'left', fontWeight: "bold" }}>
                        피드 추가
                      </p>
                      <WrapForm>
                        <LabelMainImage2>피드 이미지</LabelMainImage2>
                        <InputFind2 ref={inputRef2} placeholder='파일 이름' disabled={true}></InputFind2>
                        <FindLabelMainImage2 htmlFor='feedfile' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px", textAlign: "center"}}>파일찾기</FindLabelMainImage2>
                        <InputMainImage2 type="file" id="feedfile" accept="image/*" onChange={SaveFeedFileImage} style={{display: "none"}}></InputMainImage2>
                        <LabelDescription2 htmlFor='feed_comment' id="feed_comment_label">피드 내용</LabelDescription2>
                        <InputDescription2 type="text" maxLength={30} id='feed_comment' name='feed_comment' value={feed.feed_comment} onChange={handleFeedInputChange} ref={inputRef3}></InputDescription2>
                      </WrapForm>
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
                    <ContentTitle>친구</ContentTitle>
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
                    <MainTitle>동아리 관리</MainTitle>
                  </WrapTitle>
                  <LeaderWithClubName>
                    {userID} 님은 현재 {club_name}의 동아리장입니다.
                  </LeaderWithClubName>
                  <WrapTab
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TabTitle>동아리 가입 활성화</TabTitle>
                    <Button onClick={() => setRecruitIsOpen2((e) => !e)}>{RecruitIsOpen2 ? "비활성화하기" : "활성화하기"}</Button>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 가입 승인
                    </TabTitle>
                    <div style={{color: "white"}}>가입을 신청한 사람이 없습니다.</div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리원 관리
                    </TabTitle>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: "10px"}}
                    >
                      {MemberList}
                    </div>
                  </WrapTab>
                  <WrapTab>
                    <TabTitle style={{ marginBottom: '20px' }}>
                      동아리 홍보 관리
                    </TabTitle>
                    <WrapSubTab>
                      <TabSubTitle>대표 이미지</TabSubTitle>
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
                          파일찾기
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
                      <TabSubTitle>소개</TabSubTitle>
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
                      <TabSubTitle>피드</TabSubTitle>
                      <div>
                        <ScrollContainer style={{ width: '70vw' }} vertical={false}>
                            {feedList}
                        </ScrollContainer>
                      </div>
                      <Button onClick={() => {
                        setClubFeedModalIsOpen(true);
                      }}>피드 추가</Button>
                    </WrapSubTab>
                  </WrapTab>
                  <WrapTab>
                    <Button style={{ padding: '10px' }} onClick={() => {EditClubInfo()}}>저장</Button>
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
