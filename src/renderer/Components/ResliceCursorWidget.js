import React, { Component } from "react";

//VTK
import "vtk.js/Sources/favicon";

import vtkImageData from "vtk.js/Sources/Common/DataModel/ImageData";
import vtkDataArray from "vtk.js/Sources/Common/Core/DataArray";
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";
import vtkOpenGLRenderWindow from "vtk.js/Sources/Rendering/OpenGL/RenderWindow";
import vtkResliceCursor from "vtk.js/Sources/Interaction/Widgets/ResliceCursor/ResliceCursor";
import vtkResliceCursorLineRepresentation from "vtk.js/Sources/Interaction/Widgets/ResliceCursor/ResliceCursorLineRepresentation";
import vtkResliceCursorWidget from "vtk.js/Sources/Interaction/Widgets/ResliceCursor/ResliceCursorWidget";
import vtkRenderer from "vtk.js/Sources/Rendering/Core/Renderer";
// import vtkRenderWindow from "vtk.js/Sources/Rendering/Misc/GenericRenderWindow";
import vtkImageRenderWindow from "./ImageRenderWindow";
import vtkRenderWindowInteractor from "vtk.js/Sources/Rendering/Core/RenderWindowInteractor";
import vtkSplineWidget from "vtk.js/Sources/Widgets/Widgets3D/SplineWidget";
import { ViewTypes } from "vtk.js/Sources/Widgets/Core/WidgetManager/Constants";
import vtkPaintFilter from "vtk.js/Sources/Filters/General/PaintFilter";
import vtkMapper from "vtk.js/Sources/Rendering/Core/Mapper";
import vtkActor from "vtk.js/Sources/Rendering/Core/Actor";
import vtkColorTransferFunction from "vtk.js/Sources/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "vtk.js/Sources/Common/DataModel/PiecewiseFunction";
import vtkPolyData from "vtk.js/Sources/Common/DataModel/PolyData";
import vtkAppendPolyData from "vtk.js/Sources/Filters/General/AppendPolyData";
import vtkPoints from "vtk.js/Sources/Common/Core/Points";
import vtkCellArray from "vtk.js/Sources/Common/Core/CellArray";
import vtkAbstractWidgetFactory from 'vtk.js/Sources/Widgets/Core/AbstractWidgetFactory';

//others

import styled from "styled-components";
import fs from "fs";
import path from "path";
import VolumeWidget from './VolumeWidget'
import SliceWidget from './SliceWidget'

import {
  Box,
  Button,
  RangeInput,
  Layer,
  Grommet,
  ResponsiveContext,
} from "grommet";

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

export default class ResliceCursorWidget extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount() {

  }
  
  render() {
        return (
          <Box fill background="black" gap="none">
            <Box fill direction="row" gap="none" background="black">
              <SliceWidget {...this.props} direction ={2}/>
              <VolumeWidget  {...this.props}/>
            </Box>
            <Box fill direction="row" gap="none" background="black">
              <SliceWidget  {...this.props} direction ={0} />
              <SliceWidget  {...this.props} direction ={1} />
            </Box>
          </Box>
        );
      }
}
/*vtkImage = {this.props.vtkImage}   showInfo= {this.props.showInfo} direction={2} 
<ResponsiveContext.Consumer>
            {size => (
          )}
          </ResponsiveContext.Consumer>*/