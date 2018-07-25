INSERT INTO public.membership_type
  (id, key, name, description, max_participations, validity_days, validity_from, validity_to)
VALUES
  ('6777ebdb-adbc-44e3-9403-c00c30be837a', 'TRIAL', 'Probemitgliedschaft', 'Dies ist eine Probemitgliedschaft und vollkommen kostenlos und Verpflichtungen für dich. Mit der Probemitgliedschaft kannst du im Kursprogramm stöbern und dich für einen Kurs anmelden. Für alles weitere sprichst du dann mit Freya direkt.', 1, 30, '2018-01-01 00:00:00', '2099-12-31 23:59:59'),
  ('f07e9ea4-2585-4898-b543-bdc814c692ac', 'SUBSCRIPTION', 'Abo', 'Mit dem Abo kannst du an beliebig vielen Kursen teilnehmn.', -1, -1, '2018-01-01 00:00:00', '2099-12-31 23:59:59'),
  ('8738c48a-5540-4585-bab5-8d3b62f8b814', 'CARD_10', '10er-Karte', 'Mit dieser Karte kannst du an 10 Kursen teilnehmen.', 10, 180, '2018-01-01 00:00:00', '2099-12-31 23:59:59');