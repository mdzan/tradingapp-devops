# Use lightweight web server
FROM nginx:alpine

# Copy your App (public folder) to the container
COPY ./public /usr/share/nginx/html

# Expose Port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
