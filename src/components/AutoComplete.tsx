import './AutoComplete.css';

import { KitData, KitDataList } from '../types/app-types';

import React from 'react';

/**
 * Iterate through the search string and return a split label based on the matched values from the search data
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

export const AutoComplete = ({
    searchData,
    lastSearchedValue,
}: {
    searchData: KitDataList;
    lastSearchedValue: string;
}): React.ReactElement => {
    return (
        <div className="row">
            <table className="six columns">
                <thead>
                    <tr>
                        <th className="results-label">Label</th>
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
    );
};
