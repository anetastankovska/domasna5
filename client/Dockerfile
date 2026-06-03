FROM nginx:alpine

# Copy the static HTML and JS files to the default nginx public directory
COPY ./ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
