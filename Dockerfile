FROM denoland/deno:latest

WORKDIR /app

COPY deno.json deno.lock ./

RUN deno install

# # Prefer not to run as root.
USER deno

COPY src/ src/
COPY .env .env

ENTRYPOINT [ "deno", "task", "start"]