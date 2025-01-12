const Project = require('../models/ProjectModel')
const Patient = require('../models/PatientModel')
const User = require('../models/UserModel') // Import the User model
const patientController = require('./patientController')
const LabelSchema = require('../models/LabelSchemaModel')
const fs = require('fs')
const JSZip = require('jszip')
const path = require('path')
const Image = require('../models/ImageModel')
const Parser = require('json2csv').Parser
const LabelAnswers = require('../models/LabelAnswersModel')
const csv = require('csv-parse/sync')
const labelController = require('./labelController')
const util = require('util')

const projectsDir = path.join(__dirname, '../projects') // Define the projects directory

exports.getAllProjects = async (req, res) => {
  try {
    let projects
    if (req.userRole === 'admin') {
      // If the user is an admin, fetch all projects
      projects = await Project.find()
    } else {
      // If the user is a doctor, fetch only the projects assigned to them
      const user = await User.findById(req.userId).populate('projects')
      projects = user.projects
    }
    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' })
    }
    const newProject = new Project({ name, description })
    await newProject.save()
    const projectDir = path.join(projectsDir, newProject._id.toString())

    // Ensure the parent directory exists
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true })
    }

    fs.mkdirSync(projectDir)
    res.status(201).json(newProject)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.status(200).json(updatedProject)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Delegate the deletion of patients to the patientController
    const patients = await Patient.find({ projectId: project._id })

    for (const patient of patients) {
      await patientController.deletePatientById(patient._id)
    }

    // Delete the project's schemas
    await LabelSchema.deleteMany({ projectId: project._id })

    // Delete the project's folder
    const projectDir = path.join(
      __dirname,
      '../projects',
      project._id.toString()
    )
    fs.rmSync(projectDir, { recursive: true, force: true })

    // Delete the project itself
    await project.deleteOne()

    res
      .status(200)
      .json({ message: 'Project and related data deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPatientsByProjectId = async (req, res) => {
  try {
    const patients = await Patient.find({ projectId: req.params.id })
    res.json(patients)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.assignDoctor = async (req, res) => {
  try {
    const { projectId } = req.params
    const { doctorEmail } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const doctor = await User.findOne({ email: doctorEmail })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    doctor.projects.push(project._id)
    await doctor.save()

    res.status(200).json({ message: 'Doctor assigned successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.removeDoctor = async (req, res) => {
  try {
    const { projectId } = req.params
    const { doctorEmail } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const doctor = await User.findOne({ email: doctorEmail })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    if (doctor.projects.includes(project._id)) {
      doctor.projects = doctor.projects.filter(
        id => id.toString() !== project._id.toString()
      )
      await doctor.save()
      return res
        .status(200)
        .json({ message: 'Doctor removed from project successfully' })
    }

    // Warn if doctor is not assigned to project
    return res
      .status(400)
      .json({ message: 'Doctor is not assigned to project' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.updateAssigns = async (req, res) => {
  const { projectId } = req.params
  const { assignedDoctors } = req.body

  console.log('Updating assigns:', assignedDoctors)

  try {
    // Validate input
    if (!Array.isArray(assignedDoctors)) {
      return res
        .status(400)
        .json({ message: 'Assigned doctors must be an array' })
    }

    // Fetch the project
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Remove project from current doctors' project lists
    await User.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    )

    // Track successful and failed assignments
    const successfulAssignments = []
    const failedAssignments = []

    // Assign new doctors to the project
    for (const doctor of assignedDoctors) {
      try {
        console.log('Assigning doctor:', doctor)
        const user = await User.findOne({ email: doctor })
        if (!user) {
          failedAssignments.push(doctor)
          continue
        }

        // Add project to doctor's projects if not already there
        if (!user.projects.includes(projectId)) {
          user.projects.push(projectId)
          await user.save()
          successfulAssignments.push(doctor)
        }
      } catch (assignError) {
        console.error(`Error assigning doctor ${doctor}:`, assignError)
        failedAssignments.push(doctor)
      }
    }

    // Provide detailed response
    return res.status(200).json({
      message: 'Doctors assignment process completed',
      successfulAssignments,
      failedAssignments
    })
  } catch (error) {
    console.error('Error assigning doctors to project:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

/*
    This function exports a project's data to a zip file
    and sends the file to the client for download
    format is as follows:
    - project
    - patients.csv
      - patient1
        - data.csv
        - image1.jpg
        - image2.jpg
      - patient2
        - data.csv
        - image1.jpg
        - image2.jpg
    
    */

// copy project data to a temporary directory
// rename the project folder to the project name
// rename all patient folders to the patient name
// rename all image files to the image name
// while renaming patients, create a CSV file using projects patient schema and patient data, create a csv file with each patient is an entry
// while renaming images, create a CSV file for each patient with each image as an entry

exports.exportProject = async (req, res) => {
  try {
    const projectId = req.params.projectId
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const zip = new JSZip()
    const projectFolder = zip.folder('project')

    // Get all patients for the project
    const patients = await Patient.find({ projectId })
    const patientsData = []

    // Process each patient
    for (const patient of patients) {
      // Create patient folder
      const patientFolder = projectFolder.folder(patient.name)

      // Get all images for the patient
      const images = await Image.find({ patientId: patient._id })
      const imageData = []

      // Process each image
      for (const image of images) {
        try {
          // Read the image file
          const imageContent = await fs.readFileSync(image.filepath)
          // Add image to the patient's folder with its original name
          const imageName = image.name
          patientFolder.file(imageName, imageContent)

          // Get label answers for this image
          const imageAnswers = await LabelAnswers.findOne({
            ownerId: image._id
          })
          if (imageAnswers) {
            // Transform label data into flat structure for CSV
            const imageRow = {
              image_name: imageName,
              ...imageAnswers.labelData.reduce((acc, label) => {
                acc[label.field] = label.value
                return acc
              }, {})
            }
            imageData.push(imageRow)
          }
        } catch (err) {
          console.error(`Error processing image ${image.name}:`, err)
        }
      }

      // Create and add data.csv for the patient
      if (imageData.length > 0) {
        const parser = new Parser()
        const imageCsv = parser.parse(imageData)
        patientFolder.file('data.csv', imageCsv)
      }

      // Collect patient data for main patients.csv
      const patientAnswers = await LabelAnswers.findOne({
        ownerId: patient._id
      })
      if (patientAnswers) {
        patientsData.push({
          patient_name: patient.name,
          ...patientAnswers.labelData.reduce((acc, label) => {
            acc[label.field] = label.value
            return acc
          }, {})
        })
      }
    }

    // Create and add patients.csv
    if (patientsData.length > 0) {
      const parser = new Parser()
      const patientsCsv = parser.parse(patientsData)
      projectFolder.file('patients.csv', patientsCsv)
    }

    // Generate and send the zip file
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })
    res.set('Content-Type', 'application/zip')
    res.set('Content-Disposition', `attachment; filename=${project.name}.zip`)
    res.send(zipContent)
  } catch (error) {
    console.error('Error exporting project:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

const writeFile = util.promisify(fs.writeFile);

const ensureDirectoryExists = async dir => {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
};

exports.importProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Read the uploaded zip file
    const zipBuffer = req.file.buffer;
    const zip = await JSZip.loadAsync(zipBuffer);

    // Track changes for summary
    const changes = {
      patientsCreated: 0,
      patientsUpdated: 0,
      imagesCreated: 0,
      imagesUpdated: 0,
      errors: []
    };

    // Get schemas
    const result = await labelController.getLabelSchemaByProjectIdService(projectId);
    const [patientSchema, imageSchema] = result.data;

    // Read and parse patients.csv
    let patientsData = [];
    try {
      const patientsFile = zip.file('project/patients.csv');
      if (patientsFile) {
        const patientsCSV = await patientsFile.async('string');
        patientsData = csv.parse(patientsCSV, { columns: true });
      }
    } catch (err) {
      changes.errors.push(`Error reading patients.csv: ${err.message}`);
    }

    // Get all patient folders
    const patientFolders = new Set(
      Object.keys(zip.files)
        .filter(path => path.startsWith('project/') && path.split('/').length >= 2)
        .map(path => path.split('/')[1])
        .filter(name => name && name !== 'patients.csv')
    );

    // Process each patient folder
    for (const patientName of patientFolders) {
      try {
        // Find or create patient
        let patient = await Patient.findOne({ projectId, name: patientName });

        if (!patient) {
          // Create new patient
          patient = new Patient({
            projectId,
            name: patientName,
            age: 0,
            gender: 'unknown'
          });
          await patient.save();

          // Debug: Log the patient ID after saving
          console.log(`Created new patient: ${patientName}, ID: ${patient._id}`);

          // Create patient directory in the filesystem
          const patientDir = path.join('projects', projectId.toString(), patient._id.toString());
          await ensureDirectoryExists(patientDir);

          // Initialize patient label answers
          const defaultAnswers = patientSchema.labelData.map(label => ({
            field: label.labelQuestion,
            value: label.labelType === 'dropdown' ? label.labelOptions[0] : ''
          }));

          await labelController.createLabelAnswerService(patientSchema._id, patient._id, defaultAnswers);
          changes.patientsCreated++;
        } else {
          // Debug: Log the patient ID if found
          console.log(`Found existing patient: ${patientName}, ID: ${patient._id}`);
        }

        // Process patient's data.csv
        const dataFile = zip.file(`project/${patientName}/data.csv`);
        if (dataFile) {
          const dataCSV = await dataFile.async('string');
          const imageData = csv.parse(dataCSV, { columns: true });

          // Process each image entry
          for (const row of imageData) {
            const imageName = row.image_name;
            if (!imageName) continue;

            // Find or create image
            let image = await Image.findOne({ patientId: patient._id, name: imageName });

            if (!image) {
              // Get image file from zip
              const imageFile = zip.file(`project/${patientName}/${imageName}`);
              if (!imageFile) {
                changes.errors.push(`Image file not found: ${imageName}`);
                continue;
              }

              // Save image file
              const imageContent = await imageFile.async('nodebuffer');
              const patientDir = path.join('projects', projectId.toString(), patient._id.toString());

              // Create image record first to get the image ID
              image = new Image({
                projectId,
                patientId: patient._id,
                name: imageName,
                uploader: req.userId,
                filepath: 'temp' // Temporary, will update after saving the file
              });
              await image.save();

              // Debug: Log the image ID after saving
              console.log(`Created new image: ${imageName}, ID: ${image._id}`);

              // Use returned image ID to save the file with the ID as the filename
              const imagePath = path.join(patientDir, `${image._id}${path.extname(imageName)}`);
              await writeFile(imagePath, imageContent);

              // Update the image record with the correct filepath
              image.filepath = imagePath;
              await image.save();

              // Initialize image label answers
              const defaultAnswers = imageSchema.labelData.map(label => ({
                field: label.labelQuestion,
                value: label.labelType === 'dropdown' ? label.labelOptions[0] : ''
              }));

              await labelController.createLabelAnswerService(imageSchema._id, image._id, defaultAnswers);
              changes.imagesCreated++;
            } else {
              // Debug: Log the image ID if found
              console.log(`Found existing image: ${imageName}, ID: ${image._id}`);
            }

            // Update image label answers
            delete row.image_name;
            const labelData = Object.entries(row).map(([field, value]) => ({ field, value }));

            if (labelData.length > 0) {
              await LabelAnswers.findOneAndUpdate({ ownerId: image._id }, { labelData }, { upsert: true });
              changes.imagesUpdated++;
            }
          }
        }

        // Update patient's label answers from patients.csv if available
        const patientDataRow = patientsData.find(p => p.patient_name === patientName);
        if (patientDataRow) {
          delete patientDataRow.patient_name;
          const labelData = Object.entries(patientDataRow).map(([field, value]) => ({ field, value }));

          if (labelData.length > 0) {
            await LabelAnswers.findOneAndUpdate({ ownerId: patient._id }, { labelData }, { upsert: true });
            changes.patientsUpdated++;
          }
        }
      } catch (err) {
        changes.errors.push(`Error processing patient ${patientName}: ${err.message}`);
      }
    }

    res.json({
      message: 'Project import completed',
      summary: changes
    });
  } catch (error) {
    console.error('Error importing project:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};