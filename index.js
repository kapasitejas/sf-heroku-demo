const express = require('express');
const jsforce = require('jsforce');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = 5001;

const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

console.log(SF_LOGIN_URL);
console.log(SF_USERNAME);
console.log(SF_PASSWORD);
console.log(SF_TOKEN);

const conn = new jsforce.Connection({
    loginUrl: SF_LOGIN_URL,
});
conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (error, userInfo) => {
    console.log(error);
    if (error) {
        return console.error(error);
    }
    //console.log(conn.accessToken);
    //console.log(conn.instanceUrl);

    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
});

app.get("/", async (req, res) => {
    try {
        console.log("I am inside Get");
        conn.identity((err, res) => {
            if (err) {
                return console.error(err);
            }
            console.log("user ID: " + res.user_id);
            console.log("organization ID: " + res.organization_id);
            console.log("username: " + res.username);
            console.log("display name: " + res.display_name);
        });
        //res.send("200");
        var records;
        await conn.query("SELECT Id, Name FROM Account Limit 4", function (err, result) {
            if (err) { return console.error(err); }
            //console.log("total : " + JSON.stringify(result));
            console.log("total : " + result.totalSize);
            console.log("fetched : " + result.records.length);
            records = result.records;
        });
        console.log(' HEre I am ....' + JSON.stringify(records))
        //res.json(records);
        res.send(JSON.stringify(records));


    } catch (e) {
        console.log(e);
        res.json(JSON.stringify(e))
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
