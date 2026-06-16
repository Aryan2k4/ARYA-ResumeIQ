import httpx
import json
import os
import re
from typing import Optional

# Grok API uses an OpenAI-compatible endpoint
GROK_API_KEY = os.getenv("GROQ_API_KEY", "")
GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROK_MODEL = "llama-3.3-70b-versatile"   # or "grok-3" for the full model

ROLE_SKILLS = {
    "Software Engineer": ["Python", "Java", "C++", "Data Structures", "Algorithms", "System Design", "Git", "Docker", "SQL", "REST APIs", "Unit Testing", "Microservices"],
    "AI Engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "LLMs", "MLOps", "RAG", "Vector Databases", "Transformers", "CUDA", "Data Pipelines"],
    "Data Scientist": ["Python", "R", "Statistics", "Machine Learning", "Pandas", "NumPy", "Scikit-learn", "SQL", "Tableau", "A/B Testing", "Feature Engineering", "Jupyter"],
    "Frontend Developer": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind", "Next.js", "Redux", "GraphQL", "Webpack", "Jest", "Figma"],
    "Backend Developer": ["Node.js", "Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Docker", "Kubernetes", "REST APIs", "GraphQL", "Message Queues", "CI/CD"],
    "Full Stack Developer": ["React", "Node.js", "Python", "SQL", "MongoDB", "Docker", "TypeScript", "REST APIs", "AWS", "CI/CD", "Git", "System Design"],
    "DevOps Engineer": ["Docker", "Kubernetes", "Terraform", "AWS", "CI/CD", "Jenkins", "Ansible", "Linux", "Bash", "Monitoring", "Helm", "GitOps"],
    "Product Manager": ["Product Strategy", "Roadmapping", "User Research", "Agile", "JIRA", "A/B Testing", "SQL", "Analytics", "Stakeholder Management", "PRDs", "OKRs", "Figma"]
}


async def analyze_resume_with_grok(
    resume_text: str,
    target_role: Optional[str] = None,
    job_description: Optional[str] = None
) -> dict:
    role_context = f"\nTarget Role: {target_role}" if target_role else ""
    jd_context = f"\nJob Description:\n{job_description[:2000]}" if job_description else ""
    role_skills = ROLE_SKILLS.get(target_role, []) if target_role else []

    prompt = f"""
You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze this resume and return a comprehensive JSON analysis.

RESUME TEXT:
{resume_text[:4000]}
{role_context}
{jd_context}

Return ONLY valid JSON (no markdown, no explanation, no code fences) with this exact structure:
{{
  "ats_score": <number 0-100>,
  "readability_score": <number 0-100>,
  "structure_score": <number 0-100>,
  "keyword_score": <number 0-100>,
  "formatting_score": <number 0-100>,
  "match_percentage": <number 0-100, or null if no job description provided>,
  "sections_analysis": {{
    "summary": {{"score": <0-100>, "feedback": "<string>", "status": "<good|warning|poor>"}},
    "skills": {{"score": <0-100>, "feedback": "<string>", "status": "<good|warning|poor>"}},
    "experience": {{"score": <0-100>, "feedback": "<string>", "status": "<good|warning|poor>"}},
    "education": {{"score": <0-100>, "feedback": "<string>", "status": "<good|warning|poor>"}},
    "projects": {{"score": <0-100>, "feedback": "<string>", "status": "<good|warning|poor>"}}
  }},
  "missing_keywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "missing_skills": {json.dumps(role_skills[:5]) if role_skills else '["Skill1", "Skill2", "Skill3"]'},
  "recommended_skills": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
  "priority_skills": ["<most_important_skill1>", "<skill2>", "<skill3>"],
  "weak_areas": [
    {{"area": "<area_name>", "description": "<description>", "severity": "<high|medium|low>"}}
  ],
  "improvement_suggestions": [
    {{"category": "<category>", "suggestion": "<actionable suggestion>", "impact": "<high|medium|low>"}}
  ],
  "better_summary": "<rewritten professional summary in 3-4 sentences>",
  "better_skills_section": "<rewritten skills section as comma-separated list>",
  "ai_feedback": {{
    "overall": "<2-3 sentence overall assessment>",
    "strengths": ["<strength1>", "<strength2>", "<strength3>"],
    "quick_wins": ["<quick improvement 1>", "<quick improvement 2>", "<quick improvement 3>"]
  }}
}}

Guidelines:
- ATS score = weighted average of all component scores
- Be specific and actionable in suggestions
- Identify real missing skills for {target_role or 'the apparent target role'}
- Quick wins = changes that take less than 30 minutes
- Return ONLY the JSON object, nothing else
"""

    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROK_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are an expert resume analyzer. You always respond with valid JSON only, no markdown, no explanations."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 2000,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(GROK_API_URL, headers=headers, json=payload)
        response.raise_for_status()

    result = response.json()
    text = result["choices"][0]["message"]["content"].strip()

    # Strip markdown code fences if model wraps output anyway
    text = re.sub(r'^```(?:json)?\n?', '', text)
    text = re.sub(r'\n?```$', '', text)

    data = json.loads(text)

    # Fallback: compute ATS score if model didn't provide it
    if not data.get("ats_score"):
        scores = [
            data.get("readability_score", 70),
            data.get("structure_score", 70),
            data.get("keyword_score", 70),
            data.get("formatting_score", 70)
        ]
        data["ats_score"] = round(sum(scores) / len(scores), 1)

    return {
        "ats_score": data.get("ats_score"),
        "readability_score": data.get("readability_score"),
        "structure_score": data.get("structure_score"),
        "keyword_score": data.get("keyword_score"),
        "formatting_score": data.get("formatting_score"),
        "match_percentage": data.get("match_percentage"),
        "sections_analysis": data.get("sections_analysis"),
        "missing_keywords": data.get("missing_keywords", []),
        "missing_skills": data.get("missing_skills", []),
        "recommended_skills": data.get("recommended_skills", []),
        "priority_skills": data.get("priority_skills", []),
        "weak_areas": data.get("weak_areas", []),
        "improvement_suggestions": data.get("improvement_suggestions", []),
        "better_summary": data.get("better_summary"),
        "better_skills_section": data.get("better_skills_section"),
        "ai_feedback": data.get("ai_feedback")
    }
