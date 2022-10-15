import React from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: #081055;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignUpFinish = () => {
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        router.push('./');
      };

    return (
        <Container>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "600px", height: "400px", gap: "60px", backgroundColor: "white", borderRadius: "5px"}}>
                <p style={{textAlign: "left", color: "#b72929"}}>회원가입이 완료되었습니다. <br/>서비스를 이용하시려면 로그인 하십시요.</p>
                <input type="button" value="확인" onClick={handleSubmit} style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", display: "block", margin: "0 auto", fontWeight: "bold"}}></input>
            </div>
        </Container>
        
    )
}

export default SignUpFinish;

