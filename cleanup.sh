#!/bin/bash

# Function to display Docker status
function display_status {
    echo "---------------------------------------------------"
    echo "Docker Status:"
    echo "Containers:"
    docker ps -a
    echo "Images:"
    docker images
    echo "Volumes:"
    docker volume ls
    echo "Networks:"
    docker network ls
    echo "---------------------------------------------------"
}

# Stop all running containers
echo "Stopping all running containers..."
docker stop $(docker ps -q) > /dev/null 2>&1

# Remove all containers
echo "Removing all containers..."
docker rm $(docker ps -a -q) > /dev/null 2>&1

# Remove all images
echo "Removing all images..."
docker rmi $(docker images -q) > /dev/null 2>&1

# Remove all volumes
echo "Removing all volumes..."
docker volume rm $(docker volume ls -q) > /dev/null 2>&1

# Remove all networks
echo "Removing all networks..."
docker network rm $(docker network ls -q) > /dev/null 2>&1

# Display the status of Docker resources to verify cleanup
display_status

echo "Docker cleanup completed."
