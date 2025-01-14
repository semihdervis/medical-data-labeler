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

Frontend:

1. Clone the repository:
   ```bash
   git clone hhttps://github.com/semihdervis/medical-data-labeler.git
   ```
2. Navigate to the project directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Copy dist folder to relevant place in server using scp:
   ```bash
   scp -r -i accesskey.pem C:\Path\to\dist\dist username@ip:/home/username/server/location/
   ```
6. Give necessary permissions from server terminal (ssh):
   ```bash
   sudo chmod -R 755 /home/user/server/location/dist
   sudo chmod 644 /home/user/server/location/dist/index.html
   ```
7. Create nginx config:

   ```bash
   sudo nano /etc/nginx/sites-available/yourdomain.com
   ```

   ```bash
   server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/yourdomain.com;  # Document root for your frontend files (update this path)

    # For the frontend (Vite app)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # For the API
    location /api/ {
        proxy_pass http://localhost:3001;  # Backend is running on port 3001
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
   ```

8. Use certbot to get https access:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
9. Reload nginx:
   ```bash
   sudo systemctl reload nginx
   ```

Backend:

1. From the server, clone the repository:
   ```bash
   git clone hhttps://github.com/semihdervis/medical-data-labeler.git
   ```
2. Navigate to the project directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Move files to their relevant places
5. Create a service file:

   ```bash
   sudo nano /etc/systemd/system/express-backend.service
   ```

   ```bash
   [Unit]
   Description=Express Backend Service
   After=network.target

   [Service]
   ExecStart=/usr/bin/node /path/to/your/express/app/server.js
   WorkingDirectory=/path/to/your/express/app
   Restart=always
   User=your-username
   Environment=PATH=/usr/bin:/usr/local/bin
   Environment=NODE_ENV=production
   ExecStartPre=/bin/mkdir -p /path/to/logs
   ExecStartPre=/bin/chown your-username:your-username /path/to/logs

   [Install]
   WantedBy=multi-user.target
   ```
6. Configure systemd to detect service and run service automatically:
   ```bash
   sudo systemctl daemon-reload
   ```
   ```bash
   sudo systemctl start express-backend
   sudo systemctl enable express-backend
   ```

## Exported Data Formats

- **CSV**:
  - Contains structured patient-specific and image-specific labels.

## License

This project is licensed under the [GNU License](LICENSE).

```

```
