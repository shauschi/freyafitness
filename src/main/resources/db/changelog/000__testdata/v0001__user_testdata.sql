INSERT INTO public.user
  (id, email, password, first_name, family_name)
VALUES
  -- password (bcrypt): 1234
  ('c4dc723c-6419-4aaf-ad25-bc8f5563fd54', 'heine@freya.fitness', '$2a$10$/lzTirA09.rweLEa5Axudu5k1qm19GjjXrQrKs2zkeWdFtFjcdxKu', 'Freya', 'Heine'),
  ('57dfbef2-3ab1-442b-b321-0b46233e54e7', 'stefan.h@uschildt.de', '$2a$10$/lzTirA09.rweLEa5Axudu5k1qm19GjjXrQrKs2zkeWdFtFjcdxKu', 'Stefan', 'Hauschildt'),
  ('5a34b89c-40f5-4ef8-b58f-543c2f8b5f13', 'viviane.h@uschildt.de', '$2a$10$/lzTirA09.rweLEa5Axudu5k1qm19GjjXrQrKs2zkeWdFtFjcdxKu', 'Viviane', 'Hauschildt');