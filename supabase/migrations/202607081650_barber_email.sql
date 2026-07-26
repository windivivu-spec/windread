alter table public.barbers add column if not exists email text;

update public.barbers set email = 'kai.loc@windread.vn' where id = 'kai-loc' and email is null;
update public.barbers set email = 'minh.fade@windread.vn' where id = 'minh-fade' and email is null;
update public.barbers set email = 'ryo.beard@windread.vn' where id = 'ryo-beard' and email is null;
update public.barbers set email = 'linh.color@windread.vn' where id = 'linh-color' and email is null;
update public.barbers set email = 'bao.crop@windread.vn' where id = 'bao-crop' and email is null;
update public.barbers set email = 'son.line@windread.vn' where id = 'son-line' and email is null;
update public.barbers set email = 'hieu.wave@windread.vn' where id = 'hieu-wave' and email is null;
