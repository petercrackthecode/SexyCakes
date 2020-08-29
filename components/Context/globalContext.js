import React, {useState, createContext} from 'react';

export const GlobalContext= createContext();

const _ = require('lodash');

const DEFAULT_GLOBAL_STATE = {
    viewedItem: {},
    cart: {},
    isMainHeaderVisible: true,
    orders: {}
};

export const GlobalContextProvider= props => {
    const [globalState, setGlobalState]= useState(_.cloneDeep(DEFAULT_GLOBAL_STATE));

    return (
        <GlobalContext.Provider value={{...globalState, setGlobalState: setGlobalState}}>
            {props.children}
        </GlobalContext.Provider>
    );
};