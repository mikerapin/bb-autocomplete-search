const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const fs = require('fs');

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

app.get('/kit/:id', (req, res) => {
    const kitId = req.params.id.replace(/\D/g, '');

    const kitsFound = [];
    const labels = kitData.map(kit => kit['label_id']);
    let start = 0;
    let end = 9;

    // This isn't necessarily efficient, but it ensures that we don't need to iterate through the whole set
    // of data to find the labels we need
    while (kitsFound.length <= 10 && end < labels.length) {
        labels.slice(start, end).forEach((label, index) => {
            const cleanedLabel = label.replace(/\D/g, '');
            if (cleanedLabel.startsWith(kitId)) {
                kitsFound.push(kitData[start + index]);
            }
        });
        start += 10;
        end += 10;
    }

    res.type('json'); // => 'application/json'
    res.type('application/json'); // => 'application/json'
    res.send(kitsFound);
});
