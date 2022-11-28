import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: #081055;
  display: flex;
`;
const WrapContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
`;

const WrapTitle = styled.div`
  padding: 20px;
  margin-top: 50px;
`;

const Title = styled.span`
  color: white;
  font-size: 100px;
  font-weight: bold;
`;
const Info = styled.p`
  font-size: 20px;
  color: white;
  padding: 20px;
  margin: 50px;
`;
const WrapButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 50px;
`;

const Button = styled.button`
  width: 150px;
  height: 50px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: bold;
`;

export { Container, WrapContents, WrapTitle, Title, Info, WrapButton, Button };
