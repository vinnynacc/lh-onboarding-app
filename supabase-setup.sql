-- Lending Heights Mortgage Onboarding System
-- Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================
-- Note: Supabase handles the auth.users table automatically
-- We'll create a profiles table that extends it

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('full_admin', 'dept_admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TASKS
-- =====================================================
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_name TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  assigned_to TEXT,
  created_by UUID REFERENCES public.profiles(id),
  description TEXT,
  due_date DATE,
  start_date DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CHECKLIST ITEMS
-- =====================================================
CREATE TABLE public.checklist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TASK PROGRESS (User-specific completion tracking)
-- =====================================================
CREATE TABLE public.task_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.profiles(id),
  UNIQUE(task_id, user_id)
);

-- =====================================================
-- CHECKLIST ITEM PROGRESS
-- =====================================================
CREATE TABLE public.checklist_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  checklist_item_id UUID REFERENCES public.checklist_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(checklist_item_id, user_id)
);

-- =====================================================
-- TASK ASSIGNMENTS (Which users are assigned which tasks)
-- =====================================================
CREATE TABLE public.task_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ACTIVITY LOG
-- =====================================================
CREATE TABLE public.activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_tasks_bucket ON public.tasks(bucket_name);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_task_progress_user ON public.task_progress(user_id);
CREATE INDEX idx_task_progress_completed ON public.task_progress(completed);
CREATE INDEX idx_task_assignments_user ON public.task_assignments(user_id);
CREATE INDEX idx_task_assignments_task ON public.task_assignments(task_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created ON public.activity_log(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Tasks: Full admins can do everything, dept admins can read, users can read assigned tasks
CREATE POLICY "Full admins have full access to tasks" 
  ON public.tasks FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'full_admin'
    )
  );

CREATE POLICY "Dept admins can view all tasks" 
  ON public.tasks FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('dept_admin', 'full_admin')
    )
  );

CREATE POLICY "Users can view their assigned tasks" 
  ON public.tasks FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.task_assignments 
      WHERE task_assignments.task_id = tasks.id 
      AND task_assignments.user_id = auth.uid()
    )
  );

-- Checklist Items: Same permissions as tasks
CREATE POLICY "Full admins manage checklist items" 
  ON public.checklist_items FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'full_admin'
    )
  );

CREATE POLICY "All authenticated users can view checklist items" 
  ON public.checklist_items FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Task Progress: Users can manage their own progress
CREATE POLICY "Users manage their own task progress" 
  ON public.task_progress FOR ALL 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress" 
  ON public.task_progress FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('full_admin', 'dept_admin')
    )
  );

-- Checklist Progress: Same as task progress
CREATE POLICY "Users manage their own checklist progress" 
  ON public.checklist_progress FOR ALL 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all checklist progress" 
  ON public.checklist_progress FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('full_admin', 'dept_admin')
    )
  );

-- Task Assignments: Admins manage, users can view their own
CREATE POLICY "Admins manage task assignments" 
  ON public.task_assignments FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('full_admin', 'dept_admin')
    )
  );

CREATE POLICY "Users can view their assignments" 
  ON public.task_assignments FOR SELECT 
  USING (user_id = auth.uid());

-- Notifications: Users see only their own
CREATE POLICY "Users manage their own notifications" 
  ON public.notifications FOR ALL 
  USING (user_id = auth.uid());

-- Activity Log: All can insert, admins can view all, users see their own
CREATE POLICY "Anyone can create activity logs" 
  ON public.activity_log FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all activity" 
  ON public.activity_log FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('full_admin', 'dept_admin')
    )
  );

CREATE POLICY "Users can view their own activity" 
  ON public.activity_log FOR SELECT 
  USING (user_id = auth.uid());

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for tasks
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'vnaccarelli@lhloans.com' THEN 'full_admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (p_user_id, p_title, p_message, p_type, p_link)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, details)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS for Easy Querying
-- =====================================================

-- View: Tasks with completion statistics
CREATE OR REPLACE VIEW task_stats AS
SELECT 
  t.id,
  t.task_name,
  t.bucket_name,
  t.priority,
  t.assigned_to,
  COUNT(DISTINCT ta.user_id) as assigned_users,
  COUNT(DISTINCT CASE WHEN tp.completed THEN tp.user_id END) as completed_users,
  COUNT(DISTINCT ci.id) as total_checklist_items,
  (SELECT COUNT(*) FROM public.checklist_items WHERE task_id = t.id) as checklist_count
FROM public.tasks t
LEFT JOIN public.task_assignments ta ON ta.task_id = t.id
LEFT JOIN public.task_progress tp ON tp.task_id = t.id
LEFT JOIN public.checklist_items ci ON ci.task_id = t.id
GROUP BY t.id, t.task_name, t.bucket_name, t.priority, t.assigned_to;

-- View: User progress overview
CREATE OR REPLACE VIEW user_progress AS
SELECT 
  p.id as user_id,
  p.full_name,
  p.email,
  p.role,
  COUNT(DISTINCT ta.task_id) as assigned_tasks,
  COUNT(DISTINCT CASE WHEN tp.completed THEN tp.task_id END) as completed_tasks,
  ROUND(
    CASE 
      WHEN COUNT(DISTINCT ta.task_id) > 0 
      THEN (COUNT(DISTINCT CASE WHEN tp.completed THEN tp.task_id END)::NUMERIC / COUNT(DISTINCT ta.task_id)::NUMERIC) * 100 
      ELSE 0 
    END, 
    2
  ) as completion_percentage
FROM public.profiles p
LEFT JOIN public.task_assignments ta ON ta.user_id = p.id
LEFT JOIN public.task_progress tp ON tp.task_id = ta.task_id AND tp.user_id = p.id
WHERE p.role = 'user'
GROUP BY p.id, p.full_name, p.email, p.role;

-- =====================================================
-- INITIAL DATA - First Admin Account
-- =====================================================
-- Note: This will be executed after Vinny signs up via the auth system
-- The trigger will automatically set role to 'full_admin' for vnaccarelli@lhloans.com

COMMENT ON DATABASE postgres IS 'Lending Heights Mortgage - Employee Onboarding System';
