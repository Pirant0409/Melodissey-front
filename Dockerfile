# Étape 1 : Construire l'application Angular
FROM node:22-alpine AS build

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run production

# Étape 2 : Serveur pour servir les fichiers statiques
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
# Copier les fichiers de build Angular dans le répertoire de Nginx
COPY --from=build /usr/src/app/dist/melodissey-front /usr/share/nginx/html

# Exposer le port 80 (port par défaut de Nginx)
EXPOSE 80

# Commande de démarrage (Nginx serve le frontend)
CMD ["nginx", "-g", "daemon off;"]
