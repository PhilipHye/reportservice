# Templates

Carbone templates are real .docx/.xlsx/.odt files with `{d.field}` markers,
authored in Word or LibreOffice — they aren't generated as code.

To finish the MVP, add `account-statement.docx` here with markers matching
the data shape returned by the connector, e.g.:

    Account: {d.account_id}
    Statement period: {d.from_date} to {d.to_date}

    {d.rows[i].date} | {d.rows[i].description} | {d.rows[i].amount} | {d.rows[i].running_balance}

Carbone's loop syntax (`[i]`) repeats the row for each item in `d.rows`.
See: https://carbone.io/documentation.html
