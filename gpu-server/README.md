# MedGemma GPU inference — deployment steps

This directory is **not** a copy of the weights. The first vLLM startup downloads original weights onto your GPU server after you accept the Google Health AI Developer Foundations terms.

## Required external steps
1. Visit https://huggingface.co/google/medgemma-1.5-4b-it , log in, and accept its terms. Create a Hugging Face **read** token.
2. Provision an NVIDIA GPU Linux server or GPU container. For a starter deployment choose roughly 24 GB VRAM or more for 4B BF16 model and serving overhead; actual usage depends on context and concurrency. The 27B text variant needs substantially more memory.
3. On that GPU server set environment variables `HF_TOKEN` and `VLLM_API_KEY` (a fresh random server-side secret), then run `bash gpu-server/start-medgemma.sh` in an environment with a compatible NVIDIA driver/CUDA stack.
4. The server must be exposed through an HTTPS endpoint with authentication, e.g. `https://your-inference-domain.example/v1`. **Do not expose a raw unauthenticated port 8000 on the internet.** Limit inbound network access and use TLS.
5. In **Vercel > CardioAssist > Settings > Environment Variables**, set:
   - `MEDGEMMA_API_URL=https://your-inference-domain.example/v1`
   - `MEDGEMMA_API_KEY=<the exact VLLM_API_KEY from your GPU server>`
   - `MEDGEMMA_MODEL=google/medgemma-1.5-4b-it`
   Keep `DATABASE_URL` and `JWT_SECRET` as already configured. Redeploy to apply changed environment variables.
6. Open `/api/health` on your CardioAssist Vercel domain. `modelConfigured:true` means an endpoint URL was supplied; it **does not guarantee model inference is working**. Create a fictional patient and consultation, send a non-sensitive test question and confirm an AI reply.

## Example start (Ubuntu GPU machine)
```
export HF_TOKEN='your-hf-read-token'
export VLLM_API_KEY='your-long-random-inference-secret'
bash gpu-server/start-medgemma.sh
```

## Switching to 27B later
Change `MEDGEMMA_MODEL` both on the GPU server and Vercel to `google/medgemma-27b-text-it` and provision sufficient GPU memory; do not try to load both simultaneously on a small GPU. See the official Hugging Face model page for current requirements.

**Privacy/clinical warning:** Use synthetic test data until HIPAA/local compliance, access control, audit/security review, clinical validation, and suitable provider contracts have been completed. This model is not a standalone diagnostic device.
