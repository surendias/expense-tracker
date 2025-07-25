import Summary from '../Summary';

export default function SummaryTab({ entries }) {
  const categoryTotals = entries.reduce((acc, e) => {
    const name = e.category?.name || 'Uncategorized';
    acc[name] = (acc[name] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  return (
    <>
      

      <h5 className="mb-3">Summary</h5>
      <Summary entries={entries} />

      <h6 className="mt-4">Summary by Category</h6>
      <ul className="list-group">
        {Object.entries(categoryTotals).map(([cat, total]) => (
          <li key={cat} className="list-group-item d-flex justify-content-between">
            <span>{cat}</span>
            <span className="fw-bold">{total.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
