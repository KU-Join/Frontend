import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: #081055;
  display: flex;
`;

const WrapContents = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 20vw;
  height: 100vh;
  position: absolute;
`;

const UserInfo = styled.div`
  width: 20vw;
  height: 95vh;
`;

const Contents = styled.div`
  width: fit-content;
  height: fit-content;
  background-color: #081055;
  padding-left: 25vw;
  padding-top: 5vh;
  display: flex;
  flex-direction: column;
`;
const WrapUserStatus = styled.div`
  width: 20vw;
  height: 5vh;
  background-color: #292b2f;
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;
const Logo = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;
`;
const LogoTitle = styled.button`
  font-size: 3rem;
  color: black;
  font-weight: bold;
  border: none;
  background: none;
`;
const WrapJoinedClub = styled.div`
  display: flex;
  flex-direction: column;
`;
const ContentTitle = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
`;
const JoinedClubImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: gray;
`;

const JoinedClubName = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const JoinedClub = styled.div`
  display: flex;
  gap: 20px;
  justify-content: start;
  padding: 10px;
  align-items: center;
  margin-left: 40px;
`;
const UserProfile = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const UserImg = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: gray;
`;
const UserName = styled.p`
  font-weight: bold;
  color: white;
`;

const UserStatus = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const MainTitle = styled.p`
  font-size: 2rem;
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
`;

const WrapClubTypes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 100px;
`;

const WrapClubType = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const ClubType = styled.p`
  font-size: 1.3rem;
  color: white;
  font-weight: bold;
  text-align: left;
  margin-bottom: 30px;
`;
const WrapClub = styled.div``;

const Club = styled.div`
  width: 400px;
  heigth: 300px;
  border-radius: 20px;
  background-color: #d9d9d9;
  font-size: 100px;
`;

const WrapFriendList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

const WrapFriendListTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 70px;
  margin-bottom: 20px;
`;

const Friend = styled.p`
  font-size: 18px;
  padding: 0 130px 15px 0;
`;

const WrapTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;
const WrapButton = styled.div`
  display: flex;
  justify-content: space-between;
`;

export {
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
};
