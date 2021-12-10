import { KitDataList } from '../types/app-types';

export const fetchFromServer = (value: string, showAll: boolean): Promise<KitDataList> => {
    return fetch(`http://localhost:3001/kit/${value}${showAll ? '/all' : ''}`).then(res => {
        return res.json();
    });
};
