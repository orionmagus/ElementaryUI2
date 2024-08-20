import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  background: #fff;
  max-width: 500px;
  margin: 2rem auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const FooterWrapper = styled.div`
  border-top: 2px solid #f7f7f7;
  padding: 1rem 0;
  text-align: center;
`;

const HeaderWrapper = styled.div`
  background-image: url("/palm-trees.jpg");
  min-height: 150px;
  color: white;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  background-size: 100%;
  background-position: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 1rem;
`;

const MainWrapper = styled.div`
  padding: 1rem;
`;

const Button = styled.button`
  background-image: linear-gradient(to bottom, #fff, #f3f3f3);
  border-radius: 8px;
  letter-spacing: 1px;
  padding: 10px 20px;
  margin: 0 0.45rem;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  &:active {
    background: #eee;
  }
`;

const Header = ({ title }) => {
  return (
    <HeaderWrapper>
      <h1>{title}</h1>
    </HeaderWrapper>
  );
};

const Main = ({ content }) => {
  return (
    <MainWrapper>
      <p>{content}</p>
    </MainWrapper>
  );
};

const Footer = () => {
  return (
    <FooterWrapper>
      <Button>View</Button>
      <Button>Save for later</Button>
    </FooterWrapper>
  );
};

class Card extends React.Component {
  render() {
    const { title, content } = this.props;
    return (
      <CardWrapper>
        <Header title={title} />
        <Main content={content} />
        <Footer />
      </CardWrapper>
    );
  }
}

Card.defaultProps = {
  title: "My card title",
  content: "Bacon ipsum dolor amet pork chop pork shoulder."
};
