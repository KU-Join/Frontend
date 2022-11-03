import React, {useState, useRef} from "react";
import {useRouter} from 'next/router';
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
    WrapButton
  } from '../main/main-style'

import {
    InputFind,
    FindLabelMainImage,
    InputMainImage
} from '../makeclub-form/makeclub-form-style'

import { LeaderWithClubName, TabTitle, TabSubTitle, MemberName, Button, WrapTab, WrapSubTab } from "./manage-style";
import { Input } from "../signup-form/signup-form-style";
import Modal from 'react-modal'

import { BsFillMicFill, BsPlusLg } from 'react-icons/bs';
import { MdHeadset } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';



const ManagementLayout = () => {
    const router = useRouter();

    const {club_name} = router.query
    const userID = sessionStorage.getItem('id')

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

    const [files, setFiles] = useState<any>([])

    const SaveFileImage = (e:any) => {
        inputRef.current.placeholder = e.target.files[0].name
        setFiles([...files, e.target.files[0]]);
    }

    const inputRef = useRef<any>()

    const [introduction, setIntroduction] = useState({
        comment: ''
      });

    
    const handleInputChange = (e:any) => {
        setIntroduction({ ...introduction, [e.target.name]: e.target.value});
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);

    
          

    return (
        <Container>
            <Modal isOpen={modalIsOpen} ariaHideApp={false} style={{
    overlay: {
      margin: 'auto',
      width: '700px',
      height: '500px',
      backgroundColor: 'white',
      borderRadius: '20px'
    }
  }} contentElement={
    (props, children) => 
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "700px", height: "500px"}}> 
    <form>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "50px"}}>
        <button onClick={()=>setModalIsOpen(false)}>(임시)닫는 버튼</button>
        <p style={{color: "#b72929", textAlign: "left"}}>친구로 추가할 분의 아이디를 입력해주세요.</p>
        <input type="text" id="verify_code" name="verify_code" placeholder="" style={{borderTop: "none", borderLeft: "none", borderRight: "none", backgroundColor: "none", width: "250px"}}></input>
        <Input type="button" value="제출" style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px"}}></Input>
      </div>
    </form>
    </div>}
  >
      </Modal>
            <WrapContents>
                <UserInfo>
                <Logo>
                    <LogoTitle onClick={handleClick}>KU:</LogoTitle>
                    <LogoTitle style={{ color: '#2ABF4B' }} onClick={handleClick}>JOIN</LogoTitle>
                </Logo>
                <WrapFriendList>
                    <WrapFriendListTitle>
                        <ContentTitle>친구</ContentTitle>
                        <BsPlusLg style={{color: "black", cursor: "pointer"}} onClick={() => {setModalIsOpen(true)}}/>
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
                    <RiSettings2Fill style={{ color: '#B9BBBE', cursor: "pointer" }} onClick={() => router.push('../../setup')}/>
                </UserStatus>
                </WrapUserStatus>
            </WrapContents>
            <Contents>
                <ScrollContainer style={{height: "85vh"}} horizontal={false} ignoreElements="input">
                    <div style={{display: "flex", maxHeight: "400px", gap: "10px", flexDirection: "column"}}>
                        <WrapTitle>
                            <MainTitle>동아리 관리</MainTitle>
                        </WrapTitle>
                        <LeaderWithClubName>{userID} 님은 현재 {club_name}의 동아리장입니다.</LeaderWithClubName>
                        <WrapTab style={{display: "flex", justifyContent: "space-between"}}>
                            <TabTitle>동아리 가입 활성화</TabTitle>
                            <Button>활성화</Button>
                        </WrapTab>
                        <WrapTab>
                            <TabTitle style={{marginBottom: "20px"}}>동아리 가입 승인</TabTitle>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                    <UserImg />
                                    <MemberName>이아무개</MemberName>
                                </div>
                                <div style={{display: "flex", gap: "10px"}}>
                                    <Button>승인</Button>
                                    <Button>거절</Button>
                                </div>  
                            </div>
                        </WrapTab>
                        <WrapTab>
                            <TabTitle style={{marginBottom: "20px"}}>동아리원 관리</TabTitle>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                    <UserImg />
                                    <MemberName>김아무개</MemberName>
                                </div>
                                <Button>탈퇴</Button>
                            </div>
                        </WrapTab>
                        <WrapTab>
                            <TabTitle style={{marginBottom: "20px"}}>동아리 홍보 관리</TabTitle>
                            <WrapSubTab>
                                <TabSubTitle>대표 이미지</TabSubTitle>
                                <div style={{display: "flex", gap: "10px", alignItems: "center", justifyContent: "center"}}>
                                    <InputFind ref={inputRef} placeholder='파일 이름' disabled={true} style={{width: "300px"}}></InputFind>
                                    <FindLabelMainImage htmlFor='file' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", paddingTop: "6px"}}>파일찾기</FindLabelMainImage>
                                    <InputMainImage type="file" id="file" accept="image/*" onChange={SaveFileImage} style={{display: "none"}}></InputMainImage>
                                </div>
                            </WrapSubTab>
                            <WrapSubTab>
                                <TabSubTitle>소개</TabSubTitle>
                                <input type="text" id="comment" name="comment" value={introduction.comment} onChange={handleInputChange} placeholder="안녕하세요" style={{width: "400px"}} maxLength={30}></input>
                            </WrapSubTab>
                            <WrapSubTab>
                                <TabSubTitle>피드</TabSubTitle>
                                <div>
                                    <ScrollContainer style={{width: "70vw"}} vertical={false}>
                                        <div style={{display: "flex", maxWidth: "300px", gap: "50px"}}>
                                            <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white", textAlign: "center", margin: "20px auto"}}>
                                                <img src="https://img.icons8.com/office/80/000000/snow.png" style={{width: "300px", height: "400px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", objectFit: "cover"}} alt=""/>
                                                <div style={{textAlign: "left", padding: "10px"}}>
                                                    <p style={{fontSize: "16px", marginBottom: "5px"}}>피드 내용</p>
                                                    <p style={{fontSize: "8px", color: "#333333"}}>10월 30일</p>
                                                </div>
                                            </div>
                                            <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white", textAlign: "center", margin: "20px auto"}}>
                                                <img src="https://img.icons8.com/office/80/000000/snow.png" style={{width: "300px", height: "400px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", objectFit: "cover"}} alt=""/>
                                                <div style={{textAlign: "left", padding: "10px"}}>
                                                    <p style={{fontSize: "16px", marginBottom: "5px"}}>피드 내용</p>
                                                    <p style={{fontSize: "8px", color: "#333333"}}>10월 30일</p>
                                                </div>
                                            </div>
                                            <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white", textAlign: "center", margin: "20px auto"}}>
                                                <img src="https://img.icons8.com/office/80/000000/snow.png" style={{width: "300px", height: "400px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", objectFit: "cover"}} alt=""/>
                                                <div style={{textAlign: "left", padding: "10px"}}>
                                                    <p style={{fontSize: "16px", marginBottom: "5px"}}>피드 내용</p>
                                                    <p style={{fontSize: "8px", color: "#333333"}}>10월 30일</p>
                                                </div>
                                            </div>
                                            <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white", textAlign: "center", margin: "20px auto"}}>
                                                <img src="https://img.icons8.com/office/80/000000/snow.png" style={{width: "300px", height: "400px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", objectFit: "cover"}} alt=""/>
                                                <div style={{textAlign: "left", padding: "10px"}}>
                                                    <p style={{fontSize: "16px", marginBottom: "5px"}}>피드 내용</p>
                                                    <p style={{fontSize: "8px", color: "#333333"}}>10월 30일</p>
                                                </div>
                                            </div>
                                            <div style={{width: "300px", borderRadius: "5px", backgroundColor: "white", textAlign: "center", margin: "20px auto"}}>
                                                <img src="https://img.icons8.com/office/80/000000/snow.png" style={{width: "300px", height: "400px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", objectFit: "cover"}} alt=""/>
                                                <div style={{textAlign: "left", padding: "10px"}}>
                                                    <p style={{fontSize: "16px", marginBottom: "5px"}}>피드 내용</p>
                                                    <p style={{fontSize: "8px", color: "#333333"}}>10월 30일</p>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollContainer>
                                </div>
                                <Button>피드 추가</Button>
                            </WrapSubTab>
                        </WrapTab>
                        <WrapTab>
                            <Button style={{padding: "10px"}}>저장</Button>
                        </WrapTab>
                    </div>
                </ScrollContainer>
            </Contents>
      </Container>
    )
}

export default ManagementLayout;