"""
Feature extraction module for risk prediction
"""
import os
import re
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional, Union
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
import joblib

class FeatureExtractor:
    """
    Class for extracting features from processed DPR documents for risk analysis.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the feature extractor.
        
        Args:
            config: Configuration dictionary with feature extraction parameters
        """
        self.config = config
        self.tfidf_vectorizer = None
        self.svd_transformer = None
    
    def fit_vectorizers(self, documents: List[Dict[str, Any]]) -> None:
        """
        Fit TF-IDF vectorizer and SVD transformer on document text.
        
        Args:
            documents: List of processed documents
        """
        # Collect all section texts for fitting
        all_texts = []
        for doc in documents:
            for section_name, section_text in doc['sections'].items():
                all_texts.append(section_text)
        
        if not all_texts:
            raise ValueError("No text content available to fit vectorizers")
        
        # Fit TF-IDF vectorizer
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=1000,
            min_df=2,
            max_df=0.85,
            ngram_range=(1, 2)
        )
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(all_texts)
        
        # Fit SVD transformer for dimensionality reduction
        self.svd_transformer = TruncatedSVD(n_components=100)
        self.svd_transformer.fit(tfidf_matrix)
    
    def save_vectorizers(self, output_dir: str) -> None:
        """
        Save fitted vectorizers to disk.
        
        Args:
            output_dir: Directory to save vectorizers
        """
        os.makedirs(output_dir, exist_ok=True)
        
        tfidf_path = os.path.join(output_dir, "tfidf_vectorizer.joblib")
        svd_path = os.path.join(output_dir, "svd_transformer.joblib")
        
        joblib.dump(self.tfidf_vectorizer, tfidf_path)
        joblib.dump(self.svd_transformer, svd_path)
    
    def load_vectorizers(self, input_dir: str) -> None:
        """
        Load fitted vectorizers from disk.
        
        Args:
            input_dir: Directory containing saved vectorizers
        """
        tfidf_path = os.path.join(input_dir, "tfidf_vectorizer.joblib")
        svd_path = os.path.join(input_dir, "svd_transformer.joblib")
        
        if not os.path.exists(tfidf_path) or not os.path.exists(svd_path):
            raise FileNotFoundError(f"Vectorizer files not found in {input_dir}")
        
        self.tfidf_vectorizer = joblib.load(tfidf_path)
        self.svd_transformer = joblib.load(svd_path)
    
    def extract_text_features(self, text: str) -> np.ndarray:
        """
        Extract text features using TF-IDF and SVD.
        
        Args:
            text: Text to extract features from
            
        Returns:
            NumPy array of features
        """
        if not self.tfidf_vectorizer or not self.svd_transformer:
            raise ValueError("Vectorizers are not fitted or loaded")
        
        # Transform text using TF-IDF and SVD
        tfidf_features = self.tfidf_vectorizer.transform([text])
        svd_features = self.svd_transformer.transform(tfidf_features)
        
        return svd_features.flatten()
    
    def extract_numerical_features(self, document: Dict[str, Any]) -> np.ndarray:
        """
        Extract numerical features from document metadata.
        
        Args:
            document: Processed document dictionary
            
        Returns:
            NumPy array of features
        """
        # Extract basic numerical features
        file_size_mb = document.get('file_size_mb', 0)
        document_length = document.get('document_length', 0)
        
        # Count sections
        num_sections = len(document.get('sections', {}))
        
        # Calculate average section length
        section_lengths = [len(section) for section in document.get('sections', {}).values()]
        avg_section_length = np.mean(section_lengths) if section_lengths else 0
        
        numerical_features = np.array([
            file_size_mb,
            document_length,
            num_sections,
            avg_section_length
        ])
        
        return numerical_features
    
    def extract_risk_features(self, document: Dict[str, Any]) -> np.ndarray:
        """
        Extract risk indicator features from the document.
        
        Args:
            document: Processed document dictionary
            
        Returns:
            NumPy array of features
        """
        # Overall risk indicators
        risk_indicators = document.get('risk_indicators', {})
        
        # Extract values for each risk category
        risk_features = []
        for category in self.config["RISK_CATEGORIES"].keys():
            risk_features.append(risk_indicators.get(category, 0.0))
        
        # Section-specific risk indicators
        section_risk = document.get('section_risk_indicators', {})
        
        # Extract section-specific risk values
        for section_name, section_risks in section_risk.items():
            for category in self.config["RISK_CATEGORIES"].keys():
                risk_features.append(section_risks.get(category, 0.0))
        
        return np.array(risk_features)
    
    def extract_features(self, document: Dict[str, Any]) -> np.ndarray:
        """
        Extract all features from a processed document.
        
        Args:
            document: Processed document dictionary
            
        Returns:
            NumPy array of all features
        """
        # Concatenate all text sections
        all_text = " ".join(document.get('sections', {}).values())
        
        # Extract different feature types
        text_features = self.extract_text_features(all_text)
        numerical_features = self.extract_numerical_features(document)
        risk_features = self.extract_risk_features(document)
        
        # Combine all features
        all_features = np.concatenate([
            text_features, 
            numerical_features, 
            risk_features
        ])
        
        return all_features
    
    def create_feature_dataframe(self, documents: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Create a DataFrame with features for multiple documents.
        
        Args:
            documents: List of processed documents
            
        Returns:
            Pandas DataFrame with features for each document
        """
        all_features = []
        file_names = []
        
        for document in documents:
            features = self.extract_features(document)
            all_features.append(features)
            file_names.append(document.get('file_name', 'unknown'))
        
        # Create feature column names
        text_feature_cols = [f"text_feat_{i}" for i in range(100)]
        numerical_feature_cols = ["file_size_mb", "doc_length", "num_sections", "avg_section_length"]
        risk_feature_cols = []
        
        # Overall risk feature names
        for category in self.config["RISK_CATEGORIES"].keys():
            risk_feature_cols.append(f"risk_{category}")
        
        # Section risk feature names
        for section in ["executive_summary", "project_description", "budget_estimation", 
                         "technical_specifications", "implementation_plan", "environmental_impact", 
                         "risk_assessment"]:
            for category in self.config["RISK_CATEGORIES"].keys():
                risk_feature_cols.append(f"risk_{section}_{category}")
        
        # Combine all column names
        all_columns = text_feature_cols + numerical_feature_cols + risk_feature_cols
        
        # Create DataFrame
        feature_df = pd.DataFrame(all_features, columns=all_columns)
        feature_df.insert(0, "file_name", file_names)
        
        return feature_df