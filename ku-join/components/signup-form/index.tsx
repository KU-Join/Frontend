import React, {useState, useCallback} from 'react';
//import Modal from '../email-modal/modal'
import { Container, Form, WrapForm, DuplicateBtn, Input, LabelID, InputID, LabelPwd, InputPwd, LabelVerifyPwd, InputVerifyPwd, LabelName, InputName } from './signup-form-style';
import { useRouter } from 'next/router';
import Modal from 'react-modal'
import { MdAlternateEmail } from 'react-icons/md';

const SignUpForm = () => {

  const router = useRouter();

  const [duplication, setDuplication] = useState(false);

  const [person, setPerson] = useState({
    signup_id: '',
    signup_pwd: '',
    verify_pwd: '',
    signup_name: '',
  });

  const handleInputChange = (e:any) => {
    setPerson({ ...person, [e.target.name]: e.target.value});
  }

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const onClickToggleModal = useCallback(() => {
    console.log(person.signup_id.length)
      setOpenModal(!isOpenModal);
  }, [isOpenModal]);


  const handleSubmit = (e:any) => {
    if(person.signup_id.length == 0) {
      e.preventDefault();
      alert("건국대학교 포털 아이디를 입력해주세요.");
      return false;
    }

    if(duplication == false) {
      e.preventDefault();
      alert("아이디 중복확인이 필요합니다.");
      return false;
    }

    if((person.signup_pwd.length < 8) || (person.signup_pwd.length > 16)) {
      e.preventDefault();
      alert("비밀번호는 8~16자리여야 합니다.");
      return false;
    }

    if((person.signup_pwd.search(/[0-9]/) < 0) || (person.signup_pwd.search(/[a-z]/) < 0)) {
      e.preventDefault();
      alert("비밀번호는 영어 소문자와 숫자를 혼용해야합니다.");
      return false;
    }

    if((person.signup_pwd != person.verify_pwd) && ((person.signup_pwd.length > 0) && (person.verify_pwd.length > 0))) {
      e.preventDefault();
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }

    fetch("https://kujoin.herokuapp.com/http://54.180.68.142:8080/member-service/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://54.180.68.142:8080",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        email: person.signup_id + "@konkuk.ac.kr",
        password: person.signup_pwd,
        nickname: person.signup_name
      })
    })
    .then(response => response.json())
    .then((response) => {
      if((response.email === person.signup_id) && (response.nickname === person.signup_name)) {
        router.push('./finishsignup');
      }
      else {
        alert("회원가입에 실패했습니다. 아이디와 닉네임을 다시 확인해주세요.")
      }
    })

    return true;
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const SendMail = () => {
    fetch("https://kujoin.herokuapp.com/http://54.180.68.142:8080/member-service/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://54.180.68.142:8080",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        email: person.signup_id + "@konkuk.ac.kr"
      })
    })
    .then(response => response.json())
    .then((response) => {
      response.message === '메일을 전송하였습니다.' ? setModalIsOpen(true) : alert("메일 전송실패. 아이디를 확인해주세요. 이미 가입된 사용자일 수 있습니다.")
    })
  }

  const [codeObj, setCodeObj] = useState({
    verify_code: ''
  })

  const handleInputCodeChange = (e:any) => {
    setCodeObj({...codeObj, [e.target.name]: e.target.value})
  }

  const SendCode = () => {
    fetch("https://kujoin.herokuapp.com/http://54.180.68.142:8080/member-service/mail/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://54.180.68.142:8080",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        email: person.signup_id + "@konkuk.ac.kr",
        code: codeObj.verify_code
      })
    })
    .then(response => response.json())
    .then((response) => {
      response.message === "인증 완료되었습니다." ? CheckDuplication() : alert("인증코드가 맞지 않습니다.")
    })
  }

  const CheckDuplication = () => {
    setDuplication(!duplication)
    alert("중복확인이 완료되었습니다. 창을 닫아주십시요.")
  }

  const PreviousPage = () => {
    router.push('./');
  }

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
    <div key={person.signup_id} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "700px", height: "500px"}}> 
    <form>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "50px"}}>
        <button onClick={()=>setModalIsOpen(false)}>(임시)닫는 버튼</button>
        <p style={{color: "#b72929", textAlign: "left"}}>건국대 포털로 인증번호를 보냈습니다.<br/>인증번호를 입력해주세요.</p>
        <input type="text" id="verify_code" name="verify_code" placeholder="" onChange={handleInputCodeChange} style={{borderTop: "none", borderLeft: "none", borderRight: "none", backgroundColor: "none", width: "250px"}}></input>
        <Input type="button" value="제출" onClick={SendCode} style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px"}}></Input>
      </div>
    </form>
    </div>}
  >
      </Modal>
      <Form>
        <WrapForm>
          <LabelID htmlFor="signup_id" id="signup_id_label">포탈 아이디</LabelID>
          <InputID type="text" id="signup_id" name="signup_id" placeholder="" value={person.signup_id} onChange={handleInputChange}></InputID>
          <DuplicateBtn type="button" id="duplicate_check_btn" onClick={SendMail}>중복 확인</DuplicateBtn>
          <LabelPwd htmlFor="signup_pwd" id="signup_pwd_label">비밀번호</LabelPwd>
          <InputPwd type="password" id="signup_pwd" name="signup_pwd" placeholder="" value={person.signup_pwd} onChange={handleInputChange}></InputPwd>
          <LabelVerifyPwd htmlFor="verify_pwd" id="verify_pwd_label">비밀번호 확인</LabelVerifyPwd>
          <InputVerifyPwd type="password" id="verify_pwd" name="verify_pwd" placeholder="" value={person.verify_pwd} onChange={handleInputChange}></InputVerifyPwd>
          <LabelName htmlFor="signup_name" id="signup_name_label">이름(닉네임)</LabelName>
          <InputName type="text" id="signup_name" name="signup_name" placeholder="" value={person.signup_name} onChange={handleInputChange}></InputName>
        </WrapForm>
        <div style={{display: "flex"}}>
            <Input type="button" value="등록" onClick={handleSubmit} style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", display: "block", margin: "0 auto", fontWeight: "bold"}}></Input>
            <button onClick={PreviousPage} style={{width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", display: "block", margin: "0 auto", fontWeight: "bold"}}>취소</button>
        </div>
      </Form>
    </Container>
  );
};

export default SignUpForm;
