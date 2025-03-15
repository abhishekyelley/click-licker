drop policy if exists "allow all to select" on "public"."links";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_url_by_id(link_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
declare
  result_url text;
begin
  -- Select the URL from the links table where the id matches
  select url into result_url
  from public.links
  where id = link_id
  limit 1;

  -- Return the result
  return result_url;
end;
$$
;