# Medical Data Labeler

## Overview
The **Medical Image Data Labeling Application** is a web-based tool designed to help doctors efficiently label medical image data. This structured labeling supports data scientists in preparing datasets for machine learning model training. The application focuses solely on data labeling and export, with no direct model training integration.

## Features

### User Roles and Access Control
- **Doctors**: 
  - View and label only assigned projects.
  - Label both patient-specific and image-specific data.
- **Admins**:
  - Manage all projects, patients, and labels.
  - Assign projects to doctors.
  - Export labeled data for further processing.

### Application Interface and User Flow

#### Login and Dashboard Access
- Role-based dashboards tailored for each user:
  - **Doctors**: View and access only their assigned projects.
  - **Admins**: Manage all projects and assignments.

#### Labeling Interface
The labeling interface is divided into four main sections:

1. **Leftmost Sidebar – Patient List**:
   - Displays a list of patients in the selected project (e.g., Patient001, Patient002).
   - Selecting a patient loads their first image for labeling.

2. **Left Sidebar – Patient Information and Labels**:
   - Shows general patient information (e.g., name, age, health background).
   - Enables labeling of patient-specific observations, such as:
     - Name and Surname
     - Age and Gender
     - General Health Condition (e.g., “Diabetic,” “Hypertensive”)
     - Overall Condition Observed (e.g., “Lung Infection Detected”)

3. **Center Section – Image Display**:
   - Prominently displays the selected image for review and annotation.
   - Supports navigation through all images associated with the selected patient.

4. **Right Sidebar – Image-Specific Labels**:
   - Allows annotation of visible conditions in each image without requiring bounding boxes.
   - Examples of image-specific labels:
     - Is infection visible in this image? (Yes/No)
     - Severity of Condition (options: Mild, Moderate, Severe)
     - Presence of Anomalies (from a predefined list)

### Admin Capabilities
- **Project Management**:
  - Create, modify, and delete projects.
  - Assign projects to doctors for labeling.
- **Patient and Image Management**:
  - Add or remove patients and manage their associated images within projects.
- **Label Management**:
  - Define and maintain consistent patient-specific and image-specific labels across projects.
- **Data Export**:
  - Download labeled data in formats like CSV or JSON for machine learning workflows.

## Example Workflow

### Admin Workflow
1. **Login and Setup**:
   - Admin logs in to view all projects.
   - Updates label definitions and assigns projects to doctors.
2. **Project Management**:
   - Creates a new project, adds patients, and uploads associated images.
3. **Data Export**:
   - After doctors complete labeling, exports the labeled dataset for analysis.

### Doctor Workflow
1. **Login and Selection**:
   - Doctor logs in to view and access assigned projects.
   - Selects a project and enters the labeling interface.
2. **Patient Selection and Labeling**:
   - Selects a patient from the sidebar and reviews patient-specific information.
   - Applies general patient labels based on observations.
3. **Image Review and Labeling**:
   - Navigates through patient images and applies condition-specific labels.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/medical-labeling-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd medical-labeling-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Exported Data Formats

- **CSV**:
  - Contains structured patient-specific and image-specific labels.

## License
This project is licensed under the [GNU License](LICENSE).

