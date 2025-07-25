export default function Summary({ entries }) {
  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="row mb-4">
      <div className="col">
        <div className="alert alert-success">Income: {totalIncome}</div>
      </div>
      <div className="col">
        <div className="alert alert-danger">Expense: {totalExpense}</div>
      </div>
      <div className="col">
        <div className="alert alert-primary">Net: {totalIncome - totalExpense}</div>
      </div>
    </div>
  );
}
