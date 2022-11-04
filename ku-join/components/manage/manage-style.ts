import styled from 'styled-components'

const LeaderWithClubName = styled.p`
    color: white;
    font-size: 1.5rem
`
const TabTitle = styled.p`
    color: white;
    font-weight: bold;
    font-size: 1.3rem;
    text-align: left;
`
const TabSubTitle = styled.p`
    color: white;
    font-size: 1rem;
    text-align: left;
`
const MemberName = styled.p`
    color: white;
    font-size: 1rem
`
const Button = styled.button`
    background-color: #F1EEEE;
    border-radius: 20px;
    border: none;
    font-size: 1rem;
    cursor: pointer; 
    width: 150px; 
    height: 45px;
`
const WrapTab = styled.div`
    margin: 20px 0;
`
const WrapSubTab = styled.div`
    margin-bottom: 20px;
`
const WrapForm = styled.div`
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 200px;
  display: grid;
  gap: 10px;
  grid-template-areas: "main_image_label main_image main_image_label2"
                      "club_description_label club_description club_description";
  grid-template-columns: 150px 150px 100px;
  grid-template-rows: repeat(2, 30px);
`;

const LabelMainImage2 = styled.label`
  color: #b72929;
  grid-area: main_image_label;
  text-align: left;
`;

const FindLabelMainImage2 = styled.label`
  grid-area: main_image_label2;
`

const InputFind2 = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: main_image;
  border: 1px solid black;
`

const InputMainImage2 = styled.input`
  background-color: #d9d9d9;
  border: none;
  border: 1px solid black;
`;

const LabelDescription2 = styled.label`
  color: #b72929;
  grid-area: club_description_label;
  text-align: left;
`
const InputDescription2 = styled.input`
  background-color: #d9d9d9;
  border: none;
  grid-area: club_description;
  border: 1px solid black;
`

export {LeaderWithClubName, TabTitle, TabSubTitle, MemberName, Button, WrapTab, WrapSubTab, WrapForm, LabelMainImage2, FindLabelMainImage2, InputFind2, InputMainImage2, LabelDescription2, InputDescription2}