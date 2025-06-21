FROM oven/bun:latest AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/app
COPY package.json /temp/app/package.json
RUN cd /temp/app && bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /temp/app/node_modules /app/node_modules
COPY . .


ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=prerelease /app ./
COPY --from=prerelease /app/dist ./

USER root
RUN chown -R bun:bun .
USER bun


EXPOSE 3000
ENTRYPOINT ["bun", "run", "index.js"]
