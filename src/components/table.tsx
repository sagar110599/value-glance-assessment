import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'f7ji6DAbpt5lMP8HLY6PftYT1H1A5T0i';
//const API_URL = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=annual&limit=1000&apikey=${API_KEY}`;


  const FinancialTable: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({ start: 2020, end: 2024 });
    const [revenueRange, setRevenueRange] = useState({ min: 0, max: Infinity });
    const [netIncomeRange, setNetIncomeRange] = useState({ min: 0, max: Infinity });
    const [sortKey, setSortKey] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');

    useEffect(() => {
        const fetchFinancialData = async () => {
          try {
            const response = await axios.get(
              `https://financialmodelingprep.com/api/v3/income-statement/${selectedSymbol}?period=annual&apikey=${API_KEY}`
            );
            const fetchedData = response.data;
            setData(fetchedData);
            setFilteredData(fetchedData);
          } catch (error) {
            console.error('Error fetching financial data:', error);
          }
        };
    
        fetchFinancialData();
      }, [selectedSymbol]);
  
    useEffect(() => {
      let tempData = [...data];
      tempData = tempData.filter(
        (item) => 
          parseInt(item.date.split('-')[0]) >= dateRange.start &&
          parseInt(item.date.split('-')[0]) <= dateRange.end
      );
      tempData = tempData.filter(
        (item) => item.revenue >= revenueRange.min && item.revenue <= revenueRange.max
      );
      tempData = tempData.filter(
        (item) => item.netIncome >= netIncomeRange.min && item.netIncome <= netIncomeRange.max
      );
      tempData.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
      setFilteredData(tempData);
    }, [data, dateRange, revenueRange, netIncomeRange, sortKey, sortOrder]);
  
    const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
    
        if (value.length > 2) {
          try {
            const response = await axios.get(
              `https://financialmodelingprep.com/api/v3/search-name?query=${value}&apikey=${API_KEY}`
            );
            setSuggestions(response.data);
          } catch (error) {
            console.error('Error fetching suggestions:', error);
          }
        } else {
          setSuggestions([]);
        }
      };
    
      const handleSelectSymbol = (symbol: string) => {
        console.log(symbol);
        setSelectedSymbol(symbol);
        setQuery('');
        setSuggestions([]);
      };
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
        <label className="block mb-2">Search Company Below : Current Ticker {selectedSymbol}</label>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Type company name..."
          className="border px-2 py-1 w-full"
        />
        {suggestions.length > 0 && (
          <ul className="border border-gray-300 mt-2 max-h-40 overflow-y-auto">
            {suggestions.map((item) => (
              <li
                key={item.symbol}
                onClick={() => handleSelectSymbol(item.symbol)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {item.name} ({item.symbol})
              </li>
            ))}
          </ul>
        )}
      </div>
        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="block">Date Range</label>
            <input
              type="number"
              placeholder="Start Year"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: +e.target.value })}
              className="border px-2 py-1 mr-2"
            />
            <input
              type="number"
              placeholder="End Year"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: +e.target.value })}
              className="border px-2 py-1"
            />
          </div>
          <div>
            <label className="block">Revenue Range</label>
            <input
              type="number"
              placeholder="Min Revenue"
              value={revenueRange.min}
              onChange={(e) => setRevenueRange({ ...revenueRange, min: +e.target.value })}
              className="border px-2 py-1 mr-2"
            />
            <input
              type="number"
              placeholder="Max Revenue"
              value={revenueRange.max}
              onChange={(e) => setRevenueRange({ ...revenueRange, max: +e.target.value })}
              className="border px-2 py-1"
            />
          </div>
          <div>
            <label className="block">Net Income Range</label>
            <input
              type="number"
              placeholder="Min Net Income"
              value={netIncomeRange.min}
              onChange={(e) => setNetIncomeRange({ ...netIncomeRange, min: +e.target.value })}
              className="border px-2 py-1 mr-2"
            />
            <input
              type="number"
              placeholder="Max Net Income"
              value={netIncomeRange.max}
              onChange={(e) => setNetIncomeRange({ ...netIncomeRange, max: +e.target.value })}
              className="border px-2 py-1"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block">Sort By</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border px-2 py-1 mr-2"
          >
            <option value="date">Date</option>
            <option value="revenue">Revenue</option>
            <option value="netIncome">Net Income</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="border px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Revenue</th>
              <th className="border px-4 py-2">Net Income</th>
              <th className="border px-4 py-2">Gross Profit</th>
              <th className="border px-4 py-2">EPS</th>
              <th className="border px-4 py-2">Operating Income</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.date}>
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.revenue}</td>
                <td className="border px-4 py-2">{item.netIncome}</td>
                <td className="border px-4 py-2">{item.grossProfit}</td>
                <td className="border px-4 py-2">{item.eps}</td>
                <td className="border px-4 py-2">{item.operatingIncome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default FinancialTable;
  