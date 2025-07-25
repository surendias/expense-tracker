export default function Filters({ filters, setFilters, categories = [] }) {
  return (
    <div className="row mb-4">
      <div className="col-md-4 mb-2 mb-md-0">
        <input
          type="month"
          className="form-control"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
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
  );
}
