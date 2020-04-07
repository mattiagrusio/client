import React, { Component } from "react";
import vtkRenderWindow from "vtk.js/Sources/Rendering/Misc/GenericRenderWindow"; //
import vtkActor from "vtk.js/Sources/Rendering/Core/Actor";
import vtkCalculator from "vtk.js/Sources/Filters/General/Calculator";
import vtkConeSource from "vtk.js/Sources/Filters/Sources/ConeSource";
import vtkMapper from "vtk.js/Sources/Rendering/Core/Mapper";
import { AttributeTypes } from "vtk.js/Sources/Common/DataModel/DataSetAttributes/Constants";
import { FieldDataTypes } from "vtk.js/Sources/Common/DataModel/DataSet/Constants";
//itk
import vtkITKHelper from "vtk.js/Sources/Common/DataModel/ITKHelper";
import vtkHttpDataSetReader from "vtk.js/Sources/IO/Core/HttpDataSetReader";
import vtkImageMapper from "vtk.js/Sources/Rendering/Core/ImageMapper";
import vtkImageSlice from "vtk.js/Sources/Rendering/Core/ImageSlice";
import styled from "styled-components";

import fs from "fs";
import path from "path";

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
`;
const FloatingRangeInput = styled(RangeInput)`
  z-index: 2;
`;
const RelativeBox = styled(Box)`
  position: relative;
`;

export default class CTWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localPath: props.localPath,
      itkImage: props.itkImage,
      slider: { value: undefined, min: undefined, max: undefined },
    };

    this.changeData = this.changeData.bind(this);
    this.myRef = React.createRef();
    // Create render window inside container
    // Add some content to the renderer
    // this.mapper = vtkMapper.newInstance();
    // this.actor = vtkActor.newInstance();

    this.renderWindow = vtkRenderWindow.newInstance({
      background: [1, 1, 1],
    });
  }
  componentDidMount() {
    this.renderWindow.setContainer(this.myRef.current);
    this.imageActorI = vtkImageSlice.newInstance();
    this.imageActorJ = vtkImageSlice.newInstance();
    this.imageActorK = vtkImageSlice.newInstance();

    this.imageMapperI = vtkImageMapper.newInstance();
    this.imageMapperJ = vtkImageMapper.newInstance();
    this.imageMapperK = vtkImageMapper.newInstance();

    this.imageActorI.setMapper(this.imageMapperI);
    this.imageActorJ.setMapper(this.imageMapperJ);
    this.imageActorK.setMapper(this.imageMapperK);

    const renderer = this.renderWindow.getRenderer();
    renderer.addActor(this.imageActorI);
    renderer.addActor(this.imageActorJ);
    renderer.addActor(this.imageActorK);

    /*function updateColorLevel(e) {
  const colorLevel = Number(
    (e ? e.target : document.querySelector('.colorLevel')).value
  );
  imageActorI.getProperty().setColorLevel(colorLevel);
  imageActorJ.getProperty().setColorLevel(colorLevel);
  imageActorK.getProperty().setColorLevel(colorLevel);
  renderWindow.render();
}

function updateColorWindow(e) {
  const colorLevel = Number(
    (e ? e.target : document.querySelector('.colorWindow')).value
  );
  imageActorI.getProperty().setColorWindow(colorLevel);
  imageActorJ.getProperty().setColorWindow(colorLevel);
  imageActorK.getProperty().setColorWindow(colorLevel);
  renderWindow.render();
}*/

    //const extent = data.getExtent();
  }
  changeData(itkImageObj) {
    this.setState({ itkImage: itkImageObj });
  }
  render() {
    if (this.state.itkImage !== undefined) {
      const imageData = vtkITKHelper.convertItkToVtkImage(this.state.itkImage);

      const dataRange = imageData.getPointData().getScalars().getRange();
      console.log(dataRange);
      const extent = imageData.getExtent();

      this.imageMapperI.setInputData(imageData);
      this.imageMapperI.setISlice(256);
      this.imageMapperJ.setInputData(imageData);
      this.imageMapperJ.setJSlice(256);
      this.imageMapperK.setInputData(imageData);
      this.imageMapperK.setKSlice(100);

      this.imageActorI.getProperty().setColorLevel(50);
      this.imageActorJ.getProperty().setColorLevel(50);
      this.imageActorK.getProperty().setColorLevel(50);

      this.imageActorI.getProperty().setColorWindow(300);
      this.imageActorJ.getProperty().setColorWindow(300);
      this.imageActorK.getProperty().setColorWindow(300);

      const renderer = this.renderWindow.getRenderer();
      renderer.resetCamera();
      renderer.resetCameraClippingRange();
      this.renderWindow.getRenderWindow().render();
    }
    //
    console.log("rendered CT");
    return (
      <RelativeBox fill background="light-3">
      <FloatingBox fill = "horizontal" pad="small" background="light+3">
        <FloatingRangeInput
        value={0}
        //onChange={event => setValue(event.target.value)}<Box ref={this.myRef} />
        />
      </FloatingBox>
        <Box fill ref={this.myRef} />
      </RelativeBox>
    );
  }
}
//rootContainer;
        //<Box ref={this.myRef} />
        /*
        <Box fill pad="small">
          <RangeInput
            value={0}
            //onChange={event => setValue(event.target.value)}<Box ref={this.myRef} />
          />
        </Box>
        */
