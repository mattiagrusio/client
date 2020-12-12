// Initial welcome page. Delete the following line to remove it.
//'use strict';const styles=document.createElement('style');styles.innerText=`@import url(https://unpkg.com/spectre.css/dist/spectre.min.css);.empty{display:flex;flex-direction:column;justify-content:center;height:100vh;position:relative}.footer{bottom:0;font-size:13px;left:50%;opacity:.9;position:absolute;transform:translateX(-50%);width:100%}`;const vueScript=document.createElement('script');vueScript.setAttribute('type','text/javascript'),vueScript.setAttribute('src','https://unpkg.com/vue'),vueScript.onload=init,document.head.appendChild(vueScript),document.head.appendChild(styles);function init(){Vue.config.devtools=false,Vue.config.productionTip=false,new Vue({data:{versions:{electron:process.versions.electron,electronWebpack:require('electron-webpack/package.json').version}},methods:{open(b){require('electron').shell.openExternal(b)}},template:`<div><div class=empty><p class="empty-title h5">Welcome to your new project!<p class=empty-subtitle>Get qwdqwd now and take advantage of the great documentation at hand.<div class=empty-action><button @click="open('https://webpack.electron.build')"class="btn btn-primary">Documentation</button> <button @click="open('https://electron.atom.io/docs/')"class="btn btn-primary">Electron</button><br><ul class=breadcrumb><li class=breadcrumb-item>electron-webpack v{{ versions.electronWebpack }}</li><li class=breadcrumb-item>electron v{{ versions.electron }}</li></ul></div><p class=footer>This intitial landing page can be easily removed from <code>src/renderer/index.js</code>.</p></div></div>`}).$mount('#app')}

import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App.js';
import fs from 'fs';
import path from 'path';

var dir =  'E:/JS/electron-webpack-quick-start/data/images/';
//const dialog = require('electron').remote;
//const dialogResult = dialog.showOpenDialog({properties: ['openDirectory']}).then().catch();
/*var list = ['data/images/CT.1.2.840.113619.2.278.3.1678402701.15.1453443186.2.100.dcm',
'data/images/CT.1.2.840.113619.2.278.3.1678402701.15.1453443186.2.101.dcm',
'data/images/CT.1.2.840.113619.2.278.3.1678402701.15.1453443186.2.102.dcm'];*/
//readImageDICOMFileSeries(null,list);//this.state.localPath
/*new Promise(function(resolve, reject) {
    fs.readdir(dir, function(err, files){
        if (err) 
            reject(err); 
        else{
            var list = [];
            files.forEach(file => {
                var fn = dir + file;
                var data = fs.readFileSync(fn);
                list.push(new File(data,fn));
              });
            resolve(list);
        }
    });
}).then((files => {
    files.forEach(file => {
        console.log(file.name);
      });
    readImageDICOMFileSeries(null,files);
})).catch((error) => console.log(error));*/

/*fs.readdir(dir, (err, files) => {
    var list = [];
    
    files.forEach(file => {
        var fn = dir + file;
        fs.readFile(fn, (err, data) => {
            if (err) {
                throw err;
            }
            list.push(new File(data,fn));
        });
      });
      files.forEach(list => {
        console.log(list.name);
      });
    return list;
}).then((list) => readImageDICOMFileSeries(null,list))//this.state.localPath);*/

document.documentElement.style.overflow = "hidden";
ReactDOM.render(<App />, document.getElementById('app'));
//ReactDOM.render('Ciao', document.getElementById('app'));