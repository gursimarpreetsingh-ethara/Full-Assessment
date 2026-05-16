import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const NewProjectModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">Project Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input"
            placeholder="E.g. Website Redesign"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="glass-input min-h-[100px] resize-none"
            placeholder="Briefly describe what this project is about..."
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewProjectModal;
