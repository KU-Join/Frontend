import React, {useState} from 'react';
import { Container, Form, WrapForm, LabelID, InputID, LabelPwd, InputPwd } from './signin-form-style';
import { useRouter } from 'next/router';

const SignInForm = () => {
  const router = useRouter();

  const [person, setPerson] = useState({
    signin_id: '',
    signin_pwd: ''
  });

  const handleSubmit = (e: any) => {
    if(person.signin_id.length == 0) {
      e.preventDefault();
      alert("아이디를 입력해주세요.");
      return false;
    }

    if(person.signin_pwd.length == 0) {
      e.preventDefault();
      alert("비밀번호를 입력해주세요.");
      return false;
    }

    fetch("https://kujoin.herokuapp.com/http://54.180.68.142:8080/member-service/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://54.180.68.142:8080",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        email: person.signin_id + "@konkuk.ac.kr",
        password: person.signin_pwd
      })
    })
    .then((response) => {
      if(response.status === 400) {
        alert("해당 회원은 존재하지 않습니다.")
        return false;
      }
      else if(response.status === 401) {
        alert("비밀번호를 잘못 입력하셨습니다.")
        return false;
      }
      else {
        const accesstoken = response.headers.get('accessToken')
        if(accesstoken != null) {
          //세션스토리지에 집어넣은 이유 : 11월 14일에 전시회할 때 한 컴퓨터에서 여러 사람이 다른 탭으로 로그인 가능하도록 하기 위해서!
          sessionStorage.setItem('token', accesstoken)
          sessionStorage.setItem('id', person.signin_id)
          router.push('./main')
        }
      }
    })

    return true;

  };

  const handleInputChange = (e:any) => {
    setPerson({ ...person, [e.target.name]: e.target.value});
  }


  return (
    <Container>
      <Form>
        <WrapForm>
          <LabelID htmlFor="signin_id" id="signin_id_label">포탈 아이디</LabelID>
          <InputID type="text" id="signin_id" name="signin_id" placeholder="" value={person.signin_id} onChange={handleInputChange}></InputID>
          <LabelPwd htmlFor="signin_pwd" id="signin_pwd_label">비밀번호</LabelPwd>
          <InputPwd type="password" id="signin_pwd" name="signin_pwd" placeholder="" value={person.signin_pwd} onChange={handleInputChange}></InputPwd>
        </WrapForm>
        <input type="button" onClick={handleSubmit} value="로그인" style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", display: "block", margin: "0 auto", fontWeight: "bold"}}></input>
      </Form>
    </Container>
  );
};

export default SignInForm;
