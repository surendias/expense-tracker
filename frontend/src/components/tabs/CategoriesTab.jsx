import CategoryForm from '../CategoryForm';
import CategoryList from '../CategoryList';

export default function CategoriesTab({ categories, fetchAll }) {
  return (
    <>
      <h5 className="mb-3">Categories</h5>
      <CategoryForm onCreated={fetchAll} />
      <CategoryList categories={categories} onRefresh={fetchAll} />
    </>
  );
}
