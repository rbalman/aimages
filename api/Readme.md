# mflux-api

Local FastAPI wrapper for mflux flux2-klein image generation.
Runs on Mac host (Apple Silicon only — MLX cannot run in Docker).

## Start

```shell
./start.sh
```

## Test

```shell
curl -X POST http://localhost:8899/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Golden misty Himalayan valley at dawn, Sony A7IV 24mm f/2.8"}'
```

## n8n HTTP Request node

- URL: http://host.docker.internal:8899/generate
- Method: POST
- Body: { "prompt": "{{ $json.prompt }}" }

## Docs
http://localhost:8899/docs
```