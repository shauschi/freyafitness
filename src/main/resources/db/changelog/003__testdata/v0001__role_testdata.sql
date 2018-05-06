INSERT INTO public.role
  (id, authority, description, validity_from, validity_to)
VALUES
  ('3c08efbe-b7a2-4bdb-961b-1f0b3bf937b5', 'ADMIN', 'admin users with full rights in application', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  ('b43ae7a2-7894-4d65-8832-3035e6d5a8f0', 'TRAINER', 'trainers can e.g. create and organize courses', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  ('9477e9bd-52ab-4fe5-b228-5eeed2ceeb5a', 'USER', 'any other user of the application', '2018-01-01 00:00:00', '9999-12-31 23:59:59');
