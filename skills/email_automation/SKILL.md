# Email Automation

Overview: Automates inbox triage and reply with templates.

## Capabilities
- fetch_emails(labels, since)
- classify_email(email) -> category
- compose_reply(email, template_id)
- send_reply(email_id, message)
- mark_as_read(email_id)
- log_email_action(email_id, action, timestamp)

## Starter Workflow
- daily inbox pass; auto-reply to common queries; route hot leads to CRM
