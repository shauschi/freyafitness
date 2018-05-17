INSERT INTO public.course_type
  (id, name, description, color, validity_from, validity_to)
VALUES
  ('cb4a6865-ecb3-44d7-a3c7-9dd8f9b52337', 'Sanfter Kurs', 'Für alle Altersklassen und Fitnesslevel ist dies der ideale Einstieg.', '#69F0AE', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  ('e241c0a0-b354-4f42-803d-e8f2e01496fd', 'Normaler Kurs', 'Für Fortgeschrittene perfekt.', '#448AFF', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  ('6081833b-45de-4554-988d-1fbcd1222e5c', 'Harter Kurs', 'Harte Kurse gibt es gar nicht. Wem der normale Kurs zu leicht war, der hat sich nur nicht richtig angestrengt.', '#FF5252', '2018-01-01 00:00:00', '9999-12-31 23:59:59');

UPDATE public.course
SET course_type_id = cast(CASE
    WHEN type = 'SOFT'   THEN 'cb4a6865-ecb3-44d7-a3c7-9dd8f9b52337'
    WHEN type = 'NORMAL' THEN 'e241c0a0-b354-4f42-803d-e8f2e01496fd'
    WHEN type = 'HARD'   THEN '6081833b-45de-4554-988d-1fbcd1222e5c'
    ELSE 'cb4a6865-ecb3-44d7-a3c7-9dd8f9b52337'
  END as uuid)
WHERE type in ('SOFT', 'NORMAL', 'HARD');