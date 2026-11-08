#!/usr/bin/env bash
set -euo pipefail
# Run on an NVIDIA GPU VM/container (NOT on Vercel).
: "${HF_TOKEN:?Set HF_TOKEN after accepting MedGemma license on Hugging Face}"
: "${VLLM_API_KEY:?Set a long private VLLM_API_KEY shared only with Vercel}"
MODEL="${MEDGEMMA_MODEL:-google/medgemma-1.5-4b-it}"
PORT="${PORT:-8000}"
export HF_TOKEN
python3 -m pip install --upgrade pip
python3 -m pip install --upgrade 'vllm>=0.12' huggingface_hub
# Model downloads automatically upon startup. First boot can take several minutes.
exec vllm serve "$MODEL" --host 0.0.0.0 --port "$PORT" --api-key "$VLLM_API_KEY" --dtype auto --max-model-len 8192
