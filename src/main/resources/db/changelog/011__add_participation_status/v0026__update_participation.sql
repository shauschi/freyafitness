UPDATE public.participation
SET participation_status = 'SIGNED_IN'
WHERE participation_status IS NULL;