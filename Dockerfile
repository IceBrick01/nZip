FROM oven/bun:alpine

WORKDIR /workspace

COPY . /workspace

RUN bun install
RUN bun run build

FROM oven/bun:alpine

LABEL org.opencontainers.image.source="https://github.com/IceBrick01/nZip"

WORKDIR /workspace

COPY --from=0 /workspace/dist/Main.js /workspace
COPY --from=0 /workspace/dist/Main.js.map /workspace
COPY --from=0 /workspace/package.json /workspace
COPY --from=0 /workspace/App /workspace/App
RUN rm -rf /workspace/App/Pages

RUN bun install

EXPOSE 3000

CMD ["bun", "Main.js"]