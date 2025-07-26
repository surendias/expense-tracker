import { useState } from 'react';
import EntryTab from './tabs/EntryTab';
import CategoriesTab from './tabs/CategoriesTab';
import SummaryTab from './tabs/SummaryTab';
import ChartTab from './tabs/ChartTab';
import BudgetsTab from './tabs/BudgetsTab';
import Filters from './Filters';

const tabIcons = ['🏠', '📂', '📊', '📈', '💰'];
const tabLabels = ['Entry', 'Categories', 'Summary', 'Charts', 'Budgets'];


export default function MobileTabs({ user, categories, filters, setFilters, entries, fetchAll, onLogout }) {
  const [activeTab, setActiveTab] = useState(0);
  

  const renderTab = () => {
  switch (activeTab) {
    case 0:
      return (
        <EntryTab
          categories={categories}
          entries={entries}
          fetchAll={fetchAll}
          filters={filters}
          setFilters={setFilters}
        />
      );
    case 1:
      return <CategoriesTab categories={categories} fetchAll={fetchAll} />;
    case 2:
      return (
        <SummaryTab
          entries={entries}
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />
      );
    case 3:
      return (
        <ChartTab
          entries={entries}
          categories={categories}
          filters={filters}
          setFilters={setFilters}
        />
      );
      case 4:
      return <BudgetsTab categories={categories} filters={filters}
          setFilters={setFilters}/>;
    default:
      return null;
  }
};


  return (
    <div className="d-flex flex-column vh-100">
      <div className="flex-grow-1 px-3 py-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Welcome, {user?.email}</h5>
          <button className="btn btn-sm btn-outline-danger" onClick={onLogout}>Logout</button>
        </div>
        <Filters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />
        {renderTab()}
        <div style={{ paddingBottom: '60px' }} />
      </div>

      <nav className="bg-light border-top py-2 fixed-bottom d-flex justify-content-around">
        {tabLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveTab(i)}
            className={`btn btn-link flex-fill ${i === activeTab ? 'text-primary fw-bold' : 'text-muted'}`}
          >
            <div>{tabIcons[i]}</div>
            <small>{label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
