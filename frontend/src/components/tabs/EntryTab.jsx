import EntryForm from '../EntryForm';
import EntryList from '../EntryList';

export default function EntryTab({ entries, categories, fetchAll }) {
  return (
    <>
      
      
      <EntryList
        entries={entries}
        categories={categories}
        onRefresh={fetchAll}
        className="mb-4"
      />
        <h5 className="mb-3 mt-3">Add New Entry</h5>
      <EntryForm categories={categories} onCreated={fetchAll} />
    </>
  );
}
