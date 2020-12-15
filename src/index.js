import React from "react";
import ReactDOM from "react-dom";
import { SceneView } from "./SceneView";
import { Jumbotron, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Jumbotron>
        <h1 className="display-5">
          <b>Dive</b>Alive
        </h1>
      </Jumbotron>
      <Row>
        <Col>
          <SceneView />
        </Col>
      </Row>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
