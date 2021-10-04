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
                console.log(detailsRes.key, detailsRes.code);
                const course = new Course({
                    code: detailsRes.code,
                    crn: detailsRes.crn,
                    title: detailsRes.title,
                    creditHours: detailsRes.hours_html
                });
                const exist = await Course.exists({
                    code: detailsRes.code,
                    crn: detailsRes.crn,
                    title: detailsRes.title,
                    creditHours: detailsRes.hours_html
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

