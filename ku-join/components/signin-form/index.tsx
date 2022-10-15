import React from 'react';
import { Container, Form, WrapForm, LabelID, InputID, LabelPwd, InputPwd } from './signin-form-style';
import { useRouter } from 'next/router';

const SignInForm = () => {
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push('./main');
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <WrapForm>
          <LabelID htmlFor="signin_id" id="signin_id_label">포탈 아이디</LabelID>
          <InputID type="text" id="signup_id" name="signup_id" placeholder=""></InputID>
          <LabelPwd htmlFor="signin_pwd" id="signin_pwd_label">비밀번호</LabelPwd>
          <InputPwd type="password" id="signin_pwd" name="signin_pwd" placeholder=""></InputPwd>
        </WrapForm>
        <input type="submit" value="로그인" style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", display: "block", margin: "0 auto", fontWeight: "bold"}}></input>
      </Form>
    </Container>
  );
};

export default SignInForm;
