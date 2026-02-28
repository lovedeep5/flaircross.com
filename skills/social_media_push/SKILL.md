# Social Media Push

Overview: Automates cross-platform content publishing with dedupe checks.

## Capabilities
- prepare_post(content, hashtags, link, channels, scheduled_time)
- dedupe_check(post_hash) -> boolean
- queue_post(post) -> post_id
- post_via_browser(post) using OpenClaw
- log_post(post_id, status, timestamp)

## Starter Workflow
- Schedule 8 rotating posts, dedupe, publish on LinkedIn + Twitter (optional)

