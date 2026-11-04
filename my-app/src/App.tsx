import './App.css'
import { Provider } from "react-redux";
import { store } from "./store";
import { TimesheetPage } from "./components/TimesheetPage";


function App() {
  

  return (
    <>  
      <Provider store={store}>
        <TimesheetPage />
      </Provider>
    </>
  )
}

export default App
