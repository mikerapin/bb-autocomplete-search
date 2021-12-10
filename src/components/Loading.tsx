import './Loading.css';

import React from 'react';
export const Loading = (): React.ReactElement => {
    return (
        <div className="search-loading">
            <div className="search-loading-child"></div>
            <div className="search-loading-child"></div>
            <div className="search-loading-child"></div>
        </div>
    );
};
