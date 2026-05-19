'use client';

import { useState, useEffect } from 'react';
import StudentForm from './StudentForm';
import Spinner from './Spinner';

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  status: string;
}

const PAGE_SIZE = 4;

export default function StudentDirectory() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower) ||
        s.course.toLowerCase().includes(lower) ||
        s.status.toLowerCase().includes(lower)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentRecords = filteredStudents.slice(startIndex, endIndex);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: Student[] = await res.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingStudent(null);
    setShowModal(true);
  }

  function openEditModal(student: Student) {
    setEditingStudent(student);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingStudent(null);
  }

  async function handleSave(data: { name: string; email: string; course: string; status: string }) {
    setActionLoading(true);
    try {
      if (editingStudent) {
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Update failed');
      } else {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Create failed');
      }
      await fetchStudents();
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Are you sure?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner dark />
        <p style={{ marginTop: '1rem', color: '#888' }}>Loading students...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-box">Error: {error}</div>;
  }

  return (
    <>
  
      <div className="topbar">
        <h2>Student Directory</h2>
        <div className="top-icons">
          <i className="ri-notification-line"></i>
          <i className="ri-question-line"></i>
          <img
            src="https://uploads.onecompiler.io/44mv5p4zz/44pqayr5f/Untitled%20design%20(19).png"
            alt="Professor"
            className="profile-img"
          />
        </div>
      </div>

  
      <div className="card">
        <div className="card-top">
          <div className="search-wrapper">
            <i className="ri-search-line search-icon"></i>
            <input
              type="text"
              className="search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search students"
            />
          </div>
          <button className="btn" onClick={openAddModal} aria-label="Add new student">
            <i className="ri-add-line" style={{ marginRight: '6px' }}></i>
            Add New Student
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>STUDENT NAME</th>
                <th>EMAIL</th>
                <th>ENROLLED COURSE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                    {searchTerm ? 'No matching students found.' : 'No students yet. Add one!'}
                  </td>
                </tr>
              ) : (
                currentRecords.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>
                      <span
                        className={`status ${
                          student.status === 'Active' ? 'active-status' : 'inactive-status'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(student)}
                        title="Edit"
                        aria-label={`Edit ${student.name}`}
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(student.id)}
                        title="Delete"
                        aria-label={`Delete ${student.name}`}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bottom">
          <p>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of{' '}
            {filteredStudents.length} results
          </p>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              aria-label="Previous page"
            >
              Previous
            </button>
            <button
              className="page-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => goToPage(currentPage + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
            <StudentForm
              initialData={editingStudent}
              onSave={handleSave}
              onCancel={closeModal}
              loading={actionLoading}
            />
          </div>
        </div>
      )}
    </>
  );
}