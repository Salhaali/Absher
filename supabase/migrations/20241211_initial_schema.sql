-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    national_id VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('ذكر', 'أنثى')),
    role VARCHAR(20) DEFAULT 'عضو' CHECK (role IN ('أب', 'أم', 'ابن', 'ابنة', 'عضو')),
    family_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_family_id ON users(family_id);

-- Create families table
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    region VARCHAR(50),
    main_contact_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for families table
CREATE INDEX idx_families_main_contact ON families(main_contact_user_id);

-- Create family_members table
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL,
    user_id UUID NOT NULL,
    relation_type VARCHAR(20) CHECK (relation_type IN ('أب', 'أم', 'ابن', 'ابنة', 'أخ', 'أخت')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- Create indexes for family_members table
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Allow anonymous users to create accounts
CREATE POLICY "إنشاء حساب جديد" ON users
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read their own data
CREATE POLICY "قراءة البيانات الشخصية" ON users
    FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to update their own data
CREATE POLICY "تحديث البيانات الشخصية" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Families table policies
-- Allow family members to read family data
CREATE POLICY "قراءة بيانات العائلة" ON families
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = families.id 
            AND family_members.user_id = auth.uid()
        )
    );

-- Allow family admin to update family data
CREATE POLICY "تحديث بيانات العائلة" ON families
    FOR UPDATE USING (main_contact_user_id = auth.uid());

-- Family_members table policies
-- Allow family members to read their family members
CREATE POLICY "قراءة أفراد العائلة" ON family_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = family_members.family_id 
            AND fm.user_id = auth.uid()
        )
    );

-- Allow family admin to add new members
CREATE POLICY "إضافة أفراد جدد" ON family_members
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM families 
            WHERE families.id = family_id 
            AND families.main_contact_user_id = auth.uid()
        )
    );

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON users TO anon;
GRANT INSERT ON users TO anon;
GRANT SELECT ON users TO authenticated;
GRANT UPDATE ON users TO authenticated;

GRANT SELECT ON families TO anon;
GRANT SELECT ON families TO authenticated;
GRANT UPDATE ON families TO authenticated;

GRANT SELECT ON family_members TO anon;
GRANT SELECT ON family_members TO authenticated;
GRANT INSERT ON family_members TO authenticated;