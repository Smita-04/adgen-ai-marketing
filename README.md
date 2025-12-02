# AdGen AI | Automated Generative Marketing Pipeline

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange?style=flat-square)

> A full-stack application that orchestrates Large Language Models (LLMs) and Latent Diffusion Models (LDMs) to autonomously generate high-fidelity marketing assets from raw text inputs.

---

## 🔗 Live Deployment

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://adgen-ai-marketing.vercel.app/)

   

---

## 📸 Interface Preview

*(Generated output demonstrating the integration of semantic text generation and visual synthesis)*

<!-- 
INSTRUCTIONS: 
1. Take a screenshot of your app running. 
2. Drag and drop the image here in GitHub's editor OR save it in your 'public' folder as 'demo.png' 
-->
<img width="1920" height="1080" alt="Screenshot (620)" src="https://github.com/user-attachments/assets/bb7bbd53-96b8-49b9-bbe0-928c7f9adbf1" />
<img width="1920" height="1080" alt="Screenshot (621)" src="https://github.com/user-attachments/assets/9c4989ef-8131-45b0-b24c-f0f560d4a165" />
<img width="1920" height="1080" alt="Screenshot (622)" src="https://github.com/user-attachments/assets/28d04cde-95b3-448c-9ea3-a958d1b9d7b4" />




---

## 💡 System Architecture

The application implements a **two-stage generative pipeline**:

1.  **Semantic Analysis & Prompt Engineering (Backend):** 
    *   The Next.js API route receives raw user input (Product + Audience).
    *   It interfaces with **Google Gemini ** to perform chain-of-thought reasoning, converting the raw input into a structured JSON payload containing a viral caption and an optically-optimized image prompt.
    
2.  **Visual Synthesis (Frontend):**
    *   The frontend receives the optimized prompt and encodes it for the **Flux Diffusion Model** (via Pollinations).
    *   Images are rendered server-side agnostic via dynamic URL parameters, ensuring low latency and zero GPU dependency on the host server.

---

## 🛠️ Technical Stack

| Component | Technology | Reason for Choice |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server-side rendering and robust API route handling. |
| **Language** | TypeScript | Type safety for API responses and component props. |
| **Styling** | Tailwind CSS v4 | Utility-first architecture for rapid, responsive UI development. |
| **Reasoning Engine** | Google Gemini  | High-speed inference and large context window for prompt optimization. |
| **Image Engine** | Flux (via Pollinations) | State-of-the-art open-source diffusion model for photorealistic rendering. |

---

## 📂 Repository Structure

The codebase follows a modular Next.js App Router architecture:

```bash
ad-gen-free/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # API Endpoint: Gemini Integration & Error Handling
│   ├── globals.css           # Tailwind v4 Directives
│   ├── layout.tsx            # Root Layout & Metadata
│   └── page.tsx              # Client-Side Logic & UI Rendering
├── public/                   # Static Assets
├── .env.local                # Environment Secrets (Gitignored)
├── next.config.ts            # Build Configuration
└── package.json              # Dependency Manifest


```
git clone https://github.com/Smita-04/adgen-ai.git
cd adgen-ai
