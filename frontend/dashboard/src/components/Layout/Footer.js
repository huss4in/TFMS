import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid={true}>
        <Row>
          <Col sm={6}>{new Date().getFullYear()} © Tamkeen.</Col>
          <Col sm={6}>
            <div className="text-sm-end d-none d-sm-block">
              Developed by CIC Students
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
