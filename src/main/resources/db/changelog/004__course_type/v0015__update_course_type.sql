
UPDATE public.course_type
  SET name = 'FUN.BASE',
      description = 'Der Einstieg. Die Grundlage des funktionalen Trainings',
      color = '#03A9F4'
  WHERE id = 'cb4a6865-ecb3-44d7-a3c7-9dd8f9b52337';

UPDATE public.course_type
  SET name = 'FUN.POWER',
      description = 'Das volle Programm. Immer neue Herausforderungen. Schweißtreibend!',
      color = '#FF9800'
  WHERE id = 'e241c0a0-b354-4f42-803d-e8f2e01496fd';

UPDATE public.course_type
  SET name = 'KRAFT & TECHNIK',
      description = 'Man lernt nie aus. Techniktraining und Gewichte steigern.',
      color = '#FF5722'
  WHERE id = '6081833b-45de-4554-988d-1fbcd1222e5c';

INSERT INTO public.course_type
  (id, name, description, color, validity_from, validity_to)
VALUES
  ('893ba701-faf5-48ec-b90c-a377d1454545', 'FUN.TEAM', 'Teamwork. Wir nutzen die Grundübungen und arbeiten uns gemeinsam ans Ziel.', '#2196F3', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  ('a5a780e4-3e7c-4336-af34-6c75003414f9', 'FIT MOMS', 'Mutter & Kind Zeit. Nach der Rückbildungsgymnastik mit dem Kind gemeinsam fit werden.', '#673AB7', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  ('eca460fe-e5e2-44ef-bb67-f3c2e153d078', 'MÄNNERABEND', 'Krafttraining. Technik erlernen und gemeinsam Gewichte bewegen.', '#448AFF', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  ('2c6859b7-32f5-4e14-b382-a693eaf9d773', 'BEST AGERS(65+)', 'Da geht noch was. Funktionelles Training, egal in welchem Alter.', '#FFC107', '2018-01-01 00:00:00', '9999-12-31 23:59:59');
