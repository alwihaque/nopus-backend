const fetch = require('node-fetch');
const Course = require('../Models/course');
const {sendEmail} = require("./mailer");
const Building = require('../Models/building');

const params = new URLSearchParams();
params.append('page', 'fose');
params.append('route', 'search');
params.append('camp', 'ATL');
params.append('career', 'UCOL');

module.exports.getData = async () => {
    const response = await fetch("https://atlas.emory.edu/api/?page=fose&route=search&camp=ATL&career=UCOL", {
        "body": '{"other":{"srcdb":"5219"},"criteria":[{"field":"camp","value":"ATL"},{"field":"career","value":"UCOL"}]}',
        "method": "POST"
    });
    let answer = await response.json();
    const results = answer.results;
    for (let i= 0; i < results.length; i++) {
        setTimeout(async () => {
            try {
                const crn = results[i].crn;
                const code = results[i].code;
                const details = await fetch("https://atlas.emory.edu/api/?page=fose&route=details", {
                    "body": `{"group":"code:${code}","key":"crn:${crn}","srcdb":"5219","matched":"crn:${crn}"}`,
                    "method": "POST"
                });
                const detailsRes = await details.json();
                //console.log(detailsRes.key, detailsRes.code, detailsRes.hours_html, detailsRes.meeting_html);
                let classCode = detailsRes.key;
                let courseId = detailsRes.code;
                let classCrn = detailsRes.crn;
                let classTitle = detailsRes.title;
                let classCred = detailsRes.hours_html;
                let classSection = detailsRes.section;
                let description = detailsRes.description;
                let meetingInfo = 'No meeting info';
                let totalSeats = detailsRes.seats.split('<strong>')[1].split(' ')[2];
                let availableSeats = detailsRes.seats.split('<strong>')[2].split(' ')[2].split('<br/>')[0];
                let waitListTotal = 0;
                if(detailsRes.seats.split('<strong>')[3] === undefined){
                    waitListTotal = 0;
                }
                else {
                    waitListTotal = detailsRes.seats.split('<strong>')[3].split(' ')[2];
                }
                let section = detailsRes.allInGroup.filter(section => {
                    return section.key === classCode;
                })[0];
                //parse meeting times into something more useable
                let meeting = (function() {
                    if((section.meets === "Does Not Meet" || section.meets === "Meets Online")) {
                        return [];
                    }
                    var ap = section.meets.substring(section.meets.length - 1);
                    var times  = [];
                    var end = 0;
                    var start = 0;
                    let i = section.meets.length - 1;
                    let k = section.meets.length;
                    for(; i >= 0; i--) {
                        if (section.meets[i] === "-") {
                            end += parseInt(section.meets.substring(i+1, k));
                            if(ap == "p") {
                                end += 12;
                            }
                            break;
                        }
                        if(section.meets[i] === ":") {
                            k = i;
                            end += parseInt(section.meets.substring(k+1)) / 60.0;
                        }
                    }
                    let j = i; 
                    if(section.meets[i] === "a" || section.meets[i] === "p") {
                        ap = section.meets[i];
                        i--;
                    }
                    k = i;
                    for (; j > 0; j--) {
                        if(section.meets[j] === " ") {
                            start += parseInt(section.meets.substring(j+1, k));
                            if(ap === "p") {
                                start += 12;
                            }
                            break;
                        }
                        if(section.meets[j] === ":") {
                            k = j;
                            start += parseInt(section.meets.substring(k+1,i)) / 60.0;
                        }
                    }
                    for(i = 0; i !== j; i++) {
                        switch(section.meets[i]) {
                            case("M"):
                                times.push([2, start, end]);
                                break;
                            case("T"):
                                if(section.meets[i+1] === "h"){
                                    times.push([5, start, end]);
                                    i++;
                                }
                                else {
                                    times.push([3, start, end]);
                                }
                                break;
                            case("W"): 
                                times.push([4, start, end]);
                                break;
                            case("F"):
                                times.push([6, start, end]);
                                break;
                            default:
                                //console.log("Invalid meeting day");
                                break;
                        }
                    }
                    return times;
                })();
                if(detailsRes.meeting_html.split(/<[^>]*>/g)[2] === ' in ONLINE'){
                    meetingInfo = 'Online';
                }
                else if(detailsRes.meeting_html.split(/<[^>]*>/g)[3] !== undefined ) {
                    meetingInfo = detailsRes.meeting_html.split(/<[^>]*>/g)[3];
                    let build = true;
                    if(meetingInfo.includes("MODERN")) {
                        build = false;
                    }
                    /* Add back in if we rerun distances.js
                    if(meetingInfo.includes("New Psyc Bldg")) {
                        meetingInfo = "New Psyc Bldg";
                        if(!await Building.findOne({name:meetingInfo})) {
                            var building = new Building({
                                name: meetingInfo
                            });
                            building.save();
                        }
                        build = false;
                    }*/
                    if(meetingInfo.includes("Math") && meetingInfo.includes("Science")) {
                        meetingInfo = "Math and Science Center";
                        if(!await Building.findOne({name:meetingInfo})) {
                            var building = new Building({
                                name: meetingInfo
                            });
                            building.save();
                        }
                        build = false;
                    }
                    for(let i = meetingInfo.length - 1; i >= 0 && build; i--) {
                        if(meetingInfo[i] === ' ') {
                            var buildingName = meetingInfo.substring(0, i);
                            const alreadyExists = await Building.findOne({name:buildingName});
                            if (alreadyExists) {
                                break;
                            }
                            var building = new Building({
                                name: buildingName
                            })
                            building.save();
                            break;
                        }
                    }
                }
                //console.log(classTitle);
                const course = new Course({
                    code: courseId,
                    crn: classCrn,
                    title: classTitle,
                    creditHours: classCred,
                    totalSeats,
                    availableSeats,
                    waitListTotal,
                    section: classSection,
                    meeting,
                    meetingInfo,
                    courseDescription : description
                });
                const exist = await Course.exists({
                    code: courseId
                });
                if (!exist) {
                    await course.save();
                }
                if(exist){
                    //update course
                    await Course.findOneAndUpdate({code:courseId},{
                        code: courseId,
                        crn: classCrn,
                        title: classTitle,
                        creditHours: classCred,
                        totalSeats,
                        availableSeats,
                        waitListTotal,
                        section: classSection,
                        meeting,
                        meetingInfo,
                        courseDescription : description
                    });
                }

            } catch (e) {
                console.log(e.message);
                console.log("INDEX______", i);
            }


        }, 800 * (i + 1));

    }

}


