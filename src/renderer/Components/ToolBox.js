import React, { Component } from "react";
import {
  Box,
  Text,
  DropButton,
  Button,
  Drop
} from "grommet";

import { FormClose, Resources, Analytics, View, Help,Info } from "grommet-icons";
import Range from "./Range"
import MultiSlider from "./MultiSlider"

import PropTypes from 'prop-types';


export default class ToolBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      handler: {}
    };
    this.toolRef = React.createRef();
  }
  componentDidMount() {
  }
  render() {
    return (
      <Box fill pad="small" align="center" justify="evenly" ref={this.toolRef}>
        <DropButton
          dropAlign={{ right: 'left' }}
          dropProps={{ plain: true, pad: 'large' }}
          onOpen={() => this.setState({ value: "WinLev" })}
          dropTarget={(this.props.rangeButton.lowRange) && (this.toolRef.current)}
          dropContent={this.props.rangeButton.lowRange &&
            (<Box fill="vertical">
              <Range handler={this.props.rangeButton.handler} lowRange={this.props.rangeButton.lowRange} highRange={this.rangeButton.highRange} min={-1000} max={7000} />
            </Box>)
          }
        >
          <Box align="center">

            <View color="brand" size="large" />
            <Text size = 'medium' color="brand">Range</Text>
          </Box>
        </DropButton>
        <Button onClick={this.props.infoButton.handler}>
          <Box align="center">
            <Info color="brand" size="large" />
            <Text size = 'medium' color="brand">Info</Text>
          </Box>
        </Button>
      </Box>
    );
  }
}

ToolBox.propTypes = {

};
/*

              <Range handler={this.state.handler} low={-600} high={4000} min={-1000} max={7000} />
<Box fill direction="row" ref={this.ref}>
        <RadioButtonGroup
          name="radio"
          align="center"
          justify="evenly"
          options={this.buttons.map((button) => button.name)}
          value={this.state.value}
          onChange={event => {
            if (event.target.value != "") {
              this.setState({
                value: event.target.value,
                handler: () => {
                  let button = this.buttons.filter(obj => { return obj.name === event.target.value; });
                  if (button !== undefined) return button.handler;
                }
              })
            }
          }}
        >
          {(option, { checked, hover }) => {
            let Icon;
            let animation;
            let size;

            switch (option) {
              case 'Slice':
                Icon = Resources;
                break;
              case 'Analytics':
                Icon = Analytics;
                break;
              case 'Window/Level':
                Icon = View;
                break;
            }

            let color, elevation;
            if (checked) {
              color = 'accent-green';
              animation = 'pulse';
              size = 'large';
            }
            else if (hover) {
              color = 'accent-1';
              animation = 'none';
              size = 'large';
            }
            else {
              color = 'accent-1';
              animation = 'none';
              size = 'large';
            }
            return (
              <Box fill animation={animation} align="center" gap="xsmall">
                <Icon color={color} size="large" />
                <Text color={color} size="small">{option}</Text>
              </Box>
            );
          }}
        </RadioButtonGroup>
          {(() => {
            switch (this.state.value) {
              case 'Slice':
                break;
              case 'Analytics':
                break;
              case 'Window/Level':
                return (
                  this.ref.current && (
                    <Drop
                    plain
                      align={{ top: 'top', left: 'right' ,bottom: 'bottom'}}
                      target={this.ref.current}
                    >
                      <Range handler = {this.state.handler} height = "100%" low={-600} high={4000} min={-1000} max={7000}/>
                    </Drop>
                  ));
                break;
            }
          })()}
      </Box>

*/
// export default ToolBox;

// const ToolBox = (props) => {
//     const [value, setValue] = React.useState();
//     const [names, setNames] = React.useState(props.buttons.map((button)=>{
//         return button.name;
//     }));
//     const [handler, setHandler] = React.useState();
//     const myref = React.createRef();
//     return (
//       <Box fill direction="row">
//         <RadioButtonGroup
//           name="radio"
//           align="center"
//           justify = "evenly"
//           options={names}
//           value={value}
//           onChange={event => {setValue(event.target.value);
//                             setHandler(event.target.handler)}}
//         >
//           {(option, { checked, hover }) => {
//             let Icon;
//             let animation;
//             let size;

//             switch (option) {
//               case 'Slice':
//                 Icon = Resources;
//                 break;
//               case 'Analytics':
//                 Icon = Analytics;
//                 break;
//               case 'Window/Level':
//                 Icon = View;
//                 break;
//             }

//             let color, elevation;
//             if (checked) {
//               color = 'accent-green';
//               animation = 'pulse';
//               size = 'large';
//             }
//             else if (hover) {
//               color = 'accent-1';
//               animation = 'none';
//               size = 'large';
//             }
//             else {
//               color = 'accent-1';
//               animation = 'none';
//               size = 'large';
//             }
//             return (
//               <Box fill animation={animation} align="center" gap="xsmall">
//                 <Icon color={color} size="large" />
//                 <Text color={color} size="small">{option}</Text>
//               </Box>
//             );
//           }}
//         </RadioButtonGroup>
//         <Box >
//           {(() => {
//             switch (value) {
//               case 'Slice':
//                 break;
//               case 'Analytics':
//                 break;
//               case 'Window/Level':
//                 return <Range handler = {handler} ref = {myref} height = "100%" low={-600} high={4000} min={-1000} max={7000} />;
//                 break;
//             }
//           })()}
//         </Box>
//       </Box>
//     );
//   };
//   export default ToolBox;