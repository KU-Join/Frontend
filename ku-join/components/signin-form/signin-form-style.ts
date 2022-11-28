import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: #081055;
  display: flex;
`;

const Form = styled.form`
  border-radius: 10px;
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  background-color: white;
`;

const WrapForm = styled.div`
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 200px;
  display: grid;
  gap: 10px;
  grid-template-areas:
    'signin_id_label signin_id'
    'signin_pwd_label signin_pwd';

  grid-template-columns: 150px 150px;
  grid-template-rows: 30px 30px;
`;

const LabelID = styled.label`
  color: #b72929;
  grid-area: signin_id_label;
  text-align: left;
`;

const InputID = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: signin_id;
  border: 1px solid black;
`;

const LabelPwd = styled.label`
  color: #b72929;
  grid-area: signin_pwd_label;
  text-align: left;
`;

const InputPwd = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: signin_pwd;
  border: 1px solid black;
`;

export { Container, Form, WrapForm, LabelID, InputID, LabelPwd, InputPwd };
