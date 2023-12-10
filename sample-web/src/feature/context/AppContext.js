import { createContext, useContext, useState } from "react";
const AppContext = createContext(undefined);

export const AppProvider = ({children}) => {
    const [items, setItems] = useState([]);
    return(
        <AppContext.Provider
            value={{
                items,
                updateItems: (items) => setItems(items)
            }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);