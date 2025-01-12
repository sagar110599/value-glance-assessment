import React from 'react';
import './App.css';
import FinancialTable from './components/table';

function App() {
  return (
    <div className="App">
     <div className="min-h-screen bg-gray-100">
    <h1 className="text-center text-2xl font-bold py-4">Financial Data Filtering App</h1>
    <FinancialTable />
  </div>
    </div>
  );
}

export default App;
