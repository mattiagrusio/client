import React, { Component } from "react";
import CTWidget from "./CTWidget";
import path from "path";
//import Database from 'better-sqlite3';
//import readImageLocalDICOMFileSeries from 'itk/readImageLocalDICOMFileSeries';
import readImageDICOMFileSeries from "itk/readImageDICOMFileSeries";
import axios from "axios";
import Cookies from "js-cookie";
import styled from "styled-components";

if (Cookies.get("server-address") === undefined) {
  Cookies.set("server-address", "http://localhost:3000");
}
const serverAddress = Cookies.get("server-address");
import regeneratorRuntime from "regenerator-runtime";

import {
  Box,
  Button,
  Select,
  Grid,
  Heading,
  Header,
  Grommet,
  Layer,
  ResponsiveContext,
} from "grommet";

import { FormClose, Notification, Menu } from "grommet-icons";

const theme = {
  global: {
    colors: {
      brand: "#228BE6",
    },
    font: {
      family: "Arial",
    },
  },
  select: {
    options: {
      text: {
        size: "small",
      },
    },
  },
  rangeInput: {
    track: {
      color: "light-3",
    },
  },
};

/*
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;*/
const FitScreenBox = styled(Box)`
width = 100%;
heigth = 100%;
`;
const OPTIONS = [];

var patientList = {};

//SQLITE
//const dbPath = path.join('./', 'data', 'db.sqlite');
//console.log(dbPath);

//const db = new Database(dbPath, { verbose: console.log });
//const db = require('better-sqlite3')(dbPath);

class App extends Component {
  constructor(props) {
    super(props);
    this.openDialog = this.openDialog.bind(this);
    this.readFolder = this.readFolder.bind(this);
    this.getPatientList = this.getPatientList.bind(this);
    this.getPatientData = this.getPatientData.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.fileInput = React.createRef();
    this.ctWidget = React.createRef();
    //window.addEventListener('resize', this.handleResize);
  }

  state = {
    showSidebar: false,
    value: [],
    options: OPTIONS,
    currentPatient: "",
    width: "",
    heigth: "",
  };

  handleResize() {
    this.setState({ width: window.innerWidth, heigth: window.innerHeight });
  }

  async readFolder(files) {
    try {
      const imageData = await readImageDICOMFileSeries(null, files);
      console.log(imageData[0].spacing);
    } catch (err) {
      console.log(err);
    }
  }
  async getPatientList(text) {
    const response = await axios.post(serverAddress + "/patient/list", {
      search: text,
    }); //
    patientList = response.data;
    var result = patientList.map((item) => {
      return item["id"] + " " + item["name"];
    });
    //console.log(result);
    this.setState({ options: result });
  }
  async getPatientData(text) {
    this.setState({
      value: text,
      //options: OPTIONS
      //rows: ROWS
    });
    let response = await axios.post(serverAddress + "/patient/ctHeader", {
      id: patientList[0].id,
    });
    var imageObj = response.data;
    console.log(imageObj);

    //now request data
    response = await axios.get(serverAddress + "/patient/ctData", {
      responseType: "arraybuffer",
    });
    const array8 = new Uint8Array(response.data);
    switch (imageObj.imageType.componentType) {
      case "int16_t":
        imageObj.data = new Int16Array(
          array8.buffer,
          0,
          array8.length / Int16Array.BYTES_PER_ELEMENT
        );
        console.log(imageObj.data.length);
        break;
    }

    this.ctWidget.current.changeData(imageObj);
  }
  async openDialog() {
    const { dialog } = require("electron").remote; //dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    const dialogResult = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (dialogResult === undefined) return;
    const fs = require("fs");
    const dir = dialogResult.filePaths[0];
    const files = await fs.promises.readdir(dir);
    //console.log(files);
    const filesData = await new Promise((resolve, reject) => {
      var list = [];
      for (const file of files) {
        const path = dir + "/" + file;
        var data = fs.readFileSync(path);
        list.push(new File(data, path));
      }
      resolve(list);
    });

    var imageData = await readImageDICOMFileSeries(null, filesData);
    console.log(imageData[0].spacing);
  }

  render() {
    const { showSidebar, options, value } = this.state;
    console.log("render");
    //const [value, setValue] = React.useState('medium');
    return (
      <Grommet theme={theme} full>
        <Box fill>
          <Header
            align="center"
            justify="between"
            background="brand"
            pad={{ left: "medium", right: "small", vertical: "small" }}
            elevation="medium"
            style={{ zIndex: "1" }}
          >
            <Button icon={<Menu />} />
            <Box fill>
                <Select
                  multiple={false}
                  value={value}
                  alignSelf="stretch"
                  onSearch={(value) => {
                    this.getPatientList(value);
                  }}
                  onChange={(event) => {
                    this.getPatientData(event.value);
                  }}
                  options={options}
                  //rows={rows}   // <CTWidget ref={this.ctWidget} />
                />
            </Box>
          </Header>
          <Box fill background="dark-3" gap="small">
            {/* row 1 */}
            <Box fill direction="row" gap="small" background="dark-3">
              <CTWidget ref={this.ctWidget} />
              <CTWidget ref={this.ctWidget} />
            </Box>
            {/* row 1 */}
            <Box fill direction="row" gap="small" background="dark-3">
              <CTWidget ref={this.ctWidget} />
              <CTWidget ref={this.ctWidget} />
            </Box>
          </Box>
        </Box>
      </Grommet>
    );
  }
}
//CTWidget localPath = 'app/data/images/'/</Grommet>
export default App;
/*

              <Box fill = "vertical"  gridArea="coronal" background="light-2">     </Box>
              <Box fill = "vertical"  gridArea="3D" background="light-2">          </Box>

<CTWidget ref={this.ctWidget} />
<CTWidget ref={this.ctWidget} />
<CTWidget ref={this.ctWidget} />
<CTWidget ref={this.ctWidget} />
*/
