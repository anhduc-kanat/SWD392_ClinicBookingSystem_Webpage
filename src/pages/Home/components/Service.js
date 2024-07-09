import React from "react";
import styled from "styled-components";
// Components
import FullButton from "./Buttons/FullButton";
// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTeeth, faTooth, faTeethOpen, faGrinSquint } from "@fortawesome/free-solid-svg-icons";

export default function Services() {
    return (
        <Wrapper id="services">
            <div className="lightBg" style={{ padding: "50px 0" }}>
                <div className="container">

                </div>
            </div>
            <div className="whiteBg" style={{ padding: "60px 0" }}>
                <div className="container">
                    <HeaderInfo>
                        <h1 className="font40 extraBold" style={{ fontSize: '50px', color: '#1677FF' }}>Our Awesome Services</h1>
                        <p className="font13" style={{ fontSize: '30px', color: 'gray' }}>
                            These are the best and most distinctive services our clinic offers. Experience them and share your thoughts and feedback with us.
                        </p>
                    </HeaderInfo>
                    <ServiceBoxRow className="flex" style={{ fontSize: '20px' }}>
                        <ServiceBoxWrapper>
                            <FontAwesomeIcon icon={faTooth} className="iconService iconService1" />
                            <div>
                                <h1>Invisalign</h1>
                                <p>Invisalign is the best way to straighten your smile without interfering with your day-to-day life.</p>
                            </div>
                        </ServiceBoxWrapper>
                        <ServiceBoxWrapper>
                            <FontAwesomeIcon icon={faTeeth} className="iconService iconService2" />
                            <div>
                                <h1>Teeth Cleanings</h1>
                                <p>The only way to remove tartar is to see a dentist for a professional teeth cleaning.</p>
                            </div>
                        </ServiceBoxWrapper>
                        <ServiceBoxWrapper>
                            <FontAwesomeIcon icon={faTeethOpen} className="iconService iconService3" />
                            <div>
                                <h1>Tooth Extractions</h1>
                                <p>An extraction may be necessary if your tooth is so damaged that it can't be fixed with a dental restoration.</p>
                            </div>
                        </ServiceBoxWrapper>
                        <ServiceBoxWrapper>
                            <FontAwesomeIcon icon={faGrinSquint} className="iconService iconService4" />
                            <div>
                                <h1>Dental Bonding</h1>
                                <p>Dental bonding is a technique used to correct imperfections with your teeth to give you a better-looking smile. </p>
                            </div>
                        </ServiceBoxWrapper>
                    </ServiceBoxRow>
                </div>
                <div className="lightBg">
                    <div className="container">
                        <Advertising className="flexSpaceCenter">
                            <AddLeft>
                                <h4 className="font15 semiBold" style={{ textAlign: 'left', fontSize: '20px', marginBottom: '10px' }}>Dedicated to each patient</h4>
                                <h2 className="font40 extraBold" style={{ textAlign: 'left', fontSize: '40px', marginBottom: '10px', color: 'gray' }}>The smile of the patient</h2>
                                <p className="font12" style={{ textAlign: 'left', fontSize: '20px', }}>
                                    One smile is worth ten doses of tonic. Let us put a beautiful, bright smile on your face.<br /> Our services will ensure your satisfaction.
                                </p>
                                <ButtonsRow className="flexNullCenter" style={{ margin: "30px 0", display: 'flex', justifyContent: 'left' }}>
                                    <div style={{ width: "190px" }}>
                                        <FullButton title="Get Started" action={() => alert("clicked")} />
                                    </div>
                                    <div style={{ width: "190px", marginLeft: "15px" }}>
                                        <FullButton title="Contact Us" action={() => alert("clicked")} border />
                                    </div>
                                </ButtonsRow>

                            </AddLeft>
                            <AddRight>
                                <AddRightInner>
                                    <div className="flexNullCenter">
                                        <AddImgWrapp1 className="flexCenter">
                                            <img src="/assets/Check clean 1.png" alt="patient1" />
                                        </AddImgWrapp1>
                                        <AddImgWrapp2>
                                            <img src="/assets/Comestic and gum 1.png" alt="patient2" />
                                        </AddImgWrapp2>
                                    </div>
                                    <div className="flexNullCenter">
                                        <AddImgWrapp3>
                                            <img src="/assets/Filling.png" alt="patient3" />
                                        </AddImgWrapp3>
                                        <AddImgWrapp4>
                                            <img src="/assets/Pediatric dentistry.png" alt="patient4" />
                                        </AddImgWrapp4>
                                    </div>
                                </AddRightInner>
                            </AddRight>
                        </Advertising>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.section`
  width: 100%;
`;
const ServiceBoxRow = styled.div`
  @media (max-width: 860px) {
    flex-direction: column;
  }
`;
const ServiceBoxWrapper = styled.div`
  width: 20%;
  margin-right: 5%;
  padding: 80px 0;
  @media (max-width: 860px) {
    width: 100%;
    text-align: center;
    padding: 40px 0;
  }
`;
const HeaderInfo = styled.div`
  @media (max-width: 860px) {
    text-align: center;
  }
`;
const Advertising = styled.div`
  margin: 80px 0;
  padding: 100px 0;
  position: relative;
  @media (max-width: 1160px) {
    padding: 100px 0 40px 0;
  }
  @media (max-width: 860px) {
    flex-direction: column;
    padding: 0 0 30px 0;
    margin: 80px 0 0px 0;
  }
`;
const ButtonsRow = styled.div`
  @media (max-width: 860px) {
    justify-content: space-between;
  }
`;
const AddLeft = styled.div`
  width: 50%;
  p {
    max-width: 475px;
  }
  @media (max-width: 860px) {
    width: 80%;
    order: 2;
    text-align: center;
    h2 {
      line-height: 3rem;
      margin: 15px 0;
    }
    p {
      margin: 0 auto;
    }
  }
`;
const AddRight = styled.div`
  width: 50%;
  position: absolute;
  top: -70px;
  right: 0;
  @media (max-width: 860px) {
    width: 80%;
    position: relative;
    order: 1;
    top: -40px;
  }
`;
const AddRightInner = styled.div`
  width: 100%;
`;
const AddImgWrapp1 = styled.div`
  width: 48%;
  margin: 0 6% 10px 6%;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;
const AddImgWrapp2 = styled.div`
  width: 30%;
  margin: 0 5% 10px 5%;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;
const AddImgWrapp3 = styled.div`
  width: 20%;
  margin-left: 40%;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;
const AddImgWrapp4 = styled.div`
  width: 30%;
  margin: 0 5%auto;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;