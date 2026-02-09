# Expo Development Server Dockerfile
# Compatible with Expo SDK 54, React Native 0.81.5, React 19
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
# Note: expo-cli is no longer needed globally in SDK 54+
# All expo commands are run via npx expo
RUN npm ci

# Copy source code
COPY . .

# Key environment variables for Docker
# CI=1 disables interactive prompts
# EXPO_DEVTOOLS_LISTEN_ADDRESS makes Expo bind to all interfaces
ENV CI=1
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Expose Expo ports
# 8081 - Metro bundler
# 19000 - Expo DevTools
# 19001 - Expo DevTools (packager info)
EXPOSE 8081 19000 19001

# Start Expo development server with LAN mode
# --lan flag enables network access for physical devices
# --port 8081 specifies the Metro bundler port
CMD ["npx", "expo", "start", "--lan", "--port", "8081"]
