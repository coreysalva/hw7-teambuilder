const fs = require("fs");

function writeHTML(OUTPUT_DIR, outputPath, renderedHtml){

    if(!fs.existsSync(OUTPUT_DIR)){ //if the output folder does not exist
        fs.mkdirSync(OUTPUT_DIR); //make it
    }

    fs.writeFile(outputPath, renderedHtml, (err) => {
        if(err){
            console.log("Error creating HTML!");
        }
        else{
            console.log("Generated HTML in " + outputPath);
        }
    });
}

module.exports = writeHTML;