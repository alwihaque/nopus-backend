const fetch = require('node-fetch');
const params = new URLSearchParams();
params.append('page','fose');
params.append('route','search');
params.append('camp','ATL');
params.append('career','UCOL');
const timer = ms => new Promise(res => setTimeout(res, ms))
const getData = async () => {
    const response = await fetch("https://atlas.emory.edu/api/?page=fose&route=search&camp=ATL&career=UCOL", {
        "body": '{"other":{"srcdb":"5219"},"criteria":[{"field":"camp","value":"ATL"},{"field":"career","value":"UCOL"}]}',
        "method": "POST"
    });
    let answer = await response.json();
    const results = answer.results;
    for(let i  = 0 ; i < results.length /3; i++) {
        await timer(2000);
        const crn = results[i].crn;
        const code = results[i].code;
        const details = await fetch("https://atlas.emory.edu/api/?page=fose&route=details", {
            "body": `{"group":"code:${code}","key":"crn:${crn}","srcdb":"5219","matched":"crn:${crn}"}`,
            "method": "POST"
        });
        const detailsRes = await details.json();
        console.log(detailsRes.key, detailsRes.code);
    }


    for(let i = Math.floor(results.length/3); i < results.length/2; i++) {
        await timer(2000);
        const crn = results[i].crn;
        const code = results[i].code;
        try {
            const details = await fetch("https://atlas.emory.edu/api/?page=fose&route=details", {
                "body": `{"group":"code:${code}","key":"crn:${crn}","srcdb":"5219","matched":"crn:${crn}"}`,
                "method": "POST"
            });
            const detailsRes = await details.json();
            console.log(detailsRes.key, detailsRes.code);

        }
        catch (e) {
            console.log(e.message);
        }


    }



    for(let i = Math.floor(results.length/2); i < results.length; i++) {
        await timer(2000);
        const crn = results[i].crn;
        const code = results[i].code;
        try {
            const details = await fetch("https://atlas.emory.edu/api/?page=fose&route=details", {
                "body": `{"group":"code:${code}","key":"crn:${crn}","srcdb":"5219","matched":"crn:${crn}"}`,
                "method": "POST"
            });
            const detailsRes = await details.json();
            console.log(detailsRes.key, detailsRes.code);
        }
        catch (e) {
            console.log(e.message);

        }

    }
}

getData();