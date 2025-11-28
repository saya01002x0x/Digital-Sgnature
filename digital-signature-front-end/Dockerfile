FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN rm -f .env .env.local .env.*.local 2>/dev/null || true

ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_USE_MSW
ARG VITE_USE_REDUX_DEVTOOLS
ARG VITE_I18N_DEFAULT_LANG
ARG VITE_IS_DEV
ARG VITE_IS_PROD

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_USE_MSW=$VITE_USE_MSW
ENV VITE_USE_REDUX_DEVTOOLS=$VITE_USE_REDUX_DEVTOOLS
ENV VITE_I18N_DEFAULT_LANG=$VITE_I18N_DEFAULT_LANG
ENV VITE_IS_DEV=$VITE_IS_DEV
ENV VITE_IS_PROD=$VITE_IS_PROD

RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

