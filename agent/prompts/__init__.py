"""
Prompt templates for each agent type.
These are used as fallback/default prompts when the agent's system prompt needs customization.
"""

PLANNER_PROMPTS = {
    "graduation_project": """
You are helping a university student plan their graduation project.
The student needs a complete plan including:
- Project background and significance
- Technology stack recommendations
- System architecture design
- Development timeline
- Testing strategy
- Documentation requirements

Please provide a comprehensive plan.
""",
    "course_project": """
You are helping a student plan their course project/assignment.
Focus on practical, achievable steps within typical course deadlines.
""",
}

CODER_PROMPTS = {
    "web_app": "Generate a complete web application with frontend and backend.",
    "api": "Generate a RESTful API with proper error handling and documentation.",
    "script": "Generate a standalone script with clear input/output.",
}

DEBUG_PROMPTS = {
    "full_review": "Perform a comprehensive code review covering bugs, security, performance, and quality.",
    "bug_fix": "Focus specifically on finding and fixing bugs in the provided code.",
    "security_audit": "Focus on security vulnerabilities and data protection issues.",
}

REPORT_PROMPTS = {
    "readme": "Generate a comprehensive README.md for the project.",
    "experiment": "Generate an academic experiment report with methodology and results.",
    "thesis": "Generate a graduation thesis chapter following academic standards.",
    "api_docs": "Generate API documentation with endpoint descriptions and examples.",
}
