const fs = require('fs');

let mtaStsFile = 'version: STSv1\n';

mtaStsFile += 'mode: ' + (process.env.MTA_STS_MODE || 'testing') + '\n';
mtaStsFile += 'max_age: ' + (process.env.MTA_STS_MAX_AGE || '1209600') + '\n';

// MX records will be automatically looked up and added
const domain = process.env.DOMAIN

if (domain === undefined) {
    console.error("Please define target domain via the DOMAIN env var.")
    process.exit(1);
}

function writeMtaStsFile(content) {
    const path = ".well-known"
    try {
        fs.mkdirSync(path, { recursive: true });
        fs.writeFileSync(path + "/mta-sts.txt", content)
    } catch (error) {
        console.log("Unable to write mta-sts.txt file", error)
        process.exit(1);
    }
}

async function fetchMxRecords() {
    const dnsQueryUrl = `https://1.1.1.1/dns-query?name=${domain}&type=MX`;
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/dns-json'
        }
    };

    const dnsResponse = await fetch(dnsQueryUrl, fetchOptions);
    const dnsResponseJson = await dnsResponse.json();

    if (dnsResponseJson.Status === 0) {
        if (dnsResponseJson.Answer) {
            const mxRecords = dnsResponseJson.Answer.filter(record => record.type === 15);

            if (mxRecords.length > 0) {
                mxRecords.forEach(record => {
                    const data = record.data.split(' ');
                    //const preference = data[0];
                    const exchange = data[1];
                    const exchangeWithoutFullStop = exchange.slice(0, -1);
                    mtaStsFile += `mx: ${exchangeWithoutFullStop}\n`;
                });
                console.log("Generated file", mtaStsFile)
                writeMtaStsFile(mtaStsFile)
                console.log("Successfully written mta-sts.txt")
            } else {
                console.error('No MX records found for ' + domain);
                process.exit(1);
            }
        } else {
            console.error('No MX records found for ' + domain);
            process.exit(1);
        }
    } else {
        console.error('Error while fetching MX records for ' + domain);
        process.exit(1);
    }
}

fetchMxRecords()