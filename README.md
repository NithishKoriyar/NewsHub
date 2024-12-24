# NewsHub - Dockerized News Aggregator Frontend

This project is a React.js-based frontend for a news aggregator application. The application is containerized using Docker, ensuring easy setup and deployment.

## Prerequisites

Before you proceed, ensure the following are installed on your system:
1. [Docker](https://www.docker.com/products/docker-desktop) (version 20.10 or later)
2. A terminal or command prompt

## Getting Started

Follow the steps below to build and run the project in a Docker container.

### Step 1: Clone the Repository

Clone this repository to your local machine:

```sh
git clone https://github.com/NithishKoriyar/NewsHub.git
cd NewsHub
```

### Step 2: Build the Docker Image

Use the following command to build the Docker image:

```sh
docker build -t newshub-app:dev .
```

### Step 3: Run the Docker Container

Run the container using the command:

```sh
docker run -p 5173:5173 newshub-app:dev
```

### Step 4: Access the Application

Open your browser and navigate to:

[http://localhost:5173](http://localhost:5173)

**Note**: Use `localhost` instead of the IP address because some APIs decline requests due to CORS (Cross-Origin Resource Sharing) policies.




## Notes

### Technologies Used

- **Frontend Framework**: React.js (with Hooks for state management and functional components)
- **Styling**: Tailwind CSS for a clean and responsive design
- **Containerization**: Docker for seamless deployment

### APIs

- NewsAPI.org
- New York Times API
- The Guardian API
- NewsData.io (chosen as an alternative due to limitations in other provided APIs)

### Challenges Faced

#### API Limitations

Some APIs from the provided data sources list were either unavailable or required specific access permissions.
- **Solution**: I selected NewsData.io as an alternative and ensured smooth integration with the other APIs.

#### Rate Limits

News APIs had strict rate limits, making it challenging to fetch and combine data dynamically.
- **Solution**: I implemented caching to reduce redundant API calls and avoid exceeding rate limits.

#### Search and Filter Functionality

Designing a robust search and filter system to handle multiple filters (date, category, source) was complex.
- **Solution**: I utilized efficient state management in React and ensured smooth performance for large datasets.

#### Responsive Design

Ensuring a consistent and user-friendly experience across devices.
- **Solution**: Tailwind CSS made it easier to create a fully responsive layout, optimized for mobile and desktop users.
