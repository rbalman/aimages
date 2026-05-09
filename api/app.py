import os
import queue
import secrets
import threading

from dotenv import load_dotenv
from flask import Flask, jsonify, request

from mflux.models.common.config import ModelConfig
from mflux.models.flux2.variants import Flux2Klein
from mflux.utils.image_util import ImageUtil

import subprocess


load_dotenv()

IMAGE_DIR = os.getenv("IMAGE_DIR", "/Users/balman/github/rbalman/aigallery/src/images")
MODEL_NAME = os.getenv("MODEL_NAME", "flux2-klein-4b")
QUANTIZE = int(os.getenv("QUANTIZE", "4"))

os.makedirs(IMAGE_DIR, exist_ok=True)

# Queue for sending jobs to the MLX thread
job_queue = queue.Queue()

def mlx_worker():
    """Single long-lived thread that owns all MLX/GPU state."""
    print(f"Loading model {MODEL_NAME}...")
    model = Flux2Klein(
        model_config=ModelConfig.from_name(model_name=MODEL_NAME),
        quantize=QUANTIZE,
    )
    print("Model loaded. Ready.")

    while True:
        job = job_queue.get()
        if job is None:
            break

        result_event, params, result_box = job
        try:
            image = model.generate_image(
                seed=params["seed"],
                prompt=params["prompt"],
                width=params["width"],
                height=params["height"],
                guidance=params["guidance"],
                num_inference_steps=params["steps"],
                image_path=None,
                image_strength=None,
                scheduler="flow_match_euler_discrete",
            )
            ImageUtil.save_image(
                image=image,
                path=params["image_path"],
                export_json_metadata=False,
            )
            result_box["success"] = True
        except Exception as e:
            result_box["error"] = str(e)
        finally:
            result_event.set()

# Start the MLX worker thread once at startup
worker_thread = threading.Thread(target=mlx_worker, daemon=True)
worker_thread.start()

app = Flask(__name__)

@app.post("/generate")
def generate():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "prompt is required"}), 400

    seed = data.get("seed") or secrets.randbelow(1_000_000_000)
    image_path = f"{IMAGE_DIR}/{secrets.token_hex(5)}.png"

    result_box = {}
    result_event = threading.Event()

    job_queue.put((result_event, {
        "prompt": prompt,
        "seed": seed,
        "image_path": image_path,
        "width": data.get("width", 1080),
        "height": data.get("height", 1350),
        "guidance": data.get("guidance", 1.0),
        "steps": data.get("steps", 20),
    }, result_box))

    result_event.wait()  # block until MLX thread finishes

    if "error" in result_box:
        return jsonify({"error": result_box["error"]}), 500

    return jsonify({"image_path": image_path, "seed": seed, "success": True})

@app.get("/health")
def health():
    return jsonify({"status": "ok", "model": MODEL_NAME})

@app.post("/ollama-stop")
def ollama_stop():
    model = request.get_json(silent=True) or {}
    model_name = model.get("model", "qwen3:30b")

    result = subprocess.run(
        ["ollama", "stop", model_name],
        capture_output=True, text=True
    )

    if result.returncode != 0:
        return jsonify({"error": result.stderr.strip()}), 500

    return jsonify({
        "stopped": model_name,
        "success": True
    })

@app.post("/git-commit")
def git_commit():
    data = request.get_json()
    message = data.get("message")
    repo_path = data.get("path", "/Users/balman/github/rbalman/aigallery")
    branch = data.get("branch", "main")

    if not message:
        return jsonify({"error": "message is required"}), 400

    try:
        subprocess.run(
            ["git", "add", "."],
            cwd=repo_path, capture_output=True, text=True, check=True
        )
        subprocess.run(
            ["git", "commit", "-m", message],
            cwd=repo_path, capture_output=True, text=True, check=True
        )
        result = subprocess.run(
            ["git", "push", "origin", branch],
            cwd=repo_path, capture_output=True, text=True, check=True
        )
    except subprocess.CalledProcessError as e:
        return jsonify({"error": e.stderr.strip()}), 500

    return jsonify({
        "success": True,
        "output": result.stdout.strip()
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8899, threaded=True)