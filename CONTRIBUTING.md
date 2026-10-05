# Contributing to Lumi ✨

Thank you for your interest in contributing to **Lumi — Little Things Companion**!

## Development Guidelines

1. **Keep components small and readable**: Ensure single responsibility and clear names.
2. **Modular AI Layer**: Keep AI / Gemma logic strictly isolated within `server/services/gemma/`.
3. **Design Aesthetic**: Follow the warm cream neutral palette, soft terracotta accents, and elegant typography. Avoid generic SaaS styles.
4. **Clean Git History**: Use descriptive conventional commit messages (e.g. `feat:`, `fix:`, `chore:`).

## Quick Setup

1. **Ollama & Gemma Setup**:
   ```bash
   ollama pull gemma2:2b
   ```

2. **Backend**:
   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
