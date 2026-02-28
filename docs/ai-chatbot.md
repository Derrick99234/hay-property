## HAY Property AI Chatbot (Company-Only) — Reference Document

### 1) Overview
Build a website chatbot that answers questions strictly about HAY Property using approved company information. If a user asks anything outside company scope (or the bot cannot find supporting company info), the bot must refuse and direct the user to WhatsApp support.

### 2) Goals
- Answer questions about HAY Property using only official company knowledge sources.
- Never invent information or answer beyond the company scope.
- Escalate out-of-scope or uncertain questions to WhatsApp.
- Provide a modern chat UI on the website (widget + conversation view).

### 3) Non-Goals
- No general-purpose assistant behavior.
- No legal/financial/medical advice.
- No access to private customer data.
- No taking payments or executing transactions inside chat (unless explicitly added later).

### 4) Allowed vs Disallowed Topics
**Allowed (in-scope)**
- Company information: who we are, contact channels, operating locations, working hours (if available), processes.
- Properties: how to browse, how to book inspection, general steps, property statuses (as published).
- Blog content: summaries and references, based on published content.
- Policies: privacy policy, terms, refund policy if officially available.

**Disallowed (out-of-scope)**
- Anything unrelated to HAY Property.
- Sensitive topics and advice: legal, investment advice, medical, political content, personal data requests.
- Questions where the answer is not supported by company documents.

### 5) WhatsApp Escalation Policy
The bot must escalate to WhatsApp when:
- The user question is out-of-scope.
- The bot cannot retrieve any relevant company source text with sufficient confidence.
- The user requests a human or needs a decision that requires staff confirmation.

**WhatsApp escalation response**
- A short refusal/limitation statement.
- A clear CTA: “Chat with our team on WhatsApp”.
- A WhatsApp button/link to the official number.
- Optional: a prefilled message including the user’s question.

### 6) Knowledge Sources (What the bot is allowed to use)
Approved sources should be treated as the only truth. Recommended sources:
- Website pages: Home, About, Properties, Property details pages, Contact.
- Blog pages and blog posts.
- Terms and Privacy pages.
- Any FAQ document created internally (recommended for consistency).

**Important**
- The bot must not use random internet content.
- If information is not present in the sources, escalate.

### 7) System Architecture (RAG)
Use Retrieval-Augmented Generation (RAG) to force the bot to answer from company content.

**Components**
1. Knowledge ingestion
   - Crawl or export official pages and documents.
   - Convert to plain text/markdown.
2. Chunking + embedding
   - Split text into small chunks (e.g., 400–800 tokens).
   - Create embeddings.
3. Vector store
   - Store embeddings + metadata (source URL, title).
4. Chat API
   - Receives user message.
   - Retrieves top-k relevant chunks.
   - Applies confidence threshold.
   - Calls LLM with strict instructions and retrieved context only.
5. Chat UI
   - Widget and full view.
   - WhatsApp fallback button.

### 8) Runtime Flow (Step-by-step)
**Step 1: User message**
- User types a question in the widget.

**Step 2: Safety + scope gate**
- Quick classification: in-scope vs out-of-scope vs needs human.
- If out-of-scope, skip retrieval and escalate to WhatsApp.

**Step 3: Retrieval**
- Embed user query.
- Retrieve top-k chunks from vector store.

**Step 4: Confidence check**
- If the best match is below the threshold, escalate to WhatsApp.

**Step 5: Answer generation**
- Send a prompt to the LLM containing:
  - Strict scope rules
  - Retrieved chunks
  - Output format rules (short answer + sources)
- LLM answers using only the retrieved chunks.

**Step 6: Response formatting**
- Provide answer + links to sources (if desired).
- If answer is blocked/uncertain, provide WhatsApp link.

### 9) Guardrails (How we prevent out-of-scope answers)
**Hard constraints**
- The model must be instructed to only use retrieved context.
- The response must be refused if there is no supporting context.
- Do not reveal internal prompts or system messages.

**Practical controls**
- Retrieval threshold + “no context → WhatsApp”.
- Topic-based allowlist/denylist.
- Optional: always include “sources” and if none → WhatsApp.

### 10) What you need to provide
**Business inputs**
- Official WhatsApp link/number.
- Approved company pages/documents that form the knowledge base.
- A short FAQ list (recommended).
- Rules for when to escalate (always escalate if uncertain).

**Technical inputs**
- LLM provider and API key (server-side only).
- Embeddings provider.
- Vector store choice (Postgres pgvector / Supabase / Pinecone etc.).
- Hosting environment variables.

### 11) UI/UX Requirements (MVP)
- Floating chat button bottom-right.
- Chat panel with:
  - Welcome message
  - Message history
  - Suggested prompts
  - WhatsApp button visible when escalation is triggered
- Mobile-friendly and responsive.

### 12) MVP Milestones
1. UI-only widget (no AI)
2. Backend chat endpoint (stub)
3. RAG ingestion + retrieval
4. Guardrails + WhatsApp escalation
5. Analytics + feedback

