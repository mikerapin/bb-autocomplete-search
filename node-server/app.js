const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const fs = require('fs');

// Hard coded value of limited amount to return (this should speed up returning early when used)
const KIT_LIMIT_RETURN_VALUE = 10;

// This is simply to unblock the two packages running on localhost and the CORS issues caused by default
// Long term, this would be a very strict policy to prevent XSS
app.use(cors());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

/**
 * Ideally, this data would be in a database or some sort of storage that might be easier to search an index
 * Searching JSON can be tedious at scale
 */
let rawdata = fs.readFileSync('./node-server/KITS_SHIPPING_DATA.json', { flag: 'r' });
let kitData = JSON.parse(rawdata);

/**
 * There's definitely work here to be done to do this in a more optimized way
 *  - allow for full label search
 *  - search beyond the order the data is in
 * Much of this is depenedent on the data source
 * @param {} kitId string - the ID being searched
 * @param {*} limitNumberOfKits boolean - whether or not to limit the number of results
 * @returns
 */
const getMatchingKits = (kitId, limitNumberOfKits = true) => {
    const kitsFound = [];
    const labels = kitData.map(kit => kit['label_id']);
    let start = 0;
    let end = 9;

    // This isn't necessarily efficient, but it ensures that we don't need to iterate through the whole set
    // of data to find the labels we need
    while (end < labels.length) {
        labels.slice(start, end).forEach((label, index) => {
            const cleanedLabel = label.replace(/\D/g, '');
            if (cleanedLabel.startsWith(kitId)) {
                kitsFound.push(kitData[start + index]);
            }
        });
        start += 10;
        end += 10;
        if (limitNumberOfKits && kitsFound.length >= KIT_LIMIT_RETURN_VALUE) {
            end = labels.length;
        }
    }
    return kitsFound;
};

// I am not very familiar with Node, so there is likely a better way to organize these routes

app.get('/kit/:id/all', (req, res) => {
    const kitId = req.params.id.replace(/\D/g, '');

    const kitsFound = getMatchingKits(kitId, false);

    res.type('json'); // => 'application/json'
    res.type('application/json'); // => 'application/json'
    res.send(kitsFound);
});

app.get('/kit/:id', (req, res) => {
    const kitId = req.params.id.replace(/\D/g, '');

    const kitsFound = getMatchingKits(kitId);

    res.type('json'); // => 'application/json'
    res.type('application/json'); // => 'application/json'
    res.send(kitsFound);
});
