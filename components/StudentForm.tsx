'use client';

import { useState, FormEvent } from 'react';
import Spinner from './Spinner';

interface StudentData {
  name: string;
  email: string;
  course: string;
  status: string;
}

interface StudentFormProps {
  initialData: StudentData | null;
  onSave: (data: StudentData) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function StudentForm({
  initialData,
  onSave,
  onCancel,
  loading,
}: StudentFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [course, setCourse] = useState(initialData?.course || '');
  const [status, setStatus] = useState(initialData?.status || 'Active');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !course || !status) {
      setError('All fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Invalid email.');
      return;
    }
    setError('');
    onSave({ name, email, course, status });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-box">{error}</div>}

      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Course</label>
        <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? <Spinner /> : initialData ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}