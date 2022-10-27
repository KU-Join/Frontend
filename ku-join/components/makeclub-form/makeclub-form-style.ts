import styled from 'styled-components'

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
  grid-template-areas: "leader_id_label leader_id ."
                      "club_name_label club_name ."
                      "club_category_label club_category ."
                      "main_image_label main_image main_image_label2"
                      "club_description_label club_description club_description";
  grid-template-columns: 150px 150px 100px;
  grid-template-rows: repeat(5, 30px);
`;

const Input = styled.input`
  background-color: #d9d9d9;
  border: none;
`;

const LabelLeaderID = styled.label`
  color: #b72929;
  grid-area: leader_id_label;
  text-align: left;
`;

const InputLeaderID = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: leader_id;
  border: 1px solid black;
`;

const LabelClubName = styled.label`
  color: #b72929;
  grid-area: club_name_label;
  text-align: left;
`;

const InputClubName = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: club_name;
  border: 1px solid black;
`;

const LabelClubCategory = styled.label`
  color: #b72929;
  grid-area: club_category_label;
  text-align: left;
`;

const InputClubCategory = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: club_category;
  border: 1px solid black;`;

const LabelMainImage = styled.label`
  color: #b72929;
  grid-area: main_image_label;
  text-align: left;
`;

const FindLabelMainImage = styled.label`
  grid-area: main_image_label2;
`

const InputFind = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: main_image;
  border: 1px solid black;
`

const InputMainImage = styled.input`
  background-color: #d9d9d9;
  border: none;
  border: 1px solid black;
`;

const LabelDescription = styled.label`
  color: #b72929;
  grid-area: club_description_label;
  text-align: left;
`
const InputDescription = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: club_description;
  border: 1px solid black;
`

export {Container, Form, WrapForm, Input, InputLeaderID, LabelLeaderID, InputClubName, LabelClubName, InputClubCategory, LabelClubCategory, InputMainImage, LabelMainImage, FindLabelMainImage, InputFind, LabelDescription, InputDescription};