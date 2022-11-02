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

export {LeaderWithClubName, TabTitle, TabSubTitle, MemberName, Button, WrapTab, WrapSubTab}