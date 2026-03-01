import React from 'react';
import Dashboard from './components/Dashboard';
import { useVelocentra } from './hooks/useVelocentra';
import './App.css';

export default function App() {
    const velocentra = useVelocentra();

    return <Dashboard {...velocentra} />;
}
