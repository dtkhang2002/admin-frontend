```mermaid
sequenceDiagram
    actor User
    activate User
    User ->> ZaloOA: Ask question
    activate ZaloOA
    ZaloOA ->> Webhook: Notify question to webhook
    deactivate ZaloOA
    activate Webhook
    deactivate Webhook
    deactivate User