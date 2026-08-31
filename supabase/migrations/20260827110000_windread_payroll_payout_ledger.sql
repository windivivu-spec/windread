-- Every recorded payroll payment also creates an immutable expense entry.
-- This keeps the payroll screen and the branch cash/bank book reconciled.
create or replace function public.pay_windread_payroll_payout(
  p_payout_id uuid,
  p_paid_amount integer,
  p_method public.payment_method,
  p_note text,
  p_actor_id uuid
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  v_payout public.payroll_payouts%rowtype;
  v_period public.payroll_periods%rowtype;
  v_remaining integer;
begin
  select payout.* into v_payout
  from public.payroll_payouts payout
  where payout.id = p_payout_id
  for update;
  if not found then
    raise exception 'Không tìm thấy khoản trả lương.' using errcode = 'P0002';
  end if;

  select period.* into v_period
  from public.payroll_periods period
  where period.id = v_payout.payroll_period_id
  for update;
  if not found or v_period.status not in ('closed', 'paid') then
    raise exception 'Kỳ lương chưa sẵn sàng để thanh toán.' using errcode = '22023';
  end if;
  if v_payout.paid_at is not null then
    raise exception 'Khoản lương này đã được ghi nhận thanh toán.' using errcode = '22023';
  end if;
  if p_paid_amount < 0 or p_paid_amount <> greatest(v_payout.total_amount, 0) then
    raise exception 'Số tiền thanh toán phải khớp lương thực lĩnh.' using errcode = '22023';
  end if;

  update public.payroll_payouts
  set paid_amount = p_paid_amount,
      paid_at = now(),
      paid_by = p_actor_id,
      note = nullif(trim(coalesce(p_note, '')), '')
  where id = v_payout.id;

  if p_paid_amount > 0 then
    insert into public.ledger_entries (branch_id, category, direction, method, amount, note, created_by)
    values (
      v_period.branch_id,
      'Thanh toán lương',
      'out',
      p_method,
      p_paid_amount,
      coalesce(nullif(trim(coalesce(p_note, '')), ''), 'Lương nhân viên ' || v_payout.barber_id),
      p_actor_id
    );
  end if;

  select count(*) into v_remaining
  from public.payroll_payouts
  where payroll_period_id = v_period.id and paid_at is null;
  if v_remaining = 0 then
    update public.payroll_periods set status = 'paid' where id = v_period.id;
  end if;

  insert into public.audit_events (actor_id, branch_id, entity_type, entity_id, action, detail)
  values (
    p_actor_id,
    v_period.branch_id,
    'payroll_payout',
    v_payout.id::text,
    'paid',
    jsonb_build_object('amount', p_paid_amount, 'method', p_method)
  );
  return v_payout.id;
end;
$$;

revoke all on function public.pay_windread_payroll_payout(uuid, integer, public.payment_method, text, uuid) from public, anon, authenticated;
grant execute on function public.pay_windread_payroll_payout(uuid, integer, public.payment_method, text, uuid) to service_role;
