-- Initialize Database for DPR-AI System

-- Create extension for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_reviewer BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create DPRs table
CREATE TABLE IF NOT EXISTS dprs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpr_id UUID REFERENCES dprs(id),
    evaluated_by UUID REFERENCES users(id),
    compliance_score FLOAT NOT NULL,
    compliance_details JSONB NOT NULL,
    extracted_sections JSONB NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create risk assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpr_id UUID REFERENCES dprs(id),
    evaluated_by UUID REFERENCES users(id),
    overall_risk_score FLOAT NOT NULL,
    risk_factors JSONB NOT NULL,
    risk_details JSONB NOT NULL,
    recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS dprs_uploaded_by_idx ON dprs(uploaded_by);
CREATE INDEX IF NOT EXISTS dprs_status_idx ON dprs(status);
CREATE INDEX IF NOT EXISTS evaluations_dpr_id_idx ON evaluations(dpr_id);
CREATE INDEX IF NOT EXISTS risk_assessments_dpr_id_idx ON risk_assessments(dpr_id);

-- Create admin user (password: admin123)
INSERT INTO users (email, full_name, hashed_password, is_admin, is_reviewer)
VALUES 
    ('admin@mdoner.gov.in', 'Admin User', '$2b$12$CcHIe8hKICHzK4QECZkuieyLAaVAUoLYQH4CDTH9Vj.7m.zTMC/GK', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Create reviewer user (password: reviewer123)
INSERT INTO users (email, full_name, hashed_password, is_admin, is_reviewer)
VALUES 
    ('reviewer@mdoner.gov.in', 'Reviewer User', '$2b$12$I8LMU92DstqOrJiUFbI1l.SeZCtYMQBGzJ0DHXm3w.3mYYjCuRcfm', FALSE, TRUE)
ON CONFLICT (email) DO NOTHING;
