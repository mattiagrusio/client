import React from 'react';
import readFile from 'itk/readFile'
import fs from 'fs'
import path from 'path'

class App extends React.Component {
  componentDidMount(){

    // Asynchronous read
    let p = path.resolve(__dirname,'in.txt');
    console.log(p);
    fs.readFile(p, function (err, data) {
      if (err) {
        return console.error(err);
      }
      console.log("Asynchronous read: " + data.toString());
    })
  }
  render() {

    
    return (
      
      <div>simon, helloworld!!!</div>
    );
  }
}

export default App;