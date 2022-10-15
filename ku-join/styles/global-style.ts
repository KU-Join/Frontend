import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
    ${reset}

    html,
    body {
      padding: 0;
      margin: 0;
      width: 100vw;
      height: 100vh;
      font-family: 'Noto Sans KR', sans-serif,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
        Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue;
    }
  
    #__next{
      width: 100vw;
      height: 100vh;
      overflow:hidden;
      background-color:#f5f5f5;
    }
    
  
    * {
      box-sizing: border-box;
    }
  
    a {
      color: inherit;
      text-decoration: none;
    }
    p {
      margin: 0;
    }
  
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
    }
  
    button {
      cursor: pointer;
      border: none;
      font-family: 'Noto Sans KR',
    }
  
    ul {
    list-style: none;
    padding: 0;
    margin: 0;
    }
`;
