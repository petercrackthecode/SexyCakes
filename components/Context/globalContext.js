import React, {useState, createContext} from 'react';

export const GlobalContext= createContext();

export const GlobalContextProvider= props => {
    const [globalState, setGlobalState]= useState({
        currentStore: "",
        viewedItem: {},
        cart: {},
        isMainHeaderVisible: true,
    });

    return (
        <GlobalContext.Provider value={{...globalState, setGlobalState: setGlobalState}}>
            {props.children}
        </GlobalContext.Provider>
    );
};