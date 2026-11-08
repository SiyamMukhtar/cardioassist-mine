import os
import torch
import gradio as gr
import spaces
from transformers import AutoProcessor, AutoModelForMultimodalLM

MODEL = "google/medgemma-1.5-4b-it"
# In Spaces > Settings > Variables and secrets, add HF_TOKEN as a SECRET.
# Model access must be granted to the account owning that token.
TOKEN = os.environ.get("HF_TOKEN")
processor = AutoProcessor.from_pretrained(MODEL, token=TOKEN)
model = AutoModelForMultimodalLM.from_pretrained(
    MODEL,
    token=TOKEN,
    torch_dtype=torch.bfloat16,
    device_map="cuda",
)
model.eval()

@spaces.GPU(duration=120)
def predict(question):
    question = str(question or "").strip()[:5500]
    if not question:
        return "Please enter a question."
    messages = [{"role": "user", "content": [{"type": "text", "text": question}]}]
    inputs = processor.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=True,
        return_dict=True, return_tensors="pt"
    ).to(model.device)
    with torch.inference_mode():
        outputs = model.generate(**inputs, max_new_tokens=320, do_sample=False)
    return processor.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True).strip()

with gr.Blocks(title="CardioAssist MedGemma research demo") as demo:
    gr.Markdown("# CardioAssist · MedGemma 1.5 4B\n**Research prototype only.** No real patient data or clinical decisions.")
    prompt = gr.Textbox(lines=5, label="De-identified research question")
    result = gr.Textbox(lines=8, label="Model output")
    gr.Button("Generate").click(predict, inputs=prompt, outputs=result, api_name="predict")

demo.queue().launch()
