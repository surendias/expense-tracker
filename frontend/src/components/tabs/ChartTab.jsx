import ChartView from '../ChartView';

export default function ChartTab({ entries, categories }) {
  return (
    <>
      <h5 className="mb-3">Charts</h5>
      
      <ChartView entries={entries} categories={categories} />
    </>
  );
}
