create or replace function sync_user_projects(
    p_user_id uuid,
    p_payload jsonb
)
returns void
language plpgsql
security definer -- Executes with creator privileges, ensuring safe execution under RLS rules
as $$
begin
    -- 1. BULK UPSERT FOR PROJECTS
    insert into projects (id, user_id, name, slug, status, notes, created_at, updated_at, deleted_at)
    select
        (proj->>'id')::uuid,
        p_user_id,
        proj->>'name',
        proj->>'status',
        proj->>'slug',
        (proj->>'createdAt')::timestamptz,
        (proj->>'updatedAt')::timestamptz,
        (proj->>'deletedAt')::timestamptz
    from jsonb_array_elements(p_payload->'projects') as proj
    on conflict (id) do update set
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        updated_at = EXCLUDED.updated_at,
        deleted_at = EXCLUDED.deleted_at;
    
    -- 2. BULK UPSERT FOR PROJECT PARTS
    insert into project_parts (id, project_id, user_id, name, slug, current_rows, total_rows, created_at, updated_at, deleted_at)
    select
        (part->>'id')::uuid,
        (part->>'projectId')::uuid,
        p_user_id,
        part->>'name',
        proj->>'slug',
        (part->>'currentRows')::integer,
        (part->>'totalRows')::integer,
        (part->>'createdAt')::timestamptz,
        (part->>'updatedAt')::timestamptz,
        (part->>'deletedAt')::timestamptz
    from jsonb_array_elements(p_payload->'parts') as part
    on conflict(id) do update set
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        current_rows = EXCLUDED.current_rows,
        total_rows = EXCLUDED.total_rows,
        updated_at = EXCLUDED.updated_at,
        deleted_at = EXCLUDED.deleted_at;
    
    -- 3. BULK UPSERT FOR SECONDARY COUNTERS
    insert into secondary_counters (id, part_id, user_id, name, starts_on_global_row, rows_per_repeat, total_repeats, notes, created_at, updated_at, deleted_at)
    select
        (counter->>'id')::uuid,
        (counter->>'partId')::uuid,
        p_user_id,
        counter->>'name',
        (counter->>'startsOnGlobalRow')::integer,
        (counter->>'rowsPerRepeat')::integer,
        (counter->>'totalRepeats')::integer,
        counter->>'notes',
        (counter->>'createdAt')::timestamptz,
        (counter->>'updatedAt')::timestamptz,
        (counter->>'deletedAt')::timestamptz
    from jsonb_array_elements(p_payload->'secondary_counters') as counter
    on conflict(id) do update set
        name = EXCLUDED.name,
        starts_on_global_row = EXCLUDED.starts_on_global_row,
        rows_per_repeat = EXCLUDED.rows_per_repeat,
        total_repeats = EXCLUDED.total_repeats,
        notes = EXCLUDED.notes,
        updated_at = EXCLUDED.updated_at,
        deleted_at = EXCLUDED.deleted_at;
end;
$$;