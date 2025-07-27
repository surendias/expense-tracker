export default function Filters({ filters, setFilters, categories = [] }) {
  return (
    <>
<style>
        {`
          input[type="month"] {
  appearance: auto;
  -webkit-appearance: auto;
}
        `}
      </style>
    <div className="row mb-4">
      <div className="col-md-4 mb-2 mb-md-0">
        <input
  type="date"
  className="form-control"
  value={filters.month + '-01'} // so it's a full date
  onChange={(e) => {
    const fullDate = e.target.value; // e.g. "2025-07-01"
    const monthOnly = fullDate.slice(0, 7);
    setFilters({ ...filters, month: monthOnly });
  }}
/>
      </div>

      <div className="col-md-4 mb-2 mb-md-0">
        <select
          className="form-select"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={filters.categoryId}
          onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
        >
          <option value="">All Categories</option>
          {Array.isArray(categories) &&
            categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
    </div>
    </>
  );
}
