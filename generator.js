const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require('fs');
node_xj = require("xls-to-json");

var log = require('noogger');

const { exec } = require('child_process');


fs.readFile('badge.svg', function (err, data) {
    if(err)  log.error(err);
    else {
        const dom = new JSDOM(data);
        node_xj({
            input: "participants.xls",  // input xls
            output: "participants.json", // output json
          }, function(err, result) {
            if(err) {
              log.error(err);
            } else {
              log.notice(result);

              result.forEach(participant => {            
                  if(!participant.n) return;      
                  dom.window.document.querySelector("#state>tspan").textContent=participant.state.toUpperCase().centerJustify(14,' ');
                  dom.window.document.querySelector("#name>tspan").textContent=participant.name.toUpperCase().centerJustify(23,' ');
                  dom.window.document.querySelector("#name-title>tspan").textContent=participant.title.centerJustify(5,' ');;
                  console.log(dom.window.document.querySelector("#state>tspan").textContent); // "Hello world"
                  var fileName= participant.n+'-'+participant.name.replace(' ','')+'.svg';
                  log.notice(fileName);
                  fs.writeFile('out/svg/'+fileName,dom.window.document.querySelector('body').innerHTML);

                  //conversion to PNG using inkscape
                  exec('inkscape out/svg/'+fileName+' --export-dpi=200 --export-png='+'out/png/'+fileName.replace('.svg','.png'), (err, stdout, stderr) => {
                      if (err)  log.err(`stdout: ${stdout}`);
                      else   log.debug(`stderr: ${stderr}`);
                    });
                });
            }
        });   
    } 
});


String.prototype.centerJustify = function( length, char ) {
    var i=0;
	var str= this;
	var toggle= true;
    while ( i + this.length < length ) {
      i++;
	  if(toggle)
	  	str = str+ char;
	  else
	  	str = char+str;
	  toggle = !toggle;
    }
    return str;
}

