import React from "react";

// Components
import { Card, CardBody, Button } from "reactstrap";

function Button(props) {
  const { onClick } = props;

  return (
    <Card>
      <CardBody
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          color="primary"
          outline
          className="waves-effect waves-light"
          onClick={onClick}
        >
          {props.t("Save Run")}
        </Button>
      </CardBody>
    </Card>
  );
}

export default Button;
