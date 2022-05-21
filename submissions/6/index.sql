select account_id, account.name as account_name, to_char(click.created_at, 'YYYY-MM') AS month, COUNT(click.id) AS count
FROM accounts as account
FULL JOIN campaigns as camp ON camp.account_id = account.id
FULL JOIN clicks as click ON click.campaign_id = camp.id
GROUP By account_id, account_name, month;