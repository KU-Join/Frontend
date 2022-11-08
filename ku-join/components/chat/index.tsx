import React, { useState } from "react";
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
import { BsFillMicFill, BsPlusLg } from 'react-icons/bs';
import { MdHeadset } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';
import { MemberName } from "../manage/manage-style";

  type ClubMemberItem = {
    user_id: string;
    leader: boolean;
  }


const ChattingChannelLayout = () => {
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const router = useRouter();

  const { club_name, club_id } = router.query;

  let clubID = club_id as string;

  const userID = sessionStorage.getItem('id');

  const userid = userID as string;

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

  const getClubMemberList = async (): Promise<ClubMemberItem[]> => {
    return await (await fetch(API_URL + '/club-service/club-member/' + clubID)).json();
  }

  const {data: data1, isLoading: isLoading1, error: error1} = useQuery(['ClubMember'], getClubMemberList);

  if (isLoading1) return <div>'Loading...'</div>

  if (error1) return <div>'Error..</div>

  if (data1 != undefined) {

    let MemberList: JSX.Element[];
      MemberList = data1.map((Member: ClubMemberItem) => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center'}} key={Member.user_id}>
            <UserImg />
            <MemberName>{Member.user_id}</MemberName>
        </div>
      ))

      return(
        <Container>
            <WrapContents style={{backgroundColor: "#2F3136",zIndex: "5"}}>
                <Logo>
                  <LogoTitle style={{color: "white"}} onClick={handleClick}>KU:</LogoTitle>
                  <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>
                    JOIN
                  </LogoTitle>
                </Logo>
                <ContentTitle style={{color: "white"}}>{club_name} 동아리원 목록</ContentTitle>
                <ScrollContainer style={{ height: '80vh' }} vertical={false}>
                    <div style={{display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", paddingTop: "20px"}}>{MemberList}</div>
                </ScrollContainer>
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
            <div style={{width: "80vw", height: "100vh", paddingLeft: "20vw", backgroundColor: "#36393F", position: "absolute", zIndex: "3", display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
                <div style={{height: "90vh"}}>
                    <div style={{backgroundColor: "#202225", fontSize: "1.5rem", padding: "10px", textAlign: "left", color: "gray"}}># {club_name} 채팅방</div>
                    <ScrollContainer style={{ height: '80vh' }} vertical={false}>
                        <div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>!message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>!message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>!message</div>
                            </div>
                            <div style={{padding: "10px"}}>
                                <div style={{textAlign: "left", color: "white", fontWeight: "bold"}}>test1234</div>
                                <div style={{textAlign: "left", color: "#878A8F"}}>!message</div>
                            </div>
                        </div>
                    </ScrollContainer>
                </div>
                <div style={{color: "white", height: "7vh", padding: "10px", display: "flex", gap: "10px"}}>
                    <input type="text" style={{backgroundColor: "#40444B", borderRadius: "5px", padding: "10px", color: "white", width: "70vw"}}></input>
                    <button style={{width: "10vw", borderRadius: "5px"}}>보내기</button>
                </div>
            </div>
            <div style={{width: "100vw", height: "100vh", paddingLeft: "80vw", backgroundColor: "white", color: "black", position: "absolute", zIndex: "1"}}>
                <ContentTitle style={{paddingTop: "20px"}}>{club_name} 게시판</ContentTitle>
                {noticeIsOpen &&
                <div>
                    <div style={{display: "flex", justifyContent: "center", gap: "40px", padding: "20px 0"}}>
                        <p style={{fontWeight: "bold"}}>공지</p>
                        <p style={{cursor: "pointer"}} onClick={() => {setNoticeIsOpen((e) => !e), setImgIsOpen((e) => !e)}}>사진</p>
                    </div>
                    <ScrollContainer style={{ height: '80vh' }} vertical={false}>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>공지합니다.</p>
                    </div>
                    <div style={{
                    width: '300px',
                    borderRadius: '5px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    margin: '20px auto',
                    }}>
                        <p>2022-10-XX</p>
                        <p>김아무개</p>
                        <br/>
                        <p>!!!!!!!!공지합니다.</p>
                    </div>
                    </ScrollContainer>
                    <button style={{width: "10vw", height: "7vh", borderRadius: "5px", padding: "10px"}}>글쓰기</button>
                </div>
                }
                {ImgIsoOpen && 
                <div>
                    <div style={{display: "flex", justifyContent: "center", gap: "40px", padding: "20px 0"}}>
                        <p style={{cursor: "pointer"}} onClick={() => {setNoticeIsOpen((e) => !e), setImgIsOpen((e) => !e)}}>공지</p>
                        <p style={{fontWeight: "bold"}}>사진</p>
                    </div>
                    <ScrollContainer style={{ height: '80vh' }} vertical={false}>
                        <div
                        style={{
                        width: '300px',
                        borderRadius: '5px',
                        backgroundColor: 'gray',
                        textAlign: 'center',
                        margin: '20px auto',
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
                            a
                        </p>
                        <p style={{ fontSize: '8px', color: '#333333' }}>ㅎ</p>
                        </div>
                        </div>
                        <div
                        style={{
                        width: '300px',
                        borderRadius: '5px',
                        backgroundColor: 'gray',
                        textAlign: 'center',
                        margin: '20px auto',
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
                            a
                        </p>
                        <p style={{ fontSize: '8px', color: '#333333' }}>ㅎ</p>
                        </div>
                        </div>
                        <div
                        style={{
                        width: '300px',
                        borderRadius: '5px',
                        backgroundColor: 'gray',
                        textAlign: 'center',
                        margin: '20px auto',
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
                            a
                        </p>
                        <p style={{ fontSize: '8px', color: '#333333' }}>ㅎ</p>
                        </div>
                        </div>
                        <div
                        style={{
                        width: '300px',
                        borderRadius: '5px',
                        backgroundColor: 'gray',
                        textAlign: 'center',
                        margin: '20px auto',
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
                            a
                        </p>
                        <p style={{ fontSize: '8px', color: '#333333' }}>ㅎ</p>
                        </div>
                        </div>
                    </ScrollContainer>
                    <button style={{width: "10vw", height: "7vh", borderRadius: "5px", padding: "10px"}}>글쓰기</button>
                </div>
                }
            </div>
            
        </Container>
      )

  } 
  
}

export default ChattingChannelLayout