FROM node:18 AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/root/.pnpm
ENV PATH=$PNPM_HOME:$PATH
COPY . .
RUN pnpm add --global turbo
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter website


FROM nginx:alpine AS prod
COPY --from=build /apps/website/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


FROM node:18 AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/root/.pnpm
ENV PATH=$PNPM_HOME:$PATH
COPY . .
RUN pnpm add --global turbo
RUN pnpm install --frozen-lockfile
EXPOSE 5173
CMD ["pnpm", "run", "dev", "--filter", "website"]