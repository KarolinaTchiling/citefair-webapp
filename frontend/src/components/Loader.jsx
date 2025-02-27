import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="center-body">
        <div className="loader-spanne-20">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-spanne-20 {
    position: relative;
    width: 200px;
    height: 60px;
    padding: 0;
  }
  .loader-spanne-20 > span {
    position: absolute;
    right: 0;
    width: 5px;
    height: 60px;
    background-color: #FFCE56;
    display: block;
    border-radius: 3px;
    transform-origin: 50% 100%;
    animation: move 2.8s linear infinite;
  }
  .loader-spanne-20 > span:nth-child(1) {
    animation-delay: -0.4s;
  }
  .loader-spanne-20 > span:nth-child(2) {
    animation-delay: -0.8s;
  }
  .loader-spanne-20 > span:nth-child(3) {
    animation-delay: -1.2s;
  }
  .loader-spanne-20 > span:nth-child(4) {
    animation-delay: -1.6s;
  }
  .loader-spanne-20 > span:nth-child(5) {
    animation-delay: -2s;
  }
  .loader-spanne-20 > span:nth-child(6) {
    animation-delay: -2.4s;
  }
  .loader-spanne-20 > span:nth-child(7) {
    animation-delay: -2.8s;
  }
  @keyframes move {
    0% {
      opacity: 0;
      transform: translateX(0px) rotate(0deg);
    }
    20% {
      opacity: 1;
    }
    40% {
      transform: translateX(-80px) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: translateX(-100px) rotate(22deg);
    }
    85% {
      opacity: 1;
      transform: translateX(-150px) rotate(60deg);
    }
    100% {
      opacity: 0;
      transform: translateX(-200px) rotate(65deg);
    }
  }`;

export default Loader;
