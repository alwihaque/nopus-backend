const fetch = require('node-fetch');

const params = new URLSearchParams();
params.append('page','fose');
params.append('route','search');
params.append('camp','ATL');
params.append('career','UCOL');

const getData = async () => {
    const response = await fetch("https://atlas.emory.edu/api/?page=fose&route=search&camp=ATL&career=UCOL", {
        "body": '{"other":{"srcdb":"5219"},"criteria":[{"field":"camp","value":"ATL"},{"field":"career","value":"UCOL"}]}',
        "method": "POST"
    });

    let answer = await response.json();
    answer.results.forEach(result => {
        console.log(result.code + " " +result.title+ " Section No: "+result.no);
    })
}

getData();