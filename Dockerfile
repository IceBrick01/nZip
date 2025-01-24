FROM oven/bun:alpine

WORKDIR /workspace

COPY . /workspace

RUN bun install
RUN bun run build

FROM oven/bun:alpine

LABEL org.opencontainers.image.url="https://ghcr.io/icebrick01/nzip"
LABEL org.opencontainers.image.source="https://github.com/IceBrick01/nZip"
LABEL org.opencontainers.image.title="nZip"
LABEL org.opencontainers.image.description="Download doujinshis from nhentai.net as a zip archive."
LABEL org.opencontainers.image.version="1.6.0"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.revision=""
LABEL org.opencontainers.image.created=""

WORKDIR /workspace

COPY --from=0 /workspace/dist/Main.js /workspace
COPY --from=0 /workspace/dist/Main.js.map /workspace
COPY --from=0 /workspace/package.json /workspace
COPY --from=0 /workspace/App /workspace/App
RUN rm -rf /workspace/App/Pages

RUN bun install

EXPOSE 3000

CMD ["bun", "Main.js"]