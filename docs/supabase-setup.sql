-- Schema pour l'application Africa Invest Capital

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Table des demandes de prêt
CREATE TABLE IF NOT EXISTS loan_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  purpose TEXT NOT NULL,
  description TEXT,
  duration_months INTEGER NOT NULL CHECK (duration_months > 0),
  monthly_income DECIMAL(15, 2) NOT NULL CHECK (monthly_income > 0),
  status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'en_cours', 'approuve', 'rejete')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  loan_id INTEGER REFERENCES loan_requests(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('identite', 'revenu', 'domicile', 'professionnel', 'autre')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des notes sur les demandes de prêt
CREATE TABLE IF NOT EXISTS loan_notes (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER REFERENCES loan_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;

$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_loan_requests_updated_at
BEFORE UPDATE ON loan_requests
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

-- Politiques de sécurité RLS (Row Level Security)

-- Activer RLS sur les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_notes ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent créer leur profil" ON profiles
FOR INSERT
TO anon
WITH CHECK (auth.uid() = id);

CREATE POLICY "Les administrateurs peuvent tout voir" ON profiles
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid() AND role = 'admin'
));

-- Politiques pour les demandes de prêt
CREATE POLICY "Les clients peuvent voir leurs propres demandes" ON loan_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Les clients peuvent créer des demandes" ON loan_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les administrateurs peuvent tout gérer pour les prêts" ON loan_requests
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid() AND role = 'admin'
));

-- Politiques pour les documents
CREATE POLICY "Les utilisateurs peuvent voir leurs propres documents" ON documents
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent ajouter leurs propres documents" ON documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres documents" ON documents
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Les administrateurs peuvent tout gérer pour les documents" ON documents
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid() AND role = 'admin'
));

-- Politiques pour les notes
CREATE POLICY "Les utilisateurs peuvent voir les notes de leurs propres prêts" ON loan_notes
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM loan_requests
  WHERE loan_requests.id = loan_notes.loan_id AND loan_requests.user_id = auth.uid()
));

CREATE POLICY "Les utilisateurs peuvent ajouter des notes à leurs propres prêts" ON loan_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les administrateurs peuvent tout gérer pour les notes" ON loan_notes
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid() AND role = 'admin'
));

-- Créer des utilisateurs de test

-- Administrateur
INSERT INTO auth.users (id, email, encrypted_password) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@africainvestcapital.com', '$2a$10$5M9tn7hJ0yZO9..IEimQsuSeBrTZU6LdcxnS5XaA0O4ok4N4pqHkm');

INSERT INTO profiles (id, email, first_name, last_name, phone, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@africainvestcapital.com', 'Admin', 'Principal', '+225 07 12 34 56', 'admin');

-- Client de test
INSERT INTO auth.users (id, email, encrypted_password)
VALUES ('00000000-0000-0000-0000-000000000002', 'client@example.com', '$2a$10$5M9tn7hJ0yZO9..IEimQsuSeBrTZU6LdcxnS5XaA0O4ok4N4pqHkm');

INSERT INTO profiles (id, email, first_name, last_name, phone, role)
VALUES ('00000000-0000-0000-0000-000000000002', 'client@example.com', 'Jean', 'Dupont', '+225 07 98 76 54', 'client');

-- Créer un bucket de stockage pour les uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', TRUE);

-- Créer des politiques pour le bucket de stockage
CREATE POLICY "Les utilisateurs authentifiés peuvent télécharger des fichiers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads' AND (auth.uid())::text = (SPLIT_PART(name, '/', 1)));

CREATE POLICY "Les utilisateurs peuvent accéder à leurs propres fichiers"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'uploads' AND (auth.uid())::text = (SPLIT_PART(name, '/', 1)));

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres fichiers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads' AND (auth.uid())::text = (SPLIT_PART(name, '/', 1)));

CREATE POLICY "Les administrateurs ont accès à tous les fichiers"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'uploads' AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Les fichiers dans le bucket uploads sont accessibles publiquement"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'uploads');