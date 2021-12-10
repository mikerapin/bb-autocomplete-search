import './App.css';

import React, { useState } from 'react';

import debounce from 'lodash/debounce';

type KitData = { id: number; label_id: string; shipping_tracking_code: string };
type KitDataList = KitData[];

const fetchFromServer = (value: string) => {
    return fetch(`http://localhost:3001/kit/${value}`).then(res => {
        return res.json();
    });
};

/**
 *
 * @param label
 * @param search
 * @returns
 */
const matchLabelToSearch = (label: string, search: string): React.ReactElement => {
    let firstHalf = '';
    let labelIterator = 0;
    for (let i = 0; i < search.length && labelIterator < label.length; i++) {
        if (search[i] !== label[labelIterator]) {
            i--;
        }
        firstHalf += label[labelIterator];
        labelIterator++;
    }

    return (
        <>
            <span className="search-highlight">{firstHalf}</span>
            <span>{label.slice(labelIterator)}</span>
        </>
    );
};

const App = (): React.ReactElement => {
    const [searchData, setSearchData] = useState<KitDataList>([]);
    const [lastSearchedValue, setLastSearchedValue] = useState<string>('');
    const typeHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value.trim();
        if (currentValue !== lastSearchedValue) {
            setLastSearchedValue(currentValue);
            if (currentValue.length > 1 && parseInt(currentValue, 10) > 0) {
                fetchFromServer(currentValue).then(searchValues => setSearchData(searchValues));
            } else {
                setSearchData([]);
            }
        }
    };
    return (
        <div className="container">
            <header className="header">
                <h1>Biobot Kit Search</h1>
            </header>
            <div className="row">
                <div className="four columns">
                    <input
                        type="text"
                        name="search"
                        onKeyUp={typeHandler}
                        className="search-box twelve columns"
                        placeholder="Type your Label ID to begin searching"
                    />
                </div>
            </div>
            <div className="row">
                <table className="six columns">
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>FedEx Tracking Number</th>
                        </tr>
                    </thead>
                    {searchData.length > 0 && (
                        <tbody>
                            {searchData.map((kit: KitData) => (
                                <tr key={kit.id}>
                                    <td>{matchLabelToSearch(kit.label_id, lastSearchedValue)}</td>
                                    <td>
                                        <a
                                            href={`https://www.fedex.com/fedextrack/?tracknumbers=${kit.shipping_tracking_code}`}
                                            rel="noreferrer"
                                            target="_blank">
                                            {kit.shipping_tracking_code}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};

export default App;
