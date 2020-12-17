import React, { Component } from "react";
import {
    Box,
    Text,
    RangeSelector,
    Stack
  } from "grommet";


const Range = (props) => {
    const [values, setValues] = React.useState([props.lowRange, props.highRange]);
    return (
      <Stack fill = "vertical" focusIndicator={false}>
        <Box fill justify = "evenly" gap = "small">
          {(() => {
            let steps = [];
            for (var i = props.min; i <= props.max; i += 500) {
              steps.push(i);
            }
            return steps.map(value => (
              <Box key={value}>
                <Text size = "medium" color="accent-1" style={{ fontFamily: 'monospace' }}>
                  {value}
                </Text>
              </Box>
            ));
          })()}
        </Box>
        <RangeSelector
        fill
          direction="vertical"
          invert={false}
          min={props.min}
          max={props.max}
          size="large"
          round="small"
          values={values}
          onChange={(values) => {
              setValues(values);
              props.handler(...values);
        }}
        />
      </Stack>
    );
  }
  export default Range;