import React, {useState, useRef} from 'react'
import { Container, Form, WrapForm, Input, InputLeaderID, LabelLeaderID, InputClubName, LabelClubName, InputClubCategory, LabelClubCategory, InputMainImage, LabelMainImage, FindLabelMainImage, InputFind, LabelDescription, InputDescription} from './makeclub-form-style'

const MakeClubForm = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
    
    const [files, setFiles] = useState<any>([])

    const SaveFileImage = (e:any) => {
        inputRef.current.placeholder = e.target.files[0].name
        setFiles([...files, e.target.files[0]]);
        console.log(files)
    }

    const inputRef = useRef<any>()

    const [club, setClub] = useState({
        leader_id: '',
        club_name: '',
        club_description: '',
        category: '',
      });

    const handleInputChange = (e:any) => {
        setClub({ ...club, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e:any) => {
        const categories = ["구기체육분과", "레저무예분과", "봉사분과", "어학분과", "연행예술분과", "인문사회분과", "자연과학분과", "종교분과", "창작비평분과", "가등록"]
        if(club.leader_id.length == 0) {
            e.preventDefault();
            alert("대표자의 ID를 입력해주세요.");
            return false;
        }

        if(club.club_name.length == 0) {
            e.preventDefault();
            alert("동아리 이름을 입력해주세요.");
            return false;
        }

        if(club.category.length == 0) {
            e.preventDefault();
            alert("동아리가 속한 분과를 입력해주세요.");
            return false;
        }

        if(!(categories.includes(club.category))) {
            e.preventDefault();
            alert("동아리의 정확한 분과를 입력해주세요.");
            return false;
        }

        if(inputRef.current.placeholder == '파일 이름') {
            e.preventDefault();
            alert("동아리 대표 이미지를 등록해주세요.")
            return false;
        }

        if(club.club_description.length == 0) {
            e.preventDefault();
            alert("간단한 소개를 입력해주세요.");
            return false;
        }
        
        const formData = new FormData();
        formData.append("club_img", files[0]);
        formData.append("leader_id", club.leader_id);
        formData.append("club_name", club.club_name);
        formData.append("category", club.category);
        formData.append("club_description", club.club_description)

        console.log(formData.get("club_img"))
        console.log(formData.get("leader_id"));
        console.log(formData.get("club_name"));
        console.log(formData.get("category"));
        console.log(formData.get("club_description"));
        //const blob = new Blob([JSON.stringify(club)], {type: "application/json"})
        //formData.append("info", blob)

        fetch(API_URL + '/club-service/club-form', {
            method: "POST",
            body: formData
        })
        .then((response) => {
            response.status == 201 ? alert("등록성공") : alert("등록실패")
        })
    }

    return(
        <Container>
            <Form>
                <WrapForm>
                    <LabelLeaderID htmlFor='leader_id' id='leader_id_label'>대표자 ID</LabelLeaderID>
                    <InputLeaderID type="text" id='leader_id' name='leader_id' placeholder='' value={club.leader_id} onChange={handleInputChange}></InputLeaderID>
                    <LabelClubName htmlFor='club_name' id='club_name_label'>동아리 이름</LabelClubName>
                    <InputClubName type="text" maxLength={29} id="club_name" name="club_name" placeholder='' value={club.club_name} onChange={handleInputChange}></InputClubName>
                    <LabelClubCategory htmlFor='category' id='category_label'>동아리 분과</LabelClubCategory>
                    <InputClubCategory type="text" id="category" name="category" placeholder='' value={club.category} onChange={handleInputChange}></InputClubCategory>
                    <LabelMainImage>대표 이미지</LabelMainImage>
                    <InputFind ref={inputRef} placeholder='파일 이름' disabled={true}></InputFind>
                    <FindLabelMainImage htmlFor='file' style={{width: "100px", height: "30px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", fontSize: "12px", paddingTop: "8px"}}>파일찾기</FindLabelMainImage>
                    <InputMainImage type="file" id="file" accept="image/*" onChange={SaveFileImage} style={{display: "none"}}></InputMainImage>
                    <LabelDescription htmlFor='club_description' id="club_description_label">간단한 소개</LabelDescription>
                    <InputDescription type="text" maxLength={30} id='club_description' name='club_description' value={club.club_description} onChange={handleInputChange}></InputDescription>
                </WrapForm>
                <Input type="button" value="등록" onClick={handleSubmit} style={{cursor: "pointer", width: "150px", height: "45px", backgroundColor: "#F1EEEE", border: "none", borderRadius: "20px", display: "block", margin: "0 auto", fontWeight: "bold"}}></Input>
            </Form>
        </Container>
    );
};

export default MakeClubForm;