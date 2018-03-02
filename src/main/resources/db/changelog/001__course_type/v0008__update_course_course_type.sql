INSERT INTO public.course_type
  (id, name, description, color, validity_from, validity_to)
VALUES
  (1000, 'Sanfter Kurs', 'Für alle Altersklassen und Fitnesslevel ist dies der ideale Einstieg.', '#69F0AE', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  (1001, 'Normaler Kurs', 'Für Fortgeschrittene perfekt.', '#448AFF', '2018-01-01 00:00:00', '9999-12-31 23:59:59'),
  (1002, 'Harter Kurs', 'Harte Kurse gibt es gar nicht. Wem der normale Kurs zu leicht war, der hat sich nur nicht richtig angestrengt.', '#FF5252', '2018-01-01 00:00:00', '9999-12-31 23:59:59');

UPDATE public.course
SET course_type_id = CASE
    WHEN type = 'SOFT' THEN 1000
    WHEN type = 'NORMAL' THEN 1001
    WHEN type = 'HARD' THEN 1002
    ELSE 1000
  END
WHERE type in ('SOFT', 'NORMAL', 'HARD');