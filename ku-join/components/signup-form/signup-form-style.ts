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
  height: 250px;
  display: grid;
  gap: 10px;
  grid-template-areas: "signup_id_label signup_id duplicate_btn"
                      "signup_pwd_label signup_pwd ."
                      "verify_pwd_label verify_pwd ."
                      "signup_name_label signup_name .";


  grid-template-columns: 150px 150px 100px;
  grid-template-rows: repeat(4, 30px);
`;

const DuplicateBtn = styled.button`
  grid-area: duplicate_btn;
  width: 100px;
  height: 30px;
  background-color: #F1EEEE;
  border: none;
  border-radius: 20px;
  margin-left: 20px;
`

const Input = styled.input`
  background-color: #d9d9d9;
  border: none;
`;

const LabelID = styled.label`
  color: #b72929;
  grid-area: signup_id_label;
  text-align: left;
`;

const InputID = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: signup_id;
  border: 1px solid black;
`;

const LabelPwd = styled.label`
  color: #b72929;
  grid-area: signup_pwd_label;
  text-align: left;
`;

const InputPwd = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: signup_pwd;
  border: 1px solid black;
`;

const LabelVerifyPwd = styled.label`
  color: #b72929;
  grid-area: verify_pwd_label;
  text-align: left;
`;

const InputVerifyPwd = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: verify_pwd;
  border: 1px solid black;
`;

const LabelName = styled.label`
  color: #b72929;
  grid-area: signup_name_label;
  text-align: left;
`;

const InputName = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: signup_name;
  border: 1px solid black;
`;

export { Container, Form, WrapForm, DuplicateBtn, Input, LabelID, InputID, LabelPwd, InputPwd, LabelVerifyPwd, InputVerifyPwd, LabelName, InputName };
