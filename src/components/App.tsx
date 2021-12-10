import './App.css';

import React, { useEffect, useRef, useState } from 'react';

import { AutoComplete } from './AutoComplete';
import { KitDataList } from '../types/app-types';
import { Loading } from './Loading';
import debounce from 'lodash/debounce';
import { fetchFromServer } from '../data/fetch-kits';

const App = (): React.ReactElement => {
    const [searchData, setSearchData] = useState<KitDataList>([]);
    const [lastSearchedValue, setLastSearchedValue] = useState<string>('');
    const [lastSearchAllValue, setLastSearchAllValue] = useState<boolean>(false);
    const [loadingNewData, setLoadingNewData] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const showAllRef = useRef<HTMLInputElement>(null);

    /**
     * Do a little debouncing to make sure we don't hammer the state update and trigger fetches too often
     */
    const typeHandler = debounce(() => {
        if (searchRef.current && showAllRef.current) {
            const currentValue = searchRef.current.value.trim();
            console.log(showAllRef.current.checked);
            if (currentValue !== lastSearchedValue || showAllRef.current.checked !== lastSearchAllValue) {
                setLastSearchedValue(currentValue);
                setLastSearchAllValue(showAllRef.current.checked);
            }
        }
    }, 250);

    /**
     * Will fetch only if the inputs we're tracking change
     */
    useEffect(() => {
        const showAll = (showAllRef.current && showAllRef.current.checked) || false;
        console.log(showAll);
        if (lastSearchedValue.length > 0 && parseInt(lastSearchedValue, 10) > 0) {
            setLoadingNewData(true);
            fetchFromServer(lastSearchedValue, showAll).then(searchValues => {
                setSearchData(searchValues);
                setLoadingNewData(false);
            });
        } else {
            setSearchData([]);
        }
    }, [lastSearchedValue, lastSearchAllValue]);

    return (
        <div className="container">
            <header className="header">
                <h1>Biobot Kit Search</h1>
            </header>
            <div className="row">
                <div className="one-half column">
                    <input
                        ref={searchRef}
                        type="text"
                        name="search"
                        onKeyUp={typeHandler}
                        className="search-box twelve columns"
                        placeholder="Type your Label ID to begin searching"
                    />
                </div>
                <div className="one-half column">
                    <label className="search-all">
                        <input
                            ref={showAllRef}
                            onClick={typeHandler}
                            type="checkbox"
                            id="show-all-results"
                            name="show-all-results"
                        />
                        <label className="label-body" htmlFor="show-all-results">
                            Show all results
                        </label>
                    </label>
                </div>
            </div>
            {!loadingNewData && <AutoComplete searchData={searchData} lastSearchedValue={lastSearchedValue} />}
            {loadingNewData && <Loading />}
        </div>
    );
};

export default App;
