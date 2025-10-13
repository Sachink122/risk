"""
Configuration settings for the risk prediction model
"""
import os
from pathlib import Path
from typing import Dict, List, Any

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Model paths
MODEL_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

# Ensure directories exist
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Risk categories and their weights
RISK_CATEGORIES = {
    "financial": 0.25,
    "environmental": 0.20,
    "technical": 0.25,
    "operational": 0.20,
    "regulatory": 0.10
}

# Risk severity levels
RISK_SEVERITY = {
    "low": (0, 0.3),
    "medium": (0.3, 0.7),
    "high": (0.7, 1.0)
}

# Keywords for different risk categories
RISK_KEYWORDS = {
    "financial": [
        "budget", "cost", "expense", "funding", "finance", "investment", "money",
        "capital", "price", "financial", "economic", "revenue", "profit", "loss",
        "debt", "overrun", "estimation", "allocation", "shortage", "inflation"
    ],
    "environmental": [
        "environment", "ecology", "pollution", "emission", "waste", "discharge",
        "conservation", "biodiversity", "habitat", "climate", "sustainability",
        "contamination", "impact", "assessment", "mitigation", "compliance",
        "clearance", "green", "natural", "disaster"
    ],
    "technical": [
        "design", "specification", "technology", "engineering", "technical", 
        "architecture", "structure", "system", "infrastructure", "component",
        "integration", "interface", "compatibility", "functionality", "performance",
        "capacity", "requirement", "feasibility", "quality", "obsolescence"
    ],
    "operational": [
        "operation", "implementation", "execution", "maintenance", "schedule",
        "timeline", "deadline", "delay", "resource", "staff", "personnel", "skill",
        "experience", "coordination", "management", "stakeholder", "communication",
        "logistics", "supply", "chain"
    ],
    "regulatory": [
        "regulation", "compliance", "law", "legal", "legislation", "policy",
        "requirement", "approval", "permit", "license", "certification", "authority",
        "government", "restriction", "standard", "code", "statute", "governance",
        "regulatory", "violation"
    ]
}

# Model parameters
MODEL_PARAMS = {
    "text_classifier": {
        "max_length": 512,
        "batch_size": 16,
        "learning_rate": 2e-5,
        "epochs": 5
    },
    "risk_predictor": {
        "hidden_layers": [128, 64, 32],
        "dropout_rate": 0.2,
        "activation": "relu",
        "learning_rate": 0.001,
        "batch_size": 32,
        "epochs": 50
    }
}

# File types supported for DPR analysis
SUPPORTED_FILE_TYPES = [
    ".pdf", 
    ".docx", 
    ".xlsx", 
    ".txt"
]

# Maximum file size in MB
MAX_FILE_SIZE_MB = 50