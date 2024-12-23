import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ViewArchitecturalProject = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'https://www.backend.mga2002.in/api/architecture/data';

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjectData(data.success ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [API_URL]);

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(`https://www.backend.mga2002.in/api/architecture/upload/${projectId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjectData((prevData) => prevData.filter((project) => project._id !== projectId));
      } else {
        console.error('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const renderError = () => (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      Error: {error}
    </div>
  );

  const totalProjects = projectData.length;
  const totalPages = Math.ceil(totalProjects / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  const filteredProjects = projectData.filter((project) =>
    project.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handleShowMore = (projectId) => {
    if (projectId) {
      navigate(`/shows/${projectId}`);
    } else {
      console.error('Project ID is undefined.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Architectural Projects</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded py-2 px-4 w-full"
        />
      </div>

      {loading && renderLoading()}
      {error && renderError()}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProjects.length > 0 ? (
          currentProjects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              handleShowMore={handleShowMore} 
              handleDelete={handleDelete} 
            />
          ))
        ) : (
          <p className="text-center">No projects found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          totalPages={totalPages} 
        />
      )}
    </div>
  );
};

const ProjectCard = ({ project, handleShowMore, handleDelete }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between h-full">
    <div className="p-6 flex-grow">
      <h3 className="text-lg font-bold mb-4 text-center">Title: {project.title}</h3>
      <div className="space-y-2 text-gray-600 text-center">
        <p><span className="font-medium">Client:</span> {project.clientName || 'N/A'}</p>
        <p><span className="font-medium">Type:</span> {project.projectType}</p>
        <p><span className="font-medium">Address:</span> {project.siteAddress}</p>
        <p><span className="font-medium">GST No:</span> {project.gstNo}</p>
      </div>
    </div>

    <div className="p-4 border-t flex justify-around">
      <button 
        onClick={() => handleShowMore(project._id)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Show More
      </button>
      <button 
        onClick={() => handleDelete(project._id)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
      >
        <FaTrash className="mr-2" />
      </button>
    </div>
  </div>
);

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between mt-6">
      <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-blue-500 text-white px-4 py-2 rounded">
        Previous
      </button>
      <span className="self-center">Page {currentPage} of {totalPages}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white px-4 py-2 rounded">
        Next
      </button>
    </div>
  );
};

export default ViewArchitecturalProject;
