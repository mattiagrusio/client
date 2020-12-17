import React, { Component } from "react";
import ResliceCursorWidget from "./ResliceCursorWidget";
import path from "path";
//import Database from 'better-sqlite3';
//import readImageLocalDICOMFileSeries from 'itk/readImageLocalDICOMFileSeries';
import readImageDICOMFileSeries from "itk/readImageDICOMFileSeries";
import axios from "axios";
import Cookies from "js-cookie";
import styled from "styled-components";
import vtkITKHelper from "vtk.js/Sources/Common/DataModel/ITKHelper";
import ToolBox from "./ToolBox"

const bodyScrollLock = require('body-scroll-lock');
const disableBodyScroll = bodyScrollLock.disableBodyScroll;

if (Cookies.get("server-address") === undefined) {
  Cookies.set("server-address", "http://localhost:3000");
}
const serverAddress = Cookies.get("server-address");
import regeneratorRuntime from "regenerator-runtime";

import {
  Box,
  Button,
  Select,
  Layer,
  Text,
  ThemeContext,
  Header,
  Grommet,
  RadioButtonGroup,
  ResponsiveContext,
  Sidebar,
  Stack,
  RangeSelector,
} from "grommet";


const theme = {
  global: {
    colors: {
      'accent-blue': "#00457b",
      'accent-yellow': "#FFDD00",
      'accent-1': 'light-4',
      'accent-green': "#78A22F",
      'neutral-1': "#00233D",
      brand: 'accent-green',
      focus: 'accent-1',
      selected: 'accent-1',
      text: {
        dark: 'accent-1',
        light: 'neutral-1',
      },
    },
    hover: {
      background: 'brand',
      color: 'neutral-1',
    },
    font: {
      family: "Arial",
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

const FloatingBox = styled(Box)`
  position: absolute;
  z-index: 1;
`;

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
    this.handleRange = this.handleRange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.fileInput = React.createRef();
    this.mprWidget = React.createRef();
    this.handleShowInfo = this.handleShowInfo.bind(this);

    // this.sliceButton = React.createRef();
    // this.analyticsButton = React.createRef();

    // this.transverseWidget = React.createRef();
    // this.coronalWidget = React.createRef();
    // this.sagittalWidget = React.createRef();
    // this.widget3D = React.createRef();
    //window.addEventListener('resize', this.handleResize);
    
  this.state = {
    showSidebar: false,
    value: [],
    options: OPTIONS,
    currentPatient: "",
    width: "",
    heigth: "",
    showInfo: true,
  };
  }

  componentDidMount() {
    // 2. Get a target element that you want to persist scrolling for (such as a modal/lightbox/flyout/nav).
    // Specifically, the target element is the one we would like to allow scroll on (NOT a parent of that element).
    // This is also the element to apply the CSS '-webkit-overflow-scrolling: touch;' if desired.
    // this.targetElement = document.body;
    // document.documentElement.style.overflow = 'hidden';
    // disableBodyScroll(this.targetElement);
  }
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
  async reconstruct(text) {
    const response = await axios.post(serverAddress + "/reconstruct", {
      path: text,
    }); //
    res = response.data;
    console.log(res);
    // this.setState({ options: result });
  }
  async getPatientList(text) {
    const response = await axios.post(serverAddress + "/patient/getList", {
      search: text,
    }); //
    patientList = response.data;
    var result = patientList.map((item) => {
      return item["name"];
    });
    //console.log(result);
    this.setState({ options: result });
  }
  async getPatientData(text) {
    let response = await axios.post(serverAddress + "/patient/getHeader", {
      name: text,
    });
    var imageObj = response.data;
    console.log(imageObj);

    //now request data
    response = await axios.get(serverAddress + "/patient/getData", {
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
      case "float":
        imageObj.data = new Float32Array(
          array8.buffer,
          0,
          array8.length / Float32Array.BYTES_PER_ELEMENT
        );
        console.log(imageObj.data.length);
        break;
    }

    const imageData = vtkITKHelper.convertItkToVtkImage(imageObj);
    this.setState({vtkImage: imageData, patient: imageObj.name});
  }
  handleRange(low,high){
    this.setState({lowRange: low, highRange: high});
  }
  handleShowInfo(){
    this.setState((state) => ({showInfo: !state.showInfo}));
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
            gap='medium'
            elevation="medium"
            style={{ zIndex: "1" }}
          >
            <Box fill pad='none' align="center">
              <Select
                size='large'
                multiple={false}
                value={value}
                alignSelf="stretch"
                onOpen={(value) => {
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
          <Box fill direction = "row" style = {{position: "relative", right: "0px", bottom: "0px", left: "0px"}}>
            <Box direction = "row" fill = "vertical"  pad='small' style = {{position: "absolute", zIndex: 1, top: "0px", bottom: "0px", right: "0px"}}>
              <ToolBox  infoButton={{name:"Info", handler: this.handleShowInfo}} 
                        rangeButton={{name:"Range", handler: this.handleRange, lowRange: this.state.lowRange, highRange: this.state.highRange}} />
            </Box>
            <Box fill>
              <ResliceCursorWidget 
              lowRange={this.state.lowRange} 
              highRange={this.state.highRange} 
              vtkImage = {this.state.vtkImage} 
              showInfo= {this.state.showInfo} 
              />
            </Box>
          </Box>
        </Box>
      </Grommet>
    );
  }
}
//<ToolBox handlers = {[this.handleWindowLevel]} buttons={["Slice", "Analytics", "Window/Level"]} />
export default App;