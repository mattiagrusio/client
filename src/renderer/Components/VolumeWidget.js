import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'vtk.js/Sources/favicon';

// import macro from 'vtk.js/Sources/macro';
import vtkBoundingBox from 'vtk.js/Sources/Common/DataModel/BoundingBox';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
// import vtkVolumeController from 'vtk.js/Sources/Interaction/UI/VolumeController';
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkImageRenderWindow from "./ImageRenderWindow";


import {
  Box,
} from "grommet";

class VolumeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vtkImage: props.vtkImage,
    }
    this.widgetRef = React.createRef();

    this.changeData = this.changeData.bind(this);
    this.setWindowLevel = this.setWindowLevel.bind(this);
  }

  componentDidMount() {
    //     const background = options.background
    //     ? options.background.split(',').map((s) => Number(s))
    //     : [0, 0, 0];
    //   const containerStyle = options.containerStyle;
    this.renderWindow = vtkImageRenderWindow.newInstance();
    this.renderer = this.renderWindow.getRenderer();
    this.interactor = this.renderWindow.getInteractor();
    this.interactor.setDesiredUpdateRate(15);
    this.renderWindow.setContainer(this.widgetRef.current);
    this.interactor.bindEvents(this.widgetRef.current);
    this.mapper = vtkVolumeMapper.newInstance({
      sampleDistance: 1.1,
    });
    this.mapper.setBlendModeToMaximumIntensity();
    this.actor = vtkVolume.newInstance();
    // Pipeline handling
    this.actor.setMapper(this.mapper);
    this.renderer.addVolume(this.actor);
    //   const lookupTable = vtkColorTransferFunction.newInstance();
    //   this.actor.getProperty().setRGBTransferFunction(0, lookupTable);
    //  const piecewiseFunction = vtkPiecewiseFunction.newInstance();
    //  this.actor.getProperty().setScalarOpacity(0, piecewiseFunction);
    // actor.getProperty().setInterpolationTypeToFastLinear();
    this.actor.getProperty().setInterpolationTypeToLinear();
    this.renderWindow.resize();
    // this.actor.getProperty().setShade(true);
    // this.actor.getProperty().setUseGradientOpacity(0, true);
    // - generic good default
    // this.actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
    // this.actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
    // this.actor.getProperty().setAmbient(0.2);
    // this.actor.getProperty().setDiffuse(0.7);
    // this.actor.getProperty().setSpecular(0.3);
    // this.actor.getProperty().setSpecularPower(8.0);

  }
  updateColorMapPreset() {
    const sourceDS = this.state.vtkImage;
    const dataArray =
      sourceDS.getPointData().getScalars() ||
      sourceDS.getPointData().getArrays()[0];
    const dataRange = dataArray.getRange();
    const preset = vtkColorMaps.getPresetByName('jet');
    const lookupTable = this.actor.getProperty().getRGBTransferFunction(0);
    lookupTable.applyColorMap(preset);
    lookupTable.setMappingRange(...dataRange);
    lookupTable.updateRange();
    // this.renderWindow.render();
  }
  changeData(vtkImageObj) {
    this.setState({ vtkImage: vtkImageObj });
  }
  setWindowLevel(window,level) {
    if(this.actor != undefined){
      const rgbTransferFunction = this.actor.getProperty().getRGBTransferFunction(0);
      rgbTransferFunction.setRange(window,level);
      this.renderWindow.resize();
    }
  }
  createViewer() {


    // const vtiReader = vtkXMLImageDataReader.newInstance();
    // vtiReader.parseAsArrayBuffer(fileContents);

    const source = this.state.vtkImage;
    const dataArray =
      source.getPointData().getScalars() || source.getPointData().getArrays()[0];
    const dataRange = dataArray.getRange();


    this.mapper.setInputData(source);

    // Configuration
    // const sampleDistance =
    //   0.7 *
    //   Math.sqrt(
    //     source
    //       .getSpacing()
    //       .map((v) => v * v)
    //       .reduce((a, b) => a + b, 0)
    //   );
    //   this.mapper.setSampleDistance(sampleDistance);

    const rgbTransferFunction = this.actor.getProperty().getRGBTransferFunction(0);
    rgbTransferFunction.addRGBPoint(dataRange[0], 0.0, 0.0, 0.0);
    rgbTransferFunction.addRGBPoint(dataRange[1], 1, 0, 0);
    rgbTransferFunction.setRange(dataRange[0], dataRange[1]);

    const ofun = vtkPiecewiseFunction.newInstance();
    ofun.addPoint(dataRange[0], 0.0);
    ofun.addPoint(dataRange[1], 1.0);
    this.actor.getProperty().setRGBTransferFunction(0, rgbTransferFunction);
    this.actor.getProperty().setScalarOpacity(0, ofun);

    // For better looking volume rendering
    // - distance in world coordinates a scalar opacity of 1.0
    // this.actor
    //   .getProperty()
    //   .setScalarOpacityUnitDistance(
    //     0,
    //     vtkBoundingBox.getDiagonalLength(source.getBounds()) /
    //       Math.max(...source.getDimensions())
    //   );
    // - control how we emphasize surface boundaries
    //  => max should be around the average gradient magnitude for the
    //     volume or maybe average plus one std dev of the gradient magnitude
    //     (adjusted for spacing, this is a world coordinate gradient, not a
    //     pixel gradient)
    //  => max hack: (dataRange[1] - dataRange[0]) * 0.05
    // this.actor.getProperty().setGradientOpacityMinimumValue(0, 0);
    // this.actor
    //   .getProperty()
    //   .setGradientOpacityMaximumValue(0, (dataRange[1] - dataRange[0]) * 0.05);
    // - Use shading based on gradient

    // // Control UI
    // const controllerWidget = vtkVolumeController.newInstance({
    //   size: [400, 150],
    //   rescaleColorMap: true,
    // });
    // const isBackgroundDark = background[0] + background[1] + background[2] < 1.5;
    // controllerWidget.setContainer(rootContainer);
    // controllerWidget.setupContent(renderWindow, actor, isBackgroundDark);

    // // setUpContent above sets the size to the container.
    // // We need to set the size after that.
    // // controllerWidget.setExpanded(false);

    // this.fullScreenRenderer.setResizeCallback(({ width, height }) => {
    //   // 2px padding + 2x1px boder + 5px edge = 14
    //   if (width > 414) {
    //     controllerWidget.setSize(400, 150);
    //   } else {
    //     controllerWidget.setSize(width - 14, 150);
    //   }
    //   controllerWidget.render();
    // //   fpsMonitor.update();
    // });

    // First render
    this.renderer.getActiveCamera().setParallelProjection(true);
    // this.renderer.getActiveCamera().orthogonalizeViewUp();
    // this.renderer.getActiveCamera().setDirectionOfProjection(0-1,0);
    this.renderer.getActiveCamera().setViewUp(0, 1, 0);

    const extent = source.getExtent();
    const origin = source.getOrigin();
    const spacing = source.getSpacing();
    let worldDimensions = [];
    worldDimensions[0] = (extent[1] - extent[0]) * spacing[0];
    worldDimensions[1] = (extent[3] - extent[2]) * spacing[1];
    worldDimensions[2] = (extent[5] - extent[4]) * spacing[2];

    // this.renderer.resetCameraClippingRange();
    this.renderer.resetCamera();
    this.renderer.getActiveCamera().setParallelScale(worldDimensions[2] / 2);
    // this.renderer.getActiveCamera().azimuth(45);
    // this.renderer.getActiveCamera().elevation(90);
    this.renderWindow.resize();

    // global.picvpeline = {
    //   actor,
    //   renderer,
    //   renderWindow,
    //   lookupTable,
    //   this.mapper,
    //   source,
    //   piecewiseFunction,
    //   fullScreenRenderer,
    // };

    // if (userParams.fps) {
    //   const fpsElm = fpsMonitor.getFpsMonitorContainer();
    //   fpsElm.classList.add(style.fpsMonitor);
    //   fpsMonitor.setRenderWindow(renderWindow);
    //   fpsMonitor.setContainer(rootContainer);
    //   fpsMonitor.update();
    // }
  }

  render() {
    if (this.state.vtkImage !== undefined) {
      this.createViewer();
    }
    return (
      <Box fill ref={this.widgetRef} />
    );
  }
}

VolumeWidget.propTypes = {

};

export default VolumeWidget;