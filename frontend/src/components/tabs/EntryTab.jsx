import { useState } from 'react';
import EntryForm from '../EntryForm';
import EntryList from '../EntryList';

export default function EntryTab({ entries, categories, fetchAll }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleEntryCreated = () => {
    fetchAll();
    closeModal();
  };

  return (
    <>
    <style>
        {`
          .modal-dialog-slide-up {
            transform: translateY(100%);
            animation: slideUp 0.3s forwards;
          }

          @keyframes slideUp {
            to {
              transform: translateY(0);
            }
          }
        `}
      </style>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Entries</h5>
        <button className="btn btn-primary" onClick={openModal}>
          ➕ Add Entry
        </button>
      </div>

      <EntryList
        entries={entries}
        categories={categories}
        onRefresh={fetchAll}
      />

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-slide-up">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Entry</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <EntryForm categories={categories} onCreated={handleEntryCreated} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
