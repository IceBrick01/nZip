FROM oven/bun:alpine

WORKDIR /workspace

COPY . /workspace

# RUN bun install
# RUN bun run build
RUN sh build.sh

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

COPY --from=0 /workspace/dist /workspace

RUN bun install

EXPOSE 3000

CMD ["bun", "Main.js"]