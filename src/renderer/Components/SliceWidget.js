import React, { Component } from "react";


//VTK
import "vtk.js/Sources/favicon";
import Constants from 'vtk.js/Sources/Rendering/Core/ImageMapper/Constants';
import vtkResliceCursorLineRepresentation from "vtk.js/Sources/Interaction/Widgets/ResliceCursor/ResliceCursorLineRepresentation";
import vtkResliceCursorWidget from "vtk.js/Sources/Interaction/Widgets/ResliceCursor/ResliceCursorWidget";
import vtkFullScreenRenderWindow from "./ImageRenderWindow";
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkInteractorStyleMPRSlice from './InteractorStyleMPR';
// import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';



const { SlicingMode } = Constants;

//others

import styled from "styled-components";
import fs from "fs";
import path from "path";

import {
  Box,
  Button,
  RangeInput,
  Layer,
  Grommet,
  Text,
  ResponsiveContext,
} from "grommet";
import { Scale } from "vtk.js/Sources/Rendering/Core/ColorTransferFunction/Constants";

const FloatingBox = styled(Box)`
  position: absolute;
  bottom: 10px;
  z-index: 1;
  opacity: 0;
  transition: 0.5s;
  &:hover {
    opacity: 1;
  }
`;
const FloatingRangeInput = styled(RangeInput)`
  z-index: 2;
`;
const RelativeBox = styled(Box)`
  position: relative;
`;

export default class SliceWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localPath: props.localPath,
      slicePosition: undefined,
    };

    this.direction = props.direction;
    this.myRef = React.createRef();
    this.setColorRange = this.setColorRange.bind(this);
  }
  componentDidMount() {
    this.renderWindow = vtkFullScreenRenderWindow.newInstance();
    this.renderWindow.setContainer(this.widgetRef);
    this.renderer = this.renderWindow.getRenderer();
    this.renderer.getActiveCamera().setParallelProjection(true);
    this.istyle = vtkInteractorStyleMPRSlice.newInstance();
    this.renderWindow.getInteractor().setInteractorStyle(this.istyle);
    this.imageMapper = vtkVolumeMapper.newInstance();
    this.imageActor = vtkVolume.newInstance();
    this.colorTransfer = vtkColorTransferFunction.newInstance();
    this.renderWindow.resize();


  }


  changeData(imageData) {
    //const imageData = this.state.vtkImage;
    if (imageData == null) return;
    this.imageMapper.setInputData(imageData);
    this.imageActor.setMapper(this.imageMapper);
    this.renderer.addVolume(this.imageActor);

    this.renderer.resetCamera();
    this.renderer.resetCameraClippingRange();

    this.istyle.setVolumeMapper(this.imageMapper);
    this.fullRange = imageData
      .getPointData()
      .getScalars()
      .getRange();

    const rgbTransferFunction = this.imageActor.getProperty().getRGBTransferFunction(0);
    rgbTransferFunction.setRange(...this.fullRange);

    const extent = imageData.getExtent();
    const origin = imageData.getOrigin();
    const spacing = imageData.getSpacing();
    let worldCenter = [];
    let worldDimensions = [];
    let center = [];
    worldDimensions[0] = (extent[1] - extent[0]) * spacing[0];
    worldDimensions[1] = (extent[3] - extent[2]) * spacing[1];
    worldDimensions[2] = (extent[5] - extent[4]) * spacing[2];
    worldCenter[0] = worldDimensions[0] / 2 + origin[0];
    worldCenter[1] = worldDimensions[1] / 2 + origin[1];
    worldCenter[2] = worldDimensions[2] / 2 + origin[2];
    center[0] = (extent[1] - extent[0]) / 2;
    center[1] = (extent[3] - extent[2]) / 2;
    center[2] = (extent[5] - extent[4]) / 2;

    var dir = this.direction;
    let normal = []; let viewUp = [];
    switch (dir) {
      case 0:
        normal = [1, 0, 0]; viewUp = [0, 0, 1];
        break;
      case 1:
        normal = [0, 1, 0]; viewUp = [0, 0, 1];
        break;
      case 2:
        normal = [0, 0, 1]; viewUp = [0, 1, 0];
        break;
    }
    this.istyle.setSliceNormal(normal, viewUp);
    const range = this.istyle.getSliceRange();
    this.istyle.setSlice((range[0] + range[1]) / 2);

    let height = worldDimensions[2];
    // if (this.direction == 2) {
    //   viewUp = [0, -1, 0];
    // }

    // this.renderer.getActiveCamera().setViewUp(viewUp);
    this.renderer.getActiveCamera().setParallelScale(height / 2);
    this.renderWindow.resize();
    //this.setState({ vtkImage: vtkImageObj });


  }
  componentDidUpdate(prevProps, prevState) {
    try {
      //data
      if(typeof prevProps.vtkImage === 'undefined'){
        this.changeData(this.props.vtkImage);
      }
      else if ((this.props.vtkImage.name !== prevProps.vtkImage.name)){
        this.changeData(this.props.vtkImage);
      }
      //win level
      if (this.props.lowRange !== prevProps.highRange ||
        this.props.lowRange !== prevProps.highRange) {
        this.setColorRange(this.props.lowRange, this.props.highRange);
      }
    } catch (error) {
      console.log(error);
    }
    
  }
  setColorRange(lowRange, highRange) {
    const rgbTransferFunction = this.imageActor.getProperty().getRGBTransferFunction(0);
    rgbTransferFunction.setRange(lowRange, highRange);
    this.renderWindow.resize();
  }

  render() {
    return (
      <Box fill ref={(input) => (this.widgetRef = input)} style={{ position: 'relative' }}>
        {(this.props.showInfo && this.state.slicePosition) && (
          <Box style={{ position: "absolute", zIndex: 1, top: "0px", left: "0px" }}>
            <Text>{this.state.slicePosition}</Text>
          </Box>)}
      </Box>

    );
  }
}
