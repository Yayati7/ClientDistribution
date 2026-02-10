# AgentTask Manager

AgentTask Manager is a full-stack MERN web application that allows administrators to manage agents, upload task lists via CSV files, and automatically distribute tasks equally among available agents. Built with React, Node.js, Express.js, and MongoDB, the platform provides a clean dashboard for task monitoring, agent management, and distribution analytics.

## Features

- Secure admin authentication using JWT-based login and signup
- Agent creation and management with contact details
- CSV file upload for bulk task ingestion
- Automatic equal task distribution across all available agents
- Dynamic redistribution of tasks when new agents are added
- Dashboard displaying distributed tasks in real time
- Agent distribution analytics and summary statistics
- Toast notifications for success and error handling
- Responsive and modern admin dashboard UI

## Tech Stack

- **Frontend:** React.js, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcrypt
- **File Processing:** CSV parsing (csv-parser / multer)

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Modern web browser

## Usage

- Open the application in your browser.
- Sign up or log in as an admin.
- Add agents with required details.
- Upload a CSV file containing task information.
- Tasks will automatically be distributed among available agents.
- View distributed tasks and agent-wise summaries on the dashboard.
- Add new agents anytime to automatically rebalance existing tasks.

## Acknowledgements

- [React](https://react.dev/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [csv-parser](https://www.npmjs.com/package/csv-parser)

> Inspired by modern admin-dashboard workflow automation systems and scalable task-distribution platforms.
