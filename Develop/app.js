const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const writeHTML = require("./lib/writeHTML");


const getManagerInfo = async (currentId) => {

    const manInfo = [  
                     makeQuestion("input", "Please enter is the Manager's name:", "manName"), 
                     makeQuestion("input", "Please enter the Manager's email:", "manEmail"),
                     makeQuestion("input", "Please enter the Managers office number", "manOfficeNumber")
                    ];

    let res = await inquirer.prompt(manInfo);

    return new Manager(res.manName, currentId, res.manEmail, res.manOfficeNumber);
}

const getTeamInfo = async (currentId) => {

    let newMember = [makeQuestion("confirm", "Would you like to add a team member?", "addMember")];

    let typePrompt = [
        {
            type: "list",
            message: "What type of team member are you adding?",
            choices: ["Intern", "Engineer"],
            name: "teamType"
        }
    ];

    let askBasicInfo = [makeQuestion("input", "Please enter their name:", "name"), makeQuestion("input", "Please enter their email:", "email")];
    let askGithub = [makeQuestion("input", "Please enter their github username:", "github")];
    let askSchool = [makeQuestion("input", "Please enter their school:", "school")];

    let addingMember = true;
    let members = [];

    while(addingMember){

        let res = await inquirer.prompt(newMember); 

        if(res.addMember){ //if user wants to add a new member

            res = await inquirer.prompt(typePrompt);

            if(res.teamType == "Engineer"){ //if Engineer, do x

                let basicInfo = await inquirer.prompt(askBasicInfo);

                let githubUserName = await inquirer.prompt(askGithub);

                members.push(new Engineer(basicInfo.name, currentId++, basicInfo.email, githubUserName.github));
            }
            else if(res.teamType == "Intern"){

                let basicInfo = await inquirer.prompt(askBasicInfo);

                let school =  await inquirer.prompt(askSchool);

                members.push(new Intern(basicInfo.name, currentId++, basicInfo.email, school.school));
            } 
        }
        else{
             addingMember = false;
        }
    }

    return members;
}

const makeQuestion = (type, message, name) => {
    return {
        type: type,
        message: message,
        name: name
    }
}

async function init(){

    let currentId = 1;
    let managerObj = await getManagerInfo(currentId);

    currentId++;
    
    let teamArray = await getTeamInfo(currentId);
    teamArray.unshift(managerObj);

    console.log("Passing data to renderer...");
    let renderedHtml = render(teamArray);

    writeHTML(OUTPUT_DIR, outputPath, renderedHtml);
}

init();