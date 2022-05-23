// Import react
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { ACTION as RUNS } from "../../store/tfms/runs";
import { ACTION as RUN } from "../../store/tfms/run";

// Components
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Table,
  Form,
  Input,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import { MDBDataTableV5 } from "mdbreact";

// Local Components
import Title from "../../components/Page/Common/Title";

// Import data
import { uploadFile } from "react-s3";

const config = {
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY_KEY,
};

const Dashboard = (props) => {
  console.log("Dashboard", props);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async (file) => {
    uploadFile(file, config)
      .then((_) => alert("File Successfully Uploaded"))
      .catch((_) => alert("Files Wasn't Uploaded Successfully!"));
  };

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="page-content">
      <Title title="Dashboard" comment={props.t("Welcome to TFMS Dashboard")} />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <h5
                style={{
                  paddingBottom: "20px",
                  margin: 0,
                }}
              >
                {`${props.t("Upload Applicants.csv")}`}
              </h5>

              <Col xxl={5} xl={7} lg={8} md={12}>
                <div className="input-group">
                  <Input
                    type="file"
                    onChange={handleFileInput}
                    id="S3"
                    accept=".csv"
                  />
                  <button
                    type="submit"
                    onClick={() => handleUpload(selectedFile)}
                    className="btn btn-primary btn-sm"
                  >
                    {props.t("Upload to S3")}
                  </button>
                </div>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <CardBody
              style={{
                paddingBottom: "10px",
              }}
            >
              <CardTitle>{props.t("Run Details")}</CardTitle>

              <div className="table-responsive">
                <Table
                  className="table-centered"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th scope="col">{props.t("ID")}</th>
                      <th scope="col">{props.t("Program")}</th>
                      <th scope="col">{props.t("Period")}</th>
                      <th scope="col">{props.t("Date")}</th>
                      <th scope="col">{props.t("Budget")}</th>
                      <th
                        scope="col"
                        style={{
                          width: "200px",
                        }}
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.Runs.runs === null ? (
                      [...Array(1)].map((_, i) => (
                        <tr key={i}>
                          {[...Array(5)].map((_, i) => (
                            <td key={i}>
                              <i className="fas fa-spinner fa-spin"></i>
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : props.Runs.runs.length ? (
                      props.Runs.runs
                        .sort((a, b) => b.id - a.id)
                        .map((run, i) => (
                          <tr key={i}>
                            <td>{run.id}</td>
                            <td>
                              {props.t(
                                props.Programs.programs.find(
                                  (program) => program.id === run.program_id
                                )?.program_name
                              )}
                            </td>
                            <td>{run.period_name}</td>
                            <td>
                              {new Date((run.date + 60 * 60 * 3) * 1000)
                                .toISOString()
                                .slice(0, 19)
                                .replace("T", " ")}
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-US").format(
                                run.budget
                              )}
                              {props.t("BD")}
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Link
                                  to="/wizard"
                                  className="btn btn-success btn-sm"
                                  onClick={() => {
                                    props.fetchRun(run.id);
                                  }}
                                >
                                  <i
                                    className="fa fa-info-circle fa-shake"
                                    style={{
                                      marginRight: "5px",
                                    }}
                                  ></i>
                                  {props.t("Details")}
                                </Link>

                                <Link
                                  to="#"
                                  style={{
                                    fontSize: "22px",
                                    marginLeft: "18px",
                                  }}
                                  onClick={() => {
                                    props.deleteRun(run.id);
                                  }}
                                >
                                  <i className="fa fa-trash fa-shake"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td>No Run Was Found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
};

const { deleteRun } = RUNS;
const { fetchRun } = RUN;

export default withRouter(
  withTranslation()(
    connect(
      (state) => {
        return {
          TFMS: state.TFMS,
          Programs: state.Programs,
          Runs: state.Runs,
        };
      },
      { fetchRun, deleteRun }
    )(Dashboard)
  )
);
