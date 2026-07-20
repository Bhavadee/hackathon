CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text NOT NULL UNIQUE,
  description text NOT NULL, status text NOT NULL DEFAULT 'draft', freshness integer NOT NULL DEFAULT 100,
  source_version text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, role text NOT NULL,
  skills text[] NOT NULL, certifications text[] NOT NULL, hourly_rate integer NOT NULL,
  utilization integer NOT NULL DEFAULT 0, available_from date NOT NULL, profile_embedding vector(1536)
);
CREATE TABLE IF NOT EXISTS training_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer text NOT NULL, objective text NOT NULL,
  topic text NOT NULL, requested_date date NOT NULL, seats integer NOT NULL,
  price_per_seat numeric(10,2) NOT NULL, delivery_mode text NOT NULL, status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  content text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), agent text NOT NULL, status text NOT NULL,
  summary text NOT NULL, duration_ms integer NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_hnsw ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS trainers_profile_embedding_hnsw ON trainers USING hnsw (profile_embedding vector_cosine_ops);

INSERT INTO courses (title, slug, description, status, freshness, source_version, updated_at) VALUES
 ('SAFe DevOps Practitioner','safe-devops-practitioner','Build a continuous delivery pipeline and improve value flow.','review',74,'6.0.1',now()-interval '16 days'),
 ('ICAgile Foundations','icagile-foundations','Core agile mindset, values, principles, and team practices.','published',98,'2026.2',now()-interval '2 days'),
 ('GitLab CI/CD Essentials','gitlab-cicd-essentials','Design, secure, and operate production-ready GitLab pipelines.','published',91,'18.1',now()-interval '5 days')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO trainers (name,role,skills,certifications,hourly_rate,utilization,available_from)
SELECT * FROM (VALUES
 ('Maya Chen','Principal Agile Coach',ARRAY['SAFe','DevOps','Value Stream'],ARRAY['SAFe SPC','ICP-ACC'],185,72,CURRENT_DATE+3),
 ('Ravi Kumar','Senior Technical Trainer',ARRAY['GitLab','CI/CD','DevSecOps'],ARRAY['GitLab Certified Trainer'],160,64,CURRENT_DATE+1),
 ('Elena Torres','Enterprise Agility Lead',ARRAY['SAFe','Scrum','Leadership'],ARRAY['SAFe SPC','CST'],205,81,CURRENT_DATE+7),
 ('Jordan Blake','Platform Engineering Trainer',ARRAY['Cloud','Kubernetes','DevOps'],ARRAY['CKA','AWS SAP'],175,58,CURRENT_DATE+2),
 ('Aisha Rahman','Agile Delivery Consultant',ARRAY['Scrum','Kanban','Facilitation'],ARRAY['ICAgile ICP','PSM II'],155,49,CURRENT_DATE),
 ('Marcus Johnson','Platform Engineering Trainer',ARRAY['Platform Ops','AWS','DevOps'],ARRAY['AWS Solutions Architect','Terraform Associate'],190,83,CURRENT_DATE+8),
 ('Priya Nair','Release Management Specialist',ARRAY['Release Train','SAFe','Metrics'],ARRAY['SAFe RTE','Lean Portfolio'],170,76,CURRENT_DATE+2),
 ('Daniel Kim','Cloud Automation Coach',ARRAY['Azure','CI/CD','Scripting'],ARRAY['Azure Administrator','GitHub Actions'],165,54,CURRENT_DATE),
 ('Sofia Martinez','Enterprise Scrum Trainer',ARRAY['Scrum','Agile','Stakeholder Mgmt'],ARRAY['PSM I','ICAgile ICP-ATF'],150,67,CURRENT_DATE+4),
 ('Liam O''Connor','DevOps Transformation Lead',ARRAY['DevOps','Value Stream','Change Mgmt'],ARRAY['DevOps Institute','SAFe POPM'],210,88,CURRENT_DATE+9)
) AS seed(name,role,skills,certifications,hourly_rate,utilization,available_from)
WHERE NOT EXISTS (SELECT 1 FROM trainers);

INSERT INTO training_requests (customer,objective,topic,requested_date,seats,price_per_seat,delivery_mode,status)
SELECT * FROM (VALUES
 ('Northstar Financial','Prepare platform teams for SAFe DevOps adoption','SAFe DevOps',CURRENT_DATE+24,28,425.00,'Blended','agent review'),
 ('Acme Health','Standardize delivery teams on GitLab CI/CD','GitLab CI/CD',CURRENT_DATE+17,18,350.00,'Private cohort','trainer match'),
 ('Orbit Retail','Build agile foundations for new product hires','ICAgile',CURRENT_DATE+31,42,220.00,'Self-paced','ready')
) AS seed(customer,objective,topic,requested_date,seats,price_per_seat,delivery_mode,status)
WHERE NOT EXISTS (SELECT 1 FROM training_requests);

INSERT INTO agent_runs (agent,status,summary,duration_ms,created_at)
SELECT * FROM (VALUES
 ('Certification watchdog','attention','Detected a syllabus delta in SAFe DevOps 6.0.2',1840,now()-interval '18 minutes'),
 ('Trainer matching','complete','Ranked 3 qualified trainers for Acme Health',920,now()-interval '31 minutes'),
 ('Repository sync','complete','Branded and versioned 12 approved assets',3410,now()-interval '1 hour'),
 ('Profitability','complete','Recommended blended delivery for Northstar Financial',610,now()-interval '2 hours')
) AS seed(agent,status,summary,duration_ms,created_at)
WHERE NOT EXISTS (SELECT 1 FROM agent_runs);
