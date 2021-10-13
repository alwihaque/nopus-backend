const fetch = require('node-fetch');
const Course = require('../Models/course');


const params = new URLSearchParams();
params.append('page', 'fose');
params.append('route', 'search');
params.append('camp', 'ATL');
params.append('career', 'UCOL');

module.exports.getData = async () => {
    console.log('here');
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
                let meeting = section.meets;
                if(detailsRes.meeting_html.split(/<[^>]*>/g)[2] === ' in ONLINE'){
                    meetingInfo = 'Online';
                }
                else if(detailsRes.meeting_html.split(/<[^>]*>/g)[3] !== undefined ) {
                    meetingInfo = detailsRes.meeting_html.split(/<[^>]*>/g)[3];
                }
                console.log(classTitle);
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
                    meetingInfo
                });
                const exist = await Course.exists({
                    code: classCode,
                    crn: classCrn,
                    title: classTitle,
                    creditHours: classCred,
                    totalSeats,
                    availableSeats,
                    waitListTotal,
                    section: classSection,
                    meeting,
                    meetingInfo
                });
                if (!exist) {
                    await course.save();
                }

            } catch (e) {
                console.log(e.message);
                console.log("INDEX______", i);
            }


        }, 800 * (i + 1));

    }

}


