import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
    const [project, setProject] = useState(null);
    const [patients, setPatients] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, patientsRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/projects/${id}`),
                    axios.get(`http://localhost:3000/api/patients/${id}`)
                ]);
                setProject(projectRes.data);
                setPatients(patientsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex gap-2 mb-4">
                <Link
                    to={`/projects/${id}/edit`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Edit Project
                </Link>
                <Link
                    to={`/projects/${id}/add-patient`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Patient
                </Link>
            </div>

            <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
            <p className="mb-4">{project.description}</p>

            <h3 className="text-xl font-semibold mb-2">Person Labels</h3>
            <ul className="list-disc pl-5 mb-4">
                {project.labels.person_labels.map((label, index) => (
                    <li key={index}>
                        {label.label_question} ({label.input_type})
                        {label.input_type === 'dropdown' && label.options && (
                            <ul className="list-circle pl-5">
                                {label.options.map((option, optionIndex) => (
                                    <li key={optionIndex}>{option}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <h3 className="text-xl font-semibold mb-2">Image Labels</h3>
            <ul className="list-disc pl-5 mb-6">
                {project.labels.image_labels.map((label, index) => (
                    <li key={index}>
                        {label.label_question} ({label.input_type})
                    </li>
                ))}
            </ul>

            <h3 className="text-xl font-semibold mb-4">Patients</h3>
            <div className="grid grid-cols-1 gap-4">
                {patients.map((patient) => (
                    <div key={patient._id} className="border rounded p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold">{patient.name}</h4>
                                <p>Age: {patient.metadata.age}</p>
                                <p>Gender: {patient.metadata.gender}</p>
                                <p>Medical History: {patient.metadata.medical_history}</p>
                            </div>
                        </div>

                        {patient.images && patient.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {patient.images.map((image, index) => (
                                    <div key={index} className="border rounded p-2">
                                        <img
                                            src={image.image_url}
                                            alt={image.description}
                                            className="w-full h-48 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-600 mt-1">
                                            {image.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectDetails;