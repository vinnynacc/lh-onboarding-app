-- Import Tasks from Excel File
-- Lending Heights Mortgage Onboarding System
-- Based on Master (Onboarding Checklist) (1) copy.xlsx

-- =====================================================
-- TASK 1: Send Application for Employment
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'Send Application for Employment',
  'Offer Extended',
  'Medium',
  'Vinny Naccarelli',
  NULL,
  1
);

-- =====================================================
-- TASK 2: Send Offer of Employment
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a2222222-2222-2222-2222-222222222222',
  'Send Offer of Employment',
  'Offer Extended',
  'Medium',
  'Jason Cecco',
  NULL,
  2
);

-- =====================================================
-- TASK 3: Task Kristen to Setup ADP
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a3333333-3333-3333-3333-333333333333',
  'Task Kristen to Setup ADP',
  '🎯 Due First Week',
  'Medium',
  'Vinny Naccarelli, Jason Cecco',
  NULL,
  3
);

-- =====================================================
-- TASK 4: Onboarding Marketing Meeting
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a4444444-4444-4444-4444-444444444444',
  'Onboarding Marketing Meeting',
  '🎯 Due First Week',
  'Medium',
  'Vinny Naccarelli',
  'Meet with marketing team to set up your marketing materials and campaigns',
  4
);

-- Checklist items for Task 4
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('a4444444-4444-4444-4444-444444444444', 'Brand360 Platform Walkthrough', 1),
  ('a4444444-4444-4444-4444-444444444444', 'Review BONZO campaigns', 2),
  ('a4444444-4444-4444-4444-444444444444', 'Review Business Card Designs', 3),
  ('a4444444-4444-4444-4444-444444444444', 'Upload Past Client List', 4),
  ('a4444444-4444-4444-4444-444444444444', 'Setup Blinq Email Signature', 5),
  ('a4444444-4444-4444-4444-444444444444', 'Upload biz contacts to ARIVE', 6);

-- =====================================================
-- TASK 5: Marketing Checklist
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a5555555-5555-5555-5555-555555555555',
  'Marketing Checklist',
  '🎯 Due First Week',
  'Medium',
  'Vinny Naccarelli',
  'Complete marketing onboarding checklist items',
  5
);

-- Checklist items for Task 5
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('a5555555-5555-5555-5555-555555555555', 'Add to website', 1),
  ('a5555555-5555-5555-5555-555555555555', 'Post social media announcement', 2),
  ('a5555555-5555-5555-5555-555555555555', 'Add to Teammate Directory in Notion', 3),
  ('a5555555-5555-5555-5555-555555555555', 'Create & send welcome home deck', 4),
  ('a5555555-5555-5555-5555-555555555555', 'Create & upload Pre-Approval package', 5),
  ('a5555555-5555-5555-5555-555555555555', 'Tag with TEAM in Bonzo', 6);

-- =====================================================
-- TASK 6: Transition
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a6666666-6666-6666-6666-666666666666',
  'Transition',
  '🎯 Due First Week',
  'Medium',
  'Jason Cecco',
  'Complete transition tasks for onboarding',
  6
);

-- Checklist items for Task 6
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('a6666666-6666-6666-6666-666666666666', 'Confirm Background Check Complete', 1),
  ('a6666666-6666-6666-6666-666666666666', 'Email Joe for Benefit Setup', 2),
  ('a6666666-6666-6666-6666-666666666666', 'Confirm NMLS Transfer', 3),
  ('a6666666-6666-6666-6666-666666666666', 'Setup Keyfob', 4);

-- =====================================================
-- TASK 7: Team Culture
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a7777777-7777-7777-7777-777777777777',
  'Team Culture',
  '🎯 Due First Week',
  'Medium',
  'Jason Cecco',
  'Introduction to Lending Heights team culture and expectations',
  7
);

-- Checklist items for Task 7
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('a7777777-7777-7777-7777-777777777777', 'Review ADP', 1),
  ('a7777777-7777-7777-7777-777777777777', 'Setup Goals with Jason and Team Lead', 2),
  ('a7777777-7777-7777-7777-777777777777', 'Review Expense Tracking', 3),
  ('a7777777-7777-7777-7777-777777777777', 'Schedule 30/60/90 Day Meetings', 4);

-- =====================================================
-- TASK 8: Onboarding Docs & Forms
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a8888888-8888-8888-8888-888888888888',
  'Onboarding Docs & Forms',
  'Application Signed',
  'Medium',
  'Vinny Naccarelli',
  'June 2025 Update: Application for Employment triggers onboarding flow in Jotform',
  8
);

-- Checklist items for Task 8
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('a8888888-8888-8888-8888-888888888888', 'W4, Direct Deposit, i9 sign doc', 1),
  ('a8888888-8888-8888-8888-888888888888', 'Send Offer of Employment', 2),
  ('a8888888-8888-8888-8888-888888888888', 'Send Compensation Terms to JC & New Teammate', 3),
  ('a8888888-8888-8888-8888-888888888888', 'MLO/Non-Sales/Branch Agreement sign doc', 4),
  ('a8888888-8888-8888-8888-888888888888', 'New Teammate Onboarding Form', 5),
  ('a8888888-8888-8888-8888-888888888888', 'PA residency cert sign doc', 6),
  ('a8888888-8888-8888-8888-888888888888', 'Receipt & return of company property sign doc', 7);

-- =====================================================
-- TASK 9: IMPORTANT DATES
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'a9999999-9999-9999-9999-999999999999',
  'IMPORTANT DATES',
  'Application Signed',
  'Medium',
  'Vinny Naccarelli',
  'Employment date when they finish signing everything. Start date is when they actually begin doing their duties/job.',
  9
);

-- Checklist items for Task 9
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('a9999999-9999-9999-9999-999999999999', 'Start Date', 1),
  ('a9999999-9999-9999-9999-999999999999', 'Employment Date', 2);

-- =====================================================
-- TASK 10: New User Equipment & Credentials Setup
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'New User Equipment & Credentials Setup',
  'Application Signed',
  'Medium',
  'Vinny Naccarelli',
  'Set up new employee with necessary equipment and system access',
  10
);

-- Checklist items for Task 10
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Request SafSecur create new seat in Office 365', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'New Teammate Onboarding Email to Matt (auto sent upon form completion)', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Laptop setup', 3);

-- =====================================================
-- TASK 11: Legal
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Legal',
  'Application Signed',
  'Medium',
  'Jason Cecco',
  'Complete legal requirements and documentation. Timeline: 1 week before start',
  11
);

-- Checklist items for Task 11
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Fill out Compensation Terms', 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Initiate NMLS Transfer', 2),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Background Check', 3),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Continuing education needed?', 4);

-- =====================================================
-- TASK 12: Confirm Onboarding Docs are Signed and Filed
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Confirm Onboarding Docs are Signed and Filed',
  '💡 Due before Start Date',
  'Medium',
  'Vinny Naccarelli',
  'Confirm all onboarding docs are signed & filed in employee folder',
  12
);

-- Checklist items for Task 12
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'W4, i9, Direct Deposit', 1),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Residency Certification', 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Application for Employment', 3),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MLO/ Non-Sales/ BM Agreement', 4),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Receipt & Return of Company Property', 5),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'New Teammate Onboarding Form', 6);

-- =====================================================
-- TASK 13: Technology
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Technology',
  '💡 Due before Start Date',
  'Medium',
  'Matt Pfrommer',
  'Set up technology accounts and systems for new employee',
  13
);

-- Checklist items for Task 13
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Add to UWM', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Add to AllCompany Distribution List and team distribution', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Create Advantage Credit Login', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Add to Margin, Employee, Pricing Calculator, Payroll, and NLLB Spreadsheets', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'LenderPrice Login', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Create ARIVE Login', 6),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Setup Ring Central', 7),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Send email to setup meetings with department managers', 8);

-- =====================================================
-- TASK 14: 90 Day Plan
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '90 Day Plan',
  '💡 Due before Start Date',
  'Medium',
  NULL,
  'Establish 90-day onboarding plan and expectations',
  14
);

-- Checklist items for Task 14
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Review LO Scorecard', 1),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Review Submission Checklist', 2),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Add to weekly team meeting', 3),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Schedule weekly 1-on-1 meeting (15mins) for 1st 90 days', 4),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Review COC', 5),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ARIVE Training', 6),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Review expenses (if applicable)', 7),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Call with Omar/UWM and Lead', 8);

-- =====================================================
-- TASK 15: Schedule 30 day check in for Dept Leaders
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Schedule 30 day check in for Dept Leaders',
  '🎉 30 Days In',
  'Medium',
  'Matt Pfrommer',
  'Schedule 30-day check-in meetings with department leaders',
  15
);

-- Checklist items for Task 15
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Robyn Stikkel (Lock & Disclosure Desk)', 1),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Tori Quintana (Processing)', 2),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Vinny Naccarelli (Marketing)', 3),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Dana Prill (Closing)', 4),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Erica Brent (Appraisal Desk)', 5),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Matt Pfrommer (General)', 6);

-- =====================================================
-- TASK 16: Schedule 60 day check in for Dept Leaders
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  '10101010-1010-1010-1010-101010101010',
  'Schedule 60 day check in for Dept Leaders',
  '🤝 60 Day Update',
  'Medium',
  'Matt Pfrommer',
  'Schedule 60-day check-in meetings with department leaders',
  16
);

-- Checklist items for Task 16
INSERT INTO public.checklist_items (task_id, item_text, order_index) VALUES
  ('10101010-1010-1010-1010-101010101010', 'Robyn Stikkel (Lock & Disclosure Desk)', 1),
  ('10101010-1010-1010-1010-101010101010', 'Tori Quintana (Processing)', 2),
  ('10101010-1010-1010-1010-101010101010', 'Vinny Naccarelli (Marketing)', 3),
  ('10101010-1010-1010-1010-101010101010', 'Dana Prill (Closing)', 4),
  ('10101010-1010-1010-1010-101010101010', 'Erica Brent (Appraisal Desk)', 5),
  ('10101010-1010-1010-1010-101010101010', 'Matt Pfrommer (General)', 6);

-- =====================================================
-- TASK 17: Ask employee for onboarding feedback
-- =====================================================
INSERT INTO public.tasks (id, task_name, bucket_name, priority, assigned_to, description, order_index)
VALUES (
  '11111111-1111-1111-1111-111111111112',
  'Ask employee for onboarding feedback',
  '💹 90 Day Update',
  'Medium',
  'Vinny Naccarelli',
  'Gather feedback from the new employee about their onboarding experience to improve future processes',
  17
);

-- Verify import
SELECT 
  bucket_name,
  COUNT(*) as task_count
FROM public.tasks
GROUP BY bucket_name
ORDER BY 
  CASE bucket_name
    WHEN 'Offer Extended' THEN 1
    WHEN '🎯 Due First Week' THEN 2
    WHEN 'Application Signed' THEN 3
    WHEN '💡 Due before Start Date' THEN 4
    WHEN '🎉 30 Days In' THEN 5
    WHEN '🤝 60 Day Update' THEN 6
    WHEN '💹 90 Day Update' THEN 7
  END;

-- Show total checklist items
SELECT COUNT(*) as total_checklist_items FROM public.checklist_items;
