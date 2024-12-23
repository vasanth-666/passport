import './App.css';
import Homes from './components/Homes.js';
import Headers from './components/Headers.js';
import Logins from './components/Logins.js';
import Signups from './components/Signups.js';
import Dashboards from './components/Dashboards.js';
import Error from './components/Error';
import { Routes, Route } from "react-router-dom";

function App() {

    return (
        <>
            <Headers />
            <Routes>
                <Route path="/" element={<Homes />} />
                <Route path="/login" element={<Logins />} />
                <Route path="/signup" element={<Signups />} />
                <Route path="/dashboard" element={<Dashboards />}/>
                <Route path="*" element={<Error />} />
            </Routes>
        </>
    );
}

export default App;
