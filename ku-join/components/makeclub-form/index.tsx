import React from 'react'
import { Container, Form, WrapForm, Input, InputLeaderID, LabelLeaderID, InputClubName, LabelClubName, InputClubCategory, LabelClubCategory, InputMainImage, LabelMainImage, UploadBtn} from './makeclub-form-style'

const MakeClubForm = () => {
    return(
        <Container>
            <Form>
                <WrapForm>
                    <LabelLeaderID>대표자 ID</LabelLeaderID>
                    <InputLeaderID></InputLeaderID>
                    <LabelClubName>동아리 이름</LabelClubName>
                    <InputClubName></InputClubName>
                    <LabelClubCategory>동아리 분과</LabelClubCategory>
                    <InputClubCategory></InputClubCategory>
                    <LabelMainImage>대표 이미지</LabelMainImage>
                    <InputMainImage></InputMainImage>
                    <UploadBtn>파일선택</UploadBtn>
                </WrapForm>
                <Input type="button" value="등록" style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", display: "block", margin: "0 auto", fontWeight: "bold"}}></Input>
            </Form>
        </Container>
    );
};

export default MakeClubForm;